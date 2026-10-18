import type { Dict } from "./types";

/**
 * Vietnamese, written the way aipager's own catalogs are written: the words
 * people say (phiên, chế độ, công cụ, agent, repo, diff), bạn for the reader,
 * short sentences, and Latin digits everywhere.
 */
export const vi: Dict = {
  meta: {
    title: "aipager: Claude Code, nhắn cho bạn",
    description:
      "aipager chạy các phiên Claude Code của bạn trong một terminal tách rời và cho bạn xem chúng ngay trong Telegram: theo dõi chúng làm việc, cấp quyền khi chúng xin, gửi tin nhắn tiếp theo. Nó chạy trên máy tính của bạn.",
  },

  nav: {
    modes: "Chế độ",
    app: "Mini App",
    how: "Cách hoạt động",
    install: "Cài đặt",
    security: "Bảo mật",
    faq: "Hỏi đáp",
    docs: "Tài liệu",
    language: "Đổi ngôn ngữ",
  },

  hero: {
    title: "Claude là thêm một chat nữa.",
    lead: "aipager đưa các phiên Claude Code của bạn vào Telegram, nằm giữa các chat với gia đình, bạn bè và đồng nghiệp của bạn. Nó chạy trên máy tính của bạn.",
    agentInstall: "Để agent của bạn cài giúp",
    docs: "Tài liệu",
    security: "Bảo mật",
    meta: "Linux & macOS · MIT · khoảng một phút",
  },

  modes: {
    eyebrow: "Chế độ cấp quyền",
    title: "Ba chế độ. Bạn bắt đầu ở Chế độ Auto.",
    lead: "Mỗi phiên ở một trong ba chế độ, đặt riêng cho từng phiên và đổi bất cứ lúc nào bằng /mode. Chế độ Hỏi dừng lại trước mỗi hành động. Chế độ Auto, nơi mọi phiên mới bắt đầu, để phần kiểm tra an toàn của chính Claude Code tự chạy những lần chạy an toàn và chặn những lần chạy rủi ro thay bạn. Chế độ Toàn quyền chạy mọi thứ, không kiểm tra gì cả. Chế độ chỉ tác động đến các yêu cầu cấp quyền của Claude Code, không gì khác: trong một nhóm, công cụ mà vai trò của thành viên không được dùng vẫn bị từ chối, dù đang ở chế độ nào.",
    legend: [
      { k: "Cho phép", v: "chỉ lần chạy này" },
      { k: "Từ chối", v: "Claude chặn lần chạy này" },
      { k: "Luôn cho phép", v: "thêm quy tắc Claude đề xuất, khi nó có đề xuất" },
      { k: "Dừng", v: "cắt ngang việc đang làm thay vì trả lời" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Mọi lần chạy đều chờ bạn, kể cả đọc một file.",
      quote: "Tôi sẽ xem phần cookie helper trước.",
      read: "Read: phần cookie helper",
      needs: "Cần bạn cấp quyền",
    },
    auto: {
      tag: "mặc định",
      note: "Đọc file và chạy test đều tự chạy luôn. Một lệnh chạy trên staging thuộc loại rủi ro, nên nó dừng lại.",
      quote: "Test bấm trước khi cookie phiên được đặt.",
      risky: "Bash: Xem các phiên mới nhất trên staging",
    },
    full: {
      tag: "/mode full",
      note: "Không kiểm tra, không nút bấm. Chỉ có câu trả lời khi xong.",
      ask: "sửa test e2e login hay chập chờn",
      quote: "Test bấm trước khi cookie phiên được đặt. Nó sleep 5s rồi cầu may.",
    },
    facts: [
      {
        t: "/mode",
        b: "Hiện một nút cho mỗi chế độ còn lại; /mode ask, /mode auto và /mode full đổi ngay lập tức. Phiên mới bắt đầu ở Chế độ Auto, trừ khi chat đã chọn khác trong /settings → Phiên mới.",
      },
      {
        t: "Chế độ Hỏi ⇄ Chế độ Auto, ngay tại chỗ",
        b: "Không khởi động lại, kể cả khi Claude đang làm việc: aipager bấm Shift+Tab trong phiên, và thẻ báo đang chuyển chế độ cho tới khi Claude Code xác nhận chế độ mới.",
      },
      {
        t: "Chế độ Toàn quyền thì khởi động lại",
        b: "Chuyển sang Chế độ Toàn quyền hoặc rời khỏi nó sẽ khởi động lại phiên và giữ nguyên cuộc trò chuyện. Chỉ quản trị viên mới được mở phiên ở chế độ này hoặc chuyển phiên sang đó (hoặc chính bạn, trong chat riêng của bạn với bot).",
      },
      {
        t: "Câu hỏi thì vẫn đến",
        b: "Chế độ chỉ áp dụng cho yêu cầu cấp quyền, không áp dụng cho các quyết định: khi Claude hỏi bạn điều gì, các nút vẫn đến chat của bạn, dù đang ở chế độ nào.",
      },
    ],
  },

  places: {
    eyebrow: "Nó nằm ở đâu",
    title: "Ba chat. Còn lại là cuộc sống của bạn.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Đang làm việc · 3:14 · Read ×2 · Bash ×2",
        title: "Chat của bạn với Claude",
        body: "Một chat cho mọi phiên. Mỗi việc có một thẻ tự cập nhật liên tục, những yêu cầu bạn trả lời bằng một lần chạm, và một thanh được ghim cho biết việc gì đang chờ bạn. Tin nhắn thường đến đúng phiên mà thanh được ghim gọi tên; /web gửi tin nhắn tiếp theo sang phiên khác và tiếp tục nói chuyện ở đó.",
      },
      {
        name: "backend-team",
        tag: "nhóm · chế độ làm việc nhóm",
        preview: "Sara: @aipagerbot /web chạy test e2e login trên staging",
        title: "Nhóm làm việc của bạn",
        body: "Thêm bot vào một nhóm, rồi ai có trong danh sách cho phép cũng nhắc đến bot được. Mỗi tin nhắn chạy với vai trò của người gửi; công cụ mà vai trò đó không được dùng sẽ bị từ chối trước khi chạy, và mọi quyết định đều vào log kiểm tra kèm tên người đã chạm nút.",
      },
      {
        name: "Jim",
        tag: "chat riêng của họ với bot",
        preview: "web · Cần bạn cấp quyền",
        title: "Người khác, trong chat của chính họ",
        body: "Thêm chat riêng của một đồng nghiệp với bot, họ sẽ tự chạy các phiên của mình, với vai trò riêng và thư mục gốc riêng: mọi việc Claude của họ đều bắt đầu bên trong thư mục đó và không đọc gì trong thư mục home của bạn nằm ngoài thư mục đó. Ai chỉ nên ngồi xem thì nhận read_only trong nhóm của bạn.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<session> <prompt>"],
      ["owner", "admin", "user", "read_only"],
      ["thư mục gốc của thành viên", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Bốn vai trò, mỗi vai trò một quy tắc công cụ.",
      lead: "Vai trò được tính là vai trò bạn có trong chính chat bạn đang dùng, và công cụ mà một vai trò không được dùng sẽ bị từ chối trước khi chạy, chứ không hỏi bạn. Không gì trong Telegram hay Mini App đổi được ai có trong danh sách: chỉ aipager config, chạy trên máy tính, mới đổi được.",
      can: "Được phép",
      rows: [
        "Gửi tin nhắn cho một phiên",
        "Cho phép, Từ chối, trả lời câu hỏi của Claude",
        "Bash, và mọi thứ khác chạy code",
        "Chế độ Toàn quyền, /settings của nhóm, /update",
        "Phiên của họ được làm việc ở đâu",
        "Đọc file chứa thông tin đăng nhập (~/.ssh, …)",
      ],
      anywhere: "bất cứ đâu",
      rootFolder: "thư mục gốc",
      ownChat: "chat riêng",
      link: "Đọc đầy đủ về chế độ làm việc nhóm",
    },
  },

  day: {
    eyebrow: "Hằng ngày",
    title: "Dùng nó như một chat bình thường.",
    lead: "Không phải một console khoác áo chat: mọi thứ bạn vẫn làm trong Telegram đều dùng được ở đây. Nói vào nó trên đường về nhà, quăng cho nó ảnh chụp màn hình, gửi ý tiếp theo trước khi ý trước xong.",
    items: [
      {
        t: "Nói, thay vì gõ",
        b: "Gửi một tin nhắn thoại: aipager chuyển nó thành chữ ngay trên máy tính của bạn (không bao giờ qua cloud của ai), gửi lại cho bạn xem nó nghe được gì, rồi gõ vào phiên như thể chính bạn viết.",
      },
      {
        t: "Ảnh chụp màn hình chỗ lỗi",
        b: "Ảnh và file được lưu vào một thư mục trên máy tính của bạn, rồi Claude nhận đường dẫn tới đó, với chú thích của bạn làm tin nhắn, hoặc “check this: …” khi không có chú thích. Gửi nhiều cái một lúc thì chúng đi chung một tin nhắn.",
      },
      {
        t: "Nó gửi cả file cho bạn",
        b: "Cứ nhờ bằng lời của bạn, “gửi mình ảnh chụp màn hình”, là file sẽ tới chat của phiên đó ngay sau câu trả lời: ảnh thành ảnh, video và âm thanh giữ nguyên, còn lại thành file, nhiều cái một lúc thì gộp thành một album. Không bao giờ có cài đặt của aipager, thông tin đăng nhập của Claude hay khóa của bạn: những thứ đó bị từ chối trước khi gửi đi.",
      },
      {
        t: "Gửi tin tiếp theo ngay",
        b: "Tin nhắn của bạn đến Claude ngay lúc bạn gửi, kể cả giữa chừng một việc: 👀 khi hàng đợi của chính Claude còn giữ nó, 👍 khi Claude đã nhận. ⚡ Gửi ngay đưa nó cho Claude mà không chờ bước hiện tại kết thúc.",
      },
      {
        t: "Không bao giờ bị đọc nhầm thành câu trả lời",
        b: "Tin nhắn bạn gửi khi một yêu cầu cấp quyền đang mở sẽ được giữ lại, không bị gộp vào yêu cầu đó, và đến phiên ngay khi bạn trả lời xong.",
      },
      {
        t: "Agent và lệnh chạy nền, đếm đủ",
        b: "Mỗi agent chạy nền mà Claude mở đều có một dòng riêng trên thẻ kèm việc nó đang làm, và một lệnh chạy nền vẫn có đồng hồ riêng cho tới khi nó kết thúc.",
      },
      {
        t: "Nó báo cho bạn trước",
        b: "Một cảnh báo ngữ cảnh, một lần thu gọn cuộc trò chuyện, một phiên đã kết thúc hoặc im lặng, một việc kéo dài quá lâu: chat tự nói ra, bạn không phải đi tìm.",
      },
      {
        t: "Các nút đã có sẵn ở đó",
        b: "Dưới ô nhập tin nhắn có một bàn phím: mỗi phiên đang chạy một nút, rồi “phiên”, “dừng” và “mới”, rồi “Mẫu” cho những tin nhắn bạn gõ đi gõ lại và “Lệnh” cho những lệnh Claude Code tự xử lý.",
      },
      {
        t: "/status, cả chat trong một lần xem",
        b: "Mọi phiên thành một danh sách bạn thao tác được: từng phiên đang làm gì, mô hình của nó, ngữ cảnh còn lại, đã tốn bao nhiêu, cái gì đang xếp hàng phía sau, kèm Dừng, Trả lời và phần còn lại của menu trên từng phiên.",
      },
    ],
    heard: "Nghe được:",
    said: "sửa test e2e login hay chập chờn",
    /** what you ask for under the third one (Claude's caption is modes.auto.quote) */
    ask: "gửi mình ảnh chụp màn hình",
  },

  app: {
    eyebrow: "Mini App",
    title: "Một bảng điều khiển, vẫn ở trong Telegram.",
    lead: "/app mở tất cả các phiên cùng lúc: mỗi phiên một ô, kèm vòng ngữ cảnh, thư mục, mô hình và số tiền đã tốn. Chat vẫn là nơi bạn trả lời, còn Mini App là để nhìn bao quát tất cả, và để làm những việc mà chat làm không tiện, như đọc một diff hay đổi một cài đặt.",
    tabs: { sessions: "Phiên", settings: "Cài đặt" },
    summary: { needs: "đang chờ bạn", working: "đang làm việc", resting: "sẵn sàng", spent: "đã tiêu {n}", finished: "đã kết thúc" },
    needsYou: "Đang chờ bạn",
    answerInChat: "Trả lời trong chat",
    states: { working: "đang làm việc", needs: "đang chờ bạn", resting: "sẵn sàng" },
    settings: {
      updates: "Cập nhật",
      upToDate: "Mọi thứ đã là bản mới nhất.",
      check: "Kiểm tra cập nhật",
      language: "Ngôn ngữ ứng dụng",
      languageNote: "Chỉ đổi chữ của aipager. Câu trả lời của Claude không đổi.",
      chatPrefs: "Cài đặt chat",
      chatPrefsNote: "Các mục này áp dụng cho mọi phiên trong chat này.",
      rows: [
        { k: "Bố cục tin nhắn", v: "Thẻ làm việc + câu trả lời riêng" },
        { k: "Xem trước thay đổi (diff)", v: "Tắt" },
        { k: "Cập nhật thẻ khi việc kéo dài", v: "Bật" },
        { k: "Phiên mới" },
      ],
    },
    close: "Đóng",
    facts: [
      {
        t: "Mọi phiên trên một màn hình",
        b: "Mỗi phiên một ô, kèm vòng ngữ cảnh, phiên của ai, mô hình và số tiền đã tốn, phía trên là một dòng cho biết tình hình chat: phiên nào đang làm việc, phiên nào sẵn sàng, hôm nay tốn bao nhiêu, bao nhiêu phiên đã kết thúc. Nút + mở thêm một phiên: một cái tên, một thư mục trong những thư mục bạn vẫn dùng, một mô hình.",
      },
      {
        t: "Cái gì đang chờ bạn thì lên đầu",
        b: "Phiên đang chờ bạn trả lời một yêu cầu cấp quyền hay một câu hỏi thì nằm trên cùng, kèm điều nó đang hỏi. Nút “Trả lời trong chat” gửi lại yêu cầu đó xuống cuối chat, đủ cả nút bấm, và bạn trả lời ngay ở đó.",
      },
      {
        t: "Mỗi phiên một trang",
        b: "Dòng trạng thái, “Đang làm việc (3:12)” hay “Sẵn sàng, hoạt động lần cuối 5 phút trước”, và một lần chạm để Dừng hay Tiếp tục. Dưới đó là những công cụ vừa chạy, câu trả lời mới nhất, phần chọn mô hình, các file mà việc vừa rồi đã đổi dưới dạng diff, và cài đặt của riêng phiên đó.",
      },
      {
        t: "Chạy từ chính aipager",
        b: "Mặc định bật, mọi lượt truy cập đều được đối chiếu với chữ ký của chính Telegram, và trang không tải gì từ nơi khác: không font, không script. aipager miniapp disable tắt nó đi.",
      },
    ],
    link: "Mini App làm được những gì",
  },

  langs: {
    eyebrow: "Mười lăm ngôn ngữ",
    title: "Bằng tiếng của bạn, đến từng chữ số.",
    lead: "Chỉ chữ của riêng aipager đổi: thẻ, yêu cầu cấp quyền, nút, thanh được ghim, /status, Mini App, tài liệu. Các phiên của bạn thì không: Claude trả lời bằng ngôn ngữ bạn viết cho nó, và những gì aipager gửi cho Claude vẫn giữ nguyên. Chọn một ngôn ngữ bằng /language, hoặc để nó theo ngôn ngữ Telegram của bạn.",
    facts: [
      {
        t: "Từ phải sang trái, đúng cách",
        b: "Tiếng Ba Tư và tiếng Ả Rập đọc từ phải sang trái, với chữ số Ba Tư (۰-۹) hoặc Ả Rập-Ấn (٠-٩) và dấu phân cách của riêng chúng, cả trong Telegram lẫn trong Mini App. Tên phiên, đường dẫn, lệnh và code vẫn giữ hướng của mình.",
      },
      {
        t: "Viết, chứ không phải dịch",
        b: "Mỗi ngôn ngữ được viết đúng theo cách người dùng app bằng tiếng đó thật sự nói, kể cả từ mượn, với các dạng số nhiều của riêng ngôn ngữ đó (tiếng Ả Rập có sáu dạng).",
      },
      {
        t: "Chat của bạn, tiếng của bạn",
        b: "Chat riêng có thể theo ngôn ngữ Telegram của bạn. Một nhóm dùng một ngôn ngữ, do quản trị viên đặt, còn thông báo hiện lên sau một lần chạm thì theo tiếng của chính người chạm.",
      },
      {
        t: "Tài liệu cũng vậy",
        b: "README và mọi trang trong docs/ đều được dịch. Khi bản dịch và trang tiếng Anh khác nhau, trang tiếng Anh là đúng.",
      },
    ],
    pinned: "Tin nhắn đã ghim",
  },

  under: {
    eyebrow: "Bên dưới khung chat",
    title: "Terminal vẫn là nơi mọi thứ thật sự diễn ra.",
    lead: "Claude Code chạy trong một terminal thật, bên trong dtach, nên không ai phải để một cửa sổ mở. Mỗi bước kích hoạt một hook, hook gửi một gói tin tới aipager qua một socket cục bộ, rồi aipager cập nhật một tin nhắn trong chat của bạn. Câu trả lời của bạn đi ngược lại cùng đường đó: một quyết định cho hook đang giữ lần chạy đó, hoặc những phím gõ thẳng vào phiên.",
    nodes: [
      { t: "Claude Code", b: "bên trong dtach, không cần cửa sổ" },
      { t: "hook", b: "chạy ở mỗi bước" },
      { t: "aipager", b: "một tiến trình, bằng tài khoản của bạn" },
      { t: "Telegram", b: "token bot của chính bạn" },
      { t: "các chat của bạn", b: "chat riêng của bạn, nhóm của team bạn" },
    ],
    facts: [
      {
        t: "Ngồi vào máy bất cứ lúc nào bạn muốn",
        b: "aipager session api kết nối vào phiên đang chạy từ bất kỳ shell nào. Gõ ở đó, gõ trong chat: vẫn là một phiên. Đóng cửa sổ thì nó chạy tiếp, và kết nối này theo phiên qua cả một lần khởi động lại.",
      },
      {
        t: "Nó không bao giờ đọc màn hình của bạn",
        b: "aipager gõ vào phiên và lắng nghe các sự kiện của chính Claude Code. Những gì chat hiển thị đến từ các hook và cuộc trò chuyện đã lưu, không phải từ việc quét màn hình terminal.",
      },
      {
        t: "Không gì phải chờ chat",
        b: "Một hook gửi một gói tin rồi trả về, tốn khoảng 20 ms thời gian của Claude Code. Nếu aipager không lắng nghe, sự kiện đó đơn giản là bị bỏ và Claude làm tiếp; sau đó aipager bắt kịp từ chính các file của phiên.",
      },
    ],
    hooks: "Mười sáu hook, cộng với dòng trạng thái để đọc mô hình, ngữ cảnh và chi phí. aipager nối vào tất cả.",
  },

  trust: {
    eyebrow: "Bảo mật",
    title: "Không có gì ở giữa.",
    lead: "aipager không bao giờ nói chuyện với Anthropic. Thứ duy nhất làm việc đó là chính Claude Code, bằng tài khoản đăng nhập của bạn, trên máy tính của bạn. aipager mở nó trong một terminal và lắng nghe các hook mà Claude Code cung cấp. Không endpoint nào bị dịch ngược, không proxy, không tài khoản nào ngoài tài khoản của bạn: phiên bạn điều khiển từ điện thoại chính là phiên bạn sẽ điều khiển từ bàn phím.",
    cards: [
      {
        t: "Không có máy chủ aipager nào.",
        b: "aipager nói chuyện với Telegram Bot API bằng token bot của chính bạn. Không có tài khoản aipager, không có dịch vụ aipager, và không có máy tính của ai khác nằm giữa điện thoại của bạn và máy của bạn.",
      },
      {
        t: "Chỉ trả lời chat của bạn.",
        b: "aipager chỉ trả lời trong những chat có trong cấu hình của bạn. Người lạ tìm ra bot chỉ nhận được một dòng nói rằng bot không được cấu hình để nói chuyện với họ; không gì họ gửi đến được một phiên.",
      },
      {
        t: "Không có cổng nào mở.",
        b: "Nó chỉ lắng nghe trên loopback. Mini App đi ra ngoài qua một tunnel Cloudflare, nơi mọi lượt truy cập đều phải mang chữ ký của Telegram, và aipager miniapp disable tắt nó đi.",
      },
      {
        t: "Token của bạn, file của bạn.",
        b: "Token bot và id các chat nằm trong ~/.config/aipager/aipager.yaml với quyền 600. Chúng không được ghi vào log của aipager, và bị che ở mọi chỗ chúng có thể lọt vào đó.",
      },
      {
        t: "Nó không bao giờ nâng quyền.",
        b: "Không sudo, không setuid. Mọi thứ nó ghi đều nằm trong thư mục home của bạn, /tmp hoặc thư mục socket của riêng nó, và mọi tiến trình nó mở (claude, dtach, các trình cài đặt) đều chạy bằng tài khoản của bạn.",
      },
      {
        t: "Claude Code vẫn là bên quyết định.",
        b: "settings.json của bạn nói cái gì cần hỏi. aipager chỉ chuyển câu hỏi đi; nó không bao giờ quyết định cái gì được chạy, và một nút còn sót lại từ một việc đã xong thì đã cũ: nó từ chối chứ không đụng vào việc đang chạy.",
      },
      {
        t: "Quyền được cấp ngay trên máy tính.",
        b: "Thành viên và vai trò chỉ đổi được bằng aipager config, ngay trên máy tính. Không gì trong Telegram và không gì trong Mini App thêm được một người hay nới rộng được một vai trò.",
      },
      {
        t: "Mọi câu trả lời đều được ghi lại.",
        b: "Mỗi lần Cho phép, Từ chối và mỗi câu trả lời đều đi vào ~/.claude/aipager-audit.jsonl, chỉ ghi thêm, kèm tên người đã chạm nút khi ở trong nhóm.",
      },
    ],
    link: "Mô hình bảo mật",
  },

  install: {
    eyebrow: "Cài đặt",
    title: "Bốn dòng. Giữ chúng trong Tin nhắn đã lưu.",
    lead: "Chạm vào một dòng để sao chép. Cần hai thứ trước: một bot của riêng bạn từ @BotFather (bấm Start trong đó), và Claude Code đã đăng nhập trên máy này. Trình hướng dẫn ở dòng hai sẽ hỏi phần còn lại.",
    agent: {
      title: "Hoặc giao cho agent bạn đang có.",
      lead: "Đặt token bot vào một file mà nó không bao giờ phải đọc, rồi đưa cho Claude Code dòng này:",
      link: "Hướng dẫn mà nó làm theo",
    },
    saved: { name: "Tin nhắn đã lưu", count: "4 tin nhắn" },
    lines: [
      { note: "uv, pipx hay Homebrew, cái nào bạn có cũng được. Linux hoặc macOS." },
      { note: "token bot từ @BotFather, chat của bạn, các hook của Claude Code" },
      { note: "giữ aipager chạy cả sau khi bạn đăng xuất" },
      { note: "Claude Code trong dtach. Từ đây là việc của chat." },
    ],
    copied: "Đã sao chép",
    pm: "Thích package manager của bạn hơn? uv, pipx, Homebrew, Docker, Nix, AUR và Snap.",
    pmLink: "mọi cách cài đặt",
  },

  faq: {
    eyebrow: "Hỏi đáp",
    title: "Cứ hỏi.",
    readBack: "kéo để đọc lại",
    items: [
      {
        q: "Cái này khác gì các app Claude trên điện thoại?",
        a: "Các app Claude nói chuyện với trợ lý do Anthropic chạy. aipager cho bạn xem một phiên Claude Code đang chạy trên chính máy tính của bạn: repo của bạn, công cụ của bạn, môi trường của bạn.",
      },
      {
        q: "Code của tôi có rời khỏi máy không?",
        a: "Chỉ đi xa đến các chat Telegram của chính bạn. aipager nói chuyện với Telegram bằng token bot của bạn; không có máy chủ aipager nào ở giữa.",
      },
      {
        q: "Cái này có làm tài khoản Claude của tôi bị khóa không?",
        a: "aipager không bao giờ gọi đến Anthropic. Nó mở chương trình claude chính thức trên máy tính của bạn và đọc các hook mà Claude Code cung cấp, còn tin nhắn của bạn được gõ vào phiên đó đúng như thể bạn đang ngồi trước bàn phím: không endpoint nào bị dịch ngược, không proxy, không tài khoản dùng chung, không đi qua máy chủ của ai khác. Anthropic chỉ thấy tài khoản Claude Code của bạn làm đúng những việc nó vẫn làm. Chính sách sử dụng của họ vẫn áp dụng cho những gì bạn nhờ Claude làm, và một team dùng chung một bot thì vẫn là dùng chung gói của bạn: với trường hợp đó, hãy chạy aipager trên một tài khoản riêng hoặc bằng một key có giới hạn chi tiêu.",
      },
      {
        q: "Tôi có cần VPN hay một cổng mở không?",
        a: "Không. aipager tự đi ra ngoài hỏi Telegram qua HTTPS và không lắng nghe cổng nào ngoài loopback, nên không có gì để forward và không có gì chạm tới được từ mạng. Điện thoại của bạn nói chuyện với Telegram; Telegram nói chuyện qua chính kết nối đi ra mà máy tính của bạn mở.",
      },
      {
        q: "Nếu Claude đi chệch hướng thì sao?",
        a: "Yêu cầu cấp quyền chờ bạn chạm, /stop cắt ngang việc đang làm và bỏ mọi thứ trong hàng đợi, /kill kết thúc phiên, và nút của một việc đã xong thì đã cũ, không còn tác dụng.",
      },
      {
        q: "Team của tôi dùng được không?",
        a: "Được. Thêm bot vào một nhóm kèm vai trò: owner, admin, user, read_only. Mỗi tin nhắn chạy với quyền của người gửi, thành viên không có can_manage làm việc trong thư mục gốc của riêng họ, và mọi quyết định đều được ghi lại.",
      },
      {
        q: "Tôi gửi tin nhắn thoại hay ảnh chụp màn hình được không?",
        a: "Cả hai. Tin nhắn thoại được chuyển thành chữ ngay trên máy tính của bạn rồi gõ vào phiên như thể bạn tự viết; ảnh hay file được lưu ngay trên máy và Claude nhận đường dẫn, lấy chú thích của bạn làm tin nhắn.",
      },
      {
        q: "Nó có nói tiếng của tôi không?",
        a: "Mười lăm thứ tiếng, chọn bằng /language hoặc theo ngôn ngữ Telegram của bạn. Tiếng Ba Tư và tiếng Ả Rập đọc từ phải sang trái, với chữ số riêng. Chỉ chữ của riêng aipager đổi; Claude trả lời bằng ngôn ngữ bạn viết cho nó.",
      },
      {
        q: "Có bảng điều khiển không?",
        a: "/app mở một Mini App ngay trong Telegram: mỗi phiên một ô, trình xem diff cho mọi lần Write và Edit, phần cài đặt, dừng bằng một lần chạm. Mặc định bật, mọi lượt truy cập đều được đối chiếu với chữ ký của Telegram, và aipager miniapp disable tắt nó đi.",
      },
      {
        q: "dtach là gì?",
        a: "Một công cụ nhỏ để tách terminal ra. Nó giữ Claude Code tiếp tục chạy sau khi terminal đóng hay SSH rớt, nên câu trả lời bạn gửi một tiếng sau vẫn đến được một phiên đang chạy. Nó đi kèm aipager.",
      },
      {
        q: "Tôi đăng xuất thì nó còn chạy không?",
        a: "aipager service install giữ aipager chạy dưới systemd hoặc launchd, còn bản thân các phiên chạy trong dtach, nên chúng vẫn chạy khi terminal đã mở chúng đóng lại. Còn có cả bản Docker, Nix, AUR và Snap.",
      },
      {
        q: "Cập nhật nó thế nào?",
        a: "/update kiểm tra aipager và Claude Code rồi cài bản mới, sau đó 🔄 Khởi động lại ngay đưa nó lên lại ngay tại chỗ, dù nó chạy trong terminal, tmux, Docker hay dưới dạng service. Các phiên của bạn vẫn chạy suốt quá trình đó.",
      },
      {
        q: "Nó tốn bao nhiêu?",
        a: "Không đồng nào. Giấy phép MIT, bot là của bạn, và Claude Code vẫn dùng đúng gói hay key nó đang dùng.",
      },
    ],
  },

  cta: {
    title: "Thêm Claude vào các chat của bạn.",
    lead: "Rồi đóng terminal lại và tận hưởng buổi tối của bạn.",
    copy: "Sao chép",
  },

  footer: { changelog: "Lịch sử thay đổi", issues: "Báo lỗi" },

  docs: {
    title: "Tài liệu",
    description: "Tài liệu tra cứu của aipager: kiến trúc, hook, lệnh, xử lý sự cố, bảo mật.",
    onThisPage: "Trong trang này",
    translated: "Trang này là bản dịch của trang tiếng Anh; nếu hai bên khác nhau, trang tiếng Anh là đúng.",
    english: "Tiếng Anh",
    source: "Mã nguồn trên GitHub",
    onGitHub: "Các trang này trên GitHub",
    sourceNote: "Bản markdown trong repo chính là chữ bạn đang đọc.",
    prev: "Trước",
    next: "Tiếp",
    groups: ["Bắt đầu ở đây", "Tra cứu", "Vận hành"],
  },

  demo: {
    people: { you: "Bạn" },
    typing: "đang nhập",
    isTyping: "đang nhập",
    days: { today: "Hôm nay", yesterday: "Hôm qua", monday: "Thứ Hai" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 thành viên, 3 trực tuyến" },
      mom: { name: "Mẹ", subtitle: "trực tuyến" },
      friends: { name: "Sân 5 thứ 6 ⚽", subtitle: "9 thành viên" },
      sara: { name: "Sara", subtitle: "truy cập gần đây" },
      saved: { name: "Tin nhắn đã lưu", subtitle: "" },
    },
    folders: { all: "Tất cả chat", personal: "Cá nhân", work: "Công việc", bots: "Bot" },
    seed: {
      oldPrompt: "cho các phiên không hoạt động hết hạn sau 30 phút",
      oldAnswer: "Xong. Session store giờ cho các phiên không hoạt động hết hạn sau 30 phút; 212 test đều pass.",
      teamFlaky: "login trên prod lại chập chờn 😬 ai xem với?",
      teamSaw: "mình cũng gặp, 2 lần trong một tiếng vừa rồi",
      momEat: "Con ăn cơm chưa? 🙂",
      friendsPitch: "đặt sân rồi nhé, 7h tối thứ 6",
      friendsIn: "có tớ 🙋",
      friendsBall: "tớ đi, mang bóng mới ra",
      saraMerged: "merge PR của bạn rồi nhé 🚀",
      saraThanks: "cảm ơn nhiều!!",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "rồi ạ! con làm mì Ý 🍝 mẹ ăn chưa?",
      momLunch: "chủ nhật ăn trưa 1h nhé? 😊",
      youLunch: "1h chiều ạ ❤️",
      teamRun: "@aipagerbot /web chạy test e2e login trên staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "thứ 6 ai đi? thiếu 2 người nữa ⚽",
      youIn: "tớ đi 🙋‍♂️",
      saraVacation: "quyết định vụ đi chơi chưa? 🏖",
      youTwoMinutes: "hai phút nữa 😄",
      youBook: "Lisbon, 12-19 tháng 3 ☀️ vé 193€, khách sạn 142€",
      saraBook: "ok luôn!! đặt đi 🎉",
    },
    prompts: {
      fix: "sửa test e2e login hay chập chờn",
      trip: "một tuần ở Lisbon vào tháng 3: xem thời tiết trước, rồi 3 khách sạn dưới 180€ và vé máy bay từ Berlin. Nếu thời tiết xấu thì thử Seville.",
      more: "mở vài agent cho việc này: một cái lo khách sạn dưới 180€, một cái lo vé từ Berlin",
      push: "push luôn nhánh fix và mở PR nữa nhé",
      teamRun: "chạy test e2e login trên staging",
    },
    claude: {
      plan: "Tôi sẽ chạy test login vài lần và xem nó hỏng ở đâu.",
      flaky: "Cứ khoảng 5 lần chạy thì hỏng 1. Do timing, không phải do logic.",
      cookie: "Test bấm trước khi cookie phiên được đặt. Nó sleep 5s rồi cầu may.",
      answer: "Sửa xong. Giờ test chờ cookie phiên thay vì sleep 5s. Chạy 10 lần liên tiếp, đều xanh.",
      teamTests: "18 trên 18 test login pass trên staging. Lỗi chập chờn không xuất hiện ở đó.",
      weather: "Thời tiết trước đã: tính giá cho một tuần mưa thì vô nghĩa.",
      lisbon: "Lisbon vào tháng 3: ban ngày 18°C, mưa 2 trong 7 ngày. Vậy là ổn, không cần Seville.",
      pr: "Đã push fix/login-cookie và mở PR #214. CI đang chạy trên đó.",
      teamShort: "18 trên 18 test login pass trên staging.",
      twoAgents: "Vậy thì hai agent: một cái lo chỗ ngủ, một cái lo chỗ ngồi.",
      interim: "Chốt Lisbon: 18°C, hai ngày mưa. Cả hai agent đang đi tìm; tôi sẽ quay lại với danh sách rút gọn.",
      shortlist:
        "Khách sạn: Casa Baleal 142€ một đêm, Lx Boutique 165€, Santa Justa 178€, cả ba đều đi bộ ra Baixa được. Vé: TAP bay thẳng, 89€ chiều đi ngày 12 và 104€ chiều về ngày 19. Bạn nói một tiếng là tôi giữ cả hai.",
    },
    question: {
      verb: "Tăng timeout hay chờ cookie?",
      question: "Tăng timeout, hay chờ cookie?",
      options: ["Tăng timeout", "Chờ cookie", "Cả hai"],
      title: "Cách sửa",
      body: "Test sleep 5s trước khi bấm.",
    },
    captions: {
      restAuto: "Một phiên Claude Code đang sẵn sàng trên laptop của bạn, ở Chế độ Auto, nơi mọi phiên mới bắt đầu.",
      restAsk: "Một phiên Claude Code đang sẵn sàng trên laptop của bạn, ở Chế độ Hỏi: nó hỏi trước mỗi hành động.",
      restFull: "Một phiên Claude Code đang sẵn sàng trên laptop của bạn. Trước việc tiếp theo, bạn bỏ phần kiểm tra của nó đi.",
      held: "Tạm dừng trong lúc bạn nhìn quanh. Để yên một lát là buổi tối chạy tiếp.",
      arrived: "👀 nghĩa là nó đã đến. aipager gõ nó vào phiên, đúng như thể bạn đang ngồi trước bàn phím.",
      took: "👍 nghĩa là Claude đã nhận. Từ đây chỉ có một thẻ, tự cập nhật suốt việc đó.",
      glance: "Nó chạy test vài lần. Mỗi bước nó đi đều cập nhật đúng cái thẻ đó.",
      momFirst: "Mẹ hỏi từ hai mươi phút trước. Ở đây không có gì chờ bạn, nên bạn trả lời mẹ.",
      sent: "Đã gửi. Bạn thoát khỏi chat, như ai cũng làm.",
      workAuto:
        "Chế độ Auto, nơi mọi phiên mới bắt đầu: phần kiểm tra an toàn của chính Claude Code đã tự chạy cả việc đọc file lẫn việc chạy test. Không cái nào đến tay bạn.",
      askRead: "Chế độ Hỏi: mọi lần chạy đều chờ bạn. Lần này chỉ muốn đọc một file.",
      askTest: "Rồi lại một lần nữa cho việc chạy test. Ở Chế độ Auto thì cả hai đều không hỏi gì.",
      workFull: "Chế độ Toàn quyền: Claude Code không hỏi gì và aipager không có gì để chuyển. Bạn chỉ thấy nó đã làm gì.",
      momAgain: "Lại là mẹ. Phiên vẫn chạy tiếp sau lưng bạn; nó không cần cửa sổ nào mở.",
      team: "Nhóm làm việc. Ai trong danh sách cho phép cũng nhắc đến bot được; mỗi tin nhắn chạy với vai trò của người gửi.",
      teamSara:
        "Sara là quản trị viên trong nhóm này, nên lần chạy test của Sara được chạy. Tin nhắn đến Claude kèm tên người gửi và vai trò mà nó chạy theo.",
      teamSam: "Sam là user trong nhóm này. Vai trò này không được dùng Bash, nên lần chạy này bị từ chối trước khi bắt đầu.",
      questionAuto:
        "Giờ đến thứ chỉ bạn mới trả lời được. Chế độ quyết định cái gì chạy mà không hỏi; một câu hỏi như thế này thì đến với bạn ở mọi chế độ.",
      questionAsk: "Một câu hỏi, không phải một yêu cầu cấp quyền: quyết định của chính Claude, mỗi lựa chọn một nút.",
      buzzed: "Điện thoại rung trên tay ghế sofa. Ba nút, một lần chạm.",
      answerTyped: "Câu trả lời của bạn được gõ vào phiên như thể bạn đang ngồi trước bàn phím.",
      friends: "Gia đình, bạn bè, công việc và Claude: một app, cái app bạn vẫn mở suốt.",
      answerDone: "Xong. Câu trả lời đến như mọi tin nhắn khác, và thanh được ghim không còn báo gì nữa.",
      evening: "Một test chập chờn được sửa từ ghế sofa, giữa một câu hỏi của mẹ và một trận bóng thứ 6.",
      saraPing: "Không phải cái gì kêu lên cũng là công việc.",
      second: "Phiên thứ hai, mở ngay từ chat: không terminal, không ssh.",
      newReady: "aipager mở nó trên máy tính của bạn rồi giao lại cho bạn, đã sẵn sàng, ở đúng chế độ mà phiên mới bắt đầu.",
      weather: "Nó kiểm tra thứ quyết định mọi thứ còn lại, rồi nói nó tìm được gì.",
      queued: "Gửi khi nó còn đang làm việc: aipager đưa sang ngay, Claude xếp nó vào hàng đợi, và 👀 báo là đã vào.",
      queueLine: "Dòng bên dưới nói nó đang chờ gì, và chạm vào đó là tin nhắn được đưa cho Claude ngay giữa bước.",
      tookIt:
        "Claude nhận nó ở cuối bước: 👍, màu xám mất đi, dòng đó biến mất, và thẻ chuyển xuống dưới tin nhắn mà nó đang trả lời.",
      agents: "Nó cử hai agent đi cùng lúc. Mỗi agent có một dòng riêng, và thẻ theo dõi từng agent đang làm gì.",
      agentsWork: "Giờ chúng tự đi làm: mỗi agent chạy vài công cụ, và bạn không phải làm gì.",
      twoSessions:
        "Giờ chat này có hai phiên đang chạy. Tin nhắn thường sẽ đến phiên bạn đang nhắn tới; muốn đến phiên kia, bạn trả lời vào một tin nhắn của chính nó.",
      hold: "Nhấn giữ tin nhắn, Telegram sẽ hiện những gì bạn làm được với nó.",
      reply: "Trả lời. Ô nhập tin nhắn đang trả lời tin nhắn đó, và aipager đọc đích đến từ đấy.",
      aimed: "Được gõ vào api, không phải vào trip.",
      interim: "Việc này kết thúc trước khi chúng xong, nên câu trả lời đi ra kèm một dòng cập nhật liên tục bên dưới cho phần việc vẫn đang chạy.",
      apiFirst: "api trả lời trước; nó chỉ có đúng một việc.",
      liveLine: "aipager tự giữ cho dòng đó luôn mới trong lúc chúng làm việc.",
      bothBack: "Cả hai đã về. aipager gộp dòng đó lại thành một, và những gì chúng tìm được đánh thức Claude.",
      shortlist: "Những gì chúng tìm được quay lại thành một câu trả lời riêng, viết sau khi Claude đọc xong cả hai báo cáo.",
      human: "Chỉ còn lại đúng phần mà máy móc không nên làm thay bạn.",
      end: "Hai phiên, ba agent và một tuần ở Lisbon, từ một chiếc ghế sofa. Không còn gì đang chạy, không còn nút nào phải chạm.",
      resting: "Phiên này đang sẵn sàng. Trước khi giao việc tiếp theo, bạn bỏ phần kiểm tra của nó đi.",
      fullWho: "Chế độ Toàn quyền dành cho quản trị viên, và cho chính bạn, trong chat riêng của bạn với bot.",
      fullRestart:
        "Chuyển sang Chế độ Toàn quyền hoặc rời khỏi nó sẽ khởi động lại phiên và giữ nguyên cuộc trò chuyện. Giữa Chế độ Hỏi và Chế độ Auto thì không có gì khởi động lại cả.",
    },
    switch: {
      default: "mặc định",
      lines: [
        "Mọi lần chạy đều dừng lại và chờ bạn chạm.",
        "Lần chạy an toàn thì tự chạy; lần chạy rủi ro cần bạn cho phép trước.",
        "Không gì dừng lại. Không gì hỏi bạn.",
      ],
    },
    cable: { idle: "đang chờ việc mới", quiet: "chưa có gì mới", flick: "sợi cáp là thật · búng thử đi", daemon: "aipager" },
    wire: {
      cardEdited: "thẻ đã cập nhật · Bash ×1",
      twoCalls: "hai lần chạy, không phải chạm gì",
      trace: "trace, và cái nó tìm ra",
      permNeeded: "🔐 Cần bạn cấp quyền",
      readRuns: "quyết định · file được đọc",
      testRuns: "quyết định · test được chạy",
      threeCalls: "ba lần chạy, không kiểm tra",
      question: "❓ một câu hỏi, có nút",
      answerTyped: "câu trả lời đã gõ vào",
      claudeAnswer: "💬 câu trả lời của Claude",
      sessionIn: "một phiên trong ~/travel",
      typedTrip: "đã gõ vào claude-trip",
      newCardTrip: "một thẻ mới · trip",
      lisbon: "Lisbon tháng 3 · 18°C",
      queued: "claude-trip · trong hàng đợi",
      tookIt: "đã nhận · 👍",
      twoAgents: "🤖 hai agent",
      aimed: "nhắm tới claude-api",
      cardApi: "một thẻ · api",
      interim: "💬 trip · một câu trả lời tạm",
      thePr: "💬 api · PR đã mở",
      flightsDone: "✅ vé máy bay · 7 công cụ đã chạy",
      hotelsDone: "✅ khách sạn · 11 công cụ đã chạy",
      shortlist: "💬 trip · danh sách rút gọn",
      switchFull: "chuyển sang Chế độ Toàn quyền?",
      restarting: "đang khởi động lại, giữ cuộc trò chuyện",
      typedApi: "đã gõ vào claude-api",
      newCardApi: "một thẻ mới · api",
      yourMessage: "tin nhắn của bạn",
      aReply: "một câu trả lời · api",
    },
    hints: {
      cancel: "Hủy thì api vẫn ở nguyên chế độ cũ. Buổi tối này đi tiếp sang Chế độ Toàn quyền: thử nút kia xem.",
      deny: "Từ chối thì lần chạy này bị chặn thật. Buổi tối này cần chạy test: thử Cho phép.",
      stop: "Dừng thì việc đang làm bị cắt ngang. Thử Cho phép.",
    },
    menu: ["Trả lời", "Sao chép văn bản", "Ghim", "Chuyển tiếp", "Chọn", "Xóa"],
    composer: "Viết tin nhắn…",
    search: "Tìm kiếm",
  },
};
