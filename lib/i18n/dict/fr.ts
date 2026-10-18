import type { Dict } from "./types";

/**
 * French, written the way a good French app talks: plain, vous, short
 * sentences. The words for the product's own ideas (session, carte,
 * demande d'autorisation, Mode Automatique, a besoin de vous...) are the ones
 * aipager itself uses in Telegram, so the site and the bot speak alike.
 */
export const fr: Dict = {
  meta: {
    title: "aipager : Claude Code vous fait signe",
    description:
      "aipager fait tourner vos sessions Claude Code dans un terminal détaché et les affiche dans Telegram : regardez-les travailler, autorisez ce qu'elles demandent, envoyez le message suivant. Tout tourne sur votre ordinateur.",
  },

  nav: {
    modes: "Modes",
    app: "Mini App",
    how: "Le principe",
    install: "Installer",
    security: "Sécurité",
    faq: "FAQ",
    docs: "Docs",
    language: "Changer de langue",
  },

  hero: {
    title: "Claude, une discussion de plus.",
    lead: "aipager met vos sessions Claude Code dans Telegram, entre votre famille, vos amis et votre équipe. Tout tourne sur votre ordinateur.",
    agentInstall: "Laissez votre agent l'installer",
    docs: "Docs",
    security: "Sécurité",
    meta: "Linux et macOS · MIT · environ 1 min",
  },

  modes: {
    eyebrow: "Modes d'autorisation",
    title: "Trois modes. Vous démarrez en Mode Automatique.",
    lead: "Chaque session est dans l'un de ces trois modes. Le mode se règle session par session et se change à tout moment avec /mode. En Mode Demander, Claude demande avant chaque action. En Mode Automatique, celui où démarre chaque nouvelle session, la vérification de sécurité de Claude Code laisse passer les actions sûres et vous soumet les risquées. En Mode Accès complet, tout s'exécute sans aucune vérification. Un mode ne touche qu'aux demandes d'autorisation de Claude Code : dans un groupe, un outil que le rôle d'un membre n'a pas le droit d'utiliser reste refusé, quoi que dise le mode.",
    legend: [
      { k: "Autoriser", v: "cette action seulement" },
      { k: "Refuser", v: "Claude bloque l'action" },
      { k: "Toujours autoriser", v: "ajoute la règle que Claude propose, quand il en propose une" },
      { k: "Arrêter", v: "interrompt la tâche au lieu de répondre" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Chaque action attend votre réponse, même une lecture.",
      quote: "Je vais d'abord regarder le helper du cookie.",
      read: "Read: le helper du cookie",
      needs: "A besoin de votre autorisation",
    },
    auto: {
      tag: "par défaut",
      note: "La lecture du fichier et le lancement du test se sont faits sans vous. Une commande sur staging fait partie des actions risquées : elle s'arrête et vous demande.",
      quote: "Le test clique avant que le cookie de session soit posé.",
      risky: "Bash: Regarder les sessions les plus récentes sur staging",
    },
    full: {
      tag: "/mode full",
      note: "Aucune vérification, aucun bouton. Juste la réponse une fois que c'est fini.",
      ask: "corrige le test e2e de login instable",
      quote: "Le test clique avant que le cookie de session soit posé. Il attend 5 s et croise les doigts.",
    },
    facts: [
      {
        t: "/mode",
        b: "Affiche un bouton pour chacun des autres modes ; /mode ask, /mode auto et /mode full changent de mode tout de suite. Les nouvelles sessions démarrent en Mode Automatique, sauf si la discussion en a choisi un autre dans /settings → Nouvelles sessions.",
      },
      {
        t: "Mode Demander ⇄ Mode Automatique, sur place",
        b: "Aucun redémarrage, même pendant que Claude travaille : aipager appuie sur Shift+Tab dans la session, et la carte annonce le changement jusqu'à ce que Claude Code confirme le nouveau mode.",
      },
      {
        t: "Mode Accès complet : la session redémarre",
        b: "Passer en Mode Accès complet ou en sortir redémarre la session et garde la conversation. Seul un admin peut y lancer une session ou l'y faire passer (ou vous, dans votre discussion privée avec le bot).",
      },
      {
        t: "Les questions arrivent quand même",
        b: "Un mode s'applique aux demandes d'autorisation, pas aux décisions : quand Claude vous demande quelque chose, les boutons arrivent dans votre discussion quel que soit le mode.",
      },
    ],
  },

  places: {
    eyebrow: "Où ça se passe",
    title: "Trois discussions. Le reste, c'est votre vie.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Au travail · 3:14 · Read ×2 · Bash ×2",
        title: "Votre discussion avec Claude",
        body: "Une seule discussion pour toutes vos sessions. Une carte en direct par tâche, qui se met à jour toute seule, des demandes d'autorisation auxquelles vous répondez d'un appui, et une barre épinglée qui dit ce qui a besoin de vous. Un message normal va à la session que la barre nomme ; /web envoie le suivant ailleurs, et les messages d'après y vont aussi.",
      },
      {
        name: "backend-team",
        tag: "groupe · mode équipe",
        preview: "Sara: @aipagerbot /web lance le test e2e de login sur staging",
        title: "Le groupe de votre équipe",
        body: "Mettez le bot dans un groupe et toute personne autorisée peut le mentionner. Chaque message est traité avec le rôle de la personne qui l'envoie ; un outil que ce rôle n'a pas le droit d'utiliser est refusé avant de s'exécuter, et chaque décision part dans le log d'audit avec le nom de la personne qui a appuyé.",
      },
      {
        name: "Jim",
        tag: "sa propre discussion avec le bot",
        preview: "web · A besoin de votre autorisation",
        title: "Quelqu'un d'autre, dans sa propre discussion",
        body: "Ajoutez la discussion privée d'un collègue avec le bot et cette personne pilote ses propres sessions, avec son rôle et son propre dossier racine : ses tâches Claude démarrent dedans et ne lisent rien d'autre dans votre dossier personnel. Quelqu'un qui ne doit que regarder reçoit le rôle read_only dans votre groupe.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<session> <message>"],
      ["owner", "admin", "user", "read_only"],
      ["dossier racine des membres", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Quatre rôles, et une règle d'outils par rôle.",
      lead: "Le rôle qui compte est celui que vous avez dans la discussion où vous agissez, et un outil qu'un rôle n'a pas le droit d'utiliser est refusé avant de s'exécuter, sans demande d'autorisation. Rien dans Telegram ni dans la Mini App ne change qui est sur la liste : seulement aipager config, sur l'ordinateur.",
      can: "Peut",
      rows: [
        "Envoyer des messages à une session",
        "Autoriser, Refuser, répondre aux questions de Claude",
        "Bash, et tout ce qui exécute du code",
        "Mode Accès complet, les /settings d'un groupe, /update",
        "Où leurs sessions ont le droit de travailler",
        "Lire les fichiers d'identifiants (~/.ssh, …)",
      ],
      anywhere: "partout",
      rootFolder: "dossier racine",
      ownChat: "sa discussion",
      link: "Le mode équipe, en détail",
    },
  },

  day: {
    eyebrow: "Au quotidien",
    title: "Utilisez-le comme une discussion.",
    lead: "Pas une console déguisée en discussion : tout ce que vous faites déjà dans Telegram marche ici. Parlez-lui sur le chemin du retour, balancez-lui la capture d'écran, envoyez l'idée suivante avant que la précédente soit finie.",
    items: [
      {
        t: "Dites-le plutôt que de l'écrire",
        b: "Envoyez un message vocal : il est transcrit sur votre propre ordinateur (jamais dans le cloud de qui que ce soit), renvoyé par écrit pour que vous voyiez ce qu'aipager a entendu, et tapé dans la session comme si vous l'aviez écrit.",
      },
      {
        t: "Une capture du bug",
        b: "Les photos et les fichiers arrivent dans un dossier sur votre ordinateur et Claude reçoit le chemin, avec votre légende comme message, ou « check this: … » quand il n'y en a pas. Envoyez-en plusieurs d'un coup et ils partent en un seul message.",
      },
      {
        t: "Il vous renvoie des fichiers",
        b: "Demandez-le avec vos propres mots, « envoie-moi la capture d'écran », et le fichier arrive dans le chat de cette session juste après la réponse : les images en photos, les vidéos et l'audio tels quels, le reste en fichier, et plusieurs d'un coup en un seul album. Jamais les réglages d'aipager, les identifiants de Claude ni vos clés : ils sont refusés avant tout envoi.",
      },
      {
        t: "Envoyez le suivant tout de suite",
        b: "Votre message part vers Claude au moment où vous l'envoyez, même en pleine tâche : 👀 pendant que la file d'attente de Claude le garde, 👍 quand Claude le prend. ⚡ Envoyer maintenant le lui passe sans attendre la fin de l'étape.",
      },
      {
        t: "Jamais lu comme la réponse",
        b: "Un message envoyé pendant qu'une demande d'autorisation est ouverte est mis de côté, pas mélangé à la demande, et part vers la session dès que vous avez répondu.",
      },
      {
        t: "Agents et commandes en arrière-plan, comptés",
        b: "Chaque agent en arrière-plan que Claude lance a sa propre ligne sur la carte avec ce qu'il fait, et une commande qui tourne en arrière-plan garde son propre chrono jusqu'à ce qu'elle se termine.",
      },
      {
        t: "La discussion vous prévient",
        b: "Un avertissement de contexte, un compactage, une session terminée ou devenue silencieuse, une tâche qui a duré plus que de raison : la discussion vous le dit sans que vous ayez à aller voir.",
      },
      {
        t: "Les boutons sont déjà là",
        b: "Un clavier est posé sous la zone de message : un bouton par session en cours, puis status, stop et new, puis Modèles › pour les messages que vous retapez sans cesse et Commandes › pour celles que Claude Code gère lui-même.",
      },
      {
        t: "/status, toute la discussion d'un coup",
        b: "Toutes les sessions en une liste sur laquelle vous pouvez agir : ce que chacune fait, son modèle, le contexte qui reste, ce qu'elle a coûté, ce qui attend derrière elle, avec Arrêter, Répondre et le reste du menu sur chacune.",
      },
    ],
    heard: "J'ai entendu :",
    said: "corrige le test e2e de login instable",
    /** what you ask for under the third one (Claude's caption is modes.auto.quote) */
    ask: "envoie-moi la capture d'écran",
  },

  app: {
    eyebrow: "La Mini App",
    title: "Un tableau de bord, toujours dans Telegram.",
    lead: "/app affiche toutes les sessions d'un coup : une tuile chacune, avec son anneau de contexte, son dossier, son modèle et ce qu'elle a dépensé. C'est toujours dans la discussion que vous répondez ; l'app sert à les voir toutes ensemble, et à ce qu'une discussion fait mal, comme lire un diff ou changer un paramètre.",
    tabs: { sessions: "Sessions", settings: "Paramètres" },
    summary: { needs: "a besoin de vous", working: "au travail", resting: "prête", spent: "dépensés", finished: "terminées" },
    needsYou: "Ont besoin de vous",
    answerInChat: "Répondre dans la discussion",
    states: { working: "au travail", needs: "a besoin de vous", resting: "prête" },
    settings: {
      updates: "Mises à jour",
      upToDate: "Tout est à jour.",
      check: "Rechercher des mises à jour",
      language: "Langue de l'app",
      languageNote: "Seulement le texte d'aipager. Les réponses de Claude ne changent pas.",
      chatPrefs: "Paramètres de la discussion",
      chatPrefsNote: "Ils s'appliquent à toutes les sessions de cette discussion.",
      rows: [
        { k: "Affichage de la réponse", v: "Carte + réponse à part" },
        { k: "Aperçus des diffs", v: "Désactivé" },
        { k: "Mise à jour de carte (tâches longues)", v: "Activé" },
        { k: "Nouvelles sessions" },
      ],
    },
    close: "Fermer",
    facts: [
      {
        t: "Toutes les sessions sur un écran",
        b: "Une tuile chacune, avec son anneau de contexte, à qui elle est, le modèle et ce qu'elle a dépensé, et au-dessus une ligne qui dit où en est la discussion : celles qui travaillent, celles qui sont prêtes, ce que la journée a coûté, combien sont terminées. Le + en lance une autre : un nom, un dossier parmi ceux que vous utilisez déjà, un modèle.",
      },
      {
        t: "Ce qui a besoin de vous, en premier",
        b: "Une session qui attend votre réponse (une demande d'autorisation ou une question) passe en haut avec ce qu'elle demande. « Répondre dans la discussion » renvoie cette demande tout en bas de la discussion, boutons compris, et vous y répondez là.",
      },
      {
        t: "Une page par session",
        b: "La ligne d'état, « Au travail (3:12) » ou « Prête, dernière activité il y a 5 min », et un appui pour Arrêter ou Reprendre. En dessous, les derniers outils utilisés, la dernière réponse, le réglage du modèle, le diff des fichiers que la tâche a modifiés, et les paramètres de cette session.",
      },
      {
        t: "Servie par aipager lui-même",
        b: "Activée par défaut, chaque requête vérifiée avec la signature de Telegram, et la page ne charge rien d'ailleurs : ni polices, ni scripts. aipager miniapp disable la désactive.",
      },
    ],
    link: "Ce que l'app sait faire",
  },

  langs: {
    eyebrow: "Quinze langues",
    title: "Dans votre langue, jusqu'aux chiffres.",
    lead: "Seuls les mots d'aipager changent : les cartes, les demandes d'autorisation, les boutons, la barre épinglée, /status, la Mini App, la doc. Vos sessions, non : Claude répond dans la langue où vous lui écrivez, et ce qu'aipager envoie à Claude part tel quel. Choisissez-en une avec /language, ou laissez aipager suivre la langue de votre app Telegram.",
    facts: [
      {
        t: "De droite à gauche, pour de vrai",
        b: "Le persan et l'arabe se lisent de droite à gauche, avec les chiffres persans (۰-۹) ou indo-arabes (٠-٩) et leurs propres séparateurs, dans Telegram comme dans la Mini App. Les noms de session, les chemins, les commandes et le code gardent leur sens de lecture.",
      },
      {
        t: "Écrit, pas traduit",
        b: "Chaque langue a été écrite comme la parlent vraiment les gens qui utilisent des apps, anglicismes compris, avec ses propres formes de pluriel (l'arabe en a six).",
      },
      {
        t: "Votre discussion, votre langue",
        b: "Une discussion privée peut suivre votre app Telegram. Un groupe a une seule langue, choisie par un admin, et la fenêtre qui s'ouvre après un appui est dans la langue de la personne qui a appuyé.",
      },
      {
        t: "La doc aussi",
        b: "Le README et toutes les pages de docs/ sont traduits. Quand une traduction et la page anglaise ne disent pas la même chose, c'est la page anglaise qui fait foi.",
      },
    ],
    pinned: "Message épinglé",
  },

  under: {
    eyebrow: "Sous la discussion",
    title: "Le terminal reste la source de vérité.",
    lead: "Claude Code tourne dans un vrai terminal, dans dtach, donc personne n'a besoin de laisser une fenêtre ouverte. Chaque étape déclenche un hook qui envoie un datagramme à aipager par un socket local, et aipager met à jour un message dans votre discussion. Vos réponses reviennent par le même chemin : un verdict au hook qui retient l'action, ou des touches tapées dans la session.",
    nodes: [
      { t: "Claude Code", b: "dans dtach, aucune fenêtre à garder" },
      { t: "hook", b: "se déclenche à chaque étape" },
      { t: "aipager", b: "un seul processus, sous votre utilisateur" },
      { t: "Telegram", b: "le token de votre propre bot" },
      { t: "vos discussions", b: "votre discussion privée, le groupe de votre équipe" },
    ],
    facts: [
      {
        t: "Asseyez-vous devant quand vous voulez",
        b: "aipager session api s'attache à la session en cours depuis n'importe quel terminal. Tapez dans le terminal ou dans la discussion : c'est la même session. Fermez la fenêtre et la session continue, et si la session redémarre, votre terminal la suit.",
      },
      {
        t: "Il ne lit jamais votre écran",
        b: "aipager tape dans la session et écoute les événements de Claude Code. Ce que votre discussion affiche vient des hooks et de la conversation enregistrée, pas de l'écran d'un terminal.",
      },
      {
        t: "Rien n'attend la discussion",
        b: "Un hook envoie un datagramme et rend la main : environ 20 ms du temps de Claude Code. Si aipager n'écoute pas, l'événement est simplement perdu et Claude continue ; aipager rattrape ensuite son retard grâce aux fichiers de la session.",
      },
    ],
    hooks: "Seize hooks, et la ligne d'état d'où aipager tire le modèle, le contexte et le coût. Il est branché sur tous.",
  },

  trust: {
    eyebrow: "Sécurité",
    title: "Rien au milieu.",
    lead: "aipager ne parle jamais à Anthropic. Le seul qui le fait, c'est Claude Code lui-même, avec votre propre compte, sur votre propre ordinateur. aipager le lance dans un terminal et écoute les hooks que Claude Code publie. Aucun endpoint reconstitué par rétro-ingénierie, aucun proxy, aucun compte en dehors du vôtre : la session que vous pilotez depuis votre téléphone est celle que vous piloteriez au clavier.",
    cards: [
      {
        t: "Pas de serveur aipager.",
        b: "aipager parle à la Bot API de Telegram avec le token de votre propre bot. Il n'y a pas de compte aipager, pas de service aipager, et aucun ordinateur tiers entre votre téléphone et le vôtre.",
      },
      {
        t: "Il ne répond qu'à vos discussions.",
        b: "aipager ne répond que dans les discussions listées dans votre configuration. Un inconnu qui tombe sur le bot reçoit une ligne disant que le bot n'est pas configuré pour lui parler ; rien de ce qu'il envoie n'atteint une session.",
      },
      {
        t: "Aucun port ouvert.",
        b: "Il n'écoute que sur loopback. La Mini App sort par un tunnel Cloudflare où chaque requête doit porter la signature de Telegram, et aipager miniapp disable la désactive.",
      },
      {
        t: "Votre token, votre fichier.",
        b: "Le token du bot et les ids des discussions vivent dans ~/.config/aipager/aipager.yaml, avec les droits 600. Ils sont tenus hors du log d'aipager, et masqués partout où ils pourraient s'y glisser.",
      },
      {
        t: "Aucune élévation de privilèges.",
        b: "Pas de sudo, pas de setuid. Tout ce qu'il écrit est sous votre dossier personnel, dans /tmp ou dans son propre dossier de sockets, et tout ce qu'il lance (claude, dtach, les installateurs) tourne sous votre utilisateur.",
      },
      {
        t: "Claude Code décide toujours.",
        b: "C'est votre settings.json qui dit ce qui doit être demandé. aipager transmet la demande ; il ne décide jamais ce qui a le droit de s'exécuter, et un bouton d'une tâche déjà terminée refuse au lieu d'agir sur le travail en cours.",
      },
      {
        t: "L'accès se donne sur l'ordinateur.",
        b: "Les membres et les rôles ne changent qu'avec aipager config, sur l'ordinateur. Rien dans Telegram ni dans la Mini App ne peut ajouter une personne ou élargir un rôle.",
      },
      {
        t: "Chaque réponse est consignée.",
        b: "Chaque Autoriser, chaque Refuser et chaque réponse part dans ~/.claude/aipager-audit.jsonl, qui ne fait que grandir, avec le nom de la personne qui a appuyé dans un groupe.",
      },
    ],
    link: "Le modèle de sécurité",
  },

  install: {
    eyebrow: "Installation",
    title: "Quatre lignes. Gardez-les dans Messages enregistrés.",
    lead: "Appuyez sur une ligne pour la copier. Deux choses d'abord : un bot à vous depuis @BotFather (appuyez sur Démarrer dans sa discussion), et Claude Code connecté sur cet ordinateur. L'assistant de la deuxième ligne demande le reste.",
    agent: {
      title: "Ou confiez-le à l'agent que vous avez déjà.",
      lead: "Mettez le token du bot dans un fichier qu'il n'aura jamais à lire, puis donnez ceci à Claude Code :",
      link: "Le guide qu'il suit",
    },
    saved: { name: "Messages enregistrés", count: "4 messages" },
    lines: [
      { note: "uv, pipx ou Homebrew, celui que vous avez. Linux ou macOS." },
      { note: "le token de votre bot depuis @BotFather, votre discussion, les hooks de Claude Code" },
      { note: "garde aipager en marche après votre déconnexion" },
      { note: "Claude Code dans dtach. Votre discussion prend le relais." },
    ],
    copied: "Copié",
    pm: "Vous préférez votre gestionnaire de paquets ? uv, pipx, Homebrew, Docker, Nix, l'AUR et Snap.",
    pmLink: "toutes les façons d'installer",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Posez vos questions.",
    readBack: "faites glisser pour relire",
    items: [
      {
        q: "En quoi est-ce différent des apps mobiles de Claude ?",
        a: "Les apps de Claude parlent à l'assistant hébergé par Anthropic. aipager vous montre une session Claude Code qui tourne sur votre propre ordinateur : votre dépôt, vos outils, votre environnement.",
      },
      {
        q: "Est-ce que mon code quitte mon ordinateur ?",
        a: "Seulement jusqu'à vos propres discussions Telegram. aipager parle à Telegram avec le token de votre propre bot ; il n'y a aucun serveur aipager entre les deux.",
      },
      {
        q: "Est-ce que ça peut faire bannir mon compte Claude ?",
        a: "aipager n'appelle jamais Anthropic. Il lance le CLI officiel claude sur votre ordinateur et lit les hooks que Claude Code publie, et vos messages sont tapés dans cette session exactement comme si vous étiez au clavier : aucun endpoint reconstitué par rétro-ingénierie, aucun proxy, aucun compte partagé, rien qui passe par le serveur de quelqu'un d'autre. Ce qu'Anthropic voit, c'est votre propre compte Claude Code en train de faire ce qu'il fait déjà. Les règles d'utilisation d'Anthropic s'appliquent toujours à ce que vous lui demandez, et une équipe sur un seul bot partage toujours votre abonnement : pour ça, faites tourner aipager sur un compte à part ou avec une clé API au budget plafonné.",
      },
      {
        q: "Ai-je besoin d'un VPN ou d'un port ouvert ?",
        a: "Non. aipager interroge Telegram vers l'extérieur en HTTPS et n'écoute sur aucun port en dehors de loopback : il n'y a rien à ouvrir et rien à atteindre depuis le réseau. Votre téléphone parle à Telegram ; Telegram parle à la connexion sortante de votre ordinateur.",
      },
      {
        q: "Et si Claude part en vrille ?",
        a: "Les demandes d'autorisation attendent votre appui, /stop interrompt la tâche et vide la file d'attente, /kill termine la session, et les boutons d'une tâche déjà terminée refusent.",
      },
      {
        q: "Mon équipe peut-elle l'utiliser ?",
        a: "Oui. Mettez le bot dans un groupe avec des rôles : owner, admin, user, read_only. Chaque message est traité avec les autorisations de la personne qui l'envoie, un membre sans can_manage travaille dans son propre dossier racine, et chaque décision est consignée.",
      },
      {
        q: "Puis-je lui envoyer un message vocal ou une capture d'écran ?",
        a: "Les deux. Un message vocal est transcrit sur votre ordinateur et tapé dans la session comme si vous l'aviez écrit ; une photo ou un fichier est enregistré sur place et Claude reçoit le chemin, avec votre légende comme message.",
      },
      {
        q: "Est-ce qu'il parle ma langue ?",
        a: "Quinze, choisies avec /language ou reprises de votre app Telegram. Le persan et l'arabe se lisent de droite à gauche, avec leurs propres chiffres. Seul le texte d'aipager change ; Claude répond dans la langue où vous lui écrivez.",
      },
      {
        q: "Y a-t-il un tableau de bord ?",
        a: "/app ouvre une Mini App dans Telegram : une tuile par session, un visualiseur de diffs pour chaque Write et chaque Edit, les paramètres, un appui pour arrêter. Elle est activée par défaut, chaque requête est vérifiée avec la signature de Telegram, et aipager miniapp disable la désactive.",
      },
      {
        q: "C'est quoi dtach ?",
        a: "Un tout petit programme qui détache un terminal. Il garde Claude Code en marche après la fermeture du terminal ou la coupure du SSH, donc une réponse envoyée une heure plus tard atteint encore une session en cours. Il est fourni avec aipager.",
      },
      {
        q: "Est-ce que ça continue de tourner quand je me déconnecte ?",
        a: "aipager service install garde aipager en marche sous systemd ou launchd, et les sessions elles-mêmes vivent dans dtach : elles survivent au terminal qui les a lancées. Il y a aussi des versions Docker, Nix, AUR et Snap.",
      },
      {
        q: "Comment le mettre à jour ?",
        a: "/update vérifie aipager et Claude Code et installe la nouvelle version, puis 🔄 Redémarrer maintenant le relance sur place, qu'il tourne dans un terminal, dans tmux, dans Docker ou comme service. Vos sessions continuent de tourner pendant ce temps.",
      },
      {
        q: "Combien ça coûte ?",
        a: "Rien. C'est sous licence MIT, le bot est à vous, et Claude Code continue d'utiliser le forfait ou la clé qu'il utilise déjà.",
      },
    ],
  },

  cta: {
    title: "Ajoutez Claude à vos discussions.",
    lead: "Puis fermez le terminal et allez vivre votre soirée.",
    copy: "Copier",
  },

  footer: { changelog: "Changelog", issues: "Issues" },

  docs: {
    title: "Docs",
    description: "Documentation de référence pour aipager : architecture, hooks, commandes, dépannage, sécurité.",
    onThisPage: "Sur cette page",
    translated: "Cette page est une traduction de la page anglaise ; si les deux ne disent pas la même chose, c'est la version anglaise qui fait foi.",
    english: "Anglais",
    source: "La source sur GitHub",
    onGitHub: "Ces pages sur GitHub",
    sourceNote: "Le markdown du dépôt est exactement le texte que vous lisez.",
    prev: "Précédent",
    next: "Suivant",
    groups: ["Commencer ici", "Référence", "Le faire tourner"],
  },

  demo: {
    people: { you: "Vous" },
    typing: "en train d'écrire",
    isTyping: "est en train d'écrire",
    days: { today: "Aujourd'hui", yesterday: "Hier", monday: "Lundi" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 membres, 3 en ligne" },
      mom: { name: "Maman", subtitle: "en ligne" },
      friends: { name: "Foot vendredi ⚽", subtitle: "9 membres" },
      sara: { name: "Sara", subtitle: "vu récemment" },
      saved: { name: "Messages enregistrés", subtitle: "" },
    },
    folders: { all: "Toutes les discussions", personal: "Perso", work: "Travail", bots: "Bots" },
    seed: {
      oldPrompt: "fais expirer les sessions inactives au bout de 30 minutes",
      oldAnswer: "C'est fait. Le store de sessions expire maintenant les sessions inactives au bout de 30 minutes ; les 212 tests passent.",
      teamFlaky: "le login en prod est encore instable 😬 quelqu'un ?",
      teamSaw: "vu aussi, deux fois dans la dernière heure",
      momEat: "Tu as mangé ? 🙂",
      friendsPitch: "terrain réservé, vendredi 19h",
      friendsIn: "je viens 🙋",
      friendsBall: "je viens, j'apporte le nouveau ballon",
      saraMerged: "j'ai mergé ta PR 🚀",
      saraThanks: "merciii",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "oui, pâtes maison 🍝 et toi ?",
      momLunch: "déjeuner dimanche à 13h ? 😊",
      youLunch: "13h ❤️",
      teamRun: "@aipagerbot /web lance le test e2e de login sur staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "qui vient vendredi ? il en manque 2 ⚽",
      youIn: "je viens 🙋‍♂️",
      saraVacation: "tu as décidé pour les vacances ? 🏖",
      youTwoMinutes: "deux minutes 😄",
      youBook: "Lisbonne, 12–19 mars ☀️ vols 193 €, hôtel 142 €",
      saraBook: "ouiii réserve 🎉",
    },
    prompts: {
      fix: "corrige le test e2e de login instable",
      trip: "une semaine à Lisbonne en mars : regarde d'abord la météo, puis 3 hôtels à moins de 180 € et des vols depuis Berlin. Si la météo s'annonce mauvaise, essaie Séville.",
      more: "lance deux agents là-dessus : un sur les hôtels à moins de 180 €, un sur les vols depuis Berlin",
      push: "pousse aussi la branche du correctif et ouvre la PR",
      teamRun: "lance le test e2e de login sur staging",
    },
    claude: {
      plan: "Je vais lancer le test de login plusieurs fois et regarder où il échoue.",
      flaky: "Il échoue environ une fois sur cinq. Un problème de timing, pas de logique.",
      cookie: "Le test clique avant que le cookie de session soit posé. Il attend 5 s et croise les doigts.",
      answer: "Corrigé. Le test n'attend plus 5 s : il attend le cookie de session. 10 fois d'affilée, tout est vert.",
      teamTests: "18 tests de login sur 18 passent sur staging. Le problème ne se voit pas là-bas.",
      weather: "La météo d'abord : inutile de chiffrer une semaine de pluie.",
      lisbon: "Lisbonne en mars : 18 °C en journée, de la pluie 2 jours sur 7. Ça ira, pas besoin de Séville.",
      pr: "J'ai poussé fix/login-cookie et ouvert la PR #214. La CI tourne dessus.",
      teamShort: "18 tests de login sur 18 passent sur staging.",
      twoAgents: "Deux agents alors : un sur les lits, un sur les sièges.",
      interim: "Lisbonne est validée : 18 °C, deux jours de pluie. Les deux agents cherchent ; je reviens avec la sélection.",
      shortlist:
        "Hôtels : Casa Baleal 142 € la nuit, Lx Boutique 165 €, Santa Justa 178 €, tous à deux pas de la Baixa. Vols : TAP direct, 89 € à l'aller le 12 et 104 € au retour le 19. Un mot de vous et je bloque les deux.",
    },
    question: {
      verb: "Augmenter le timeout ou attendre le cookie ?",
      question: "Augmenter le timeout, ou attendre le cookie ?",
      options: ["Augmenter le timeout", "Attendre le cookie", "Les deux"],
      title: "Correctif",
      body: "Le test attend 5 s avant de cliquer.",
    },
    captions: {
      restAuto: "Une session Claude Code prête sur votre ordinateur, en Mode Automatique, celui où démarre chaque nouvelle session.",
      restAsk: "Une session Claude Code prête sur votre ordinateur, en Mode Demander : elle demande avant chaque action.",
      restFull: "Une session Claude Code prête sur votre ordinateur. Avant la prochaine tâche, vous lui enlevez ses vérifications.",
      held: "En pause, le temps que vous regardiez. Ne touchez à rien un instant et la soirée reprend.",
      arrived: "👀 veut dire que c'est arrivé. aipager le tape dans la session, exactement comme si vous étiez au clavier.",
      took: "👍 veut dire que Claude l'a pris. À partir de là, c'est une seule carte, qui se met à jour toute seule pendant la tâche.",
      glance: "Il lance le test plusieurs fois. Chaque étape met à jour la même carte.",
      momFirst: "Maman a écrit il y a vingt minutes. Rien ici n'a besoin de vous, alors vous lui répondez.",
      sent: "Envoyé. Vous quittez la discussion, comme tout le monde.",
      workAuto:
        "Mode Automatique, celui où démarre chaque nouvelle session : la vérification de sécurité de Claude Code a laissé passer d'elle-même la lecture du fichier et le lancement du test. Aucun des deux n'est venu jusqu'à vous.",
      askRead: "Mode Demander : chaque action attend votre réponse. Celle-ci veut seulement lire un fichier.",
      askTest: "Et encore une fois pour lancer le test. En Mode Automatique, ces deux actions seraient passées sans rien demander.",
      workFull: "Mode Accès complet : Claude Code ne demande rien et aipager n'a rien à transmettre. Vous voyez seulement ce qu'il a fait.",
      momAgain: "Encore Maman. La session continue derrière vous ; elle n'a besoin d'aucune fenêtre ouverte.",
      team: "Le groupe de l'équipe. Toute personne autorisée peut mentionner le bot ; chaque message est traité avec le rôle de la personne qui l'envoie.",
      teamSara:
        "Sara est admin dans ce groupe, donc son test se lance. Le message arrive à Claude avec le nom de la personne qui l'a envoyé et le rôle sous lequel il est traité.",
      teamSam: "Sam est user dans ce groupe. Son rôle n'a pas le droit d'utiliser Bash, donc l'action est refusée avant de s'exécuter.",
      questionAuto:
        "Maintenant quelque chose que personne d'autre que vous ne peut trancher. Un mode décide ce qui s'exécute sans demander ; une question comme celle-ci vous arrive dans tous les modes.",
      questionAsk: "Une question, pas une autorisation : une décision de Claude, avec un bouton par option.",
      buzzed: "Votre téléphone a vibré sur l'accoudoir du canapé. Trois boutons, un appui.",
      answerTyped: "Votre réponse est tapée dans la session comme si vous étiez au clavier.",
      friends: "La famille, les amis, le travail et Claude : une seule app, celle que vous ouvrez de toute façon.",
      answerDone: "C'est fait. La réponse arrive comme n'importe quel autre message, et la barre épinglée se tait.",
      evening: "Un test instable corrigé depuis le canapé, entre une question de Maman et un match vendredi.",
      saraPing: "Tout ce qui sonne n'est pas du travail.",
      second: "Une deuxième session, lancée depuis la discussion : pas de terminal, pas de ssh.",
      newReady: "aipager la lance sur votre ordinateur et vous la rend, prête, dans le mode où démarrent les nouvelles sessions.",
      weather: "Il vérifie ce qui décide de tout le reste, et dit ce qu'il a trouvé.",
      queued: "Envoyé pendant qu'il travaille encore : aipager le passe tout de suite, Claude le met en file d'attente, et le 👀 dit qu'il est bien arrivé.",
      queueLine: "La ligne en dessous dit ce qu'il attend, et un appui dessus passe le message à Claude en pleine étape.",
      tookIt:
        "Claude le prend à la fin de l'étape : 👍, le gris s'en va, la ligne disparaît, et la carte passe sous le message auquel elle répond.",
      agents: "Il en envoie deux d'un coup. Chacun a sa propre ligne, et la carte suit ce que chacun fait.",
      agentsWork: "Ils sont partis de leur côté maintenant : quelques outils utilisés chacun, et rien à faire pour vous.",
      twoSessions:
        "Deux sessions vivent dans cette discussion maintenant. Un message normal va à celle qui reçoit vos messages ; pour atteindre l'autre, vous répondez à un de ses messages.",
      hold: "Appui long, et Telegram propose ce que vous pouvez en faire.",
      reply: "Répondre. Le message que vous écrivez répond à celui-là, et aipager y lit la destination.",
      aimed: "Tapé dans api, pas dans trip.",
      interim: "La tâche se termine avant eux, donc la réponse part avec une ligne en direct en dessous pour le travail qui continue.",
      apiFirst: "api répond en premier ; elle n'avait que cette seule chose à faire.",
      liveLine: "aipager garde cette ligne à jour tout seul pendant qu'ils travaillent.",
      bothBack: "Les deux sont revenus. aipager replie les deux lignes en une seule et la tâche réveille Claude avec ce qu'ils ont trouvé.",
      shortlist: "Ce qu'ils ont trouvé revient comme une réponse à part entière, écrite une fois que Claude a lu les deux rapports.",
      human: "Il ne reste plus que la partie qu'une machine ne devrait pas faire à votre place.",
      end: "Deux sessions, trois agents et une semaine à Lisbonne, depuis un canapé. Rien qui tourne encore, aucun bouton qui attend.",
      resting: "Cette session est prête. Avant de lui donner la prochaine tâche, vous lui enlevez ses vérifications.",
      fullWho: "Le Mode Accès complet est pour les admins, et pour vous, dans votre discussion privée avec le bot.",
      fullRestart:
        "Passer en Mode Accès complet ou en sortir redémarre la session et garde la conversation. Entre les modes Demander et Automatique, rien ne redémarre du tout.",
    },
    switch: {
      default: "par défaut",
      lines: [
        "Chaque action s'arrête et attend votre appui.",
        "Les actions sûres s'exécutent seules ; les risquées attendent votre autorisation.",
        "Rien ne s'arrête. Rien ne demande.",
      ],
    },
    cable: { idle: "en attente d'une tâche", quiet: "rien de nouveau", flick: "le câble est réel · donnez-lui une pichenette", daemon: "aipager" },
    wire: {
      cardEdited: "carte mise à jour · Bash ×1",
      twoCalls: "deux actions, rien à valider",
      trace: "la trace, et ce qu'elle a trouvé",
      permNeeded: "🔐 A besoin de votre autorisation",
      readRuns: "verdict · la lecture s'exécute",
      testRuns: "verdict · le test s'exécute",
      threeCalls: "trois actions, aucune vérification",
      question: "❓ une question, avec des boutons",
      answerTyped: "réponse tapée dans la session",
      claudeAnswer: "💬 la réponse de Claude",
      sessionIn: "une session dans ~/travel",
      typedTrip: "tapé dans claude-trip",
      newCardTrip: "une nouvelle carte · trip",
      lisbon: "Lisbonne en mars · 18 °C",
      queued: "claude-trip · en file d'attente",
      tookIt: "il l'a pris · 👍",
      twoAgents: "🤖 deux agents",
      aimed: "dirigé vers claude-api",
      cardApi: "une carte · api",
      interim: "💬 trip · une réponse provisoire",
      thePr: "💬 api · la PR",
      flightsDone: "✅ vols · 7 outils utilisés",
      hotelsDone: "✅ hôtels · 11 outils utilisés",
      shortlist: "💬 trip · la sélection",
      switchFull: "passer en Mode Accès complet ?",
      restarting: "redémarrage, conversation gardée",
      typedApi: "tapé dans claude-api",
      newCardApi: "une nouvelle carte · api",
      yourMessage: "votre message",
      aReply: "une réponse · api",
    },
    hints: {
      cancel: "Annuler laisserait api dans le mode où elle est. Ce soir, la suite se passe en Mode Accès complet : essayez l'autre bouton.",
      deny: "Refuser bloquerait vraiment l'action. Ce soir, il faut que le test s'exécute : essayez Autoriser.",
      stop: "Arrêter interromprait la tâche. Essayez Autoriser.",
    },
    menu: ["Répondre", "Copier le texte", "Épingler", "Transférer", "Sélectionner", "Supprimer"],
    composer: "Écrire un message…",
    search: "Rechercher",
  },
};
