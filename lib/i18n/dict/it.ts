import type { Dict } from "./types";

/**
 * Italian, written the way an app made in Italy talks: plain, tu, short
 * sentences, no exclamation marks. The words for the product's own ideas
 * (sessione, scheda, richiesta di permesso, Modalità «Automatico», al lavoro,
 * pronta) are the ones aipager itself says in Telegram.
 */
export const it: Dict = {
  meta: {
    title: "aipager: Claude Code ti avvisa",
    description:
      "aipager fa girare le tue sessioni di Claude Code in un terminale in background e le porta su Telegram: guardale lavorare, approva quello che chiedono, manda il prossimo messaggio. Gira sul tuo computer.",
  },

  nav: {
    modes: "Modalità",
    app: "Mini App",
    how: "Come funziona",
    install: "Installazione",
    security: "Sicurezza",
    faq: "FAQ",
    docs: "Docs",
    language: "Cambia lingua",
  },

  hero: {
    title: "Claude è una chat in più.",
    lead: "aipager mette le tue sessioni di Claude Code su Telegram, tra la tua famiglia, i tuoi amici e il tuo team. Gira sul tuo computer.",
    agentInstall: "Fallo installare al tuo agente",
    docs: "Docs",
    security: "Sicurezza",
    meta: "Linux e macOS · MIT · circa un minuto",
  },

  modes: {
    eyebrow: "Modalità dei permessi",
    title: "Tre modalità. Si parte dalla modalità «Automatico».",
    lead: "Ogni sessione sta in una delle tre, si sceglie per sessione e si cambia quando vuoi con /mode. La modalità «Chiedi» si ferma prima di ogni azione. La modalità «Automatico», da cui parte ogni sessione nuova, lascia che il controllo di sicurezza di Claude Code esegua da solo le azioni sicure e fermi per te quelle rischiose. La modalità «Completo» esegue tutto senza alcun controllo. Una modalità vale per le richieste di permesso di Claude Code e per nient'altro: in un gruppo, uno strumento che il ruolo di un membro non può usare viene rifiutato lo stesso, qualunque cosa dica la modalità.",
    legend: [
      { k: "Consenti", v: "solo questa azione" },
      { k: "Nega", v: "Claude blocca l'azione" },
      { k: "Consenti sempre", v: "aggiunge la regola che Claude propone, quando ne propone una" },
      { k: "Ferma", v: "interrompe l'attività invece di rispondere" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Ogni azione aspetta te, anche una lettura.",
      quote: "Prima guardo l'helper del cookie.",
      read: "Read: l'helper del cookie",
      needs: "Serve il tuo permesso",
    },
    auto: {
      tag: "predefinito",
      note: "La lettura e il test sono partiti da soli. Un comando su staging è di quelli rischiosi, quindi si è fermato.",
      quote: "Il test clicca prima che venga impostato il cookie di sessione.",
      risky: "Bash: Guarda le sessioni più recenti su staging",
    },
    full: {
      tag: "/mode full",
      note: "Nessun controllo, nessun pulsante. Solo la risposta quando ha finito.",
      ask: "sistema il test e2e del login che fallisce a caso",
      quote: "Il test clicca prima che venga impostato il cookie di sessione. Dorme 5s e spera.",
    },
    facts: [
      {
        t: "/mode",
        b: "Mostra un pulsante per ognuna delle altre modalità; /mode ask, /mode auto e /mode full cambiano subito. Le sessioni nuove partono in modalità «Automatico», a meno che la chat non abbia scelto altro in /settings → Nuove sessioni.",
      },
      {
        t: "Modalità «Chiedi» ⇄ «Automatico», al volo",
        b: "Niente riavvio, nemmeno mentre Claude lavora: aipager preme Shift+Tab nella sessione, e la scheda dice che sta cambiando finché Claude Code non conferma la nuova modalità.",
      },
      {
        t: "La modalità «Completo» riavvia",
        b: "Passare alla modalità «Completo», o uscirne, riavvia la sessione e la conversazione resta. Solo un admin può avviare una sessione in questa modalità, o farci passare una sessione già aperta (o tu, nella tua chat privata con il bot).",
      },
      {
        t: "Le domande arrivano lo stesso",
        b: "Una modalità vale per le richieste di permesso, non per le decisioni: quando Claude ti chiede qualcosa, i pulsanti arrivano nella tua chat in qualunque modalità.",
      },
    ],
  },

  places: {
    eyebrow: "Dove vive",
    title: "Tre chat. Tutto il resto è la tua vita.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Al lavoro · 3:14 · Read ×2 · Bash ×2",
        title: "La tua chat con Claude",
        body: "Una sola chat per tutte le sessioni. Per ogni attività una scheda in diretta che si aggiorna da sola, richieste a cui rispondi con un tocco, e una barra fissata che dice cosa ha bisogno di te. Un messaggio normale va alla sessione indicata nella barra; /web manda il prossimo a un'altra sessione, e da lì in poi parli con quella.",
      },
      {
        name: "backend-team",
        tag: "gruppo · uso in team",
        preview: "Sara: @aipagerbot /web esegui l'e2e del login su staging",
        title: "Il gruppo del tuo team",
        body: "Metti il bot in un gruppo e chiunque sia tra le persone consentite può menzionarlo. Ogni messaggio gira con il ruolo di chi lo manda; uno strumento che quel ruolo non può usare viene rifiutato prima di partire, e ogni decisione finisce nel log di audit con il nome di chi ha toccato il pulsante.",
      },
      {
        name: "Jim",
        tag: "la sua chat con il bot",
        preview: "web · Serve il tuo permesso",
        title: "Un'altra persona, nella sua chat",
        body: "Aggiungi la chat privata che una persona del tuo team ha con il bot e guiderà le proprie sessioni, con il suo ruolo e la sua cartella radice: le attività di Claude partono lì dentro e non leggono niente della tua cartella home fuori da lì. Chi deve solo guardare riceve read_only nel tuo gruppo.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<sessione> <messaggio>"],
      ["owner", "admin", "user", "read_only"],
      ["cartella radice dei membri", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Quattro ruoli, e una regola sugli strumenti per ogni ruolo.",
      lead: "Il ruolo che conta è quello che hai nella chat in cui stai scrivendo, e uno strumento che un ruolo non può usare viene rifiutato prima di partire, non ti viene chiesto. Niente su Telegram e niente nella Mini App cambia chi è tra le persone consentite: solo aipager config, sul computer.",
      can: "Può",
      rows: [
        "Mandare messaggi a una sessione",
        "«Consenti», «Nega», rispondere alle domande di Claude",
        "Bash, e tutto quello che esegue codice",
        "La modalità «Completo», le /settings di un gruppo, /update",
        "Dove possono lavorare le loro sessioni",
        "Leggere i file delle credenziali (~/.ssh, …)",
      ],
      anywhere: "ovunque",
      rootFolder: "cartella radice",
      ownChat: "chat privata",
      link: "L'uso in team, per intero",
    },
  },

  day: {
    eyebrow: "Giorno per giorno",
    title: "Usalo come una chat.",
    lead: "Non è una console travestita da chat: tutto quello che già fai su Telegram funziona qui. Parlaci mentre torni a casa, buttagli lo screenshot, manda il pensiero successivo prima che il precedente sia finito.",
    items: [
      {
        t: "Dillo a voce",
        b: "Manda un vocale: viene trascritto sul tuo computer (mai nel cloud di nessuno), ti torna indietro scritto così vedi cosa ha sentito, e finisce nella sessione come se l'avessi scritto tu.",
      },
      {
        t: "Uno screenshot del bug",
        b: "Foto e file finiscono in una cartella sul tuo computer e Claude riceve il percorso, con la tua didascalia come messaggio, o un «check this: …» quando non ce n'è una. Mandane diversi insieme e partono come un messaggio solo.",
      },
      {
        t: "Ti manda file",
        b: "Chiediglielo con parole tue, «mandami lo screenshot», e il file arriva nella chat di quella sessione subito dopo la risposta: le immagini come foto, video e audio così come sono, tutto il resto come file, e più di uno insieme come un unico album. Mai le impostazioni di aipager, le credenziali di Claude o le tue chiavi: vengono rifiutate prima che parta qualsiasi cosa.",
      },
      {
        t: "Manda subito il prossimo",
        b: "Il tuo messaggio arriva a Claude nel momento in cui lo mandi, anche a metà attività: 👀 mentre la coda di Claude lo tiene, 👍 quando Claude lo prende. «⚡ Invia ora» glielo passa senza aspettare la fine del passaggio.",
      },
      {
        t: "Mai letto come la risposta",
        b: "Un messaggio che mandi mentre c'è una richiesta di permesso aperta resta da parte, non finisce dentro la risposta, e va alla sessione appena hai risposto.",
      },
      {
        t: "Agenti e comandi in background, contati",
        b: "Ogni agente in background che Claude avvia ha la sua riga sulla scheda con quello che sta facendo, e un comando lasciato in background tiene il suo orologio finché non finisce.",
      },
      {
        t: "Te lo dice per primo",
        b: "Un avviso sul contesto, una compattazione, una sessione terminata o rimasta in silenzio, un'attività andata per le lunghe: la chat te lo dice senza che tu vada a guardare.",
      },
      {
        t: "I pulsanti sono già lì",
        b: "Sotto la casella del messaggio c'è una tastiera: un pulsante per ogni sessione in esecuzione, poi «status», «stop» e «new», poi «Template» per i messaggi che riscrivi sempre e «Comandi» per quelli che gestisce Claude Code.",
      },
      {
        t: "/status, tutta la chat insieme",
        b: "Tutte le sessioni in una lista su cui puoi agire: cosa fa ognuna, il suo modello, il contesto che resta, quanto è costata, cosa ha in coda, con «Ferma», «Rispondi» e il resto del menu su ognuna.",
      },
    ],
    heard: "Ho sentito:",
    said: "sistema il test e2e del login che fallisce a caso",
    /** what you ask for under the third one (Claude's caption is modes.auto.quote) */
    ask: "mandami lo screenshot",
  },

  app: {
    eyebrow: "La Mini App",
    title: "Una dashboard, sempre dentro Telegram.",
    lead: "/app apre tutte le sessioni in una volta sola: un riquadro per ognuna, con l'anello del contesto, la cartella, il modello e quanto ha speso. La chat resta il posto dove rispondi; l'app serve per vederle tutte insieme e per le cose che in chat sono scomode, come leggere un diff o cambiare un'impostazione.",
    tabs: { sessions: "Sessioni", settings: "Impostazioni" },
    summary: { needs: "ha bisogno di te", working: "al lavoro", resting: "pronta", spent: "spesi", finished: "terminate" },
    needsYou: "Hanno bisogno di te",
    answerInChat: "Rispondi nella chat",
    states: { working: "al lavoro", needs: "ha bisogno di te", resting: "pronta" },
    settings: {
      updates: "Aggiornamenti",
      upToDate: "Tutto è aggiornato.",
      check: "Cerca aggiornamenti",
      language: "Lingua dell'app",
      languageNote: "Solo i testi di aipager. Le risposte di Claude non cambiano.",
      chatPrefs: "Preferenze della chat",
      chatPrefsNote: "Valgono per tutte le sessioni di questa chat.",
      rows: [
        { k: "Come appare la risposta", v: "Scheda + risposta a parte" },
        { k: "Anteprime dei diff", v: "Disattivo" },
        { k: "Aggiorna scheda nelle attività lunghe", v: "Attivo" },
        { k: "Nuove sessioni" },
      ],
    },
    close: "Chiudi",
    facts: [
      {
        t: "Tutte le sessioni su uno schermo",
        b: "Un riquadro per ognuna, con l'anello del contesto, di chi è, il modello e quanto ha speso, e sopra una riga che dice come va la chat: quali sono al lavoro, quali sono pronte, quanto è costata la giornata, quante sono terminate. Il + ne avvia un'altra: un nome, una cartella fra quelle che usi già, un modello.",
      },
      {
        t: "Prima quello che ha bisogno di te",
        b: "Una sessione che aspetta la tua risposta a una richiesta di permesso o a una domanda sta in cima, con quello che sta chiedendo. «Rispondi nella chat» rimanda quella richiesta in fondo alla chat, pulsanti compresi, e lì rispondi.",
      },
      {
        t: "Una pagina per sessione",
        b: "Lo stato - «Al lavoro (3:12)» o «Pronta, ultima attività 5 min fa» - e un tocco per «Ferma» o «Riprendi». Sotto, gli ultimi strumenti usati, l'ultima risposta, il controllo del modello, i file che l'attività ha cambiato come diff, e le impostazioni di quella sessione.",
      },
      {
        t: "A servirla è aipager stesso",
        b: "È attiva di default, ogni richiesta viene controllata con la firma di Telegram, e la pagina non carica niente da fuori: niente font, niente script. aipager miniapp disable la spegne.",
      },
    ],
    link: "Cosa sa fare l'app",
  },

  langs: {
    eyebrow: "Quindici lingue",
    title: "Nella tua lingua, fino alle cifre.",
    lead: "Cambiano solo le parole di aipager: le schede, le richieste, i pulsanti, la barra fissata, /status, la Mini App, la documentazione. Le tue sessioni no: Claude risponde nella lingua in cui gli scrivi, e quello che aipager manda a Claude resta com'è. Scegline una con /language, o lascia che segua il tuo Telegram.",
    facts: [
      {
        t: "Da destra a sinistra, come si deve",
        b: "Il persiano e l'arabo si leggono da destra a sinistra, con le cifre persiane (۰-۹) o arabo-indiane (٠-٩) e i loro separatori, su Telegram e nella Mini App. I nomi delle sessioni, i percorsi, i comandi e il codice tengono la loro direzione.",
      },
      {
        t: "Scritte, non tradotte",
        b: "Ogni lingua è stata scritta come parla davvero chi usa le app in quella lingua, prestiti dall'inglese compresi, con le forme plurali di ciascuna (l'arabo ne ha sei).",
      },
      {
        t: "La tua chat, la tua lingua",
        b: "Una chat privata può seguire il tuo Telegram. Un gruppo ha una lingua sola, scelta da un admin, e il messaggio che compare dopo un tocco è nella lingua di chi ha toccato.",
      },
      {
        t: "Anche la documentazione",
        b: "Il README e tutte le pagine sotto docs/ sono tradotti. Quando una traduzione e la pagina inglese non vanno d'accordo, ha ragione la pagina inglese.",
      },
    ],
    pinned: "Messaggio fissato",
  },

  under: {
    eyebrow: "Sotto la chat",
    title: "La verità resta nel terminale.",
    lead: "Claude Code gira in un terminale vero, dentro dtach, così nessuno deve tenere una finestra aperta. Ogni passaggio fa partire un hook che manda un datagramma ad aipager su un socket locale, e aipager modifica un messaggio nella tua chat. Le tue risposte tornano indietro per la stessa strada: un verdetto all'hook che tiene ferma l'azione, oppure tasti battuti nella sessione.",
    nodes: [
      { t: "Claude Code", b: "dentro dtach, senza finestra" },
      { t: "hook", b: "parte a ogni passaggio" },
      { t: "aipager", b: "un processo, il tuo utente" },
      { t: "Telegram", b: "il token del tuo bot" },
      { t: "le tue chat", b: "la tua chat privata, il gruppo del tuo team" },
    ],
    facts: [
      {
        t: "Siediti al terminale quando vuoi",
        b: "aipager session api ti collega alla sessione in esecuzione da qualsiasi terminale. Scrivi lì, scrivi in chat: è la stessa sessione. Chiudi la finestra e la sessione va avanti, e il collegamento la segue anche quando si riavvia.",
      },
      {
        t: "Non legge mai il tuo schermo",
        b: "aipager scrive nella sessione e ascolta gli eventi di Claude Code. Quello che vedi in chat viene dagli hook e dalla conversazione salvata, non dallo schermo di un terminale.",
      },
      {
        t: "Niente aspetta la chat",
        b: "Un hook manda un datagramma e torna: circa 20 ms del tempo di Claude Code. Se aipager non sta ascoltando, l'evento viene semplicemente scartato e Claude va avanti; aipager poi si rimette in pari dai file della sessione.",
      },
    ],
    hooks: "Sedici hook, più la status line da cui legge il modello, il contesto e il costo. aipager è collegato a tutti quanti.",
  },

  trust: {
    eyebrow: "Sicurezza",
    title: "Niente in mezzo.",
    lead: "aipager non parla mai con Anthropic. L'unico che lo fa è Claude Code, con il tuo login, sul tuo computer. aipager lo avvia in un terminale e ascolta gli hook che Claude Code pubblica. Nessun endpoint ricavato per reverse engineering, nessun proxy, nessun account che non sia il tuo: la sessione che guidi dal telefono è la stessa che guideresti dalla tastiera.",
    cards: [
      {
        t: "Nessun server aipager.",
        b: "aipager parla con la Bot API di Telegram usando il token del tuo bot. Non esiste un account aipager né un servizio aipager, e fra il tuo telefono e il tuo computer non c'è il computer di nessun altro.",
      },
      {
        t: "Risponde solo alle tue chat.",
        b: "aipager risponde solo nelle chat elencate nella tua configurazione. Chi trova il bot per caso riceve una riga sola, «Questo bot non è configurato per parlare con te», e niente di quello che manda arriva a una sessione.",
      },
      {
        t: "Nessuna porta aperta.",
        b: "Ascolta solo su loopback. La Mini App esce da un tunnel Cloudflare dove ogni richiesta deve portare la firma di Telegram, e aipager miniapp disable la spegne.",
      },
      {
        t: "Il tuo token, il tuo file.",
        b: "Il token del bot e gli id delle chat stanno in ~/.config/aipager/aipager.yaml con permessi 600. Restano fuori dal log di aipager, e dove potrebbero finirci vengono oscurati.",
      },
      {
        t: "Non alza mai i privilegi.",
        b: "Niente sudo, niente setuid. Tutto quello che scrive sta nella tua cartella home, in /tmp o nella sua cartella dei socket, e ogni processo che avvia (claude, dtach, gli installer) gira come te.",
      },
      {
        t: "Decide sempre Claude Code.",
        b: "È il tuo settings.json a dire cosa va chiesto. aipager gira la domanda; non decide mai cosa può partire, e un pulsante rimasto da un'attività finita rifiuta invece di toccare il lavoro in corso.",
      },
      {
        t: "L'accesso si dà sul computer.",
        b: "Membri e ruoli cambiano solo con aipager config, sul computer. Niente su Telegram e niente nella Mini App può aggiungere una persona o allargare un ruolo.",
      },
      {
        t: "Ogni risposta resta scritta.",
        b: "Ogni «Consenti», ogni «Nega» e ogni risposta finisce in ~/.claude/aipager-audit.jsonl, che si può solo allungare, con il nome di chi ha toccato il pulsante in un gruppo.",
      },
    ],
    link: "Il modello di sicurezza",
  },

  install: {
    eyebrow: "Installazione",
    title: "Quattro righe. Tienile nei Messaggi salvati.",
    lead: "Tocca una riga per copiarla. Prima due cose: un bot tuo da @BotFather (premi «Avvia» nella sua chat), e Claude Code con il login fatto su questo computer. La procedura guidata della seconda riga ti chiede il resto.",
    agent: {
      title: "Oppure lascia fare all'agente che hai già.",
      lead: "Metti il token del bot in un file che l'agente non deve mai leggere, poi dai questo a Claude Code:",
      link: "La guida che userà",
    },
    saved: { name: "Messaggi salvati", count: "4 messaggi" },
    lines: [
      { note: "uv, pipx o Homebrew, quello che hai. Linux o macOS." },
      { note: "il token del bot da @BotFather, la tua chat, gli hook di Claude Code" },
      { note: "tiene su aipager anche dopo il logout" },
      { note: "Claude Code dentro dtach. Da qui in poi va avanti la chat." },
    ],
    copied: "Copiato",
    pm: "Preferisci il tuo package manager? uv, pipx, Homebrew, Docker, Nix, l'AUR e Snap.",
    pmLink: "tutti i modi per installarlo",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Chiedi pure.",
    readBack: "trascina per rileggere",
    items: [
      {
        q: "In cosa è diverso dalle app di Claude per il telefono?",
        a: "Le app di Claude parlano con l'assistente che Anthropic tiene sui suoi server. aipager rispecchia una sessione di Claude Code in esecuzione sul tuo computer: il tuo repo, i tuoi strumenti, il tuo ambiente.",
      },
      {
        q: "Il mio codice esce dal mio computer?",
        a: "Solo fino alle tue chat di Telegram. aipager parla con Telegram usando il token del tuo bot; in mezzo non c'è nessun server aipager.",
      },
      {
        q: "Mi possono bannare l'account Claude per questo?",
        a: "aipager non chiama mai Anthropic. Avvia la CLI ufficiale claude sul tuo computer e legge gli hook che Claude Code pubblica, e i tuoi messaggi vengono scritti in quella sessione esattamente come se fossi alla tastiera: nessun endpoint ricavato per reverse engineering, nessun proxy, nessun account condiviso, niente che passi dal server di qualcun altro. Quello che Anthropic vede è il tuo login di Claude Code che fa quello che già fa. Le loro regole d'uso valgono lo stesso per quello che gli chiedi, e un team su un bot solo condivide comunque il tuo abbonamento: per quello, fai girare aipager su un account suo o con una chiave a spesa limitata.",
      },
      {
        q: "Mi serve una VPN o una porta aperta?",
        a: "No. aipager interroga Telegram in uscita su HTTPS e non ascolta su nessuna porta fuori da loopback, quindi non c'è niente da aprire e niente da raggiungere dalla rete. Il tuo telefono parla con Telegram; Telegram parla con la connessione in uscita del tuo computer.",
      },
      {
        q: "E se Claude esce dai binari?",
        a: "Le richieste aspettano il tuo tocco, /stop interrompe l'attività e butta via quello che c'è in coda, /kill termina la sessione, e i pulsanti di un'attività finita rifiutano.",
      },
      {
        q: "Lo può usare il mio team?",
        a: "Sì. Metti il bot in un gruppo con i ruoli: owner, admin, user, read_only. Ogni messaggio gira con i permessi di chi lo manda, un membro senza can_manage lavora dentro la sua cartella radice, e ogni decisione finisce nel log di audit.",
      },
      {
        q: "Posso mandargli un vocale o uno screenshot?",
        a: "Tutti e due. Un vocale viene trascritto sul tuo computer e scritto nella sessione come se l'avessi scritto tu; una foto o un file viene salvato in locale e Claude riceve il percorso, con la tua didascalia come messaggio.",
      },
      {
        q: "Parla la mia lingua?",
        a: "Quindici, che scegli con /language o che seguono il tuo Telegram. Il persiano e l'arabo si leggono da destra a sinistra, con le loro cifre. Cambia solo il testo di aipager; Claude risponde nella lingua in cui gli scrivi.",
      },
      {
        q: "C'è una dashboard?",
        a: "/app apre una Mini App dentro Telegram: un riquadro per sessione, un visualizzatore di diff per ogni Write e ogni Edit, le impostazioni, un tocco per fermare una sessione. È attiva di default, ogni richiesta viene controllata con la firma di Telegram, e aipager miniapp disable la spegne.",
      },
      {
        q: "Cos'è dtach?",
        a: "Un programmino che stacca i terminali. Tiene vivo Claude Code dopo che il terminale si chiude o cade l'SSH, così una risposta che mandi un'ora dopo arriva lo stesso a una sessione in esecuzione. È incluso in aipager.",
      },
      {
        q: "Continua a funzionare dopo il logout?",
        a: "aipager service install tiene su aipager con systemd o launchd, e le sessioni vivono dentro dtach, quindi sopravvivono al terminale che le ha avviate. Ci sono anche le versioni Docker, Nix, AUR e Snap.",
      },
      {
        q: "Come lo aggiorno?",
        a: "/update controlla aipager e Claude Code e installa la versione nuova, poi «🔄 Riavvia ora» lo fa ripartire sul posto, che giri in un terminale, in tmux, in Docker o come servizio. Le tue sessioni continuano a girare nel frattempo.",
      },
      {
        q: "Quanto costa?",
        a: "Niente. La licenza è MIT, il bot è tuo, e Claude Code continua a usare il piano o la chiave che usa già.",
      },
    ],
  },

  cta: {
    title: "Aggiungi Claude alle tue chat.",
    lead: "Poi chiudi il terminale e vai a vivere la tua serata.",
    copy: "Copia",
  },

  footer: { changelog: "Novità", issues: "Issues" },

  docs: {
    title: "Documentazione",
    description: "Documentazione di riferimento di aipager: architettura, hook, comandi, risoluzione dei problemi, sicurezza.",
    onThisPage: "In questa pagina",
    translated: "Questa pagina è la traduzione della pagina inglese; se le due non vanno d'accordo, ha ragione quella inglese.",
    english: "Inglese",
    source: "L'originale su GitHub",
    onGitHub: "Queste pagine su GitHub",
    sourceNote: "Il markdown nel repo è lo stesso testo che stai leggendo.",
    prev: "Precedente",
    next: "Successiva",
    groups: ["Si parte da qui", "Riferimento", "Tenerlo in piedi"],
  },

  demo: {
    people: { you: "Tu" },
    typing: "sta scrivendo",
    isTyping: "sta scrivendo",
    days: { today: "Oggi", yesterday: "Ieri", monday: "Lunedì" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 membri, 3 online" },
      mom: { name: "Mamma", subtitle: "online" },
      friends: { name: "Calcetto del venerdì ⚽", subtitle: "9 membri" },
      sara: { name: "Sara", subtitle: "ultimo accesso di recente" },
      saved: { name: "Messaggi salvati", subtitle: "" },
    },
    folders: { all: "Tutte le chat", personal: "Personali", work: "Lavoro", bots: "Bot" },
    seed: {
      oldPrompt: "fai scadere le sessioni inattive dopo 30 minuti",
      oldAnswer: "Fatto. Ora lo store delle sessioni le fa scadere dopo 30 minuti di inattività; 212 test passano.",
      teamFlaky: "il login in prod fa di nuovo i capricci 😬 qualcuno?",
      teamSaw: "visto anche io, due volte nell'ultima ora",
      momEat: "Hai mangiato? 🙂",
      friendsPitch: "campo prenotato, venerdì alle 19",
      friendsIn: "ci sono 🙋",
      friendsBall: "ci sono, porto il pallone nuovo",
      saraMerged: "mergiata la tua PR 🚀",
      saraThanks: "grazieee",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "sì, ho fatto la pasta 🍝 tu?",
      momLunch: "domenica pranzo all'una? 😊",
      youLunch: "all'una ❤️",
      teamRun: "@aipagerbot /web esegui l'e2e del login su staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "chi c'è venerdì? ne mancano 2 ⚽",
      youIn: "ci sono 🙋‍♂️",
      saraVacation: "hai deciso per le vacanze? 🏖",
      youTwoMinutes: "due minuti 😄",
      youBook: "Lisbona, 12–19 marzo ☀️ voli 193 €, hotel 142 €",
      saraBook: "sìì, prenota 🎉",
    },
    prompts: {
      fix: "sistema il test e2e del login che fallisce a caso",
      trip: "una settimana a Lisbona a marzo: controlla prima il meteo, poi 3 hotel sotto i 180 € e i voli da Berlino. Se il meteo è brutto, prova Siviglia.",
      more: "lancia un paio di agenti: uno sugli hotel sotto i 180 €, uno sui voli da Berlino",
      push: "fai anche il push del branch del fix e apri la PR",
      teamRun: "esegui l'e2e del login su staging",
    },
    claude: {
      plan: "Faccio girare il test del login qualche volta e guardo dove fallisce.",
      flaky: "Fallisce circa una volta su cinque. È questione di tempi, non di logica.",
      cookie: "Il test clicca prima che venga impostato il cookie di sessione. Dorme 5s e spera.",
      answer: "Sistemato. Ora il test aspetta il cookie di sessione invece di dormire 5s. 10 giri di fila, tutti verdi.",
      teamTests: "18 test di login su 18 passano su staging. Lì il problema non si vede.",
      weather: "Prima il meteo: non ha senso cercare i prezzi per una settimana di pioggia.",
      lisbon: "Lisbona a marzo: 18 °C di giorno, pioggia 2 giorni su 7. Va bene così, Siviglia non serve.",
      pr: "Fatto il push di fix/login-cookie e aperta la PR #214. Ci sta girando la CI.",
      teamShort: "18 test di login su 18 passano su staging.",
      twoAgents: "Allora due agenti: uno per dormire, uno per volare.",
      interim: "Lisbona si fa: 18 °C, due giorni di pioggia. I due agenti sono fuori a cercare; torno con la lista.",
      shortlist:
        "Hotel: Casa Baleal 142 € a notte, Lx Boutique 165 €, Santa Justa 178 €, tutti a piedi dalla Baixa. Voli: TAP diretto, 89 € all'andata il 12 e 104 € al ritorno il 19. Dimmi e te li blocco.",
    },
    question: {
      verb: "Alzare il timeout o aspettare il cookie?",
      question: "Alzare il timeout, o aspettare il cookie?",
      options: ["Alzare il timeout", "Aspettare il cookie", "Tutti e due"],
      title: "Il fix",
      body: "Il test dorme 5s prima di cliccare.",
    },
    captions: {
      restAuto: "Una sessione di Claude Code pronta sul tuo portatile, in modalità «Automatico», da cui parte ogni sessione nuova.",
      restAsk: "Una sessione di Claude Code pronta sul tuo portatile, in modalità «Chiedi»: chiede prima di ogni azione.",
      restFull: "Una sessione di Claude Code pronta sul tuo portatile. Prima del prossimo lavoro, le togli i controlli.",
      held: "In pausa mentre ti guardi intorno. Lascia stare un attimo e la serata riprende.",
      arrived: "👀 vuol dire che è arrivato. aipager lo scrive nella sessione, esattamente come se fossi alla tastiera.",
      took: "👍 vuol dire che Claude l'ha preso. Da qui in poi è una scheda sola, che si aggiorna mentre l'attività va avanti.",
      glance: "Fa girare il test qualche volta. Ogni passaggio che fa aggiorna la stessa scheda.",
      momFirst: "Mamma ha scritto venti minuti fa. Qui niente ha bisogno di te, quindi le rispondi.",
      sent: "Mandato. Esci dalla chat, come fanno tutti.",
      workAuto:
        "Modalità «Automatico», da cui parte ogni sessione nuova: il controllo di sicurezza di Claude Code ha eseguito da solo la lettura e il test. Nessuno dei due è arrivato a te.",
      askRead: "Modalità «Chiedi»: ogni azione aspetta te. Questa vuole solo leggere un file.",
      askTest: "E di nuovo per il test. In modalità «Automatico» nessuna delle due avrebbe chiesto niente.",
      workFull: "Modalità «Completo»: Claude Code non chiede niente e aipager non ha niente da girarti. Vedi solo quello che ha fatto.",
      momAgain: "Mamma di nuovo. La sessione va avanti dietro di te; non le serve una finestra aperta.",
      team: "Il gruppo del team. Chiunque sia tra le persone consentite può menzionare il bot; ogni messaggio gira con il ruolo di chi lo manda.",
      teamSara:
        "Sara è admin in questo gruppo, quindi il suo test parte. Il messaggio arriva a Claude con il nome di chi l'ha mandato e il ruolo con cui gira.",
      teamSam: "Sam è user in questo gruppo. Bash non è consentito al suo ruolo, quindi l'azione viene rifiutata prima di partire.",
      questionAuto:
        "Adesso una cosa a cui puoi rispondere solo tu. Una modalità decide cosa parte senza chiedere; una domanda come questa ti arriva in ogni modalità.",
      questionAsk: "Una domanda, non un permesso: una decisione di Claude, con un pulsante per ogni opzione.",
      buzzed: "Il telefono ha vibrato sul bracciolo del divano. Tre pulsanti, un tocco.",
      answerTyped: "La tua risposta viene scritta nella sessione come se fossi alla tastiera.",
      friends: "Famiglia, amici, lavoro e Claude: una sola app, quella che guardi comunque.",
      answerDone: "Fatto. La risposta arriva come qualsiasi altro messaggio, e la barra fissata torna tranquilla.",
      evening: "Un test ballerino sistemato dal divano, tra una domanda di Mamma e una partita venerdì.",
      saraPing: "Non tutto quello che suona è lavoro.",
      second: "Una seconda sessione, avviata dalla chat: niente terminale, niente ssh.",
      newReady: "aipager la avvia sul tuo computer e te la ridà pronta, nella modalità in cui partono le sessioni nuove.",
      weather: "Controlla la cosa che decide tutto il resto, e dice cosa ha trovato.",
      queued: "Mandato mentre sta ancora lavorando: aipager glielo passa subito, Claude lo mette in coda, e il 👀 dice che è dentro.",
      queueLine: "La riga sotto dice cosa sta aspettando, e se la tocchi il messaggio arriva a Claude a metà passaggio.",
      tookIt:
        "Claude lo prende alla fine del passaggio: 👍, il grigio se ne va, la riga sparisce, e la scheda si sposta sotto il messaggio a cui risponde.",
      agents: "Ne manda fuori due insieme. Ognuno ha la sua riga, e la scheda segue quello che fa ciascuno.",
      agentsWork: "Adesso vanno per conto loro: qualche strumento a testa, e niente da fare per te.",
      twoSessions:
        "Adesso in questa chat vivono due sessioni. Un messaggio normale va alla sessione a cui vanno i tuoi messaggi; per raggiungere l'altra, rispondi a un suo messaggio.",
      hold: "Tienilo premuto, e Telegram ti mostra cosa puoi farci.",
      reply: "Rispondi. Ora la casella risponde a quel messaggio, e aipager capisce da lì dove mandarlo.",
      aimed: "Scritto in api, non in trip.",
      interim: "L'attività finisce prima di loro, quindi la risposta esce con sotto una riga in diretta per il lavoro ancora in corso.",
      apiFirst: "api risponde per prima; aveva solo quella cosa da fare.",
      liveLine: "aipager tiene aggiornata quella riga da solo mentre loro lavorano.",
      bothBack: "Tornati tutti e due. aipager unisce le righe in una sola e il lavoro degli agenti sveglia Claude con quello che hanno trovato.",
      shortlist: "Quello che hanno trovato torna come una risposta a sé, scritta dopo che Claude ha letto i due resoconti.",
      human: "Resta solo la parte che un computer non dovrebbe fare al posto tuo.",
      end: "Due sessioni, tre agenti e una settimana a Lisbona, da un divano. Niente rimasto in esecuzione, niente rimasto da toccare.",
      resting: "Questa sessione è pronta. Prima di darle il prossimo lavoro, le togli i controlli.",
      fullWho: "La modalità «Completo» è per gli admin, e per te, nella tua chat privata con il bot.",
      fullRestart:
        "Passare alla modalità «Completo», o uscirne, riavvia la sessione e la conversazione resta. Fra le modalità «Chiedi» e «Automatico» non si riavvia niente.",
    },
    switch: {
      default: "predefinito",
      lines: [
        "Ogni azione si ferma e aspetta il tuo tocco.",
        "Le azioni sicure partono da sole; quelle rischiose aspettano il tuo permesso.",
        "Non si ferma niente. Non chiede niente.",
      ],
    },
    cable: { idle: "in attesa di un'attività", quiet: "niente di nuovo", flick: "il cavo è vero · dagli un colpetto", daemon: "aipager" },
    wire: {
      cardEdited: "scheda aggiornata · Bash ×1",
      twoCalls: "due azioni, niente da toccare",
      trace: "la traccia, e cosa ha trovato",
      permNeeded: "🔐 Serve il tuo permesso",
      readRuns: "verdetto · parte la lettura",
      testRuns: "verdetto · parte il test",
      threeCalls: "tre azioni, nessun controllo",
      question: "❓ una domanda, con i pulsanti",
      answerTyped: "risposta scritta nella sessione",
      claudeAnswer: "💬 la risposta di Claude",
      sessionIn: "una sessione in ~/travel",
      typedTrip: "scritto in claude-trip",
      newCardTrip: "una scheda nuova · trip",
      lisbon: "Lisbona a marzo · 18 °C",
      queued: "claude-trip · in coda",
      tookIt: "l'ha preso · 👍",
      twoAgents: "🤖 due agenti",
      aimed: "diretto a claude-api",
      cardApi: "una scheda · api",
      interim: "💬 trip · una prima risposta",
      thePr: "💬 api · la PR",
      flightsDone: "✅ voli · 7 strumenti usati",
      hotelsDone: "✅ hotel · 11 strumenti usati",
      shortlist: "💬 trip · la lista",
      switchFull: "passare alla modalità «Completo»?",
      restarting: "si riavvia, la conversazione resta",
      typedApi: "scritto in claude-api",
      newCardApi: "una scheda nuova · api",
      yourMessage: "il tuo messaggio",
      aReply: "una risposta · api",
    },
    hints: {
      cancel: "«Annulla» lascerebbe api dov'è. Stasera si passa alla modalità «Completo»: prova con l'altro pulsante.",
      deny: "«Nega» bloccherebbe davvero l'azione. Stasera serve che il test parta: prova con «Consenti».",
      stop: "«Ferma» interromperebbe l'attività. Prova con «Consenti».",
    },
    menu: ["Rispondi", "Copia testo", "Fissa", "Inoltra", "Seleziona", "Elimina"],
    composer: "Scrivi un messaggio…",
    search: "Cerca",
  },
};
