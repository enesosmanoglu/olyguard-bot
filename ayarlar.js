let test = process.env.name.includes("test")

exports.sunucu = test ? "667115809449050150" : "606027252362379294" // OLYMPOS: 606027252362379294 // TEST: 667115809449050150
exports.olyguard_ids = [
    test ? "690217618761711632" : "701779351447797851", // test I / olyguard I
    test ? "690225198708162659" : "701801762612445296", // test II / olyguard II
    test ? "690227237164941394" : "701801997468172309", // test III / olyguard III
]

exports.prefix = "og!"
exports.color = "2f3136"

exports.yetkili_ids = [
    "208196116078919680", // jamie
    "133191597683638273", // ria 
]

exports.olympos = {
    prefix: "o!",
    channelName: "botlar-arası",
    commands: {
        mute: "mute",
    },
}

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

exports.perms = { // BU HAZIR AYARLAR KOMUT KULLANIM YETKİSİ BELİRLERKEN HIZ KAZANMAK İÇİN HAZIRLANMIŞTIR!
    bot: [
        "✧ OLYMPOS", "✧ OLYMPOS v2", "✧ olyguard I", "✧ olyguard II", "✧ olyguard III", "✧ Town of Olympos", "Town of Olympos"
    ],
    üst: [ // en üst komutlar için sadece en üst düzey yetkililer !!
        "Zeus", "POSEIDON"
    ],
    üstyönetim: [ // üst düzey komutlar için üst düzey yetkililer
        "Zeus", "POSEIDON", "Hera", "Hades"
    ],
    vipüstü: [ // vip rollerinin üstünde bulunan yetkililer
        "Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena"
    ], 
    yetkili: [ // tüm yetkili roller
        "Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia", "Dionysos"
    ],
    yetkisizAraRoller: [ // Yetki sıralaması yaparken gözardı edilecek roller !!
        "Ayın En İyileri", "✧", "Kratos", "Golden VIP", "Silver VIP", "Bronze VIP", "VIP", "🎂  Doğum Günün Kutlu Olsun", "olympos team"
    ],
    vip: [ // Tüm vip rolleri || Doğum günü sisteminde yaş arttırma yaparken nick değiştirme yapılır, bunu engellemek için bu roller gözardı edilir.
        "Golden VIP", "Silver VIP", "Bronze VIP", "VIP"
    ],
    kayıtlı: [ // Sadece kayıtlı üyelerin kullanabileceği komutlar için 
        "Elite of Olympos", "Rebel of Olympos", "Apollo", "Artemis"
    ],
    taglı: [ // Sadece taglı üyelerin kullanabileceği komutlar için 
        "Elite of Olympos"
    ],
    kayıtsız: [ // Sadece kayıtsız üyelerin kullanabileceği komutlar için 
        "Peasant of Olympos"
    ],
    herkes: [ // Kayıtlı veya kayıtsız herkesin kullanabileceği komutlar için
        "@everyone"
    ],
    sıralamaDışı: [ // rank sıralamalarında bulunmayacak roller
        "Zeus", "POSEIDON", "Hera", "Hades"
    ],
}
exports.default = { // VARSAYILAN AYARLAR
    //açkapat
    "botengel": true,
    "kanalkoruma": true,
    "rolkoruma": true,

    "spam": true,
    "raid": true,
    "reklam": true,

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

    "raid.kanallar": ["kayıt"], // Hangi kanallarda geçerli olsun ?
    "raid.saniye": 10, // Kaç saniye içindeki mesajlar kontrol edilsin ?
    "raid.kişi": 5, // Kaç farklı kişiden aynı mesaj tekrarında uyarı verilsin ?
    "spam.uyarı": 3, // Kaç uyarı sonrası ceza verilsin ?
    "spam.saniye": 10, // Kaç saniye içindeki mesajlar kontrol edilsin ?
    "spam.tekrar": 3, // Kaç aynı mesaj tekrarında uyarı verilsin ?
    "reklam.uyarı": 3, // Kaç uyarı sonrası ceza verilsin ?
}
