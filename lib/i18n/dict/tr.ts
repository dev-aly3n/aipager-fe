import type { Dict } from "./types";

/**
 * Turkish. Written to read like aipager reads in Turkish: the same words for
 * the same ideas as the bot's own catalog, the same calm register, sen
 * throughout. Product text (cards, buttons, the pinned bar) is not here: it
 * comes from aipager's own catalogs through lib/bot-strings.json.
 */
export const tr: Dict = {
  meta: {
    title: "aipager: Claude Code seni çağırıyor",
    description:
      "aipager, Claude Code oturumlarını pencere açık tutmaya gerek kalmadan bir terminalde çalıştırır ve Telegram'a yansıtır: çalışmalarını izle, istediklerine izin ver, sıradaki mesajı gönder. Senin bilgisayarında çalışır.",
  },

  nav: {
    modes: "Modlar",
    app: "Mini App",
    how: "Nasıl çalışır",
    install: "Kurulum",
    security: "Güvenlik",
    faq: "SSS",
    docs: "Dokümanlar",
    language: "Dili değiştir",
  },

  hero: {
    title: "Claude da sohbetlerinden biri.",
    lead: "aipager, Claude Code oturumlarını Telegram'a taşır: ailenin, arkadaşlarının ve ekibinin arasına. Senin bilgisayarında çalışır.",
    agentInstall: "Kurulumu ajanına yaptır",
    docs: "Dokümanlar",
    security: "Güvenlik",
    meta: "Linux & macOS · MIT · bir dakika kadar",
  },

  modes: {
    eyebrow: "İzin modları",
    title: "Üç mod. Otomatik modla başlarsın.",
    lead: "Her oturum bu üçünden birindedir; mod oturum başına ayarlanır ve /mode ile istediğin an değişir. Sor modu her işlemden önce durur. Her yeni oturumun başladığı Otomatik mod, Claude Code'un kendi güvenlik denetiminin güvenli çağrıları çalıştırmasına, riskli olanları da senin için durdurmasına izin verir. Tam erişim modu her şeyi hiçbir denetim olmadan çalıştırır. Bir mod yalnızca Claude Code'un kendi izin isteklerini yönetir, başka bir şeyi değil: bir grupta, üyenin rolünün kullanamayacağı bir araç, mod ne derse desin yine reddedilir.",
    legend: [
      { k: "İzin ver", v: "yalnızca bu çağrı için" },
      { k: "Reddet", v: "Claude çağrıyı engeller" },
      { k: "Hep izin ver", v: "Claude bir kural öneriyorsa onu ekler" },
      { k: "Durdur", v: "yanıtlamak yerine görevi yarıda keser" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Her çağrı seni bekler, bir okuma bile.",
      quote: "Önce çerez yardımcısına bakacağım.",
      read: "Read: çerez yardımcısı",
      needs: "İznin gerekiyor",
    },
    auto: {
      tag: "varsayılan",
      note: "Okuma da test çalıştırması da kendiliğinden geçti. Staging'e giden bir komut riskli olanlardan, bu yüzden durdu.",
      quote: "Test, oturum çerezi yazılmadan tıklıyor.",
      risky: "Bash: Staging'deki en yeni oturumlara bak",
    },
    full: {
      tag: "/mode full",
      note: "Denetim yok, düğme yok. Bitince yalnızca yanıt.",
      ask: "flaky login e2e testini düzelt",
      quote: "Test, oturum çerezi yazılmadan tıklıyor. 5sn uyuyup şansa bırakıyor.",
    },
    facts: [
      {
        t: "/mode",
        b: "Diğer her mod için bir düğme gösterir; /mode ask, /mode auto ve /mode full doğrudan geçiş yapar. Sohbet /settings → Yeni oturumlar altında başka bir şey seçmediyse yeni oturumlar Otomatik modda başlar.",
      },
      {
        t: "Sor modu ⇄ Otomatik mod, yerinde",
        b: "Yeniden başlatma yok, Claude çalışırken bile: aipager oturumda Shift+Tab'a basar ve Claude Code yeni modu onaylayana kadar kartta geçişin sürdüğü yazar.",
      },
      {
        t: "Tam erişim modu yeniden başlatır",
        b: "Tam erişim moduna geçmek ya da oradan çıkmak oturumu yeniden başlatır, konuşmayı korur. Bir oturumu bu modda yalnızca bir yönetici başlatabilir ya da bu moda geçirebilir (bir de botla olan kendi özel sohbetinde sen).",
      },
      {
        t: "Sorular yine gelir",
        b: "Bir mod izin isteklerini yönetir, kararları değil: Claude sana bir şey sorduğunda düğmeler mod ne olursa olsun sohbetine düşer.",
      },
    ],
  },

  places: {
    eyebrow: "Nerede duruyor",
    title: "Üç sohbet. Gerisi zaten senin hayatın.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Çalışıyor · 3:14 · Read ×2 · Bash ×2",
        title: "Claude ile sohbetin",
        body: "Bütün oturumlar için tek sohbet. Her görev için kendini güncelleyen canlı bir kart, tek dokunuşla yanıtladığın istekler ve neyin seni beklediğini söyleyen sabitlenmiş bir çubuk. Düz bir mesaj, çubuğun adını yazdığı oturuma gider; /web sıradaki mesajını başka bir oturuma gönderir ve konuşma orada sürer.",
      },
      {
        name: "backend-team",
        tag: "grup · ekip modu",
        preview: "Sara: @aipagerbot /web login e2e'yi staging'de çalıştır",
        title: "Ekibinin grubu",
        body: "Botu bir gruba ekle, izin verilenler listesindeki herkes adını anarak ona yazabilsin. Her mesaj gönderenin rolüyle çalışır; o rolün kullanamayacağı bir araç çalışmadan önce reddedilir ve her karar, düğmeye kimin dokunduğunun adıyla denetim kaydına geçer.",
      },
      {
        name: "Jim",
        tag: "botla olan kendi sohbeti",
        preview: "web · İznin gerekiyor",
        title: "Başka biri, kendi sohbetinde",
        body: "Bir ekip arkadaşının botla olan özel sohbetini ekle; kendi rolü ve kendi kök klasörüyle kendi oturumlarını yönetsin: Claude görevleri o klasörün içinde başlar ve senin ev klasöründe o klasörün dışındaki hiçbir şeyi okumaz. Yalnızca izlemesi gereken birine ise grubunda read_only verirsin.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<oturum> <mesaj>"],
      ["owner", "admin", "user", "read_only"],
      ["üyelerin kök klasörü", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Dört rol, her role bir araç kuralı.",
      lead: "Geçerli olan rol, işlem yaptığın sohbetteki rolündür; bir rolün kullanamayacağı araç sorulmaz, çalışmadan önce reddedilir. Telegram'daki ya da Mini App'teki hiçbir şey listede kimin olduğunu değiştiremez: yalnızca bilgisayardaki aipager config.",
      can: "Yapabilir",
      rows: [
        "Bir oturuma mesaj göndermek",
        "İzin vermek, reddetmek, Claude'un sorularını yanıtlamak",
        "Bash ve kod çalıştıran her şey",
        "Tam erişim modu, bir grubun /settings ayarları, /update",
        "Oturumlarının nerede çalışabileceği",
        "Kimlik bilgisi dosyalarını okumak (~/.ssh, …)",
      ],
      anywhere: "her yerde",
      rootFolder: "kök klasörü",
      ownChat: "kendi sohbeti",
      link: "Ekip modu, ayrıntılarıyla",
    },
  },

  day: {
    eyebrow: "Gündelik kullanım",
    title: "Sohbet gibi kullan.",
    lead: "Sohbet kılığına girmiş bir konsol değil: Telegram'da zaten yaptığın her şey burada da çalışır. Eve dönerken konuş, ekran görüntüsünü at, bir önceki bitmeden aklına geleni gönder.",
    items: [
      {
        t: "Yazma, söyle",
        b: "Bir sesli mesaj gönder; kendi bilgisayarında yazıya dökülür (kimsenin bulutunda değil), ne duyduğunu görebilesin diye sana geri gönderilir ve sen yazmışsın gibi oturuma yazılır.",
      },
      {
        t: "Hatanın ekran görüntüsü",
        b: "Fotoğraflar ve dosyalar bilgisayarındaki bir klasöre kaydedilir, Claude'a da yolu gösterilir; mesaj olarak senin açıklaman kullanılır, açıklama yoksa “check this: …” gider. Aynı anda birkaç tane gönder, hepsi tek mesaj olarak gider.",
      },
      {
        t: "Sıradakini hemen gönder",
        b: "Mesajın, gönderdiğin anda Claude'a gider, görevin ortasında bile: Claude'un kendi kuyruğunda beklerken 👀, Claude aldığında 👍. ⚡ Şimdi gönder, adımın bitmesini beklemeden mesajı teslim eder.",
      },
      {
        t: "Asla yanıt sanılmaz",
        b: "Bir izin isteği açıkken gönderdiğin mesaj bekletilir, isteğin içine karışmaz ve sen yanıt verir vermez oturuma gider.",
      },
      {
        t: "Ajanlar ve arka plan komutları, tek tek",
        b: "Claude'un başlattığı her arka plan ajanının kartta ne yaptığını gösteren kendi satırı olur; çalışır hâlde bırakılan bir arka plan komutu da bitene kadar kendi saatini tutar.",
      },
      {
        t: "Önce o haber verir",
        b: "Bir bağlam uyarısı, bir sıkıştırma, sona eren ya da sesi kesilen bir oturum, fazla uzayan bir görev: sen bakmaya gitmeden sohbet bunu söyler.",
      },
      {
        t: "Düğmeler zaten orada",
        b: "Mesaj kutusunun altında bir klavye durur: çalışan her oturum için bir düğme, sonra Özet, Stop ve Oluştur, sonra sürekli yeniden yazdığın mesajlar için Şablonlar ve Claude Code'un kendi hallettikleri için Komutlar.",
      },
      {
        t: "/status, bütün sohbet bir bakışta",
        b: "Üzerinde işlem yapabileceğin bir liste hâlinde her oturum: hangisi ne yapıyor, modeli, kalan bağlamı, ne kadara mal olduğu, arkasında kuyrukta ne beklediği; her birinde Durdur, Yanıtla ve menünün geri kalanı.",
      },
    ],
    heard: "Duyulan:",
    said: "flaky login e2e testini düzelt",
  },

  app: {
    eyebrow: "Mini App",
    title: "Bir panel, hâlâ Telegram'ın içinde.",
    lead: "/app bütün oturumları bir arada açar: her biri için bir kutucuk, içinde bağlam halkası, klasörü, modeli ve ne kadar harcadığı. Yanıt verdiğin yer hâlâ sohbet; uygulama ise hepsine birden bakmak ve bir sohbette hantal kalan işler için: değişiklikleri (diff) okumak, bir ayarı değiştirmek gibi.",
    tabs: { sessions: "Oturumlar", settings: "Ayarlar" },
    summary: { needs: "seni bekliyor", working: "çalışıyor", resting: "hazır", spent: "harcandı", finished: "bitti" },
    needsYou: "Seni bekleyenler",
    answerInChat: "Sohbette yanıtla",
    states: { working: "çalışıyor", needs: "seni bekliyor", resting: "hazır" },
    settings: {
      updates: "Güncellemeler",
      upToDate: "Her şey güncel.",
      check: "Güncellemeleri kontrol et",
      language: "Uygulama dili",
      languageNote: "Yalnızca aipager'ın kendi metni. Claude'un yanıtları değişmez.",
      chatPrefs: "Sohbet tercihleri",
      chatPrefsNote: "Bunlar bu sohbetteki her oturum için geçerlidir.",
      rows: [
        { k: "Yanıt nasıl görünsün", v: "Kart + ayrı yanıt" },
        { k: "Değişiklik önizlemeleri", v: "Kapalı" },
        { k: "Uzun görevlerde kart güncellemeleri", v: "Açık" },
        { k: "Yeni oturumlar" },
      ],
    },
    close: "Kapat",
    facts: [
      {
        t: "Her oturum tek ekranda",
        b: "Her biri için bir kutucuk: bağlam halkası, kimin olduğu, modeli ve ne kadar harcadığı; üstlerinde de sohbetin ne durumda olduğunu söyleyen bir satır: ne çalışıyor, ne hazır, gün ne kadar tuttu, kaç tanesi bitti. + bir yenisini başlatır: bir ad, zaten kullandığın klasörlerden biri, bir model.",
      },
      {
        t: "Önce seni bekleyen",
        b: "Bir izin isteğini ya da bir soruyu bekleyen oturum, ne sorduğuyla birlikte en üstte durur. “Sohbette yanıtla” o isteği düğmeleriyle birlikte sohbetin en altına geri gönderir, sen de orada yanıtlarsın.",
      },
      {
        t: "Her oturuma bir sayfa",
        b: "Durum satırı (“Çalışıyor (3:12)” ya da “Hazır, son etkinlik 5 dk önce”) ve tek dokunuşla Durdur ya da Devam ettir. Altında son kullanılan araçlar, en son yanıt, model seçimi, görevin dosyalarda yaptığı değişiklikler (diff) ve o oturumun kendi ayarları.",
      },
      {
        t: "aipager'ın kendisi sunar",
        b: "Varsayılan olarak açık, her istek Telegram'ın kendi imzasıyla denetleniyor ve sayfa başka hiçbir yerden bir şey yüklemiyor: yazı tipi yok, script yok. aipager miniapp disable onu kapatır.",
      },
    ],
    link: "Uygulamanın yapabildikleri",
  },

  langs: {
    eyebrow: "On beş dil",
    title: "Kendi dilinde, rakamlarına kadar.",
    lead: "Yalnızca aipager'ın kendi metinleri değişir: kartlar, istekler, düğmeler, sabitlenmiş çubuk, /status, Mini App, dokümanlar. Oturumların değişmez: Claude ona yazdığın dilde yanıt verir ve aipager'ın Claude'a gönderdikleri olduğu gibi kalır. /language ile bir dil seç ya da Telegram'daki dilin kullanılsın.",
    facts: [
      {
        t: "Sağdan sola, gerektiği gibi",
        b: "Farsça ve Arapça sağdan sola okunur; Farsça (۰-۹) ya da Arapça-Hint (٠-٩) rakamları ve kendi ayırıcılarıyla, hem Telegram'da hem Mini App'te. Oturum adları, yollar, komutlar ve kod kendi yönünü korur.",
      },
      {
        t: "Çevrilmedi, yazıldı",
        b: "Her dil, o dilde uygulama kullanan insanların gerçekten konuştuğu gibi yazıldı, İngilizceden geçen kelimeler dahil; her dilin kendi çoğul biçimleriyle (Arapçada altı tane var).",
      },
      {
        t: "Senin sohbetin, senin dilin",
        b: "Özel bir sohbet, Telegram'daki dilini kullanabilir. Bir grubun tek bir dili olur, onu da bir yönetici seçer; bir düğmeye dokununca açılan kısa uyarı ise dokunan kişinin kendi dilindedir.",
      },
      {
        t: "Dokümanlar da",
        b: "README ve docs/ altındaki her sayfa çevrildi. Bir çeviriyle İngilizce sayfa birbirini tutmazsa İngilizce sayfa geçerlidir.",
      },
    ],
    pinned: "Sabitlenmiş mesaj",
  },

  under: {
    eyebrow: "Sohbetin altında",
    title: "Asıl kaynak hâlâ terminal.",
    lead: "Claude Code gerçek bir terminalde, dtach'in içinde çalışır; kimsenin bir pencereyi açık tutması gerekmez. Her adım bir hook tetikler, o hook yerel bir soket üzerinden aipager'a tek bir datagram gönderir ve aipager sohbetindeki bir mesajı düzenler. Yanıtların aynı yoldan geri döner: çağrıyı bekleten hook'a bir karar ya da oturuma yazılan tuşlar.",
    nodes: [
      { t: "Claude Code", b: "dtach'in içinde, pencereye gerek yok" },
      { t: "hook", b: "her adımda tetiklenir" },
      { t: "aipager", b: "tek süreç, senin kullanıcınla" },
      { t: "Telegram", b: "kendi bot token'ın" },
      { t: "sohbetlerin", b: "özel sohbetin, ekibinin grubu" },
    ],
    facts: [
      {
        t: "İstediğin an başına otur",
        b: "aipager session api, çalışan oturuma herhangi bir terminalden bağlanır. Orada yaz, sohbette yaz: aynı oturum. Pencereyi kapat, oturum devam eder; oturum yeniden başlasa bile bağlantın kopmaz.",
      },
      {
        t: "Ekranını asla okumaz",
        b: "aipager oturuma yazar ve Claude Code'un kendi olaylarını dinler. Sohbetinde gördüklerin hook'lardan ve kaydedilen konuşmadan gelir, terminal ekranını okumaktan değil.",
      },
      {
        t: "Hiçbir şey sohbeti beklemez",
        b: "Bir hook tek bir datagram gönderip döner; bu, Claude Code'un yaklaşık 20 ms'sini alır. aipager dinlemiyorsa olay kaybolur ve Claude yoluna devam eder; izleyici, kaçanları oturumun kendi dosyalarından tamamlar.",
      },
    ],
    hooks: "On altı hook, bir de model, bağlam ve maliyet için okuduğu durum satırı (status line). aipager hepsine bağlı.",
  },

  trust: {
    eyebrow: "Güvenlik",
    title: "Arada hiçbir şey yok.",
    lead: "aipager, Anthropic ile hiç konuşmaz. Bunu yapan tek şey, kendi girişinle kendi bilgisayarında çalışan Claude Code'un kendisidir. aipager onu bir terminalde başlatır ve Claude Code'un yayınladığı hook'ları dinler. Tersine mühendislikle bulunmuş bir uç nokta yok, proxy yok, seninkinden başka hesap yok: telefonundan yönettiğin oturum, klavyeden yöneteceğin oturumun aynısı.",
    cards: [
      {
        t: "aipager sunucusu yok.",
        b: "aipager, Telegram Bot API ile kendi bot token'ını kullanarak konuşur. aipager hesabı diye bir şey de, aipager servisi diye bir şey de yok; telefonunla bilgisayarının arasında başka kimsenin bilgisayarı yok.",
      },
      {
        t: "Yalnızca senin sohbetlerin yanıtlanır.",
        b: "aipager yalnızca ayar dosyanda listelenen sohbetlerde yanıt verir. Botu bulan bir yabancı, onunla konuşacak şekilde ayarlanmadığını söyleyen tek bir satır alır; gönderdiği hiçbir şey bir oturuma ulaşmaz.",
      },
      {
        t: "Açık port yok.",
        b: "Yalnızca loopback üzerinde dinler. Mini App, her isteğin Telegram'ın imzasını taşıması gereken bir Cloudflare tüneli üzerinden dışarı çıkar ve aipager miniapp disable onu kapatır.",
      },
      {
        t: "Senin token'ın, senin dosyan.",
        b: "Bot token'ı ve sohbet kimlikleri ~/.config/aipager/aipager.yaml dosyasında durur, izinleri 600. aipager'ın günlüğüne girmezler ve sızabilecekleri her yerde gizlenirler.",
      },
      {
        t: "Asla yetki yükseltmez.",
        b: "sudo yok, setuid yok. Yazdığı her şey ev klasörünün, /tmp'nin ya da kendi soket klasörünün içindedir ve başlattığı her süreç (claude, dtach, kurulum programları) senin kullanıcınla çalışır.",
      },
      {
        t: "Karar hâlâ Claude Code'un.",
        b: "Neyin sorulması gerektiğini senin settings.json dosyan söyler. aipager soruyu iletir; neyin çalışabileceğine asla karar vermez ve biten bir görevden kalan bir düğme, şu an süren işe dokunmak yerine çalışmayı reddeder.",
      },
      {
        t: "Erişim bilgisayarda verilir.",
        b: "Üyeler ve roller yalnızca bilgisayarda, aipager config ile değişir. Telegram'daki hiçbir şey, Mini App'teki hiçbir şey bir kişi ekleyemez ya da bir rolü genişletemez.",
      },
      {
        t: "Her yanıt kayıtta.",
        b: "Her İzin ver, her Reddet ve her yanıt ~/.claude/aipager-audit.jsonl dosyasına gider; o dosyaya yalnızca ekleme yapılır ve bir grupta kimin dokunduğu da yazar.",
      },
    ],
    link: "Güvenlik modeli",
  },

  install: {
    eyebrow: "Kurulum",
    title: "Dört satır. Kayıtlı Mesajlar'da sakla.",
    lead: "Kopyalamak için bir satıra dokun. Önce iki şey: @BotFather'dan kendi botun (içinde Başlat'a bas) ve bu bilgisayarda giriş yapılmış Claude Code. İkinci satırdaki sihirbaz gerisini sana sorar.",
    agent: {
      title: "Ya da zaten elinde olan ajana bırak.",
      lead: "Bot token'ını, ajanın hiç okumasına gerek olmayan bir dosyaya koy, sonra Claude Code'a şunu ver:",
      link: "İzlediği rehber",
    },
    saved: { name: "Kayıtlı Mesajlar", count: "4 mesaj" },
    lines: [
      { note: "uv, pipx ya da Homebrew, hangisi varsa. Linux ya da macOS." },
      { note: "@BotFather'dan aldığın bot token'ın, sohbetin, Claude Code'un hook'ları" },
      { note: "bilgisayardan çıkış yaptıktan sonra da aipager'ı ayakta tutar" },
      { note: "dtach içinde Claude Code. Gerisini sohbetin devralır." },
    ],
    copied: "Kopyalandı",
    pm: "Paket yöneticini mi tercih edersin? uv, pipx, Homebrew, Docker, Nix, AUR ve Snap.",
    pmLink: "kurmanın bütün yolları",
  },

  faq: {
    eyebrow: "SSS",
    title: "Sor bakalım.",
    readBack: "geri okumak için sürükle",
    items: [
      {
        q: "Bunun Claude'un mobil uygulamalarından farkı ne?",
        a: "Claude'un uygulamaları, Anthropic'in barındırdığı asistanla konuşur. aipager ise kendi bilgisayarında çalışan bir Claude Code oturumunu yansıtır: senin repon, senin araçların, senin ortamın.",
      },
      {
        q: "Kodum bilgisayarımdan çıkıyor mu?",
        a: "Yalnızca kendi Telegram sohbetlerine kadar. aipager, Telegram ile kendi bot token'ını kullanarak konuşur; arada aipager sunucusu diye bir şey yok.",
      },
      {
        q: "Bu yüzden Claude hesabım banlanır mı?",
        a: "aipager, Anthropic'i hiç çağırmaz. Bilgisayarında resmi claude CLI'yı başlatır ve Claude Code'un yayınladığı hook'ları okur; mesajların da o oturuma, tam klavyenin başındaymışsın gibi yazılır: tersine mühendislikle bulunmuş uç nokta yok, proxy yok, paylaşılan hesap yok, başkasının sunucusundan geçen hiçbir şey yok. Anthropic'in gördüğü şey, senin Claude Code girişinin zaten yaptığını yapması. Ondan ne istediğin yine Anthropic'in kullanım politikalarına tabidir ve tek bota bağlı bir ekip yine senin aboneliğini paylaşıyor demektir: bunun için aipager'ı ayrı bir hesapla ya da harcama limiti olan bir anahtarla çalıştır.",
      },
      {
        q: "VPN'e ya da açık bir porta ihtiyacım var mı?",
        a: "Hayır. aipager, Telegram'a yalnızca dışarı doğru, HTTPS üzerinden bağlanır ve loopback dışında hiçbir portu dinlemez; yani yönlendirecek bir şey de, ağdan erişilecek bir şey de yok. Telefonun Telegram ile konuşur; Telegram da bilgisayarının kendi giden bağlantısıyla.",
      },
      {
        q: "Claude çığırından çıkarsa ne olur?",
        a: "İstekler senin dokunuşunu bekler, /stop görevi yarıda keser ve kuyrukta ne varsa atar, /kill oturumu sonlandırır, biten bir görevden kalan düğmeler ise çalışmayı reddeder.",
      },
      {
        q: "Ekibim de kullanabilir mi?",
        a: "Evet. Botu bir gruba ekle ve rolleri ver: owner, admin, user, read_only. Her mesaj gönderenin izinleriyle çalışır, can_manage yetkisi olmayan bir üye kendi kök klasöründe kalır ve her karar denetim kaydına geçer.",
      },
      {
        q: "Ona sesli mesaj ya da ekran görüntüsü gönderebilir miyim?",
        a: "İkisi de olur. Sesli mesaj bilgisayarında yazıya dökülür ve sen yazmışsın gibi oturuma yazılır; bir fotoğraf ya da dosya bilgisayarına kaydedilir ve Claude'a yolu verilir, mesaj olarak da senin açıklaman kullanılır.",
      },
      {
        q: "Benim dilimi konuşuyor mu?",
        a: "On beş dil; /language ile seçilir ya da Telegram'daki dilinden alınır. Farsça ve Arapça sağdan sola okunur, kendi rakamlarıyla. Yalnızca aipager'ın kendi metni değişir; Claude ona yazdığın dilde yanıt verir.",
      },
      {
        q: "Panel var mı?",
        a: "/app, Telegram'ın içinde bir Mini App açar: oturum başına bir kutucuk, her Write ve Edit için değişiklik (diff) görüntüleyici, ayarlar, tek dokunuşla durdurma. Varsayılan olarak açıktır, her istek Telegram'ın imzasıyla denetlenir ve aipager miniapp disable onu kapatır.",
      },
      {
        q: "dtach nedir?",
        a: "Küçücük bir terminal ayırıcı. Terminal kapandıktan ya da SSH düştükten sonra da Claude Code'u ayakta tutar; böylece bir saat sonra gönderdiğin bir yanıt hâlâ çalışan bir oturuma ulaşır. aipager ile birlikte gelir.",
      },
      {
        q: "Bilgisayardan çıkış yapınca çalışmaya devam eder mi?",
        a: "aipager service install, aipager'ı systemd ya da launchd altında ayakta tutar; oturumların kendisi de dtach içinde yaşar, yani onları başlatan terminal kapansa da sürerler. Docker, Nix, AUR ve Snap paketleri de var.",
      },
      {
        q: "Nasıl güncellerim?",
        a: "/update, aipager'ı ve Claude Code'u kontrol eder ve yeni sürümü kurar; sonra “🔄 Şimdi yeniden başlat” onu olduğu yerde yeniden ayağa kaldırır, ister bir terminalde, ister tmux'ta, ister Docker'da, ister bir hizmet olarak çalışsın. Oturumların bu sırada çalışmaya devam eder.",
      },
      {
        q: "Maliyeti ne?",
        a: "Hiçbir şey. MIT lisanslı, bot senin ve Claude Code zaten kullandığı planı ya da anahtarı kullanmaya devam ediyor.",
      },
    ],
  },

  cta: {
    title: "Claude'u sohbetlerine ekle.",
    lead: "Sonra terminali kapat, akşamının tadını çıkar.",
    copy: "Kopyala",
  },

  footer: { changelog: "Sürüm notları", issues: "Issues" },

  docs: {
    title: "Dokümanlar",
    description: "aipager için başvuru dokümanları: mimari, hook'lar, komutlar, sorun giderme, güvenlik.",
    onThisPage: "Bu sayfada",
    translated: "Bu sayfa İngilizceden çevrildi; ikisi birbirini tutmazsa İngilizce sürüm geçerlidir.",
    english: "İngilizce",
    source: "GitHub'daki kaynak",
    onGitHub: "Bu sayfalar GitHub'da",
    sourceNote: "Repodaki markdown, okumakta olduğun metnin aynısı.",
    prev: "Önceki",
    next: "Sonraki",
    groups: ["Buradan başla", "Referans", "Çalıştırma"],
  },

  demo: {
    people: { you: "Sen" },
    typing: "yazıyor",
    isTyping: "yazıyor",
    days: { today: "Bugün", yesterday: "Dün", monday: "Pazartesi" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 üye, 3 çevrimiçi" },
      mom: { name: "Annem", subtitle: "çevrimiçi" },
      friends: { name: "Cuma halı saha ⚽", subtitle: "9 üye" },
      sara: { name: "Sara", subtitle: "son görülme yakın zamanda" },
      saved: { name: "Kayıtlı Mesajlar", subtitle: "" },
    },
    folders: { all: "Tüm sohbetler", personal: "Kişisel", work: "İş", bots: "Botlar" },
    seed: {
      oldPrompt: "boşta kalan oturumlar 30 dakika sonra sona ersin",
      oldAnswer: "Tamam. Oturum deposu artık boşta kalan oturumları 30 dakika sonra sonlandırıyor; 212 test geçiyor.",
      teamFlaky: "prod login yine flaky 😬 bakan var mı?",
      teamSaw: "bende de oldu, son bir saatte iki kez",
      momEat: "Yemek yedin mi? 🙂",
      friendsPitch: "saha ayarlandı, cuma 19:00",
      friendsIn: "ben varım 🙋",
      friendsBall: "varım, yeni topu getiriyorum",
      saraMerged: "PR'ını merge ettim 🚀",
      saraThanks: "sağ ol!!",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "yedim! makarna yaptım 🍝 sen?",
      momLunch: "pazar öğlen 1'de yemek? 😊",
      youLunch: "1'de ❤️",
      teamRun: "@aipagerbot /web login e2e'yi staging'de çalıştır",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "cumaya kim var? 2 kişi eksiğiz ⚽",
      youIn: "ben varım 🙋‍♂️",
      saraVacation: "tatile karar verdin mi? 🏖",
      youTwoMinutes: "iki dakika 😄",
      youBook: "Lizbon, 12–19 Mart ☀️ uçak 193 €, otel 142 €",
      saraBook: "evet!! rezerve et 🎉",
    },
    prompts: {
      fix: "flaky login e2e testini düzelt",
      trip: "martta bir hafta Lizbon: önce hava durumuna bak, sonra 180 € altında 3 otel ve Berlin'den uçuşlar. Hava kötü görünüyorsa Sevilla'ya bak.",
      more: "bunun için birkaç ajan başlat: biri 180 € altındaki otellere, biri Berlin'den uçuşlara baksın",
      push: "bir de düzeltme dalını push et ve PR'ı aç",
      teamRun: "login e2e'yi staging'de çalıştır",
    },
    claude: {
      plan: "Login testini birkaç kez çalıştırıp nerede hata verdiğine bakacağım.",
      flaky: "Beş çalıştırmadan birinde hata veriyor. Mantık değil, zamanlama.",
      cookie: "Test, oturum çerezi yazılmadan tıklıyor. 5sn uyuyup şansa bırakıyor.",
      answer: "Düzelttim. Test artık 5sn uyumak yerine oturum çerezini bekliyor. Arka arkaya 10 çalıştırma, hepsi yeşil.",
      teamTests: "Staging'de 18 login testinin 18'i geçiyor. Hata orada çıkmıyor.",
      weather: "Önce hava durumu: yağmurlu bir haftanın fiyatına bakmanın anlamı yok.",
      lisbon: "Martta Lizbon: gündüz 18°C, 7 günün 2'sinde yağmur. Yeterince iyi, Sevilla'ya gerek yok.",
      pr: "fix/login-cookie dalını push ettim ve PR #214'ü açtım. CI onun üzerinde çalışıyor.",
      teamShort: "Staging'de 18 login testinin 18'i geçiyor.",
      twoAgents: "O zaman iki ajan: biri yataklara, biri koltuklara.",
      interim: "Lizbon tamam: 18°C, iki gün yağmurlu. İki ajan da aramaya çıktı; kısa listeyle döneceğim.",
      shortlist:
        "Oteller: Casa Baleal gecesi 142 €, Lx Boutique 165 €, Santa Justa 178 €; üçü de Baixa'ya yürüme mesafesinde. Uçuşlar: TAP direkt, 12'sinde gidiş 89 €, 19'unda dönüş 104 €. Sen bir söyle, ikisini de ayırtayım.",
    },
    question: {
      verb: "Timeout'u mu artırayım, çerezi mi bekleyeyim?",
      question: "Timeout'u artırayım mı, çerezi mi bekleyeyim?",
      options: ["Timeout'u artır", "Çerezi bekle", "İkisi de"],
      title: "Düzeltme",
      body: "Test tıklamadan önce 5sn uyuyor.",
    },
    captions: {
      restAuto: "Dizüstü bilgisayarında hazır bekleyen bir Claude Code oturumu; her yeni oturumun başladığı Otomatik modda.",
      restAsk: "Dizüstü bilgisayarında hazır bekleyen bir Claude Code oturumu, Sor modunda: her işlemden önce sorar.",
      restFull: "Dizüstü bilgisayarında hazır bekleyen bir Claude Code oturumu. Sıradaki işten önce denetimlerini kaldırıyorsun.",
      held: "Sen etrafa bakarken duraklatıldı. Bir an öylece bırak, akşam kaldığı yerden devam eder.",
      arrived: "👀 ulaştı demek. aipager mesajı oturuma yazar, tam da klavyenin başındaymışsın gibi.",
      took: "👍 Claude aldı demek. Buradan sonrası tek bir kart: görev ilerledikçe kendini günceller.",
      glance: "Testi birkaç kez çalıştırır. Attığı her adım aynı kartı günceller.",
      momFirst: "Annen yirmi dakika önce sormuş. Burada seni bekleyen bir şey yok, sen de ona yanıt veriyorsun.",
      sent: "Gönderildi. Herkesin yaptığı gibi sohbetten çıkıyorsun.",
      workAuto:
        "Her yeni oturumun başladığı Otomatik mod: Claude Code'un kendi güvenlik denetimi hem okumayı hem de test çalıştırmasını kendisi geçirdi. İkisi de sana gelmedi.",
      askRead: "Sor modu: her çağrı seni bekler. Bu çağrı yalnızca bir dosya okumak istiyor.",
      askTest: "Test çalıştırması için yine aynısı. Otomatik modda bunların ikisi de hiç sormazdı.",
      workFull: "Tam erişim modu: Claude Code hiçbir şey sormaz, aipager'ın da iletecek bir şeyi olmaz. Sen yalnızca ne yaptığını görürsün.",
      momAgain: "Yine annen. Oturum arkanda devam ediyor; açık bir pencereye ihtiyacı yok.",
      team: "Ekibin grubu. İzin verilenler listesindeki herkes botun adını anarak ona yazabilir; her mesaj gönderenin rolüyle çalışır.",
      teamSara:
        "Sara bu grupta yönetici, bu yüzden test çalıştırması geçiyor. Mesaj Claude'a, kimin gönderdiği ve hangi rolle çalıştığı yazılı olarak ulaşıyor.",
      teamSam: "Sam bu grupta user rolünde. Bash onun rolüne kapalı, bu yüzden çağrı çalışmadan önce reddediliyor.",
      questionAuto:
        "Şimdi yalnızca senin yanıtlayabileceğin bir şey. Bir mod neyin sorulmadan çalışacağına karar verir; böyle bir soru ise her modda sana gelir.",
      questionAsk: "Bir izin değil, bir soru: Claude'un kendi kararı, her seçenek için bir düğme.",
      buzzed: "Telefonun koltuğun kolunda titredi. Üç düğme, tek dokunuş.",
      answerTyped: "Yanıtın, klavyenin başındaymışsın gibi oturuma yazılıyor.",
      friends: "Aile, arkadaşlar, iş ve Claude: tek uygulama, zaten sürekli baktığın uygulama.",
      answerDone: "Bitti. Yanıt başka her mesaj gibi geliyor, sabitlenmiş çubuk da susuyor.",
      evening: "Koltuktan düzeltilen flaky bir test; annenin bir sorusuyla cuma günkü maç arasında.",
      saraPing: "Bildirim veren her şey iş değil.",
      second: "Sohbetten başlatılan ikinci bir oturum: terminal yok, ssh yok.",
      newReady: "aipager onu bilgisayarında başlatır ve yeni oturumların başladığı modda, hazır olarak sana verir.",
      weather: "Gerisini belirleyen şeye bakar ve bulduğunu söyler.",
      queued: "O daha çalışırken gönderildi: aipager mesajı hemen iletir, Claude onu kuyruğa alır ve 👀 ulaştığını söyler.",
      queueLine: "Altındaki satır neyi beklediğini söyler; ona dokununca mesaj adımın ortasında Claude'a verilir.",
      tookIt:
        "Claude mesajı adımın sonunda alır: 👍, gri renk gider, satır kaybolur ve kart, yanıtladığı mesajın altına geçer.",
      agents: "Aynı anda iki ajan yollar. Her birinin kendi satırı olur ve kart her birinin ne yaptığını izler.",
      agentsWork: "Artık kendi başlarınalar: her biri birkaç araç kullanıyor, senin yapacağın bir şey yok.",
      twoSessions:
        "Bu sohbette artık iki oturum var. Düz bir mesaj, mesajlarının ayarlı olduğu oturuma gider; diğerine ulaşmak için onun bir mesajını yanıtlarsın.",
      hold: "Basılı tut, Telegram onunla neler yapabileceğini sunsun.",
      reply: "Yanıtla. Mesaj kutusu artık o mesajı yanıtlıyor, aipager de mesajın hangi oturuma gideceğini oradan anlıyor.",
      aimed: "trip'e değil, api'ye yazıldı.",
      interim: "Görev onlardan önce bitiyor, bu yüzden yanıt, hâlâ süren iş için altında canlı bir satırla çıkıyor.",
      apiFirst: "Önce api yanıtlıyor; yapacak tek bir işi vardı.",
      liveLine: "Onlar çalışırken aipager o satırı kendi başına güncel tutar.",
      bothBack: "İkisi de döndü. aipager satırları tek satıra indiriyor ve ajanların buldukları Claude'u yeniden uyandırıyor.",
      shortlist: "Buldukları, Claude iki raporu da okuduktan sonra yazılan ayrı bir yanıt olarak geliyor.",
      human: "Geriye yalnızca bir makinenin senin yerine yapmaması gereken kısım kalıyor.",
      end: "Bir koltuktan iki oturum, üç ajan ve Lizbon'da bir hafta. Çalışır kalan bir şey yok, dokunulacak bir şey yok.",
      resting: "Bu oturum hazır bekliyor. Ona sıradaki işi vermeden önce denetimlerini kaldırıyorsun.",
      fullWho: "Tam erişim modu yöneticiler içindir; bir de botla olan kendi özel sohbetinde senin için.",
      fullRestart:
        "Tam erişim moduna geçmek ya da oradan çıkmak oturumu yeniden başlatır, konuşmayı korur. Sor modu ile Otomatik mod arasında hiçbir şey yeniden başlamaz.",
    },
    switch: {
      default: "varsayılan",
      lines: [
        "Her çağrı durur ve senin dokunmanı bekler.",
        "Güvenli çağrılar kendiliğinden çalışır; riskli olanlar senin iznini bekler.",
        "Hiçbir şey durmaz. Hiçbir şey sorulmaz.",
      ],
    },
    cable: { idle: "sıradaki görevi bekliyor", quiet: "yeni bir şey yok", flick: "kablo gerçek · bir fiske at", daemon: "aipager" },
    wire: {
      cardEdited: "kart güncellendi · Bash ×1",
      twoCalls: "iki çağrı, dokunacak bir şey yok",
      trace: "trace ve bulduğu şey",
      permNeeded: "🔐 İznin gerekiyor",
      readRuns: "karar · okuma çalışıyor",
      testRuns: "karar · test çalışıyor",
      threeCalls: "üç çağrı, denetim yok",
      question: "❓ bir soru, düğmeleriyle",
      answerTyped: "yanıt yazıldı",
      claudeAnswer: "💬 Claude'un yanıtı",
      sessionIn: "~/travel içinde bir oturum",
      typedTrip: "claude-trip'e yazıldı",
      newCardTrip: "yeni bir kart · trip",
      lisbon: "Martta Lizbon · 18°C",
      queued: "claude-trip · kuyrukta",
      tookIt: "aldı · 👍",
      twoAgents: "🤖 iki ajan",
      aimed: "hedef: claude-api",
      cardApi: "bir kart · api",
      interim: "💬 trip · ara yanıt",
      thePr: "💬 api · PR",
      flightsDone: "✅ uçuşlar · 7 araç",
      hotelsDone: "✅ oteller · 11 araç",
      shortlist: "💬 trip · kısa liste",
      switchFull: "Tam erişim moduna geçilsin mi?",
      restarting: "yeniden başlıyor, konuşma korunuyor",
      typedApi: "claude-api'ye yazıldı",
      newCardApi: "yeni bir kart · api",
      yourMessage: "mesajın",
      aReply: "bir yanıt · api",
    },
    hints: {
      cancel: "“İptal” api'yi olduğu modda bırakırdı. Bu akşam Tam erişim moduyla devam ediyor: diğer düğmeyi dene.",
      deny: "“Reddet” çağrıyı gerçekten engellerdi. Bu akşam testin çalışması gerekiyor: “İzin ver” düğmesini dene.",
      stop: "“Durdur” görevi yarıda keserdi. “İzin ver” düğmesini dene.",
    },
    menu: ["Yanıtla", "Metni Kopyala", "Sabitle", "İlet", "Seç", "Sil"],
    composer: "Mesaj yaz…",
    search: "Ara",
  },
};
