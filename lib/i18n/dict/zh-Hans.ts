import type { Dict } from "./types";

/**
 * Simplified Chinese, written the way an app made in Chinese would say it:
 * 你, short sentences, full-width punctuation, no officialese. The words for
 * the product's own ideas (会话、卡片、权限请求、自动模式、就绪、工作中…) are the
 * ones aipager itself uses in Telegram, so the site and the bot speak with
 * one voice.
 */
export const zhHans: Dict = {
  meta: {
    title: "aipager：Claude Code 随时呼你",
    description:
      "aipager 在一个后台终端里运行你的 Claude Code 会话，并把它们同步到 Telegram：看它们工作，允许它们的请求，发下一条消息。它运行在你自己的电脑上。",
  },

  nav: {
    modes: "模式",
    app: "Mini App",
    how: "工作原理",
    install: "安装",
    security: "安全",
    faq: "常见问题",
    docs: "文档",
    language: "切换语言",
  },

  hero: {
    title: "Claude 也只是一个聊天。",
    lead: "aipager 把你的 Claude Code 会话放进 Telegram，夹在家人、朋友和团队的聊天中间。它运行在你自己的电脑上。",
    agentInstall: "让你的 AI 代理来安装",
    docs: "文档",
    security: "安全",
    meta: "Linux 和 macOS · MIT · 大约一分钟",
  },

  modes: {
    eyebrow: "权限模式",
    title: "三种模式。从自动模式开始。",
    lead: "每个会话都处在三种模式中的一种，各自单独设置，随时用 /mode 切换。询问模式在每个操作前都停下来。自动模式是每个新会话的起点，它让 Claude Code 自己的安全检查放行安全的操作，把有风险的拦下来交给你。完全访问模式什么都不检查，直接运行。模式只管 Claude Code 自己的权限请求，别的都不管：在群组里，成员的角色不能用的工具照样会被拒绝，模式怎么设都一样。",
    legend: [
      { k: "允许", v: "只这一次" },
      { k: "拒绝", v: "Claude 会挡下这次操作" },
      { k: "始终允许", v: "Claude 给出规则时，把这条规则加上" },
      { k: "停止", v: "打断这次任务，不回答" },
    ],
    ask: {
      tag: "/mode ask",
      note: "每个操作都等你，连读一个文件也一样。",
      quote: "我先看看处理 cookie 的那个辅助函数。",
      read: "Read: cookie 辅助函数",
      needs: "需要你授予权限",
    },
    auto: {
      tag: "默认",
      note: "读文件和跑测试都直接放行了。对 staging 执行命令属于有风险的那类，所以它停了下来。",
      quote: "测试在 session cookie 写入之前就点了下去。",
      risky: "Bash: 查一下 staging 上最新的 session 记录",
    },
    full: {
      tag: "/mode full",
      note: "不检查，也没有按钮。做完了直接给你答案。",
      ask: "修一下那个不稳定的登录 e2e 测试",
      quote: "测试在 session cookie 写入之前就点了下去。它只是 sleep 5 秒，然后碰运气。",
    },
    facts: [
      {
        t: "/mode",
        b: "会为其他每个模式各显示一个按钮；/mode ask、/mode auto 和 /mode full 直接切换。新会话从自动模式开始，除非这个聊天在 /settings 的“新会话”里改过。",
      },
      {
        t: "询问模式 ⇄ 自动模式，就地切换",
        b: "不用重启，Claude 正在工作时也一样：aipager 在会话里按下 Shift+Tab，卡片会一直显示正在切换，直到 Claude Code 确认了新模式。",
      },
      {
        t: "完全访问模式要重启",
        b: "切到完全访问模式或从它切出来，会话都会重启，对话会保留。只有管理员能把会话开在这个模式里或者切过去（在你和机器人的私聊里，你自己也可以）。",
      },
      {
        t: "问题照样会来",
        b: "模式管的是权限请求，不是决定：Claude 问你事情的时候，不管在哪个模式，按钮都会出现在你的聊天里。",
      },
    ],
  },

  places: {
    eyebrow: "它待在哪里",
    title: "三个聊天。其余的都是你的生活。",
    chats: [
      {
        name: "aipager",
        tag: "机器人",
        preview: "api · 工作中 · 3:14 · Read ×2 · Bash ×2",
        title: "你和 Claude 的聊天",
        body: "所有会话都在这一个聊天里。每次任务一张实时卡片，自己不断更新；权限请求点一下就能回答；置顶栏告诉你哪个在等你回复。普通消息会发到置顶栏点名的那个会话；用 /web 可以把下一条发到别处，之后就在那边继续聊。",
      },
      {
        name: "backend-team",
        tag: "群组 · 团队模式",
        preview: "Sara: @aipagerbot /web 在 staging 上跑一遍登录 e2e",
        title: "你团队的群组",
        body: "把机器人拉进群组，名单里的人都可以 @ 它。每条消息都按发送者的角色运行；角色不能用的工具在运行之前就被拒绝，每个决定都会连同点按钮的人一起记进审计日志。",
      },
      {
        name: "Jim",
        tag: "对方和机器人的私聊",
        preview: "web · 需要你授予权限",
        title: "别人，在自己的聊天里",
        body: "把同事和机器人的私聊加进来，对方就能开自己的会话，带着自己的角色和自己的根文件夹：Claude 的任务都从那个文件夹里开始，文件夹之外、你主文件夹里的东西一概读不到。只需要旁观的人，在你的群组里给 read_only。",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<session> <prompt>"],
      ["owner", "admin", "user", "read_only"],
      ["成员的根文件夹", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "四种角色，每种角色一套工具规则。",
      lead: "起作用的是你在当前聊天里的那个角色；角色不能用的工具，在运行之前就被拒绝，不会来问你。Telegram 和 Mini App 里的任何操作都改不了名单上有谁：只有电脑上的 aipager config 可以。",
      can: "可以",
      rows: [
        "给会话发消息",
        "允许、拒绝、回答 Claude 的问题",
        "Bash，以及其他运行代码的工具",
        "完全访问模式、群组的 /settings、/update",
        "会话可以在哪里工作",
        "读取凭证文件（~/.ssh 等）",
      ],
      anywhere: "任何地方",
      rootFolder: "根文件夹",
      ownChat: "仅限自己的私聊",
      link: "完整的团队模式说明",
    },
  },

  day: {
    eyebrow: "日常",
    title: "就当聊天用。",
    lead: "它不是套了聊天外壳的控制台：你在 Telegram 里本来会做的事，这里都能做。回家路上对它说几句，把截图直接扔给它，上一条还没做完就把下一个想法发过去。",
    items: [
      {
        t: "说给它听",
        b: "发一条语音消息，转写在你自己的电脑上完成（不经过任何人的云），转好的文字会发回来给你看一眼，然后像你亲手打的一样输进会话。",
      },
      {
        t: "一张 bug 的截图",
        b: "照片和文件会落到你电脑上的一个文件夹里，Claude 拿到的是路径，你写的说明就是消息；没写说明时，发过去的就是“check this:”加上路径。一次发好几个，它们会合成一条消息。",
      },
      {
        t: "它也会给你发文件",
        b: "用你自己的话说，比如“把截图发给我”，文件就会在回答之后发到那个会话的聊天里：图片作为照片，视频和音频保持原样，其他的作为文件，一次几个就合成一个相册。但 aipager 的设置、Claude 的凭据和你的密钥永远不会发出：发送之前就会被拒绝。",
      },
      {
        t: "下一条现在就发",
        b: "你一发出去，消息立刻就到 Claude 那里，任务做到一半也一样：消息在 Claude 自己的队列里等着时是 👀，Claude 收下了就是 👍。点 ⚡ 立即发送，不等这一步结束就把消息递过去。",
      },
      {
        t: "绝不会被当成回答",
        b: "权限请求还开着的时候，你发的消息会先被扣住，不会被算成对请求的回答，等你答完就马上发给会话。",
      },
      {
        t: "代理和后台命令，都有数",
        b: "Claude 启动的每个后台代理在卡片上都有自己的一行，写着它在做什么；留在后台跑的命令会一直有自己的计时，直到它结束。",
      },
      {
        t: "它会先告诉你",
        b: "上下文快用完的提醒、压缩了一次对话、会话结束了或者没动静了、任务跑得太久了：不用你去看，聊天里就会说。",
      },
      {
        t: "按钮早就在那儿",
        b: "输入框下面有一块按钮键盘：每个运行中的会话一个按钮，然后是状态、停止、新建，再是模板（放你反复要打的消息）和命令（放 Claude Code 自己处理的那些）。",
      },
      {
        t: "/status，一眼看完整个聊天",
        b: "所有会话排成一张能直接操作的列表：每个在做什么、用的模型、还剩多少上下文、花了多少、后面排着什么，每一条上都有停止、回答，以及菜单里的其余操作。",
      },
    ],
    heard: "我听到的是：",
    said: "修一下那个不稳定的登录 e2e 测试",
    /** what you ask for under the third one (Claude's caption is modes.auto.quote) */
    ask: "把截图发给我",
  },

  app: {
    eyebrow: "Mini App",
    title: "一个控制面板，还是在 Telegram 里。",
    lead: "/app 一次打开所有会话：每个一张小卡片，带着上下文圆环、文件夹、模型和已经花掉的钱。回答还是在聊天里做，这个 app 是用来一眼看全部的，也用来做聊天里不方便做的事，比如看改动（diff）或者改设置。",
    tabs: { sessions: "会话", settings: "设置" },
    summary: { needs: "{n} 个在等你回复", working: "{n} 个工作中", resting: "{n} 个就绪", spent: "已花费 {n}", finished: "{n} 个已结束" },
    needsYou: "等你回复",
    answerInChat: "在聊天中回答",
    states: { working: "工作中", needs: "等你回复", resting: "就绪" },
    settings: {
      updates: "更新",
      upToDate: "一切都是最新的。",
      check: "检查更新",
      language: "应用语言",
      languageNote: "只影响 aipager 自己的文字。Claude 的回答不变。",
      chatPrefs: "聊天设置",
      chatPrefsNote: "这些设置适用于这个聊天中的每个会话。",
      rows: [
        { k: "消息布局", v: "工作卡片 + 单独的回答" },
        { k: "改动预览（diff）", v: "关" },
        { k: "长任务的卡片更新", v: "开" },
        { k: "新会话" },
      ],
    },
    close: "关闭",
    facts: [
      {
        t: "所有会话一屏看完",
        b: "每个会话一张小卡片，带上下文圆环、它是谁的、用的模型和已经花掉的钱；上面一行说明这个聊天的整体情况：哪些在工作、哪些就绪、今天花了多少、结束了几个。点 + 再开一个：取个名字，从你常用的文件夹里挑一个，选个模型。",
      },
      {
        t: "等你回复的排在最前",
        b: "等着你回答权限请求或者问题的会话排在最上面，写着它在问什么。点“在聊天中回答”，这个请求连同按钮会重新发到聊天最下面，你在那里回答它。",
      },
      {
        t: "每个会话一个页面",
        b: "状态那一行写着“工作中（3:12）”或“就绪，上次活动 5 分钟前”，还有一键“停止”或“恢复”。下面是最近用过的工具、最新的回复、模型选择、这次任务改动的文件（diff），还有这个会话自己的设置。",
      },
      {
        t: "由 aipager 自己提供",
        b: "默认开启，每个请求都对照 Telegram 自己的签名校验，页面不从别处加载任何东西：没有字体，没有脚本。aipager miniapp disable 可以关掉它。",
      },
    ],
    link: "这个 app 能做什么",
  },

  langs: {
    eyebrow: "十五种语言",
    title: "用你的语言，连数字都是。",
    lead: "变的只有 aipager 自己的文字：卡片、请求、按钮、置顶栏、/status、Mini App、文档。你的会话不变：你用什么语言写，Claude 就用什么语言回；aipager 发给 Claude 的内容也原样不动。用 /language 选一个，或者让它跟着你的 Telegram 走。",
    facts: [
      {
        t: "从右到左，做对了",
        b: "波斯语和阿拉伯语从右往左读，用波斯数字（۰-۹）或阿拉伯-印度数字（٠-٩）和它们自己的分隔符，Telegram 里和 Mini App 里都是。会话名、路径、命令和代码保持它们自己的方向。",
      },
      {
        t: "是写出来的，不是翻出来的",
        b: "每种语言都按用这门语言的人平时怎么说来写，外来词照留，复数形式也按各自语言的规矩（阿拉伯语有六种）。",
      },
      {
        t: "你的聊天，你的语言",
        b: "私聊可以跟着你的 Telegram 走。群组只有一种语言，由管理员设置；点完按钮弹出来的提示，用的是点按钮那个人自己的语言。",
      },
      {
        t: "文档也一样",
        b: "README 和 docs/ 下的每一页都翻译了。翻译和英文页不一致时，以英文页为准。",
      },
    ],
    pinned: "置顶消息",
  },

  under: {
    eyebrow: "聊天底下",
    title: "一切以终端为准。",
    lead: "Claude Code 跑在一个真正的终端里（放在 dtach 里），所以谁都不用一直开着窗口。每一步都会触发一个 hook，通过本地套接字（socket）往 aipager 发一个数据报，aipager 再去改你聊天里的那条消息。你的回答原路返回：要么是给正扣着这次操作的 hook 一个结果，要么是直接按键输进会话。",
    nodes: [
      { t: "Claude Code", b: "跑在 dtach 里，不用开窗口" },
      { t: "hook", b: "每一步都会触发" },
      { t: "aipager", b: "一个进程，以你的身份运行" },
      { t: "Telegram", b: "你自己的机器人 token" },
      { t: "你的聊天", b: "你的私聊，你团队的群组" },
    ],
    facts: [
      {
        t: "随时可以坐到它跟前",
        b: "在任何终端里运行 aipager session api，就能接上正在跑的会话。在那边打字，在聊天里打字，是同一个会话。关掉窗口它照样继续，会话重启时这个连接也跟着走。",
      },
      {
        t: "它从不读你的屏幕",
        b: "aipager 往会话里打字，并监听 Claude Code 自己发出的事件。你在聊天里看到的东西来自 hook 和保存的对话，不是从终端屏幕上抓来的。",
      },
      {
        t: "没有东西在等聊天",
        b: "一个 hook 发出一个数据报就返回，占用 Claude Code 大约 20 ms。没有 aipager 在听的时候，事件直接丢掉，Claude 照常继续；之后 aipager 会从会话自己的文件里把进度补回来。",
      },
    ],
    hooks: "十六个 hook，再加上它读取模型、上下文和花费的那条状态栏。aipager 每一个都接上了。",
  },

  trust: {
    eyebrow: "安全",
    title: "中间什么都没有。",
    lead: "aipager 从不和 Anthropic 通信。会和它通信的只有 Claude Code 自己，用你自己的登录，在你自己的电脑上。aipager 只是在终端里把它启动起来，然后听 Claude Code 发出的 hook。没有谁逆向出来的接口，没有中转服务器，除了你自己没有别的账号：你在手机上操作的那个会话，就是你坐在键盘前会操作的那一个。",
    cards: [
      {
        t: "没有 aipager 服务器。",
        b: "aipager 用你自己的机器人 token 直接和 Telegram Bot API 说话。没有 aipager 账号，也没有 aipager 服务，你的手机和你的电脑之间没有别人的电脑。",
      },
      {
        t: "只回应你的聊天。",
        b: "aipager 只在你配置里列出的聊天中回应。陌生人找到这个机器人，只会收到一句话：它没有被配置成和对方说话；对方发的任何东西都到不了会话。",
      },
      {
        t: "不开任何端口。",
        b: "它只监听本地回环。Mini App 通过 Cloudflare tunnel 对外，每个请求都必须带上 Telegram 的签名，aipager miniapp disable 可以关掉它。",
      },
      {
        t: "你的 token，你的文件。",
        b: "机器人 token 和聊天 id 放在 ~/.config/aipager/aipager.yaml 里，权限 600。它们不会写进 aipager 的 log；凡是可能混进 log 的地方，也都会打码。",
      },
      {
        t: "它从不提权。",
        b: "没有 sudo，没有 setuid。它写的东西都在你的主文件夹、/tmp 或者它自己的套接字文件夹里；它启动的每个进程（claude、dtach、安装程序）都以你的身份运行。",
      },
      {
        t: "决定权还在 Claude Code。",
        b: "什么需要问你，由你的 settings.json 说了算。aipager 只是把问题转过来，从不决定什么可以运行；已经结束的任务留下的按钮点了也不生效，不会动到现在正在跑的工作。",
      },
      {
        t: "权限在电脑上给。",
        b: "成员和角色只能用电脑上的 aipager config 改。Telegram 里和 Mini App 里的任何操作都加不了人，也放不宽角色。",
      },
      {
        t: "每个回答都留档。",
        b: "每一次允许、拒绝和回答都写进 ~/.claude/aipager-audit.jsonl，只追加；在群组里还会记下是谁点的。",
      },
    ],
    link: "安全模型",
  },

  install: {
    eyebrow: "安装",
    title: "四行命令。存到收藏夹里。",
    lead: "点一行就能复制。先准备两样东西：在 @BotFather 那里建一个自己的机器人（记得在里面按 Start），以及在这台电脑上登录好的 Claude Code。剩下的，第二行的向导会问你。",
    agent: {
      title: "或者交给你已经在用的 AI 代理。",
      lead: "把机器人 token 放进一个它根本不用读的文件里，然后把这段话交给 Claude Code：",
      link: "它照着走的指南",
    },
    saved: { name: "收藏夹", count: "4 条消息" },
    lines: [
      { note: "uv、pipx 或 Homebrew，你有哪个用哪个。Linux 或 macOS。" },
      { note: "来自 @BotFather 的机器人 token、你的聊天、Claude Code 的 hook" },
      { note: "你退出登录之后 aipager 也继续运行" },
      { note: "Claude Code 跑在 dtach 里。接下来交给你的聊天。" },
    ],
    copied: "已复制",
    pm: "更想用自己的包管理器？uv、pipx、Homebrew、Docker、Nix、AUR 和 Snap 都行。",
    pmLink: "所有安装方式",
  },

  faq: {
    eyebrow: "常见问题",
    title: "问吧。",
    readBack: "拖动可以往回看",
    items: [
      {
        q: "这和 Claude 的手机 app 有什么不一样？",
        a: "Claude 的 app 连的是 Anthropic 托管的助手。aipager 同步的是跑在你自己电脑上的 Claude Code 会话：你的仓库、你的工具、你的环境。",
      },
      {
        q: "我的代码会离开我的电脑吗？",
        a: "最远只到你自己的 Telegram 聊天。aipager 用你自己的机器人 token 和 Telegram 说话，中间没有 aipager 的服务器。",
      },
      {
        q: "这会让我的 Claude 账号被封吗？",
        a: "aipager 从不调用 Anthropic。它在你的电脑上启动官方的 claude 命令行，读 Claude Code 发出的 hook；你的消息被输进那个会话，和你坐在键盘前打的一模一样：没有逆向出来的接口，没有中转服务器，没有共用账号，也不经过任何别人的服务器。Anthropic 看到的，就是你自己的 Claude Code 登录在做它本来就在做的事。他们的使用政策照样管着你让它做什么；一个团队共用一个机器人，用的仍然是你的订阅：这种情况下，把 aipager 跑在它自己的账号下，或者用一个设了额度上限的 key。",
      },
      {
        q: "我需要 VPN 或者开端口吗？",
        a: "不需要。aipager 通过 HTTPS 向外轮询 Telegram，除了本机回环之外不监听任何端口，所以没有东西要转发，从网络上也够不到它。你的手机和 Telegram 说话，Telegram 和你电脑自己发出去的那条连接说话。",
      },
      {
        q: "要是 Claude 跑偏了怎么办？",
        a: "权限请求要等你点，/stop 打断这次任务并清空队列，/kill 结束会话，已经结束的任务留下的按钮点了也不生效。",
      },
      {
        q: "我的团队能用吗？",
        a: "能。把机器人拉进群组，分配角色：owner、admin、user、read_only。每条消息都按发送者的权限运行，没有 can_manage 的成员只能在自己的根文件夹里干活，每个决定都会被审计。",
      },
      {
        q: "我能给它发语音消息或者截图吗？",
        a: "都可以。语音消息在你的电脑上转写，然后像你亲手打的一样输进会话；照片或文件存在本地，Claude 拿到的是路径，你写的说明就是消息。",
      },
      {
        q: "它会说我的语言吗？",
        a: "会十五种，用 /language 选，或者跟着你的 Telegram 走。波斯语和阿拉伯语从右往左读，用它们自己的数字。变的只有 aipager 自己的文字；你用什么语言写，Claude 就用什么语言回。",
      },
      {
        q: "有控制面板吗？",
        a: "/app 会在 Telegram 里打开一个 Mini App：每个会话一张小卡片，每次 Write 和 Edit 都能看改动（diff），还有设置和一键停止。它默认开启，每个请求都对照 Telegram 的签名校验，aipager miniapp disable 可以关掉。",
      },
      {
        q: "dtach 是什么？",
        a: "一个很小的终端分离工具。终端关掉或者 SSH 断了，它也让 Claude Code 继续运行，所以你一小时后发出的回答照样能到一个还在运行的会话。它随 aipager 一起装。",
      },
      {
        q: "我退出登录之后它还会继续跑吗？",
        a: "aipager service install 会让 aipager 在 systemd 或 launchd 下一直运行，会话本身跑在 dtach 里，所以它们比启动它们的终端活得久。另外还有 Docker、Nix、AUR 和 Snap 的版本。",
      },
      {
        q: "怎么更新？",
        a: "/update 会检查 aipager 和 Claude Code 并装上新版本，然后点 🔄 立即重启，就地把它拉起来，不管它跑在终端、tmux、Docker 里还是作为服务跑。你的会话会一路继续运行。",
      },
      {
        q: "要多少钱？",
        a: "不要钱。它是 MIT 许可的，机器人是你自己的，Claude Code 还用它本来用的套餐或者 key。",
      },
    ],
  },

  cta: {
    title: "把 Claude 加进你的聊天。",
    lead: "然后关掉终端，去过你的晚上。",
    copy: "复制",
  },

  footer: { changelog: "更新日志", issues: "Issues" },

  docs: {
    title: "文档",
    description: "aipager 的参考文档：架构、hook、命令、故障排除、安全。",
    onThisPage: "本页内容",
    translated: "本页是英文页面的译文；两者不一致时，以英文页面为准。",
    english: "英文",
    source: "GitHub 上的源文件",
    onGitHub: "GitHub 上的这些页面",
    sourceNote: "仓库里的 markdown 就是你正在读的这些文字。",
    prev: "上一页",
    next: "下一页",
    groups: ["从这里开始", "参考", "把它跑起来"],
  },

  demo: {
    people: { you: "你" },
    typing: "正在输入",
    isTyping: "正在输入",
    days: { today: "今天", yesterday: "昨天", monday: "星期一" },
    chats: {
      aipager: { name: "aipager", subtitle: "机器人" },
      team: { name: "backend-team", subtitle: "5 名成员，3 人在线" },
      mom: { name: "妈妈", subtitle: "在线" },
      friends: { name: "周五五人足球 ⚽", subtitle: "9 名成员" },
      sara: { name: "Sara", subtitle: "最近上线" },
      saved: { name: "收藏夹", subtitle: "" },
    },
    folders: { all: "所有聊天", personal: "个人", work: "工作", bots: "机器人" },
    seed: {
      oldPrompt: "让闲置会话 30 分钟后过期",
      oldAnswer: "搞定。会话存储现在会让闲置会话在 30 分钟后过期；212 个测试全部通过。",
      teamFlaky: "线上登录又不稳定了 😬 有人看看吗",
      teamSaw: "我也碰到了，这一小时内两次",
      momEat: "吃饭了吗？🙂",
      friendsPitch: "场地订好了，周五 7 点",
      friendsIn: "来 🙋",
      friendsBall: "来，我带新球",
      saraMerged: "你的 PR 合了 🚀",
      saraThanks: "谢啦！！",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "吃了！做了意面 🍝 你呢？",
      momLunch: "周日 1 点吃午饭？😊",
      youLunch: "1 点 ❤️",
      teamRun: "@aipagerbot /web 在 staging 上跑一遍登录 e2e",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "周五谁来？还差 2 个 ⚽",
      youIn: "我来 🙋‍♂️",
      saraVacation: "假期定了吗？🏖",
      youTwoMinutes: "两分钟 😄",
      youBook: "里斯本，3 月 12–19 ☀️ 机票 €193，酒店 €142",
      saraBook: "好！！订吧 🎉",
    },
    prompts: {
      fix: "修一下那个不稳定的登录 e2e 测试",
      trip: "3 月去里斯本待一周：先查天气，然后找 3 家 €180 以下的酒店和从柏林出发的机票。天气不好的话就看塞维利亚。",
      more: "派两个代理去做：一个查 €180 以下的酒店，一个查从柏林出发的机票",
      push: "顺便把修复分支推上去，开个 PR",
      teamRun: "在 staging 上跑一遍登录 e2e",
    },
    claude: {
      plan: "我先把登录测试跑几遍，看看它在哪里失败。",
      flaky: "大约每五次失败一次。是时序问题，不是逻辑问题。",
      cookie: "测试在 session cookie 写入之前就点了下去。它只是 sleep 5 秒，然后碰运气。",
      answer: "修好了。测试现在会等 session cookie，而不是 sleep 5 秒。连跑 10 次，全绿。",
      teamTests: "staging 上 18 个登录测试全部通过。那个不稳定的问题在这里没出现。",
      weather: "先看天气：如果一周都下雨，比价也没意义。",
      lisbon: "3 月的里斯本：白天 18°C，7 天里有 2 天下雨。够好了，不用去塞维利亚。",
      pr: "已推送 fix/login-cookie，并开了 PR #214。CI 正在跑。",
      teamShort: "staging 上 18 个登录测试全部通过。",
      twoAgents: "那就两个代理：一个管住的，一个管飞的。",
      interim: "里斯本可以：18°C，两天有雨。两个代理都出去找了，有了名单我再回来。",
      shortlist:
        "酒店：Casa Baleal 每晚 €142，Lx Boutique €165，Santa Justa €178，走路都能到 Baixa。机票：TAP 直飞，12 号去 €89，19 号回 €104。你说一声，我就把两边都占上。",
    },
    question: {
      verb: "调高超时还是等 cookie？",
      question: "调高超时，还是等 cookie？",
      options: ["调高超时", "等 cookie", "两个都要"],
      title: "怎么修",
      body: "测试点击之前 sleep 了 5 秒。",
    },
    captions: {
      restAuto: "一个在你笔记本上就绪的 Claude Code 会话，处于自动模式，每个新会话都从这个模式开始。",
      restAsk: "一个在你笔记本上就绪的 Claude Code 会话，处于询问模式：每个操作之前它都会问你。",
      restFull: "一个在你笔记本上就绪的 Claude Code 会话。下一个任务之前，你把它的检查关掉。",
      held: "你在四处看，演示就先停着。放一会儿不动，这个晚上会自己继续。",
      arrived: "👀 表示消息到了。aipager 把它输进会话，和你坐在键盘前打的完全一样。",
      took: "👍 表示 Claude 收下了。从这里开始就是一张卡片，任务跑着，它自己不断更新。",
      glance: "它把测试跑了几遍，每走一步都改写同一张卡片。",
      momFirst: "妈妈二十分钟前问过你。这边没有需要你的事，所以你先回她。",
      sent: "发出去了。你像平时一样切出了这个聊天。",
      workAuto:
        "自动模式，每个新会话都从这里开始：读文件和跑测试都由 Claude Code 自己的安全检查放行了。两件事都没来找你。",
      askRead: "询问模式：每个操作都等你。这一次它只是想读一个文件。",
      askTest: "跑测试又问了一次。在自动模式里，这两件事都不会来问。",
      workFull: "完全访问模式：Claude Code 什么都不问，aipager 也没有什么要转达。你只看到它做了什么。",
      momAgain: "妈妈又来了。会话在你身后照常跑着，它不需要开着窗口。",
      team: "团队的群组。名单里的人都可以 @ 机器人；每条消息都按发送者的角色运行。",
      teamSara:
        "Sara 在这个群组里是管理员，所以这次测试跑得通。消息到 Claude 那里时，带着是谁发的、以什么角色运行。",
      teamSam: "Sam 在这个群组里是 user。这个角色不能用 Bash，所以这次操作在运行之前就被拒绝了。",
      questionAuto:
        "接下来是只有你能回答的事。模式决定什么可以不问就运行；像这样的问题，在哪个模式下都会来找你。",
      questionAsk: "这是一个问题，不是权限请求：Claude 自己要做的决定，每个选项一个按钮。",
      buzzed: "手机在沙发扶手上震了一下。三个按钮，点一下就行。",
      answerTyped: "你的回答被输进会话，就像你坐在键盘前一样。",
      friends: "家人、朋友、工作，还有 Claude：都在一个 app 里，反正你本来也会看它。",
      answerDone: "好了。答案像别的消息一样落下来，置顶栏也安静了。",
      evening: "在妈妈的一句问候和周五的一场球之间，一个不稳定的测试在沙发上就修好了。",
      saraPing: "响一下的不一定都是工作。",
      second: "第二个会话，直接从聊天里开：不用终端，不用 ssh。",
      newReady: "aipager 在你的电脑上把它启动起来，就绪之后交还给你，用的是新会话默认的那个模式。",
      weather: "它先查那件决定其余一切的事，然后把结果说出来。",
      queued: "它还在工作的时候发出去：aipager 立刻递过去，Claude 让它排队，👀 表示已经进去了。",
      queueLine: "下面那一行写着它在等什么，点一下就能在这一步中间把消息交给 Claude。",
      tookIt:
        "这一步结束时 Claude 收下了它：👍，灰色褪去，那一行消失，卡片移到它要回答的那条消息下面。",
      agents: "它一次派出去两个。每个都有自己的一行，卡片跟着写它们各自在做什么。",
      agentsWork: "它们现在自己忙去了：各用了几次工具，你不用做什么。",
      twoSessions:
        "现在这个聊天里有两个会话。普通消息会发到你设定的那一个；要发给另一个，就回复它自己的某条消息。",
      hold: "长按，Telegram 就会给出你能对它做的事。",
      reply: "点回复。输入框现在是在回复那条消息，aipager 就从中看出这条要发给谁。",
      aimed: "输进了 api，不是 trip。",
      interim: "这次任务比它们先结束，所以答案先发出来，下面带一行实时的进度，写着还在跑的工作。",
      apiFirst: "api 先回答；它只有这一件事要做。",
      liveLine: "它们干活的时候，aipager 会自己把那一行一直更新着。",
      bothBack: "两个都回来了。aipager 把那一行并成一条，它们带回来的东西把 Claude 叫醒。",
      shortlist: "它们找到的东西作为一条单独的答案回来，是 Claude 读完两份报告之后写的。",
      human: "剩下的，就只有机器不该替你做的那部分了。",
      end: "两个会话、三个代理，还有里斯本的一周，全是在沙发上办的。没有东西还在跑，也没有按钮要点。",
      resting: "这个会话现在就绪。在交给它下一个任务之前，你把它的检查关掉。",
      fullWho: "完全访问模式是给管理员的，也给你，在你和机器人的私聊里。",
      fullRestart:
        "切到完全访问模式或从它切出来，会话会重启，对话会保留。在询问模式和自动模式之间切换，什么都不用重启。",
    },
    switch: {
      default: "默认",
      lines: [
        "每个操作都会停下来，等你点。",
        "安全的操作自己跑；有风险的要等你允许才跑。",
        "什么都不停。什么都不问。",
      ],
    },
    cable: { idle: "等待新任务", quiet: "没有新消息", flick: "这根线是真的 · 拨一下", daemon: "aipager" },
    wire: {
      cardEdited: "卡片已更新 · Bash ×1",
      twoCalls: "两次操作，没什么可点的",
      trace: "追踪记录，和它发现的东西",
      permNeeded: "🔐 需要你授予权限",
      readRuns: "结果 · 开始读文件",
      testRuns: "结果 · 测试开始跑",
      threeCalls: "三次操作，不检查",
      question: "❓ 一个问题，带按钮",
      answerTyped: "回答已输进会话",
      claudeAnswer: "💬 Claude 的回答",
      sessionIn: "一个在 ~/travel 的会话",
      typedTrip: "输进 claude-trip",
      newCardTrip: "一张新卡片 · trip",
      lisbon: "3 月的里斯本 · 18°C",
      queued: "claude-trip · 已排队",
      tookIt: "收下了 · 👍",
      twoAgents: "🤖 两个代理",
      aimed: "发给 claude-api",
      cardApi: "一张卡片 · api",
      interim: "💬 trip · 一条中间答复",
      thePr: "💬 api · PR",
      flightsDone: "✅ 机票 · 用了 7 次工具",
      hotelsDone: "✅ 酒店 · 用了 11 次工具",
      shortlist: "💬 trip · 候选名单",
      switchFull: "切换到完全访问模式？",
      restarting: "正在重启，对话保留",
      typedApi: "输进 claude-api",
      newCardApi: "一张新卡片 · api",
      yourMessage: "你的消息",
      aReply: "一条回复 · api",
    },
    hints: {
      cancel: "点取消就会让 api 维持现在的模式。这个晚上要走到完全访问模式：试试另一个按钮。",
      deny: "点拒绝就真的会挡下这次操作。这个晚上需要跑这个测试：试试允许。",
      stop: "点停止会打断这次任务。试试允许。",
    },
    menu: ["回复", "复制文本", "置顶", "转发", "选择", "删除"],
    composer: "写条消息…",
    search: "搜索",
  },
};
