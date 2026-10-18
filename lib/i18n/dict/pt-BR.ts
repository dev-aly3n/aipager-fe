import type { Dict } from "./types";

/**
 * Brazilian Portuguese, written the way a good Brazilian app talks: plain,
 * direct, você. The words for the product's own ideas (sessão, cartão, pedido
 * de permissão, Modo Automático, precisa de você, pronta…) are the ones
 * aipager itself uses in Telegram and in the Mini App.
 */
export const ptBR: Dict = {
  meta: {
    title: "aipager: o Claude Code chamando você",
    description:
      "O aipager roda suas sessões do Claude Code num terminal separado e espelha tudo no Telegram: acompanhe o trabalho, aprove o que elas pedem, mande a próxima mensagem. Tudo roda no seu computador.",
  },

  nav: {
    modes: "Modos",
    app: "Mini App",
    how: "Como funciona",
    install: "Instalar",
    security: "Segurança",
    faq: "FAQ",
    docs: "Docs",
    language: "Mudar idioma",
  },

  hero: {
    title: "O Claude é mais um chat.",
    lead: "O aipager coloca suas sessões do Claude Code no Telegram, entre sua família, seus amigos e sua equipe. Roda no seu computador.",
    agentInstall: "Deixe seu agente instalar",
    docs: "Docs",
    security: "Segurança",
    meta: "Linux e macOS · MIT · cerca de um minuto",
  },

  modes: {
    eyebrow: "Modos de permissão",
    title: "Três modos. Você começa no Modo Automático.",
    lead: "Cada sessão está em um dos três, escolhido por sessão e mudado quando você quiser com /mode. No Modo Perguntar, tudo para antes de cada ação. O Modo Automático, onde toda sessão nova começa, deixa a própria verificação de segurança do Claude Code rodar as ações seguras e parar as arriscadas para você. O Modo Acesso total roda tudo sem nenhuma verificação. Um modo mexe só nos pedidos de permissão do Claude Code: num grupo, uma ferramenta que a função de um membro não pode usar continua sendo recusada, não importa o modo.",
    legend: [
      { k: "Permitir", v: "só desta vez" },
      { k: "Negar", v: "o Claude bloqueia a ação" },
      { k: "Sempre permitir", v: "adiciona a regra que o Claude oferece, quando ele oferece uma" },
      { k: "Parar", v: "interrompe a tarefa em vez de responder" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Toda ação espera por você, até uma leitura.",
      quote: "Vou olhar primeiro o helper do cookie.",
      read: "Read: o helper do cookie",
      needs: "Precisa da sua permissão",
    },
    auto: {
      tag: "padrão",
      note: "A leitura e os testes rodaram sem perguntar. Um comando no staging é do tipo arriscado, então esse parou.",
      quote: "O teste clica antes do cookie de sessão ser criado.",
      risky: "Bash: Ver as sessões mais recentes no staging",
    },
    full: {
      tag: "/mode full",
      note: "Sem verificação, sem botão. Só a resposta quando termina.",
      ask: "arruma o teste e2e de login que está instável",
      quote: "O teste clica antes do cookie de sessão ser criado. Ele dá um sleep de 5s e torce.",
    },
    facts: [
      {
        t: "/mode",
        b: "Mostra um botão para cada um dos outros modos; /mode ask, /mode auto e /mode full mudam na hora. Sessões novas começam no Modo Automático, a não ser que o chat tenha escolhido outra coisa em /settings → Novas sessões.",
      },
      {
        t: "Modo Perguntar ⇄ Modo Automático, na mesma sessão",
        b: "Sem reiniciar, mesmo com o Claude trabalhando: o aipager aperta Shift+Tab na sessão, e o cartão diz que está mudando até o Claude Code confirmar o novo modo.",
      },
      {
        t: "O Modo Acesso total reinicia",
        b: "Entrar ou sair do Modo Acesso total reinicia a sessão e mantém a conversa. Só um admin pode criar uma sessão nele ou mudar uma para ele (ou você, no seu chat privado com o bot).",
      },
      {
        t: "As perguntas chegam do mesmo jeito",
        b: "Um modo manda nos pedidos de permissão, não nas decisões: quando o Claude pergunta algo a você, os botões chegam no seu chat em qualquer modo.",
      },
    ],
  },

  places: {
    eyebrow: "Onde ele vive",
    title: "Três chats. O resto é a sua vida.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Trabalhando · 3:14 · Read ×2 · Bash ×2",
        title: "Seu chat com o Claude",
        body: "Um chat para todas as sessões. Um cartão ao vivo por tarefa que se edita sozinho, pedidos que você responde com um toque e uma barra fixada que diz o que precisa de você. Uma mensagem comum vai para a sessão que a barra mostra; o /web manda a próxima para outra e continua a conversa lá.",
      },
      {
        name: "backend-team",
        tag: "grupo · modo equipe",
        preview: "Sara: @aipagerbot /web roda o e2e de login no staging",
        title: "O grupo da sua equipe",
        body: "Coloque o bot num grupo e quem estiver na lista de pessoas permitidas pode mencioná-lo. Cada mensagem roda com a função de quem enviou; uma ferramenta que a função não pode usar é recusada antes de rodar, e cada decisão vai para o log de auditoria com o nome de quem tocou.",
      },
      {
        name: "Jim",
        tag: "o próprio chat com o bot",
        preview: "web · Precisa da sua permissão",
        title: "Outra pessoa, no chat dela",
        body: "Adicione o chat privado de alguém da equipe com o bot e essa pessoa comanda as próprias sessões, com a função dela e a pasta raiz dela: as tarefas do Claude começam dentro dessa pasta e não leem nada da sua pasta pessoal fora dela. Quem só deve acompanhar ganha read_only no seu grupo.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<sessão> <mensagem>"],
      ["owner", "admin", "user", "read_only"],
      ["pasta raiz dos membros", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Quatro funções, e uma regra de ferramentas por função.",
      lead: "A função que vale é a que você tem no chat onde está agindo, e uma ferramenta que a função não pode usar é recusada antes de rodar, sem perguntar. Nada no Telegram nem no Mini App muda quem está na lista: só o aipager config, no computador.",
      can: "Pode",
      rows: [
        "Mandar mensagens para uma sessão",
        "Permitir, Negar, responder às perguntas do Claude",
        "Bash, e tudo mais que roda código",
        "Modo Acesso total, o /settings de um grupo, /update",
        "Onde as sessões podem trabalhar",
        "Ler arquivos de credenciais (~/.ssh, …)",
      ],
      anywhere: "em qualquer lugar",
      rootFolder: "pasta raiz",
      ownChat: "chat próprio",
      link: "O modo equipe, por completo",
    },
  },

  day: {
    eyebrow: "No dia a dia",
    title: "Use como um chat.",
    lead: "Não é um console fantasiado de chat: tudo o que você já faz no Telegram funciona aqui. Fale com ele na volta para casa, jogue o print nele, mande a próxima ideia antes da anterior terminar.",
    items: [
      {
        t: "Fale em vez de escrever",
        b: "Mande um áudio: o aipager transcreve no seu próprio computador (nunca na nuvem de ninguém), devolve o que ouviu para você conferir e digita na sessão como se você tivesse escrito.",
      },
      {
        t: "Um print do bug",
        b: "Fotos e arquivos caem numa pasta do seu computador e o Claude recebe o caminho, com a sua legenda como mensagem, ou “check this: …” quando não tem legenda. Mande vários de uma vez e eles vão como uma mensagem só.",
      },
      {
        t: "Ele te manda arquivos",
        b: "Peça com suas próprias palavras, “me manda o print”, e o arquivo chega no chat daquela sessão logo depois da resposta: imagens como fotos, vídeos e áudios do jeito que são, qualquer outra coisa como arquivo, e vários de uma vez como um álbum só. Nunca as configurações do aipager, as credenciais do Claude ou as suas chaves: isso é recusado antes de qualquer envio.",
      },
      {
        t: "Mande a próxima agora",
        b: "Sua mensagem chega no Claude no instante em que você envia, mesmo no meio de uma tarefa: 👀 enquanto ela espera na fila do próprio Claude, 👍 quando o Claude pega. O ⚡ Enviar agora entrega a mensagem sem esperar a etapa terminar.",
      },
      {
        t: "Nunca lida como a resposta",
        b: "Uma mensagem que você manda com um pedido de permissão aberto fica esperando, não entra como resposta ao pedido, e vai para a sessão assim que você responder.",
      },
      {
        t: "Agentes e comandos em segundo plano, contados",
        b: "Cada agente em segundo plano que o Claude inicia ganha a própria linha no cartão com o que está fazendo, e um comando deixado rodando em segundo plano mantém o próprio relógio até terminar.",
      },
      {
        t: "Ele avisa antes",
        b: "Um aviso de contexto, uma compactação, uma sessão encerrada ou que ficou quieta, uma tarefa que demorou demais: o chat conta para você sem você precisar ir olhar.",
      },
      {
        t: "Os botões já estão ali",
        b: "Um teclado fica embaixo da caixa de mensagem: um botão por sessão ativa, depois status, stop e new, e então Templates para as mensagens que você vive redigitando e Comandos para as que o próprio Claude Code resolve sozinho.",
      },
      {
        t: "/status, o chat inteiro de uma vez",
        b: "Todas as sessões numa lista em que você pode agir: o que cada uma está fazendo, o modelo, o contexto que sobrou, o quanto já custou, o que está na fila atrás dela, com Parar, Responder e o resto do menu em cada uma.",
      },
    ],
    heard: "Ouvi:",
    said: "arruma o teste e2e de login que está instável",
    /** what you ask for under the third one (Claude's caption is modes.auto.quote) */
    ask: "me manda o print",
  },

  app: {
    eyebrow: "O Mini App",
    title: "Um painel, ainda dentro do Telegram.",
    lead: "O /app abre todas as sessões de uma vez: um bloco para cada, com o anel de contexto, a pasta, o modelo e o quanto já gastou. O chat continua sendo onde você responde, e o app serve para ver todas juntas e para o que é desajeitado num chat, como ler um diff ou mudar uma configuração.",
    tabs: { sessions: "Sessões", settings: "Configurações" },
    summary: { needs: "precisa de você", working: "trabalhando", resting: "pronta", spent: "gastos", finished: "encerradas" },
    needsYou: "Precisa de você",
    answerInChat: "Responder no chat",
    states: { working: "trabalhando", needs: "precisa de você", resting: "pronta" },
    settings: {
      updates: "Atualizações",
      upToDate: "Tudo está atualizado.",
      check: "Verificar atualizações",
      language: "Idioma do app",
      languageNote: "Só o texto do aipager. As respostas do Claude não mudam.",
      chatPrefs: "Configurações do chat",
      chatPrefsNote: "Valem para todas as sessões deste chat.",
      rows: [
        { k: "Como a resposta aparece", v: "Cartão + resposta separada" },
        { k: "Prévias de diff", v: "Desligado" },
        { k: "Atualizar cartão em tarefas longas", v: "Ligado" },
        { k: "Novas sessões" },
      ],
    },
    close: "Fechar",
    facts: [
      {
        t: "Todas as sessões numa tela",
        b: "Um bloco para cada, com o anel de contexto, de quem ela é, o modelo e o quanto já gastou, e em cima deles uma linha que diz como está o chat: quantas estão trabalhando, quantas estão prontas, quanto custou o dia, quantas já estão encerradas. O + cria outra: um nome, uma pasta entre as que você já usa, um modelo.",
      },
      {
        t: "O que precisa de você vem primeiro",
        b: "Uma sessão esperando sua resposta a um pedido de permissão ou a uma pergunta fica no topo, com o que ela está pedindo. O Responder no chat manda esse pedido de volta para o fim do chat, com botões e tudo, e você responde lá.",
      },
      {
        t: "Uma página por sessão",
        b: "A linha de estado, “Trabalhando (3:12)” ou “Pronta, última atividade há 5 min”, e um toque para Parar ou Continuar. Embaixo, as últimas ferramentas usadas, a última resposta, o controle do modelo, o diff dos arquivos que a tarefa mudou, e as configurações daquela sessão.",
      },
      {
        t: "Servido pelo próprio aipager",
        b: "Vem ligado, cada requisição é conferida com a assinatura do próprio Telegram, e a página não carrega nada de fora: nem fontes, nem scripts. Para desligar, use aipager miniapp disable.",
      },
    ],
    link: "O que o app faz",
  },

  langs: {
    eyebrow: "Quinze idiomas",
    title: "No seu idioma, até nos dígitos.",
    lead: "Só as palavras do próprio aipager mudam: cartões, pedidos, botões, a barra fixada, o /status, o Mini App, a documentação. Suas sessões não: o Claude responde no idioma em que você escreve para ele, e o que o aipager manda para o Claude vai do jeito que estava. Escolha um com /language, ou deixe o aipager seguir o idioma do seu Telegram.",
    facts: [
      {
        t: "Da direita para a esquerda, do jeito certo",
        b: "O persa e o árabe se leem da direita para a esquerda, com os dígitos do persa (۰-۹) ou do árabe (٠-٩) e os separadores de cada um, no Telegram e no Mini App. Nomes de sessão, caminhos, comandos e código mantêm a direção deles.",
      },
      {
        t: "Escrito, não traduzido",
        b: "Cada idioma foi escrito do jeito que fala quem usa apps nele, estrangeirismos incluídos, com as formas de plural de cada língua (o árabe tem seis).",
      },
      {
        t: "Seu chat, seu idioma",
        b: "Um chat privado pode seguir o seu Telegram. Um grupo tem um idioma só, escolhido por um admin, e o aviso que aparece depois de um toque sai no idioma de quem tocou.",
      },
      {
        t: "A documentação também",
        b: "O README e todas as páginas dentro de docs/ são traduzidos. Quando uma tradução e a página em inglês não batem, quem vale é a página em inglês.",
      },
    ],
    pinned: "Mensagem fixada",
  },

  under: {
    eyebrow: "Por baixo do chat",
    title: "O terminal continua sendo a fonte da verdade.",
    lead: "O Claude Code roda num terminal de verdade, dentro do dtach, então ninguém precisa deixar uma janela aberta. Cada etapa dispara um hook que manda um datagrama para o aipager por um socket local, e o aipager edita uma mensagem no seu chat. Suas respostas voltam pelo mesmo caminho: um veredito para o hook que está segurando a ação, ou teclas digitadas na sessão.",
    nodes: [
      { t: "Claude Code", b: "dentro do dtach, sem janela aberta" },
      { t: "hook", b: "dispara a cada etapa" },
      { t: "aipager", b: "um processo, com o seu usuário" },
      { t: "Telegram", b: "o token do seu próprio bot" },
      { t: "seus chats", b: "seu chat privado, o grupo da sua equipe" },
    ],
    facts: [
      {
        t: "Sente no computador quando quiser",
        b: "O aipager session api se conecta à sessão em andamento a partir de qualquer terminal. Digite lá, digite no chat: é a mesma sessão. Feche a janela e ela segue, e a conexão acompanha a sessão mesmo quando ela reinicia.",
      },
      {
        t: "Ele nunca lê a sua tela",
        b: "O aipager digita na sessão e escuta os eventos do próprio Claude Code. O que aparece no seu chat vem dos hooks e da conversa salva, não de ler o que aparece no terminal.",
      },
      {
        t: "Nada fica esperando o chat",
        b: "Um hook manda um datagrama e volta: uns 20 ms do tempo do Claude Code. Sem o aipager escutando, o evento é simplesmente descartado e o Claude segue; o aipager se atualiza depois pelos próprios arquivos da sessão.",
      },
    ],
    hooks: "Dezesseis hooks, mais a status line de onde ele tira o modelo, o contexto e o custo. O aipager está ligado em todos eles.",
  },

  trust: {
    eyebrow: "Segurança",
    title: "Nada no meio do caminho.",
    lead: "O aipager nunca fala com a Anthropic. Quem fala é só o próprio Claude Code, com o seu login, no seu computador. O aipager inicia o Claude Code num terminal e escuta os hooks que ele publica. Nenhum endpoint descoberto por engenharia reversa, nenhum proxy, nenhuma conta além da sua: a sessão que você comanda pelo celular é a mesma que você comandaria no teclado.",
    cards: [
      {
        t: "Não existe servidor do aipager.",
        b: "O aipager fala com a Bot API do Telegram usando o token do seu próprio bot. Não existe conta do aipager nem serviço do aipager, e não tem o computador de mais ninguém entre o seu celular e o seu computador.",
      },
      {
        t: "Só os seus chats são atendidos.",
        b: "O aipager só responde nos chats que estão na sua configuração. Um desconhecido que achar o bot recebe uma linha dizendo que o bot não está configurado para falar com essa pessoa; nada do que ela mandar chega a uma sessão.",
      },
      {
        t: "Nenhuma porta aberta.",
        b: "Ele escuta só no loopback. O Mini App sai por um túnel da Cloudflare onde toda requisição precisa levar a assinatura do Telegram. Para desligar, use aipager miniapp disable.",
      },
      {
        t: "Seu token, seu arquivo.",
        b: "O token do bot e os ids dos chats ficam em ~/.config/aipager/aipager.yaml com permissão 600. Eles ficam fora do log do aipager, e são ocultados em todo lugar onde poderiam acabar aparecendo.",
      },
      {
        t: "Ele nunca vira root.",
        b: "Nada de sudo, nada de setuid. Tudo o que ele escreve fica na sua pasta pessoal, em /tmp ou na pasta de sockets dele, e todo processo que ele inicia (claude, dtach, os instaladores) roda como você.",
      },
      {
        t: "Quem decide continua sendo o Claude Code.",
        b: "O seu settings.json diz o que precisa de permissão. O aipager repassa a pergunta; ele nunca decide o que pode rodar, e um botão que sobrou de uma tarefa que já terminou se recusa a agir em vez de mexer no trabalho que está rodando agora.",
      },
      {
        t: "O acesso é dado no computador.",
        b: "Membros e funções só mudam com o aipager config, no computador. Nada no Telegram e nada no Mini App pode adicionar uma pessoa ou ampliar uma função.",
      },
      {
        t: "Toda resposta fica registrada.",
        b: "Cada Permitir, cada Negar e cada resposta vai para ~/.claude/aipager-audit.jsonl, que só cresce, com quem tocou quando foi num grupo.",
      },
    ],
    link: "O modelo de segurança",
  },

  install: {
    eyebrow: "Instalação",
    title: "Quatro linhas. Guarde nas Mensagens Salvas.",
    lead: "Toque numa linha para copiar. Antes, duas coisas: um bot seu do @BotFather (toque em Iniciar nele) e o Claude Code logado neste computador. O assistente da segunda linha pede o resto.",
    agent: {
      title: "Ou entregue para o agente que você já tem.",
      lead: "Coloque o token do bot num arquivo que o agente nunca precisa ler, e então dê isto ao Claude Code:",
      link: "O guia que ele segue",
    },
    saved: { name: "Mensagens Salvas", count: "4 mensagens" },
    lines: [
      { note: "uv, pipx ou Homebrew, o que você tiver. Linux ou macOS." },
      { note: "o token do seu bot do @BotFather, o seu chat, os hooks do Claude Code" },
      { note: "mantém o aipager no ar mesmo depois do logout" },
      { note: "O Claude Code dentro do dtach. Daqui em diante, é no seu chat." },
    ],
    copied: "Copiado",
    pm: "Prefere o seu gerenciador de pacotes? uv, pipx, Homebrew, Docker, Nix, o AUR e o Snap.",
    pmLink: "todas as formas de instalar",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Pergunte.",
    readBack: "arraste para ver o que passou",
    items: [
      {
        q: "Qual a diferença para os apps do Claude no celular?",
        a: "Os apps do Claude falam com o assistente hospedado pela Anthropic. O aipager espelha uma sessão do Claude Code rodando no seu próprio computador: o seu repo, as suas ferramentas, o seu ambiente.",
      },
      {
        q: "Meu código sai do meu computador?",
        a: "Só até os seus próprios chats do Telegram. O aipager fala com o Telegram usando o token do seu próprio bot; não tem nenhum servidor do aipager no meio.",
      },
      {
        q: "Isso pode fazer minha conta do Claude ser banida?",
        a: "O aipager nunca chama a Anthropic. Ele inicia a CLI oficial claude no seu computador e lê os hooks que o Claude Code publica, e as suas mensagens são digitadas naquela sessão exatamente como se você estivesse no teclado: nenhum endpoint de engenharia reversa, nenhum proxy, nenhuma conta compartilhada, nada passando pelo servidor de outra pessoa. O que a Anthropic vê é o seu próprio login do Claude Code fazendo o que ele já faz. As políticas de uso da Anthropic continuam valendo para o que você pedir, e uma equipe num bot só continua dividindo a sua assinatura: para isso, rode o aipager numa conta própria ou com uma chave com limite de gasto.",
      },
      {
        q: "Preciso de VPN ou de uma porta aberta?",
        a: "Não. O aipager consulta o Telegram de dentro para fora, por HTTPS, e não escuta em nenhuma porta além do loopback, então não tem nada para liberar nem nada que se alcance pela rede. O seu celular fala com o Telegram; o Telegram fala com a conexão de saída do seu computador.",
      },
      {
        q: "E se o Claude sair do controle?",
        a: "Os pedidos esperam o seu toque, o /stop interrompe a tarefa e descarta o que estiver na fila, o /kill encerra a sessão, e botões de uma tarefa que já terminou se recusam a agir.",
      },
      {
        q: "Minha equipe pode usar?",
        a: "Pode. Coloque o bot num grupo com funções: owner, admin, user, read_only. Cada mensagem roda com as permissões de quem enviou, um membro sem can_manage trabalha dentro da própria pasta raiz, e cada decisão vai para o log de auditoria.",
      },
      {
        q: "Posso mandar um áudio ou um print?",
        a: "Os dois. Um áudio é transcrito no seu computador e digitado na sessão como se você tivesse escrito; uma foto ou um arquivo é salvo no seu computador e o Claude recebe o caminho, com a sua legenda como mensagem.",
      },
      {
        q: "Ele fala o meu idioma?",
        a: "Quinze, escolhidos com /language ou seguindo o seu Telegram. O persa e o árabe se leem da direita para a esquerda, com os dígitos deles. Só o texto do próprio aipager muda; o Claude responde no idioma em que você escreve para ele.",
      },
      {
        q: "Tem um painel?",
        a: "O /app abre um Mini App dentro do Telegram: um bloco por sessão, um visualizador de diff para cada Write e cada Edit, as configurações, um toque para parar. Vem ligado, cada requisição é conferida com a assinatura do Telegram. Para desligar, use aipager miniapp disable.",
      },
      {
        q: "O que é o dtach?",
        a: "Um programinha que separa o processo do terminal. Ele mantém o Claude Code rodando depois que o terminal fecha ou o SSH cai, então uma resposta que você manda uma hora depois ainda chega numa sessão que está rodando. Vem junto com o aipager.",
      },
      {
        q: "Ele continua rodando depois que eu faço logout?",
        a: "O aipager service install mantém o aipager no ar com systemd ou launchd, e as sessões moram dentro do dtach, então elas sobrevivem ao terminal que as iniciou. Também tem versões para Docker, Nix, AUR e Snap.",
      },
      {
        q: "Como eu atualizo?",
        a: "O /update confere o aipager e o Claude Code e instala a versão nova; depois, o 🔄 Reiniciar agora coloca essa versão no ar ali mesmo, não importa se o aipager roda num terminal, no tmux, no Docker ou como serviço. Suas sessões continuam rodando durante isso.",
      },
      {
        q: "Quanto custa?",
        a: "Nada. A licença é MIT, o bot é seu, e o Claude Code continua usando o plano ou a chave que ele já usa.",
      },
    ],
  },

  cta: {
    title: "Coloque o Claude nos seus chats.",
    lead: "Depois feche o terminal e vá viver a sua noite.",
    copy: "Copiar",
  },

  footer: { changelog: "Mudanças", issues: "Issues" },

  docs: {
    title: "Documentação",
    description: "Documentação de referência do aipager: arquitetura, hooks, comandos, resolução de problemas e segurança.",
    onThisPage: "Nesta página",
    translated: "Esta página é uma tradução da página em inglês; se as duas não baterem, quem vale é a página em inglês.",
    english: "Inglês",
    source: "O original no GitHub",
    onGitHub: "Estas páginas no GitHub",
    sourceNote: "O markdown do repo é o mesmo texto que você está lendo.",
    prev: "Anterior",
    next: "Próxima",
    groups: ["Comece por aqui", "Referência", "Colocando para rodar"],
  },

  demo: {
    people: { you: "Você" },
    typing: "digitando",
    isTyping: "está digitando",
    days: { today: "Hoje", yesterday: "Ontem", monday: "Segunda-feira" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 membros, 3 online" },
      mom: { name: "Mãe", subtitle: "online" },
      friends: { name: "Fut de sexta ⚽", subtitle: "9 membros" },
      sara: { name: "Sara", subtitle: "visto por último recentemente" },
      saved: { name: "Mensagens Salvas", subtitle: "" },
    },
    folders: { all: "Todos os chats", personal: "Pessoal", work: "Trabalho", bots: "Bots" },
    seed: {
      oldPrompt: "expira as sessões ociosas depois de 30 minutos",
      oldAnswer: "Pronto. O session store agora expira as sessões ociosas depois de 30 minutos; 212 testes passando.",
      teamFlaky: "o login em prod tá instável de novo 😬 alguém?",
      teamSaw: "vi também, duas vezes na última hora",
      momEat: "Já comeu? 🙂",
      friendsPitch: "quadra reservada, sexta 19h",
      friendsIn: "tô dentro 🙋",
      friendsBall: "tô dentro, levo a bola nova",
      saraMerged: "fiz o merge do seu PR 🚀",
      saraThanks: "valeuu",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "comi sim, fiz macarrão 🍝 e você?",
      momLunch: "almoço domingo 13h? 😊",
      youLunch: "13h ❤️",
      teamRun: "@aipagerbot /web roda o e2e de login no staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "quem vai sexta? faltam 2 ⚽",
      youIn: "tô dentro 🙋‍♂️",
      saraVacation: "já decidiu as férias? 🏖",
      youTwoMinutes: "dois minutos 😄",
      youBook: "Lisboa, 12–19 de março ☀️ voos € 193, hotel € 142",
      saraBook: "issoo, reserva 🎉",
    },
    prompts: {
      fix: "arruma o teste e2e de login que está instável",
      trip: "uma semana em Lisboa em março: vê o tempo primeiro, depois 3 hotéis abaixo de € 180 e voos saindo de Berlim. Se o tempo estiver ruim, tenta Sevilha.",
      more: "manda uns dois agentes nisso: um nos hotéis abaixo de € 180, outro nos voos saindo de Berlim",
      push: "faz push da branch da correção e abre o PR também",
      teamRun: "roda o e2e de login no staging",
    },
    claude: {
      plan: "Vou rodar o teste de login algumas vezes e ver onde ele falha.",
      flaky: "Ele falha mais ou menos uma vez a cada cinco. É questão de timing, não de lógica.",
      cookie: "O teste clica antes do cookie de sessão ser criado. Ele dá um sleep de 5s e torce.",
      answer: "Resolvido. Agora o teste espera o cookie de sessão em vez de dar um sleep de 5s. 10 rodadas seguidas, todas verdes.",
      teamTests: "18 de 18 testes de login passam no staging. A falha intermitente não aparece lá.",
      weather: "Primeiro o tempo: não adianta cotar uma semana de chuva.",
      lisbon: "Lisboa em março: 18 °C de dia, chuva em 2 dos 7 dias. Está bom, não precisa de Sevilha.",
      pr: "Fiz push de fix/login-cookie e abri o PR #214. O CI está rodando nele.",
      teamShort: "18 de 18 testes de login passam no staging.",
      twoAgents: "Dois agentes então: um na hospedagem, outro nas passagens.",
      interim: "Lisboa está confirmada: 18 °C, dois dias de chuva. Os dois agentes estão procurando; volto com a lista.",
      shortlist:
        "Hotéis: Casa Baleal € 142 a diária, Lx Boutique € 165, Santa Justa € 178, os três a pé até a Baixa. Voos: TAP direto, € 89 na ida dia 12 e € 104 na volta dia 19. É só falar que eu reservo os dois.",
    },
    question: {
      verb: "Aumentar o timeout ou esperar o cookie?",
      question: "Aumentar o timeout ou esperar o cookie?",
      options: ["Aumentar o timeout", "Esperar o cookie", "Os dois"],
      title: "Correção",
      body: "O teste dá um sleep de 5s antes de clicar.",
    },
    captions: {
      restAuto: "Uma sessão do Claude Code pronta no seu notebook, no Modo Automático, onde toda sessão nova começa.",
      restAsk: "Uma sessão do Claude Code pronta no seu notebook, no Modo Perguntar: ela pergunta antes de cada ação.",
      restFull: "Uma sessão do Claude Code pronta no seu notebook. Antes do próximo trabalho, você tira as verificações dela.",
      held: "Em pausa enquanto você olha em volta. Deixe parado um instante e a noite segue.",
      arrived: "O 👀 quer dizer que chegou. O aipager digita na sessão, exatamente como se você estivesse no teclado.",
      took: "O 👍 quer dizer que o Claude pegou. Daqui em diante é um cartão só, se editando enquanto a tarefa roda.",
      glance: "Ele roda o teste algumas vezes. Cada etapa edita o mesmo cartão.",
      momFirst: "Sua mãe perguntou faz vinte minutos. Nada aqui precisa de você, então você responde para ela.",
      sent: "Enviado. Você sai do chat, como qualquer pessoa faria.",
      workAuto:
        "Modo Automático, onde toda sessão nova começa: a própria verificação de segurança do Claude Code rodou a leitura e os testes sozinha. Nenhum dos dois chegou até você.",
      askRead: "Modo Perguntar: toda ação espera por você. Esta só quer ler um arquivo.",
      askTest: "E de novo para a rodada de testes. No Modo Automático, nenhuma das duas teria perguntado.",
      workFull: "Modo Acesso total: o Claude Code não pergunta nada e o aipager não tem nada para repassar. Você só vê o que ele fez.",
      momAgain: "Sua mãe de novo. A sessão segue trabalhando enquanto isso; ela não precisa de janela aberta.",
      team: "O grupo da equipe. Quem estiver na lista de pessoas permitidas pode mencionar o bot; cada mensagem roda com a função de quem enviou.",
      teamSara:
        "A Sara é admin neste grupo, então a rodada de testes dela passa. A mensagem chega ao Claude marcada com quem enviou e com a função em que roda.",
      teamSam: "O Sam é user neste grupo. O Bash está bloqueado para a função dele, então a ação é recusada antes de rodar.",
      questionAuto:
        "Agora algo que só você pode responder. Um modo decide o que roda sem perguntar; uma pergunta como esta chega até você em qualquer modo.",
      questionAsk: "Uma pergunta, não um pedido de permissão: uma decisão do próprio Claude, com um botão por opção.",
      buzzed: "Seu celular vibrou no braço do sofá. Três botões, um toque.",
      answerTyped: "Sua resposta é digitada na sessão como se você estivesse no teclado.",
      friends: "Família, amigos, trabalho e o Claude: um app só, aquele que você já abre mesmo.",
      answerDone: "Pronto. A resposta chega como qualquer outra mensagem, e a barra fixada se cala.",
      evening: "Um teste instável arrumado do sofá, entre uma pergunta da mãe e um jogo na sexta.",
      saraPing: "Nem tudo que apita é trabalho.",
      second: "Uma segunda sessão, criada pelo chat: sem terminal, sem ssh.",
      newReady: "O aipager inicia a sessão no seu computador e devolve pronta, no modo em que as sessões novas começam.",
      weather: "Ele checa o que decide todo o resto, e conta o que achou.",
      queued: "Enviada com ele ainda trabalhando: o aipager entrega na hora, o Claude põe na fila, e o 👀 diz que entrou.",
      queueLine: "A linha embaixo diz o que ela está esperando, e tocar nela entrega a mensagem ao Claude no meio da etapa.",
      tookIt:
        "O Claude pega no fim da etapa: 👍, o cinza sai, a linha some, e o cartão vai para baixo da mensagem que ele está respondendo.",
      agents: "Ele manda dois de uma vez. Cada um ganha a própria linha, e o cartão acompanha o que cada um está fazendo.",
      agentsWork: "Agora eles estão por conta própria: cada um usa algumas ferramentas, e não há nada para você fazer.",
      twoSessions:
        "Agora tem duas sessões rodando neste chat. Uma mensagem comum vai para a sessão escolhida para as suas mensagens; para falar com a outra, você responde a uma mensagem dela.",
      hold: "Segure a mensagem e o Telegram mostra o que dá para fazer com ela.",
      reply: "Responder. A caixa de mensagem está respondendo àquela mensagem, e é por aí que o aipager sabe para qual sessão a sua mensagem vai.",
      aimed: "Digitada na api, não na trip.",
      interim: "A tarefa termina antes deles, então a resposta sai com uma linha ao vivo embaixo para o trabalho que continua.",
      apiFirst: "A api responde primeiro; ela só tinha uma coisa para fazer.",
      liveLine: "O aipager mantém essa linha atualizada sozinho enquanto eles trabalham.",
      bothBack: "Os dois voltaram. O aipager junta a linha numa só e acorda o Claude com o que eles acharam.",
      shortlist: "O que eles acharam volta como uma resposta própria, escrita depois que o Claude leu os dois relatórios.",
      human: "O que sobra é só a parte que uma máquina não deveria fazer por você.",
      end: "Duas sessões, três agentes e uma semana em Lisboa, do sofá. Nada ficou rodando, nada ficou para tocar.",
      resting: "Esta sessão está pronta. Antes de passar o próximo trabalho, você tira as verificações dela.",
      fullWho: "O Modo Acesso total é para os admins, e para você, no seu chat privado com o bot.",
      fullRestart:
        "Entrar ou sair do Modo Acesso total reinicia a sessão e mantém a conversa. Entre o Modo Perguntar e o Modo Automático, nada reinicia.",
    },
    switch: {
      default: "padrão",
      lines: [
        "Toda ação para e espera o seu toque.",
        "As ações seguras rodam sozinhas; as arriscadas esperam a sua permissão.",
        "Nada para. Nada pergunta.",
      ],
    },
    cable: { idle: "esperando uma tarefa", quiet: "nada de novo", flick: "o cabo é de verdade · dê um peteleco", daemon: "aipager" },
    wire: {
      cardEdited: "cartão editado · Bash ×1",
      twoCalls: "duas ações, nada para tocar",
      trace: "o trace, e o que ele achou",
      permNeeded: "🔐 Precisa da sua permissão",
      readRuns: "veredito · a leitura roda",
      testRuns: "veredito · o teste roda",
      threeCalls: "três ações, sem verificação",
      question: "❓ uma pergunta, com botões",
      answerTyped: "resposta digitada",
      claudeAnswer: "💬 a resposta do Claude",
      sessionIn: "uma sessão em ~/travel",
      typedTrip: "digitada na claude-trip",
      newCardTrip: "um cartão novo · trip",
      lisbon: "Lisboa em março · 18 °C",
      queued: "claude-trip · na fila",
      tookIt: "pegou · 👍",
      twoAgents: "🤖 dois agentes",
      aimed: "direcionada à claude-api",
      cardApi: "um cartão · api",
      interim: "💬 trip · uma resposta parcial",
      thePr: "💬 api · o PR",
      flightsDone: "✅ voos · 7 ferramentas usadas",
      hotelsDone: "✅ hotéis · 11 ferramentas usadas",
      shortlist: "💬 trip · a lista",
      switchFull: "mudar para o Modo Acesso total?",
      restarting: "reiniciando, conversa mantida",
      typedApi: "digitada na claude-api",
      newCardApi: "um cartão novo · api",
      yourMessage: "sua mensagem",
      aReply: "uma resposta · api",
    },
    hints: {
      cancel: "O Cancelar deixaria a api como ela está. Esta noite segue para o Modo Acesso total: toque no outro botão.",
      deny: "O Negar bloquearia a ação de verdade. Esta noite precisa que o teste rode: toque em Permitir.",
      stop: "O Parar interromperia a tarefa. Toque em Permitir.",
    },
    menu: ["Responder", "Copiar Texto", "Fixar", "Encaminhar", "Selecionar", "Apagar"],
    composer: "Escrever uma mensagem…",
    search: "Buscar",
  },
};
