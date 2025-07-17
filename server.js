const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'certificates');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
        }
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// DONOR ENDPOINTS

// Register donor
app.post('/api/donors/register', async (req, res) => {
    try {
        const { name, phone_number, whatsapp_number, blood_type, location } = req.body;

        // Validate required fields
        if (!name || !phone_number || !blood_type || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if phone number already exists
        const existingDonor = await db.query(
            'SELECT id FROM donors WHERE phone_number = $1',
            [phone_number]
        );

        if (existingDonor.rows.length > 0) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }

        // Insert new donor
        const result = await db.query(
            `INSERT INTO donors (name, phone_number, whatsapp_number, blood_type, location) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone_number, blood_type, location, created_at`,
            [name, phone_number, whatsapp_number || phone_number, blood_type, location]
        );

        res.status(201).json({
            message: 'Donor registered successfully',
            donor: result.rows[0]
        });
    } catch (error) {
        console.error('Error registering donor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all donors (for hospital dashboard)
app.get('/api/donors', authenticateToken, async (req, res) => {
    try {
        const { blood_type } = req.query;
        
        let query = 'SELECT id, name, phone_number, whatsapp_number, blood_type, location, created_at FROM donors WHERE is_active = true';
        let params = [];

        if (blood_type) {
            query += ' AND blood_type = $1';
            params.push(blood_type);
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// HOSPITAL ENDPOINTS

// Register hospital
app.post('/api/hospitals/register', upload.single('rbc_certificate'), async (req, res) => {
    try {
        const { name, email, password, location } = req.body;

        // Validate required fields
        if (!name || !email || !password || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'RBC certificate is required' });
        }

        // Check if email already exists
        const existingHospital = await db.query(
            'SELECT id FROM hospitals WHERE email = $1',
            [email]
        );

        if (existingHospital.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert new hospital
        const result = await db.query(
            `INSERT INTO hospitals (name, email, password_hash, location, rbc_certificate_path) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, location, is_approved, created_at`,
            [name, email, passwordHash, location, req.file.path]
        );

        res.status(201).json({
            message: 'Hospital registration submitted for approval',
            hospital: result.rows[0]
        });
    } catch (error) {
        console.error('Error registering hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Hospital login
app.post('/api/hospitals/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find hospital by email
        const result = await db.query(
            'SELECT id, name, email, password_hash, location, is_approved FROM hospitals WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hospital = result.rows[0];

        // Check if hospital is approved
        if (!hospital.is_approved) {
            return res.status(403).json({ error: 'Hospital not approved yet' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, hospital.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: hospital.id, email: hospital.email, type: 'hospital' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            hospital: {
                id: hospital.id,
                name: hospital.name,
                email: hospital.email,
                location: hospital.location
            }
        });
    } catch (error) {
        console.error('Error logging in hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get hospital dashboard stats
app.get('/api/hospitals/dashboard', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'hospital') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const hospitalId = req.user.id;

        // Get total requests
        const totalRequests = await db.query(
            'SELECT COUNT(*) FROM blood_requests WHERE hospital_id = $1',
            [hospitalId]
        );

        // Get pending requests
        const pendingRequests = await db.query(
            'SELECT COUNT(*) FROM blood_requests WHERE hospital_id = $1 AND status = $2',
            [hospitalId, 'pending']
        );

        // Get total donors
        const totalDonors = await db.query('SELECT COUNT(*) FROM donors WHERE is_active = true');

        // Get fulfilled requests
        const fulfilledRequests = await db.query(
            'SELECT COUNT(*) FROM blood_requests WHERE hospital_id = $1 AND status = $2',
            [hospitalId, 'fulfilled']
        );

        res.json({
            totalRequests: parseInt(totalRequests.rows[0].count),
            pendingRequests: parseInt(pendingRequests.rows[0].count),
            totalDonors: parseInt(totalDonors.rows[0].count),
            fulfilledRequests: parseInt(fulfilledRequests.rows[0].count)
        });
    } catch (error) {
        console.error('Error fetching hospital dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ADMIN ENDPOINTS

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find admin by email
        const result = await db.query(
            'SELECT id, name, email, password_hash, is_active FROM admin_users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = result.rows[0];

        if (!admin.is_active) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, type: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get admin dashboard stats
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get total hospitals
        const totalHospitals = await db.query(
            'SELECT COUNT(*) FROM hospitals WHERE is_approved = true'
        );

        // Get pending approvals
        const pendingApprovals = await db.query(
            'SELECT COUNT(*) FROM hospitals WHERE is_approved = false'
        );

        // Get total donors
        const totalDonors = await db.query('SELECT COUNT(*) FROM donors WHERE is_active = true');

        // Get total blood requests
        const totalRequests = await db.query('SELECT COUNT(*) FROM blood_requests');

        res.json({
            totalHospitals: parseInt(totalHospitals.rows[0].count),
            pendingApprovals: parseInt(pendingApprovals.rows[0].count),
            totalDonors: parseInt(totalDonors.rows[0].count),
            totalRequests: parseInt(totalRequests.rows[0].count)
        });
    } catch (error) {
        console.error('Error fetching admin dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get pending hospitals for approval
app.get('/api/admin/pending-hospitals', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await db.query(
            'SELECT id, name, email, location, rbc_certificate_path, created_at FROM hospitals WHERE is_approved = false ORDER BY created_at ASC'
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching pending hospitals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Approve hospital
app.patch('/api/admin/approve-hospital/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const hospitalId = req.params.id;
        const adminId = req.user.id;

        const result = await db.query(
            'UPDATE hospitals SET is_approved = true, approved_by = $1, approved_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING name',
            [adminId, hospitalId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        res.json({ message: `Hospital "${result.rows[0].name}" approved successfully` });
    } catch (error) {
        console.error('Error approving hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reject hospital
app.delete('/api/admin/reject-hospital/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const hospitalId = req.params.id;

        const result = await db.query(
            'DELETE FROM hospitals WHERE id = $1 AND is_approved = false RETURNING name',
            [hospitalId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hospital not found or already approved' });
        }

        res.json({ message: `Hospital "${result.rows[0].name}" rejected successfully` });
    } catch (error) {
        console.error('Error rejecting hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// BLOOD REQUEST ENDPOINTS

// Create blood request
app.post('/api/blood-requests', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'hospital') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { blood_type, urgency_level, quantity_needed, notes } = req.body;
        const hospitalId = req.user.id;

        // Validate required fields
        if (!blood_type || !urgency_level || !quantity_needed) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert blood request
        const result = await db.query(
            `INSERT INTO blood_requests (hospital_id, blood_type, urgency_level, quantity_needed, notes) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [hospitalId, blood_type, urgency_level, quantity_needed, notes]
        );

        // Get matching donors
        const donors = await db.query(
            'SELECT id, name, phone_number FROM donors WHERE blood_type = $1 AND is_active = true',
            [blood_type]
        );

        res.status(201).json({
            message: 'Blood request created successfully',
            request: result.rows[0],
            notifiedDonors: donors.rows.length
        });
    } catch (error) {
        console.error('Error creating blood request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get blood requests for hospital
app.get('/api/blood-requests', authenticateToken, async (req, res) => {
    try {
        if (req.user.type !== 'hospital') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const hospitalId = req.user.id;

        const result = await db.query(
            'SELECT * FROM blood_requests WHERE hospital_id = $1 ORDER BY created_at DESC',
            [hospitalId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching blood requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    
    if (error.message === 'Only PDF, JPG, JPEG, and PNG files are allowed') {
        return res.status(400).json({ error: error.message });
    }
    
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await db.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await db.close();
    process.exit(0);
});
