// Multi-language alert message templates

export const alertTemplates = {
  en: {
    critical: {
      sms: "🚨 URGENT BLOOD NEEDED 🚨\n\n{hospitalName} needs {bloodType} blood IMMEDIATELY!\n\nQuantity: {quantity} units\nLocation: {location}\n\nReply YES if available or call {hospitalPhone}\n\nSave Life - Every second counts!",
      whatsapp:
        "🚨 *CRITICAL BLOOD ALERT* 🚨\n\n*Hospital:* {hospitalName}\n*Blood Type:* {bloodType}\n*Quantity:* {quantity} units\n*Location:* {location}\n\n⏰ *IMMEDIATE RESPONSE NEEDED*\n\nReply *YES* if you can donate or call {hospitalPhone}\n\n🩸 Save Life - Your donation can save lives!",
    },
    urgent: {
      sms: "🩸 BLOOD NEEDED 🩸\n\n{hospitalName} urgently needs {bloodType} blood.\n\nQuantity: {quantity} units\nLocation: {location}\n\nReply YES if available or call {hospitalPhone}\n\nSave Life - Help save lives!",
      whatsapp:
        "🩸 *URGENT BLOOD REQUEST* 🩸\n\n*Hospital:* {hospitalName}\n*Blood Type:* {bloodType}\n*Quantity:* {quantity} units\n*Location:* {location}\n\nReply *YES* if you can donate or call {hospitalPhone}\n\n❤️ Save Life - Be a hero today!",
    },
    routine: {
      sms: "🏥 Blood Donation Request\n\n{hospitalName} needs {bloodType} blood.\n\nQuantity: {quantity} units\nLocation: {location}\n\nReply YES if available or call {hospitalPhone}\n\nSave Life - Thank you!",
      whatsapp:
        "🏥 *Blood Donation Request*\n\n*Hospital:* {hospitalName}\n*Blood Type:* {bloodType}\n*Quantity:* {quantity} units\n*Location:* {location}\n\nReply *YES* if you can donate or call {hospitalPhone}\n\n🙏 Save Life - Thank you for your kindness!",
    },
  },
  rw: {
    critical: {
      sms: "🚨 AMARASO AKENEWE BYIHUTIRWA 🚨\n\n{hospitalName} ikeneye amaraso {bloodType} AKO KANYA!\n\nIngano: {quantity} ibice\nAho iherereye: {location}\n\nSubiza YEGO niba uhari cyangwa hamagara {hospitalPhone}\n\nKubana Ubuzima - Buri kanya ni ngombwa!",
      whatsapp:
        "🚨 *AMARASO AKENEWE BYIHUTIRWA* 🚨\n\n*Ibitaro:* {hospitalName}\n*Ubwoko bw'amaraso:* {bloodType}\n*Ingano:* {quantity} ibice\n*Aho biherereye:* {location}\n\n⏰ *GUSUBIZA BYIHUTIRWA*\n\nSubiza *YEGO* niba ushobora gutanga cyangwa hamagara {hospitalPhone}\n\n🩸 Kubana Ubuzima - Gutanga kwawe gushobora kubana ubuzima!",
    },
    urgent: {
      sms: "🩸 AMARASO AKENEWE 🩸\n\n{hospitalName} ikeneye amaraso {bloodType} byihutirwa.\n\nIngano: {quantity} ibice\nAho iherereye: {location}\n\nSubiza YEGO niba uhari cyangwa hamagara {hospitalPhone}\n\nKubana Ubuzima - Fasha kubana ubuzima!",
      whatsapp:
        "🩸 *GUSABA AMARASO BYIHUTIRWA* 🩸\n\n*Ibitaro:* {hospitalName}\n*Ubwoko bw'amaraso:* {bloodType}\n*Ingano:* {quantity} ibice\n*Aho biherereye:* {location}\n\nSubiza *YEGO* niba ushobora gutanga cyangwa hamagara {hospitalPhone}\n\n❤️ Kubana Ubuzima - Ba intwari uyu munsi!",
    },
    routine: {
      sms: "🏥 Gusaba Gutanga Amaraso\n\n{hospitalName} ikeneye amaraso {bloodType}.\n\nIngano: {quantity} ibice\nAho iherereye: {location}\n\nSubiza YEGO niba uhari cyangwa hamagara {hospitalPhone}\n\nKubana Ubuzima - Murakoze!",
      whatsapp:
        "🏥 *Gusaba Gutanga Amaraso*\n\n*Ibitaro:* {hospitalName}\n*Ubwoko bw'amaraso:* {bloodType}\n*Ingano:* {quantity} ibice\n*Aho biherereye:* {location}\n\nSubiza *YEGO* niba ushobora gutanga cyangwa hamagara {hospitalPhone}\n\n🙏 Kubana Ubuzima - Murakoze kubana ubuzima!",
    },
  },
  fr: {
    critical: {
      sms: "🚨 SANG URGENT REQUIS 🚨\n\n{hospitalName} a besoin de sang {bloodType} IMMÉDIATEMENT!\n\nQuantité: {quantity} unités\nLieu: {location}\n\nRépondez OUI si disponible ou appelez {hospitalPhone}\n\nSauver des Vies - Chaque seconde compte!",
      whatsapp:
        "🚨 *ALERTE SANG CRITIQUE* 🚨\n\n*Hôpital:* {hospitalName}\n*Groupe Sanguin:* {bloodType}\n*Quantité:* {quantity} unités\n*Lieu:* {location}\n\n⏰ *RÉPONSE IMMÉDIATE REQUISE*\n\nRépondez *OUI* si vous pouvez donner ou appelez {hospitalPhone}\n\n🩸 Sauver des Vies - Votre don peut sauver des vies!",
    },
    urgent: {
      sms: "🩸 SANG REQUIS 🩸\n\n{hospitalName} a un besoin urgent de sang {bloodType}.\n\nQuantité: {quantity} unités\nLieu: {location}\n\nRépondez OUI si disponible ou appelez {hospitalPhone}\n\nSauver des Vies - Aidez à sauver des vies!",
      whatsapp:
        "🩸 *DEMANDE DE SANG URGENTE* 🩸\n\n*Hôpital:* {hospitalName}\n*Groupe Sanguin:* {bloodType}\n*Quantité:* {quantity} unités\n*Lieu:* {location}\n\nRépondez *OUI* si vous pouvez donner ou appelez {hospitalPhone}\n\n❤️ Sauver des Vies - Soyez un héros aujourd'hui!",
    },
    routine: {
      sms: "🏥 Demande de Don de Sang\n\n{hospitalName} a besoin de sang {bloodType}.\n\nQuantité: {quantity} unités\nLieu: {location}\n\nRépondez OUI si disponible ou appelez {hospitalPhone}\n\nSauver des Vies - Merci!",
      whatsapp:
        "🏥 *Demande de Don de Sang*\n\n*Hôpital:* {hospitalName}\n*Groupe Sanguin:* {bloodType}\n*Quantité:* {quantity} unités\n*Lieu:* {location}\n\nRépondez *OUI* si vous pouvez donner ou appelez {hospitalPhone}\n\n🙏 Sauver des Vies - Merci pour votre gentillesse!",
    },
  },
}

export function formatAlertMessage(
  template: string,
  data: {
    hospitalName: string
    bloodType: string
    quantity: number
    location: string
    hospitalPhone: string
  },
): string {
  return template
    .replace(/{hospitalName}/g, data.hospitalName)
    .replace(/{bloodType}/g, data.bloodType)
    .replace(/{quantity}/g, data.quantity.toString())
    .replace(/{location}/g, data.location)
    .replace(/{hospitalPhone}/g, data.hospitalPhone)
}
