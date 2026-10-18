import type { Dict } from "./types";

/**
 * Indonesian, written the way an app made in Indonesia would say it: plain,
 * short sentences, kamu throughout, no officialese. The words for the
 * product's own ideas (sesi, kartu, permintaan izin, Mode Auto, menunggu
 * jawabanmu…) are the ones aipager itself uses in Telegram.
 */
export const id: Dict = {
  meta: {
    title: "aipager: Claude Code memanggilmu",
    description:
      "aipager menjalankan sesi Claude Code-mu di terminal terpisah dan menampilkannya di Telegram: lihat sesimu bekerja, izinkan apa yang diminta, kirim pesan berikutnya. Semuanya jalan di komputermu.",
  },

  nav: {
    modes: "Mode",
    app: "Mini App",
    how: "Cara kerjanya",
    install: "Pasang",
    security: "Keamanan",
    faq: "FAQ",
    docs: "Dokumentasi",
    language: "Ganti bahasa",
  },

  hero: {
    title: "Claude jadi satu chat lagi.",
    lead: "aipager menaruh sesi Claude Code-mu di Telegram, di antara keluarga, teman dan tim kerjamu. Semuanya jalan di komputermu.",
    agentInstall: "Biar agenmu yang memasangnya",
    docs: "Dokumentasi",
    security: "Keamanan",
    meta: "Linux & macOS · MIT · sekitar satu menit",
  },

  modes: {
    eyebrow: "Mode izin",
    title: "Tiga mode. Kamu mulai dari Mode Auto.",
    lead: "Setiap sesi ada di salah satu dari tiga mode, dipilih per sesi dan bisa diganti kapan saja dengan /mode. Mode Tanya berhenti sebelum setiap tindakan. Mode Auto, mode awal setiap sesi baru, membiarkan pemeriksaan keamanan Claude Code sendiri menjalankan tindakan yang aman dan menghentikan yang berisiko untukmu. Mode Akses penuh menjalankan semuanya tanpa pemeriksaan sama sekali. Mode hanya mengatur permintaan izin dari Claude Code, bukan yang lain: di grup, alat yang tidak boleh dipakai sesuai peran anggota tetap ditolak, apa pun modenya.",
    legend: [
      { k: "Izinkan", v: "hanya tindakan ini" },
      { k: "Tolak", v: "Claude memblokir tindakan itu" },
      { k: "Selalu izinkan", v: "menambahkan aturan yang ditawarkan Claude, kalau ada" },
      { k: "Hentikan", v: "memutus tugasnya, bukan menjawab" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Setiap tindakan menunggumu, bahkan sekadar membaca file.",
      quote: "Aku lihat dulu helper cookie-nya.",
      read: "Read: helper cookie",
      needs: "Perlu izinmu",
    },
    auto: {
      tag: "bawaan",
      note: "Membaca file dan menjalankan test lolos sendiri. Perintah ke staging termasuk yang berisiko, jadi berhenti dulu.",
      quote: "Test-nya sudah klik sebelum cookie sesi di-set.",
      risky: "Bash: Lihat sesi terbaru di staging",
    },
    full: {
      tag: "/mode full",
      note: "Tanpa pemeriksaan, tanpa tombol. Cuma jawabannya begitu selesai.",
      ask: "perbaiki test e2e login yang suka gagal",
      quote: "Test-nya sudah klik sebelum cookie sesi di-set. Cuma sleep 5 detik, lalu berharap.",
    },
    facts: [
      {
        t: "/mode",
        b: "Menampilkan satu tombol untuk tiap mode lain; /mode ask, /mode auto dan /mode full langsung mengganti modenya. Sesi baru mulai di Mode Auto kecuali chat ini memilih yang lain di /settings → Sesi baru.",
      },
      {
        t: "Tanya ⇄ Auto, seketika",
        b: "Tanpa mulai ulang, bahkan saat Claude sedang bekerja: aipager menekan Shift+Tab di sesi itu, dan kartunya bilang sedang beralih sampai Claude Code mengonfirmasi mode barunya.",
      },
      {
        t: "Mode Akses penuh perlu mulai ulang",
        b: "Masuk atau keluar dari Mode Akses penuh memulai ulang sesi, dan percakapannya tetap ada. Hanya admin yang bisa memulai sesi di mode itu atau memindahkannya ke sana (atau kamu, di chat pribadimu sendiri dengan bot).",
      },
      {
        t: "Pertanyaan tetap datang",
        b: "Mode mengatur permintaan izin, bukan keputusan: saat Claude menanyakan sesuatu, tombolnya tetap masuk ke chatmu, apa pun modenya.",
      },
    ],
  },

  places: {
    eyebrow: "Di mana tempatnya",
    title: "Tiga chat. Sisanya hidupmu sendiri.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Bekerja · 3:14 · Read ×2 · Bash ×2",
        title: "Chatmu dengan Claude",
        body: "Satu chat untuk semua sesi. Satu kartu per tugas yang terus memperbarui dirinya sendiri, permintaan yang kamu jawab dengan satu ketukan, dan bilah tersemat yang bilang apa yang menunggu jawabanmu. Pesan biasa masuk ke sesi yang disebut bilah itu; /web mengirim pesan berikutnya ke sesi lain, dan percakapannya lanjut di sana.",
      },
      {
        name: "backend-team",
        tag: "grup · mode tim",
        preview: "Sara: @aipagerbot /web jalankan e2e login di staging",
        title: "Grup timmu",
        body: "Masukkan bot ke grup, dan siapa pun yang terdaftar bisa menyebutnya. Setiap pesan jalan dengan peran pengirimnya; alat yang tidak boleh dipakai peran itu ditolak sebelum jalan, dan setiap keputusan tercatat di log audit lengkap dengan nama orang yang mengetuknya.",
      },
      {
        name: "Jim",
        tag: "chatnya sendiri dengan bot",
        preview: "web · Perlu izinmu",
        title: "Orang lain, di chatnya sendiri",
        body: "Tambahkan chat pribadi rekan timmu dengan bot, dan dia menjalankan sesinya sendiri, dengan perannya sendiri dan folder utamanya sendiri: tugas Claude-nya mulai di dalam folder itu dan tidak membaca apa pun di folder home-mu di luar itu. Kalau ada yang cuma boleh melihat, beri dia read_only di grupmu.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<sesi> <pesan>"],
      ["owner", "admin", "user", "read_only"],
      ["folder utama anggota", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Empat peran, dan satu aturan alat per peran.",
      lead: "Peran yang berlaku adalah peran yang kamu pegang di chat tempat kamu bertindak, dan alat yang tidak boleh dipakai peran itu langsung ditolak sebelum jalan, bukan ditanyakan. Tidak ada apa pun di Telegram atau Mini App yang bisa mengubah siapa saja yang terdaftar: hanya aipager config, di komputer.",
      can: "Bisa",
      rows: [
        "Mengirim pesan ke sesi",
        "Izinkan, Tolak, menjawab pertanyaan Claude",
        "Bash, dan apa pun yang menjalankan kode",
        "Mode Akses penuh, /settings grup, /update",
        "Di mana sesinya boleh bekerja",
        "Membaca file kredensial (~/.ssh, …)",
      ],
      anywhere: "di mana saja",
      rootFolder: "folder utama",
      ownChat: "chat sendiri",
      link: "Mode tim, selengkapnya",
    },
  },

  day: {
    eyebrow: "Sehari-hari",
    title: "Pakai seperti chat biasa.",
    lead: "Bukan konsol yang dibungkus tampilan chat: semua yang biasa kamu lakukan di Telegram juga bisa di sini. Bicara ke aipager di jalan pulang, lempar screenshot-nya, kirim ide berikutnya sebelum yang tadi selesai.",
    items: [
      {
        t: "Ucapkan saja",
        b: "Kirim pesan suara dan isinya diubah jadi teks di komputermu sendiri (tidak pernah di cloud siapa pun), ditampilkan balik supaya kamu lihat apa yang didengar aipager, lalu diketik ke dalam sesi seolah-olah kamu yang menulisnya.",
      },
      {
        t: "Screenshot bug-nya",
        b: "Foto dan file masuk ke folder di komputermu dan Claude diarahkan ke path-nya, dengan keteranganmu sebagai pesan, atau “check this: …” kalau tidak ada keterangan. Kirim beberapa sekaligus dan semuanya masuk sebagai satu pesan.",
      },
      {
        t: "Kirim yang berikutnya sekarang",
        b: "Pesanmu sampai ke Claude begitu kamu kirim, bahkan di tengah tugas: 👀 selama antrean Claude sendiri masih menahannya, 👍 begitu Claude mengambilnya. ⚡ Kirim sekarang menyerahkannya tanpa menunggu langkah itu selesai.",
      },
      {
        t: "Tidak pernah dibaca sebagai jawaban",
        b: "Pesan yang kamu kirim saat ada permintaan izin yang belum dijawab akan ditahan dulu, bukan dicampur ke dalam permintaan itu, dan masuk ke sesi begitu kamu menjawabnya.",
      },
      {
        t: "Agen dan perintah latar belakang, semuanya terpantau",
        b: "Setiap agen latar belakang yang dimulai Claude dapat barisnya sendiri di kartu beserta apa yang sedang dikerjakannya, dan perintah latar belakang yang dibiarkan jalan punya timer-nya sendiri sampai berakhir.",
      },
      {
        t: "aipager yang bilang duluan",
        b: "Peringatan konteks, percakapan yang diringkas, sesi yang sudah berakhir atau diam saja, tugas yang kelewat lama: kabarnya langsung masuk ke chat, tanpa kamu harus mengecek.",
      },
      {
        t: "Tombolnya sudah ada di situ",
        b: "Ada keyboard di bawah kotak pesan: satu tombol per sesi yang berjalan, lalu status, stop dan new, lalu Templat untuk pesan yang selalu kamu ketik ulang dan Perintah untuk yang ditangani Claude Code sendiri.",
      },
      {
        t: "/status, seluruh chat sekaligus",
        b: "Semua sesi dalam satu daftar yang bisa langsung kamu kendalikan: apa yang sedang dikerjakan masing-masing, modelnya, sisa konteksnya, berapa biayanya, apa yang mengantre di belakangnya, lengkap dengan Hentikan, Jawab dan menu lainnya di tiap sesi.",
      },
    ],
    heard: "Yang kudengar:",
    said: "perbaiki test e2e login yang suka gagal",
  },

  app: {
    eyebrow: "Mini App",
    title: "Dasbor, tetap di dalam Telegram.",
    lead: "/app membuka semua sesi sekaligus: satu kotak untuk masing-masing, lengkap dengan cincin konteks, folder, model dan biaya yang sudah terpakai. Tempat menjawab tetap di chat; aplikasinya untuk melihat semuanya dalam sekali pandang, dan untuk hal-hal yang canggung dilakukan di chat, seperti membaca diff atau mengubah pengaturan.",
    tabs: { sessions: "Sesi", settings: "Pengaturan" },
    summary: { needs: "menunggu jawabanmu", working: "sedang bekerja", resting: "siap", spent: "terpakai", finished: "sudah berakhir" },
    needsYou: "Menunggu jawabanmu",
    answerInChat: "Jawab di chat",
    states: { working: "sedang bekerja", needs: "menunggu jawabanmu", resting: "siap" },
    settings: {
      updates: "Pembaruan",
      upToDate: "Semuanya sudah terbaru.",
      check: "Cek pembaruan",
      language: "Bahasa aplikasi",
      languageNote: "Hanya teks aipager sendiri. Jawaban Claude tidak berubah.",
      chatPrefs: "Pengaturan chat",
      chatPrefsNote: "Ini berlaku untuk setiap sesi di chat ini.",
      rows: [
        { k: "Tata letak pesan", v: "Kartu kerja + jawaban terpisah" },
        { k: "Pratinjau perubahan (diff)", v: "Mati" },
        { k: "Pembaruan kartu tugas panjang", v: "Nyala" },
        { k: "Sesi baru" },
      ],
    },
    close: "Tutup",
    facts: [
      {
        t: "Semua sesi dalam satu layar",
        b: "Satu kotak untuk tiap sesi, lengkap dengan cincin konteks, pemiliknya, modelnya dan biaya yang terpakai, dan satu baris di atasnya yang menunjukkan keadaan chat ini: mana yang sedang bekerja, mana yang siap, berapa biaya hari ini, berapa yang sudah berakhir. Tombol + memulai sesi lain: nama, folder dari yang sudah kamu pakai, dan model.",
      },
      {
        t: "Yang menunggu jawabanmu, paling atas",
        b: "Sesi yang punya permintaan izin atau pertanyaan yang belum dijawab muncul paling atas, beserta apa yang ditanyakannya. Jawab di chat mengirim permintaan itu kembali ke bagian bawah chat, lengkap dengan tombolnya, dan kamu menjawabnya di sana.",
      },
      {
        t: "Satu halaman per sesi",
        b: "Keadaannya, “Bekerja (3:12)” atau “Siap, terakhir aktif 5 menit lalu”, dan satu ketukan untuk Hentikan atau Lanjutkan. Di bawahnya alat-alat terakhir yang dipakai, jawaban terbaru, pengatur model, file yang diubah tugas itu dalam bentuk diff, dan pengaturan sesi itu sendiri.",
      },
      {
        t: "Langsung dari aipager sendiri",
        b: "Aktif secara bawaan, setiap permintaan dicocokkan dengan tanda tangan Telegram sendiri, dan halamannya tidak memuat apa pun dari luar: tidak ada font, tidak ada script. aipager miniapp disable mematikannya.",
      },
    ],
    link: "Apa saja yang bisa dilakukan aplikasi ini",
  },

  langs: {
    eyebrow: "Lima belas bahasa",
    title: "Dalam bahasamu, sampai ke angkanya.",
    lead: "Yang berubah hanya kata-kata aipager sendiri: kartu, permintaan, tombol, bilah tersemat, /status, Mini App, dokumentasinya. Sesimu tidak: Claude menjawab dalam bahasa yang kamu pakai saat menulis, dan apa yang dikirim aipager ke Claude tetap seperti aslinya. Pilih bahasanya dengan /language, atau biarkan mengikuti aplikasi Telegram-mu.",
    facts: [
      {
        t: "Kanan ke kiri, dengan benar",
        b: "Bahasa Persia dan Arab dibaca dari kanan ke kiri, dengan angka Persia (۰-۹) atau Arab-Hindi (٠-٩) dan pemisahnya sendiri, baik di Telegram maupun di Mini App. Nama sesi, path, perintah dan kode tetap pada arahnya sendiri.",
      },
      {
        t: "Ditulis, bukan diterjemahkan",
        b: "Tiap bahasa ditulis seperti orang yang memakai aplikasi dalam bahasa itu benar-benar bicara, termasuk kata serapannya, dengan bentuk jamak milik tiap bahasa (bahasa Arab punya enam).",
      },
      {
        t: "Chatmu, bahasamu",
        b: "Chat pribadi bisa mengikuti aplikasi Telegram-mu. Grup punya satu bahasa, diatur oleh admin, dan pop-up yang muncul setelah satu ketukan memakai bahasa orang yang mengetuknya.",
      },
      {
        t: "Dokumentasinya juga",
        b: "README dan semua halaman di docs/ ikut diterjemahkan. Kalau terjemahan dan halaman bahasa Inggrisnya berbeda, versi bahasa Inggris yang berlaku.",
      },
    ],
    pinned: "Pesan tersemat",
  },

  under: {
    eyebrow: "Di balik chat",
    title: "Terminal tetap jadi acuannya.",
    lead: "Claude Code berjalan di terminal sungguhan, di dalam dtach, jadi tidak ada yang perlu membiarkan jendela terbuka. Tiap langkah memicu hook yang mengirim satu datagram ke aipager lewat socket lokal, dan aipager memperbarui satu pesan di chatmu. Jawabanmu kembali lewat jalur yang sama: keputusanmu ke hook yang sedang menahan tindakan itu, atau ketikan ke dalam sesi.",
    nodes: [
      { t: "Claude Code", b: "di dalam dtach, tanpa perlu jendela" },
      { t: "hook", b: "jalan di tiap langkah" },
      { t: "aipager", b: "satu proses, sebagai user-mu" },
      { t: "Telegram", b: "token bot milikmu sendiri" },
      { t: "chatmu", b: "chat pribadimu, grup timmu" },
    ],
    facts: [
      {
        t: "Duduk di depannya kapan saja",
        b: "aipager session api menyambung ke sesi yang sedang berjalan dari terminal mana pun. Ketik di sana, ketik di chat: sesi yang sama. Tutup jendelanya dan sesinya jalan terus, dan sambungannya bahkan tetap ikut sesi itu saat dimulai ulang.",
      },
      {
        t: "aipager tidak pernah membaca layarmu",
        b: "aipager mengetik ke dalam sesi dan mendengarkan event dari Claude Code sendiri. Yang muncul di chatmu berasal dari hook dan percakapan yang tersimpan, bukan dari membaca isi layar terminal.",
      },
      {
        t: "Tidak ada yang menunggu chat",
        b: "Hook mengirim satu datagram lalu selesai, sekitar 20 ms dari waktu Claude Code. Kalau aipager tidak sedang mendengarkan, event-nya dibuang begitu saja dan Claude jalan terus; aipager menyusul dari file milik sesi itu sendiri.",
      },
    ],
    hooks: "Enam belas hook, ditambah baris status yang dibaca aipager untuk model, konteks dan biaya. Semuanya tersambung ke aipager.",
  },

  trust: {
    eyebrow: "Keamanan",
    title: "Tidak ada perantara.",
    lead: "aipager tidak pernah bicara dengan Anthropic. Satu-satunya yang bicara adalah Claude Code sendiri, dengan login milikmu, di komputermu sendiri. aipager menjalankannya di terminal dan mendengarkan hook yang diterbitkan Claude Code. Tidak ada endpoint hasil bongkaran, tidak ada proxy, tidak ada akun selain akunmu: sesi yang kamu kendalikan dari ponsel adalah sesi yang sama dengan yang kamu kendalikan dari keyboard.",
    cards: [
      {
        t: "Tidak ada server aipager.",
        b: "aipager bicara ke Telegram Bot API dengan token bot milikmu sendiri. Tidak ada akun aipager dan tidak ada layanan aipager, dan tidak ada komputer orang lain di antara ponselmu dan komputermu.",
      },
      {
        t: "Hanya chatmu yang dilayani.",
        b: "aipager hanya menjawab di chat yang tercantum di konfigurasimu. Orang asing yang menemukan bot ini cuma dapat satu baris yang bilang bot itu tidak disetel untuk bicara dengannya; tidak ada satu pun yang dia kirim sampai ke sesi.",
      },
      {
        t: "Tidak ada port terbuka.",
        b: "aipager hanya mendengarkan di loopback. Mini App keluar lewat tunnel Cloudflare, dan setiap permintaan di sana wajib membawa tanda tangan Telegram; aipager miniapp disable mematikannya.",
      },
      {
        t: "Token milikmu, file milikmu.",
        b: "Token bot dan id chat tersimpan di ~/.config/aipager/aipager.yaml dengan mode 600. Keduanya dijauhkan dari log aipager, dan disensor di mana pun keduanya bisa terselip ke dalamnya.",
      },
      {
        t: "aipager tidak pernah menaikkan hak akses.",
        b: "Tanpa sudo, tanpa setuid. Semua yang ditulisnya ada di folder home-mu, di /tmp atau di folder socket miliknya sendiri, dan setiap proses yang dijalankannya (claude, dtach, pemasangnya) jalan sebagai kamu.",
      },
      {
        t: "Claude Code yang tetap memutuskan.",
        b: "settings.json milikmu yang menentukan apa yang perlu ditanyakan. aipager cuma meneruskan pertanyaannya, tidak pernah memutuskan apa yang boleh jalan, dan tombol sisa dari tugas yang sudah selesai tidak berlaku lagi, jadi tidak bisa bertindak pada pekerjaan yang sedang jalan.",
      },
      {
        t: "Akses diberikan di komputer.",
        b: "Anggota dan peran hanya berubah lewat aipager config, di komputer. Tidak ada apa pun di Telegram maupun di Mini App yang bisa menambah orang atau memperluas peran siapa pun.",
      },
      {
        t: "Setiap jawaban tercatat.",
        b: "Tiap Izinkan, Tolak dan jawaban masuk ke ~/.claude/aipager-audit.jsonl, yang hanya bisa ditambah, lengkap dengan siapa yang mengetuknya kalau itu di grup.",
      },
    ],
    link: "Model keamanan",
  },

  install: {
    eyebrow: "Pemasangan",
    title: "Empat baris. Simpan di Pesan Tersimpan.",
    lead: "Ketuk salah satu baris untuk menyalinnya. Dua hal dulu: bot milikmu sendiri dari @BotFather (tekan Start di sana), dan Claude Code yang sudah login di komputer ini. Wizard di baris kedua menanyakan sisanya.",
    agent: {
      title: "Atau serahkan saja ke agen yang sudah kamu punya.",
      lead: "Taruh token bot di file yang tidak perlu dibacanya, lalu berikan ini ke Claude Code:",
      link: "Panduan yang diikutinya",
    },
    saved: { name: "Pesan Tersimpan", count: "4 pesan" },
    lines: [
      { note: "uv, pipx atau Homebrew, mana saja yang kamu punya. Linux atau macOS." },
      { note: "token bot dari @BotFather, chatmu, hook Claude Code" },
      { note: "menjaga aipager tetap jalan setelah kamu logout" },
      { note: "Claude Code di dalam dtach. Selanjutnya chatmu yang mengambil alih." },
    ],
    copied: "Disalin",
    pm: "Lebih suka package manager-mu sendiri? uv, pipx, Homebrew, Docker, Nix, AUR dan Snap.",
    pmLink: "semua cara memasangnya",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Tanya saja.",
    readBack: "geser untuk membaca yang tadi",
    items: [
      {
        q: "Apa bedanya dengan aplikasi Claude di ponsel?",
        a: "Aplikasi Claude bicara dengan asisten Anthropic yang jalan di server mereka. aipager menampilkan sesi Claude Code yang berjalan di komputermu sendiri: repo-mu, alat-alatmu, environment-mu.",
      },
      {
        q: "Apakah kodeku keluar dari komputerku?",
        a: "Paling jauh cuma sampai ke chat Telegram milikmu sendiri. aipager bicara ke Telegram dengan token bot milikmu; tidak ada server aipager di antaranya.",
      },
      {
        q: "Apakah ini bisa membuat akun Claude-ku diblokir?",
        a: "aipager tidak pernah memanggil Anthropic. aipager menjalankan CLI resmi claude di komputermu dan membaca hook yang diterbitkan Claude Code, dan pesanmu diketik ke dalam sesi itu persis seperti kalau kamu sendiri yang duduk di keyboard: tidak ada endpoint hasil bongkaran, tidak ada proxy, tidak ada akun bersama, tidak ada yang lewat server orang lain. Yang dilihat Anthropic adalah login Claude Code milikmu sendiri melakukan apa yang memang sudah dilakukannya. Kebijakan penggunaan mereka tetap berlaku untuk apa pun yang kamu minta, dan satu tim di satu bot tetap berbagi langgananmu: untuk itu, jalankan aipager di akunnya sendiri atau dengan key yang punya batas biaya.",
      },
      {
        q: "Apakah aku butuh VPN atau port terbuka?",
        a: "Tidak. aipager menghubungi Telegram ke luar lewat HTTPS dan tidak mendengarkan di port mana pun di luar loopback, jadi tidak ada yang perlu di-forward dan tidak ada yang bisa dijangkau dari jaringan. Ponselmu bicara ke Telegram; Telegram bicara ke koneksi keluar komputermu sendiri.",
      },
      {
        q: "Bagaimana kalau Claude kebablasan?",
        a: "Permintaan izin menunggu ketukanmu, /stop memutus tugas dan membuang apa pun yang mengantre, /kill mengakhiri sesi, dan tombol dari tugas yang sudah selesai tidak berlaku lagi.",
      },
      {
        q: "Apakah timku bisa memakainya?",
        a: "Bisa. Masukkan bot ke grup dengan peran: owner, admin, user, read_only. Tiap pesan jalan dengan izin pengirimnya, anggota tanpa can_manage bekerja di dalam folder utamanya sendiri, dan setiap keputusan tercatat di log audit.",
      },
      {
        q: "Bisakah aku mengirim pesan suara atau screenshot?",
        a: "Dua-duanya bisa. Pesan suara diubah jadi teks di komputermu lalu diketik ke dalam sesi seolah-olah kamu yang menulisnya; foto atau file disimpan di komputermu dan Claude diberi path-nya, dengan keteranganmu sebagai pesan.",
      },
      {
        q: "Apakah aipager bisa bahasaku?",
        a: "Ada lima belas, dipilih dengan /language atau mengikuti aplikasi Telegram-mu. Bahasa Persia dan Arab dibaca dari kanan ke kiri, dengan angkanya sendiri. Yang berubah hanya teks aipager sendiri; Claude menjawab dalam bahasa yang kamu pakai saat menulis.",
      },
      {
        q: "Apakah ada dasbornya?",
        a: "/app membuka Mini App di dalam Telegram: satu kotak per sesi, penampil diff untuk tiap Write dan Edit, pengaturannya, dan satu ketukan untuk menghentikan. Aktif secara bawaan, setiap permintaan dicocokkan dengan tanda tangan Telegram, dan aipager miniapp disable mematikannya.",
      },
      {
        q: "Apa itu dtach?",
        a: "Program kecil yang melepas sesi dari terminal. dtach menjaga Claude Code tetap hidup setelah terminalnya ditutup atau SSH-nya putus, jadi jawaban yang kamu kirim sejam kemudian tetap sampai ke sesi yang masih hidup. Ikut terpasang bersama aipager.",
      },
      {
        q: "Apakah aipager tetap jalan kalau aku logout?",
        a: "aipager service install menjaga aipager tetap jalan di bawah systemd atau launchd, dan sesinya sendiri hidup di dalam dtach, jadi sesi tetap jalan walaupun terminal yang memulainya sudah ditutup. Ada juga versi Docker, Nix, AUR dan Snap.",
      },
      {
        q: "Bagaimana cara memperbaruinya?",
        a: "/update mengecek aipager dan Claude Code lalu memasang versi barunya, kemudian 🔄 Mulai ulang sekarang memulainya ulang di tempat yang sama, baik di terminal, di tmux, di Docker atau sebagai layanan. Sesimu tetap jalan selama itu.",
      },
      {
        q: "Berapa biayanya?",
        a: "Gratis. Lisensinya MIT, botnya milikmu, dan Claude Code tetap memakai paket atau key yang sudah dipakainya.",
      },
    ],
  },

  cta: {
    title: "Tambahkan Claude ke chatmu.",
    lead: "Lalu tutup terminalnya dan nikmati malammu.",
    copy: "Salin",
  },

  footer: { changelog: "Catatan perubahan", issues: "Issues" },

  docs: {
    title: "Dokumentasi",
    description: "Dokumentasi rujukan untuk aipager: arsitektur, hook, perintah, penanganan masalah, keamanan.",
    onThisPage: "Di halaman ini",
    translated: "Halaman ini diterjemahkan dari bahasa Inggris; kalau keduanya berbeda, versi bahasa Inggris yang berlaku.",
    english: "English",
    source: "Sumbernya di GitHub",
    onGitHub: "Halaman-halaman ini di GitHub",
    sourceNote: "Markdown di repo itu teks yang sama dengan yang sedang kamu baca.",
    prev: "Sebelumnya",
    next: "Berikutnya",
    groups: ["Mulai dari sini", "Rujukan", "Menjalankannya"],
  },

  demo: {
    people: { you: "Kamu" },
    typing: "mengetik",
    isTyping: "sedang mengetik",
    days: { today: "Hari ini", yesterday: "Kemarin", monday: "Senin" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 anggota, 3 online" },
      mom: { name: "Ibu", subtitle: "online" },
      friends: { name: "Futsal Jumat ⚽", subtitle: "9 anggota" },
      sara: { name: "Sara", subtitle: "terakhir dilihat baru-baru ini" },
      saved: { name: "Pesan Tersimpan", subtitle: "" },
    },
    folders: { all: "Semua chat", personal: "Pribadi", work: "Kerja", bots: "Bot" },
    seed: {
      oldPrompt: "buat sesi yang tidak aktif otomatis kedaluwarsa setelah 30 menit",
      oldAnswer: "Selesai. Penyimpanan sesi sekarang membuat sesi yang tidak aktif kedaluwarsa setelah 30 menit; 212 test lulus.",
      teamFlaky: "login di prod suka gagal lagi 😬 ada yang tahu?",
      teamSaw: "aku juga lihat, dua kali dalam sejam terakhir",
      momEat: "Sudah makan? 🙂",
      friendsPitch: "lapangan udah dibooking, jumat jam 7 malam",
      friendsIn: "ikut 🙋",
      friendsBall: "ikut, aku bawa bola baru",
      saraMerged: "PR-mu udah aku merge 🚀",
      saraThanks: "makasihh",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "udah, tadi masak pasta 🍝 Ibu?",
      momLunch: "hari Minggu makan siang jam 1 ya? 😊",
      youLunch: "jam 1 ❤️",
      teamRun: "@aipagerbot /web jalankan e2e login di staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "siapa ikut jumat? kurang 2 orang ⚽",
      youIn: "ikut 🙋‍♂️",
      saraVacation: "udah nentuin liburannya? 🏖",
      youTwoMinutes: "dua menit lagi 😄",
      youBook: "Lisbon, 12–19 Maret ☀️ pesawat €193, hotel €142",
      saraBook: "yesss booking aja 🎉",
    },
    prompts: {
      fix: "perbaiki test e2e login yang suka gagal",
      trip: "seminggu di Lisbon bulan Maret: cek cuacanya dulu, lalu 3 hotel di bawah €180 dan penerbangan dari Berlin. Kalau cuacanya jelek, coba Sevilla.",
      more: "jalankan dua agen untuk itu: satu untuk hotel di bawah €180, satu untuk penerbangan dari Berlin",
      push: "push juga branch perbaikannya dan buka PR-nya",
      teamRun: "jalankan e2e login di staging",
    },
    claude: {
      plan: "Aku akan menjalankan test login beberapa kali dan melihat di mana gagalnya.",
      flaky: "Gagalnya sekitar satu dari lima kali jalan. Soal timing, bukan logika.",
      cookie: "Test-nya sudah klik sebelum cookie sesi di-set. Cuma sleep 5 detik, lalu berharap.",
      answer: "Sudah diperbaiki. Sekarang test-nya menunggu cookie sesi, bukan sleep 5 detik. 10 kali jalan berturut-turut, semuanya hijau.",
      teamTests: "18 dari 18 test login lulus di staging. Kegagalannya tidak muncul di sana.",
      weather: "Cuaca dulu: percuma menghitung harga untuk seminggu hujan.",
      lisbon: "Lisbon bulan Maret: 18°C di siang hari, hujan di 2 dari 7 hari. Cukup bagus, tidak perlu Sevilla.",
      pr: "fix/login-cookie sudah di-push dan PR #214 sudah dibuka. CI sedang jalan di sana.",
      teamShort: "18 dari 18 test login lulus di staging.",
      twoAgents: "Kalau begitu dua agen: satu untuk kamar, satu untuk kursi pesawat.",
      interim: "Lisbon jadi: 18°C, dua hari hujan. Dua agen sedang mencari; nanti aku kembali dengan daftar pendeknya.",
      shortlist:
        "Hotel: Casa Baleal €142 semalam, Lx Boutique €165, Santa Justa €178, semuanya bisa jalan kaki ke Baixa. Penerbangan: TAP langsung, €89 berangkat tanggal 12 dan €104 pulang tanggal 19. Bilang saja dan aku tahan keduanya.",
    },
    question: {
      verb: "Naikkan timeout atau tunggu cookie-nya?",
      question: "Naikkan timeout, atau tunggu cookie-nya?",
      options: ["Naikkan timeout", "Tunggu cookie-nya", "Dua-duanya"],
      title: "Perbaikan",
      body: "Test-nya sleep 5 detik sebelum klik.",
    },
    captions: {
      restAuto: "Sesi Claude Code siap di laptopmu, dalam Mode Auto, mode awal setiap sesi baru.",
      restAsk: "Sesi Claude Code siap di laptopmu, dalam Mode Tanya: Claude bertanya sebelum setiap tindakan.",
      restFull: "Sesi Claude Code siap di laptopmu. Sebelum tugas berikutnya, kamu mematikan pemeriksaannya.",
      held: "Berhenti sejenak selagi kamu melihat-lihat. Diamkan sebentar dan malamnya jalan terus.",
      arrived: "👀 artinya pesannya sampai. aipager mengetiknya ke dalam sesi, persis seperti kalau kamu yang duduk di keyboard.",
      took: "👍 artinya Claude mengambilnya. Dari sini semuanya jadi satu kartu, yang memperbarui dirinya sendiri selama tugas berjalan.",
      glance: "Claude menjalankan test beberapa kali. Setiap langkah yang diambilnya memperbarui kartu yang sama.",
      momFirst: "Ibu bertanya dua puluh menit lalu. Di sini tidak ada yang menunggu jawabanmu, jadi kamu balas Ibu dulu.",
      sent: "Terkirim. Kamu keluar dari chatnya, seperti orang pada umumnya.",
      workAuto:
        "Mode Auto, mode awal setiap sesi baru: pemeriksaan keamanan Claude Code sendiri yang meloloskan pembacaan file dan test-nya. Dua-duanya tidak sampai ke kamu.",
      askRead: "Mode Tanya: setiap tindakan menunggumu. Yang ini cuma mau membaca file.",
      askTest: "Dan sekali lagi untuk menjalankan test. Dalam Mode Auto, dua-duanya tidak akan bertanya sama sekali.",
      workFull: "Mode Akses penuh: Claude Code tidak bertanya apa pun dan aipager tidak punya apa pun untuk diteruskan. Kamu cuma melihat apa yang sudah dikerjakannya.",
      momAgain: "Ibu lagi. Sesinya jalan terus di belakangmu; tidak butuh jendela yang terbuka.",
      team: "Grup tim. Siapa pun yang terdaftar bisa menyebut botnya; tiap pesan jalan dengan peran pengirimnya.",
      teamSara:
        "Sara admin di grup ini, jadi test-nya jalan. Pesannya sampai ke Claude dengan tanda siapa yang mengirimnya dan peran apa yang dipakainya.",
      teamSam: "Sam user di grup ini. Bash tidak boleh dipakai perannya, jadi tindakan itu ditolak sebelum jalan.",
      questionAuto:
        "Sekarang sesuatu yang cuma bisa kamu jawab. Mode menentukan apa yang jalan tanpa bertanya; pertanyaan seperti ini sampai ke kamu di mode mana pun.",
      questionAsk: "Pertanyaan, bukan permintaan izin: keputusan Claude sendiri, dengan satu tombol per pilihan.",
      buzzed: "Ponselmu bergetar di sandaran sofa. Tiga tombol, satu ketukan.",
      answerTyped: "Jawabanmu diketik ke dalam sesi seolah-olah kamu yang duduk di keyboard.",
      friends: "Keluarga, teman, kerjaan dan Claude: satu aplikasi, yang memang selalu kamu buka.",
      answerDone: "Selesai. Jawabannya masuk seperti pesan biasa, dan bilah tersematnya kembali diam.",
      evening: "Satu test yang suka gagal diperbaiki dari sofa, di sela pertanyaan Ibu dan main bola hari Jumat.",
      saraPing: "Tidak semua yang berbunyi itu kerjaan.",
      second: "Sesi kedua, dimulai dari chat: tanpa terminal, tanpa ssh.",
      newReady: "aipager memulainya di komputermu dan menyerahkannya kembali, sudah siap, dalam mode awal untuk sesi baru.",
      weather: "Claude mengecek hal yang menentukan sisanya, lalu bilang apa yang ditemukannya.",
      queued: "Dikirim saat Claude masih bekerja: aipager langsung menyerahkannya, Claude memasukkannya ke antrean, dan 👀 bilang pesannya masuk.",
      queueLine: "Baris di bawahnya bilang pesan itu sedang menunggu apa, dan kalau kamu ketuk, pesanmu langsung diserahkan ke Claude di tengah langkah.",
      tookIt:
        "Claude mengambilnya di akhir langkah: 👍, warna abu-abunya pudar, barisnya hilang, dan kartunya pindah ke bawah pesan yang dijawabnya.",
      agents: "Claude mengirim dua agen sekaligus. Masing-masing dapat barisnya sendiri, dan kartunya mengikuti apa yang dikerjakan tiap agen.",
      agentsWork: "Sekarang kedua agen jalan sendiri: beberapa alat dipakai masing-masing, dan tidak ada yang perlu kamu lakukan.",
      twoSessions:
        "Sekarang ada dua sesi berjalan di chat ini. Pesan biasa masuk ke sesi yang sedang dituju; untuk sampai ke sesi satunya, kamu balas salah satu pesannya.",
      hold: "Tahan pesannya, dan Telegram menawarkan apa saja yang bisa kamu lakukan dengannya.",
      reply: "Balas. Kotak pesannya sedang membalas pesan itu, dan aipager membaca tujuannya dari situ.",
      aimed: "Diketik ke api, bukan ke trip.",
      interim: "Tugasnya selesai lebih dulu daripada kedua agen, jadi jawabannya keluar dengan baris di bawahnya yang terus diperbarui untuk pekerjaan yang masih jalan.",
      apiFirst: "api menjawab duluan; cuma satu hal yang harus dikerjakannya.",
      liveLine: "aipager sendiri yang menjaga baris itu tetap terbarui selama kedua agen bekerja.",
      bothBack: "Dua-duanya kembali. aipager menggabungkan dua barisnya jadi satu, dan temuan keduanya membangunkan Claude.",
      shortlist: "Temuan keduanya datang kembali sebagai jawaban tersendiri, ditulis setelah Claude membaca kedua laporannya.",
      human: "Yang tersisa tinggal bagian yang tidak seharusnya dikerjakan mesin untukmu.",
      end: "Dua sesi, tiga agen dan seminggu di Lisbon, dari atas sofa. Tidak ada yang masih jalan, tidak ada lagi yang perlu diketuk.",
      resting: "Sesi ini siap. Sebelum kamu memberinya tugas berikutnya, kamu mematikan pemeriksaannya.",
      fullWho: "Mode Akses penuh untuk admin, dan untukmu, di chat pribadimu sendiri dengan bot.",
      fullRestart:
        "Masuk atau keluar dari Mode Akses penuh memulai ulang sesi, dan percakapannya tetap ada. Antara Mode Tanya dan Mode Auto tidak ada yang dimulai ulang sama sekali.",
    },
    switch: {
      default: "bawaan",
      lines: [
        "Setiap tindakan berhenti dan menunggu ketukanmu.",
        "Tindakan yang aman jalan sendiri; yang berisiko harus kamu izinkan dulu.",
        "Tidak ada yang berhenti. Tidak ada yang bertanya.",
      ],
    },
    cable: { idle: "menunggu tugas", quiet: "belum ada yang baru", flick: "kabelnya sungguhan · sentil saja", daemon: "aipager" },
    wire: {
      cardEdited: "kartu diperbarui · Bash ×1",
      twoCalls: "dua tindakan, tidak ada yang perlu diketuk",
      trace: "jejaknya, dan apa yang ditemukan",
      permNeeded: "🔐 Perlu izinmu",
      readRuns: "keputusan · file dibaca",
      testRuns: "keputusan · test dijalankan",
      threeCalls: "tiga tindakan, tanpa pemeriksaan",
      question: "❓ pertanyaan, dengan tombol",
      answerTyped: "jawaban diketik",
      claudeAnswer: "💬 jawaban Claude",
      sessionIn: "sesi di ~/travel",
      typedTrip: "diketik ke claude-trip",
      newCardTrip: "kartu baru · trip",
      lisbon: "Lisbon bulan Maret · 18°C",
      queued: "claude-trip · dalam antrean",
      tookIt: "diambil · 👍",
      twoAgents: "🤖 dua agen",
      aimed: "diarahkan ke claude-api",
      cardApi: "kartu · api",
      interim: "💬 trip · jawaban sementara",
      thePr: "💬 api · PR-nya",
      flightsDone: "✅ penerbangan · 7 alat dipakai",
      hotelsDone: "✅ hotel · 11 alat dipakai",
      shortlist: "💬 trip · daftar pendeknya",
      switchFull: "beralih ke Mode Akses penuh?",
      restarting: "dimulai ulang, percakapan tetap ada",
      typedApi: "diketik ke claude-api",
      newCardApi: "kartu baru · api",
      yourMessage: "pesanmu",
      aReply: "balasan · api",
    },
    hints: {
      cancel: "Batal akan membiarkan api tetap seperti sekarang. Malam ini lanjut ke Mode Akses penuh: coba tombol satunya.",
      deny: "Tolak benar-benar akan memblokir tindakan itu. Malam ini butuh test-nya jalan: coba Izinkan.",
      stop: "Hentikan akan memutus tugasnya. Coba Izinkan.",
    },
    menu: ["Balas", "Salin Teks", "Sematkan", "Teruskan", "Pilih", "Hapus"],
    composer: "Tulis pesan…",
    search: "Cari",
  },
};
