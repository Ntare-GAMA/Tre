// Multi-language response confirmation templates

export const responseTemplates = {
  en: {
    available: {
      confirmation:
        "✅ Thank you {donorName}!\n\nYour availability has been confirmed for {bloodType} blood donation at {hospitalName}.\n\nThe hospital will contact you shortly at {donorPhone}.\n\n🩸 Save Life - You're a hero!",
      hospitalNotification:
        "🎉 DONOR AVAILABLE!\n\n{donorName} ({donorPhone}) is available to donate {bloodType} blood.\n\nContact them immediately for your urgent request.\n\nSave Life System",
    },
    not_available: {
      confirmation:
        "Thank you for responding, {donorName}.\n\nWe understand you're not available right now. We'll contact you for future requests.\n\n❤️ Save Life - Thank you for being part of our community!",
      hospitalNotification: "{donorName} is not available for {bloodType} donation at this time.",
    },
  },
  rw: {
    available: {
      confirmation:
        "✅ Murakoze {donorName}!\n\nKubona kwawe kwemejwe kugira ngo utange amaraso {bloodType} kuri {hospitalName}.\n\nIbitaro rizakuhamagara vuba kuri {donorPhone}.\n\n🩸 Kubana Ubuzima - Uri intwari!",
      hospitalNotification:
        "🎉 UMUTANGA ARAHARI!\n\n{donorName} ({donorPhone}) arahari gutanga amaraso {bloodType}.\n\nMumuhamagare ako kanya kubera icyifuzo cyanyu cyihutirwa.\n\nSisitemu ya Kubana Ubuzima",
    },
    not_available: {
      confirmation:
        "Murakoze gusubiza, {donorName}.\n\nTurabona ko ubu nturahari. Tuzakuhamagara mu bihe bizaza.\n\n❤️ Kubana Ubuzima - Murakoze kuba mu muryango wacu!",
      hospitalNotification: "{donorName} ntarahari gutanga amaraso {bloodType} muri iki gihe.",
    },
  },
  fr: {
    available: {
      confirmation:
        "✅ Merci {donorName}!\n\nVotre disponibilité a été confirmée pour le don de sang {bloodType} à {hospitalName}.\n\nL'hôpital vous contactera bientôt au {donorPhone}.\n\n🩸 Sauver des Vies - Vous êtes un héros!",
      hospitalNotification:
        "🎉 DONNEUR DISPONIBLE!\n\n{donorName} ({donorPhone}) est disponible pour donner du sang {bloodType}.\n\nContactez-le immédiatement pour votre demande urgente.\n\nSystème Sauver des Vies",
    },
    not_available: {
      confirmation:
        "Merci d'avoir répondu, {donorName}.\n\nNous comprenons que vous n'êtes pas disponible maintenant. Nous vous contacterons pour de futures demandes.\n\n❤️ Sauver des Vies - Merci de faire partie de notre communauté!",
      hospitalNotification: "{donorName} n'est pas disponible pour le don de sang {bloodType} en ce moment.",
    },
  },
}

export function formatResponseMessage(
  template: string,
  data: {
    donorName: string
    donorPhone: string
    bloodType: string
    hospitalName: string
  },
): string {
  return template
    .replace(/{donorName}/g, data.donorName)
    .replace(/{donorPhone}/g, data.donorPhone)
    .replace(/{bloodType}/g, data.bloodType)
    .replace(/{hospitalName}/g, data.hospitalName)
}
