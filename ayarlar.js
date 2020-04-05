exports.prefix = "og!"
exports.sunucu = "667115809449050150", // OLYMPOS: 606027252362379294 // TEST: 667115809449050150
  
exports.yetkili_ids = [
  "208196116078919680", // jamie
  "133191597683638273", // ria 
]

exports.olympos = { // BOTID => Mute cezası için DM atılacak hesap id
    "botID" : "687364362901782554", // OLYMPOS BOT: 689884874244358251 // RIA: 133191597683638273 // OLYMPOS V2: 687364362901782554
    "prefix" : "o!",
}
exports.olyguard_ids = [
  "690217618761711632", // olyguard I
  "690225198708162659", // olyguard II
  "690227237164941394", // olyguard III
]

exports.yetkili_roller = [
    "Zeus",
    "POSEIDON",
    "Hera",
    "Hades",
    "Demeter",
    "Athena",
    "Ares",
    "Hephaistos",
    "Aphrodite",
    "Hermes",
    "Hestia",
    "Dionysos"
]
  
exports.perms = { // KOMUT YETKİLİLERİ İÇİN HAZIR AYARLAR
    "üst": ["Zeus", "POSEIDON", "Hera"],
    "vipüstü" : ["Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Kratos"],
    "kayıtlı" : ["Apollo", "Artemis"],
    "herkes" : ["@everyone"]
  }
exports.default = { // VARSAYILAN AYARLAR
  //açkapat
  "botengel": true,
  "kanalkoruma": true,
  "reklambanayar" : true,
  "rolkoruma" : true,
  
  "spam": true,
  "raid": true,
  
  "rol": true,
  "kanal": true,
  "ban": true,
  "kick": true,
  
  //ayar
  "ban.kişi": 10,
  "ban.dakika": 1,
  "kick.kişi": 10,
  "kick.dakika": 1,
  "kanal.adet": 5,
  "kanal.dakika": 5,
  "rol.adet": 3,
  "rol.dakika": 5,
  
  "raid.saniye": 10, // Kaç saniye içindeki mesajlar kontrol edilsin ?
  "raid.kişi": 10, // Kaç farklı kişiden aynı mesaj tekrarında uyarı verilsin ?
  "spam.uyarı": 3, // Kaç uyarı sonrası ceza verilsin ?
  "spam.saniye": 10, // Kaç saniye içindeki mesajlar kontrol edilsin ?
  "spam.tekrar": 3, // Kaç aynı mesaj tekrarında uyarı verilsin ?
}
