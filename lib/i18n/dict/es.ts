import type { Dict } from "./types";

/**
 * Spanish, written the way an app made in Spanish would say it: plain, tú,
 * neutral across Mexico, Colombia, Argentina and Spain. The words for the
 * product's own ideas (sesión, tarjeta, solicitud de permiso, Modo
 * Automático…) are the ones aipager itself uses in Telegram.
 */
export const es: Dict = {
  meta: {
    title: "aipager: Claude Code te avisa",
    description:
      "aipager ejecuta tus sesiones de Claude Code en una terminal en segundo plano y las muestra en Telegram: mira cómo trabajan, aprueba lo que te piden, manda el siguiente mensaje. Funciona en tu computadora.",
  },

  nav: {
    modes: "Modos",
    app: "Mini App",
    how: "Cómo funciona",
    install: "Instalar",
    security: "Seguridad",
    faq: "FAQ",
    docs: "Docs",
    language: "Cambiar idioma",
  },

  hero: {
    title: "Claude es un chat más.",
    lead: "aipager pone tus sesiones de Claude Code en Telegram, entre tu familia, tus amigos y tu equipo. Funciona en tu computadora.",
    agentInstall: "Deja que tu agente lo instale",
    docs: "Docs",
    security: "Seguridad",
    meta: "Linux y macOS · MIT · cosa de un minuto",
  },

  modes: {
    eyebrow: "Modos de permisos",
    title: "Tres modos. Empiezas en Modo Automático.",
    lead: "Cada sesión está en uno de los tres, se elige por sesión y se cambia cuando quieras con /mode. El Modo Preguntar se detiene antes de cada acción. El Modo Automático, donde arranca cada sesión nueva, deja que la propia comprobación de seguridad de Claude Code ejecute las acciones seguras y detenga las arriesgadas para que decidas tú. El Modo Acceso total ejecuta todo sin ninguna comprobación. Un modo manda sobre las solicitudes de permiso de Claude Code y nada más: en un grupo, una herramienta que el rol de un miembro no puede usar se rechaza igual, diga lo que diga el modo.",
    legend: [
      { k: "Permitir", v: "solo esta vez" },
      { k: "Rechazar", v: "Claude bloquea la acción" },
      { k: "Permitir siempre", v: "añade la regla que ofrece Claude, cuando ofrece una" },
      { k: "Detener", v: "interrumpe la tarea en lugar de responder" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Cada acción te espera, hasta para leer un archivo.",
      quote: "Primero voy a revisar el helper de la cookie.",
      read: "Read: el helper de la cookie",
      needs: "Necesita tu permiso",
    },
    auto: {
      tag: "por defecto",
      note: "La lectura y el test se ejecutaron solos. Un comando contra staging es de los arriesgados, así que se detuvo.",
      quote: "El test hace clic antes de que se establezca la cookie de sesión.",
      risky: "Bash: Mirar las sesiones más nuevas en staging",
    },
    full: {
      tag: "/mode full",
      note: "Sin comprobaciones, sin botones. Solo la respuesta cuando termina.",
      ask: "arregla el test e2e de login que falla a veces",
      quote: "El test hace clic antes de que se establezca la cookie de sesión. Espera 5s y cruza los dedos.",
    },
    facts: [
      {
        t: "/mode",
        b: "Muestra un botón para cada uno de los otros modos; /mode ask, /mode auto y /mode full cambian al instante. Las sesiones nuevas arrancan en Modo Automático, salvo que el chat haya elegido otra cosa en /settings → Sesiones nuevas.",
      },
      {
        t: "Modo Preguntar ⇄ Modo Automático, sobre la marcha",
        b: "Sin reiniciar, incluso mientras Claude trabaja: aipager presiona Shift+Tab en la sesión, y la tarjeta dice que está cambiando hasta que Claude Code confirma el nuevo modo.",
      },
      {
        t: "El Modo Acceso total reinicia",
        b: "Entrar o salir del Modo Acceso total reinicia la sesión y conserva la conversación. Solo un admin puede crear una sesión en ese modo o pasar una a él (o tú, en tu propio chat privado con el bot).",
      },
      {
        t: "Las preguntas llegan igual",
        b: "Un modo manda sobre las solicitudes de permiso, no sobre las decisiones: cuando Claude te pregunta algo, los botones llegan a tu chat en cualquier modo.",
      },
    ],
  },

  places: {
    eyebrow: "Dónde vive",
    title: "Tres chats. Lo demás es tu vida.",
    chats: [
      {
        name: "aipager",
        tag: "bot",
        preview: "api · Trabajando · 3:14 · Read ×2 · Bash ×2",
        title: "Tu chat con Claude",
        body: "Un chat para todas tus sesiones. Una tarjeta en vivo por tarea que se edita sola, solicitudes que respondes con un toque y una barra fijada que dice qué te necesita. Un mensaje normal va a la sesión que nombra la barra; /web manda el siguiente a otra sesión, y la conversación sigue ahí.",
      },
      {
        name: "backend-team",
        tag: "grupo · modo equipo",
        preview: "Sara: @aipagerbot /web ejecuta el e2e de login contra staging",
        title: "El grupo de tu equipo",
        body: "Mete el bot en un grupo y cualquiera de la lista de personas permitidas puede mencionarlo. Cada mensaje se ejecuta con el rol de quien lo envía; una herramienta que ese rol no puede usar se rechaza antes de ejecutarse, y cada decisión queda en el log de auditoría con el nombre de quien tocó el botón.",
      },
      {
        name: "Jim",
        tag: "su propio chat con el bot",
        preview: "web · Necesita tu permiso",
        title: "Otra persona, en su propio chat",
        body: "Añade el chat privado de alguien de tu equipo con el bot y esa persona manejará sus propias sesiones, con su rol y su propia carpeta raíz: sus tareas de Claude arrancan dentro de ella y no leen nada de tu carpeta personal fuera de ahí. A quien solo deba mirar le das read_only en tu grupo.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<sesión> <mensaje>"],
      ["owner", "admin", "user", "read_only"],
      ["carpeta raíz de los miembros", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Cuatro roles, y una regla de herramientas por rol.",
      lead: "El rol que cuenta es el que tienes en el chat donde actúas, y una herramienta que un rol no puede usar se rechaza antes de ejecutarse, no se pregunta. Nada en Telegram ni en la Mini App cambia quién está en la lista: solo aipager config, en la computadora.",
      can: "Puede",
      rows: [
        "Enviar mensajes a una sesión",
        "Permitir, Rechazar, responder las preguntas de Claude",
        "Bash, y todo lo que ejecute código",
        "Modo Acceso total, los /settings de un grupo, /update",
        "Dónde pueden trabajar sus sesiones",
        "Leer archivos de credenciales (~/.ssh, …)",
      ],
      anywhere: "en cualquier parte",
      rootFolder: "carpeta raíz",
      ownChat: "su chat",
      link: "El modo equipo, en detalle",
    },
  },

  day: {
    eyebrow: "Día a día",
    title: "Úsalo como un chat.",
    lead: "No es una consola disfrazada de chat: todo lo que ya haces en Telegram funciona aquí. Háblale de camino a casa, mándale la captura, envía la siguiente idea antes de que termine la anterior.",
    items: [
      {
        t: "Mejor díselo",
        b: "Manda un audio: aipager lo transcribe en tu propia computadora (nunca en la nube de nadie), te lo devuelve escrito para que veas qué entendió, y lo escribe en la sesión como si lo hubieras tecleado tú.",
      },
      {
        t: "Una captura del bug",
        b: "Las fotos y los archivos se guardan en una carpeta de tu computadora y a Claude se le pasa la ruta, con tu pie de foto como mensaje, o «check this: …» cuando no hay ninguno. Manda varios a la vez y van como un solo mensaje.",
      },
      {
        t: "Manda el siguiente ya",
        b: "Tu mensaje llega a Claude en cuanto lo envías, incluso a mitad de una tarea: 👀 mientras la cola de Claude lo guarda, 👍 cuando Claude lo toma. ⚡ Enviar ahora se lo pasa sin esperar a que termine el paso.",
      },
      {
        t: "Nunca se lee como la respuesta",
        b: "Un mensaje que envías mientras hay una solicitud de permiso abierta se queda esperando: no se toma como tu respuesta, y llega a la sesión en cuanto respondes.",
      },
      {
        t: "Agentes y comandos en segundo plano, contados",
        b: "Cada agente en segundo plano que arranca Claude tiene su propia fila en la tarjeta con lo que está haciendo, y un comando que queda corriendo en segundo plano lleva su propio reloj hasta que termina.",
      },
      {
        t: "Te avisa antes",
        b: "Un aviso de contexto, una compactación, una sesión que terminó o se quedó callada, una tarea que se alargó de más: el chat te lo dice sin que vayas a mirar.",
      },
      {
        t: "Los botones ya están ahí",
        b: "Debajo del cuadro de mensaje hay un teclado: un botón por cada sesión en marcha, luego status, stop y new, y después Plantillas para los mensajes que repites siempre y Comandos para los que maneja el propio Claude Code.",
      },
      {
        t: "/status, todo el chat de un vistazo",
        b: "Todas las sesiones en una lista desde la que puedes actuar: qué hace cada una, su modelo, el contexto que le queda, lo que ha costado, lo que tiene en cola, con Detener, Responder y el resto del menú en cada una.",
      },
    ],
    heard: "Escuché:",
    said: "arregla el test e2e de login que falla a veces",
  },

  app: {
    eyebrow: "La Mini App",
    title: "Un panel, sin salir de Telegram.",
    lead: "/app abre todas las sesiones a la vez: una ficha para cada una, con su anillo de contexto, su carpeta, su modelo y lo que lleva gastado. El chat sigue siendo donde respondes; la app es para verlas todas juntas y para lo que en un chat es incómodo, como leer un diff o cambiar un ajuste.",
    tabs: { sessions: "Sesiones", settings: "Ajustes" },
    summary: { needs: "te necesita", working: "trabajando", resting: "lista", spent: "gastados", finished: "terminadas" },
    needsYou: "Te necesitan",
    answerInChat: "Responder en el chat",
    states: { working: "trabajando", needs: "te necesita", resting: "lista" },
    settings: {
      updates: "Actualizaciones",
      upToDate: "Todo está actualizado.",
      check: "Buscar actualizaciones",
      language: "Idioma de la app",
      languageNote: "Solo el texto de aipager. Las respuestas de Claude no cambian.",
      chatPrefs: "Ajustes del chat",
      chatPrefsNote: "Se aplican a todas las sesiones de este chat.",
      rows: [
        { k: "Cómo se ve la respuesta", v: "Tarjeta + respuesta aparte" },
        { k: "Vistas previas de diff", v: "Desactivado" },
        { k: "Actualizar tarjeta en tareas largas", v: "Activado" },
        { k: "Sesiones nuevas" },
      ],
    },
    close: "Cerrar",
    facts: [
      {
        t: "Todas las sesiones en una pantalla",
        b: "Una ficha para cada una, con su anillo de contexto, de quién es, el modelo y lo que lleva gastado, y encima una línea que dice cómo va el chat: cuáles trabajan, cuáles están listas, cuánto costó el día, cuántas terminaron. El + crea otra: un nombre, una carpeta de las que ya usas, un modelo.",
      },
      {
        t: "Lo que te necesita, primero",
        b: "Una sesión que espera una solicitud de permiso o una pregunta se pone arriba con lo que está pidiendo. «Responder en el chat» manda esa solicitud al final del chat, con sus botones, y la respondes ahí.",
      },
      {
        t: "Una página por sesión",
        b: "El estado, «Trabajando (3:12)» o «Lista, última actividad hace 5 min», y un toque para Detener o Continuar. Debajo, las últimas herramientas usadas, la última respuesta, el control del modelo, los archivos que cambió la tarea en forma de diff, y los ajustes de esa sesión.",
      },
      {
        t: "La sirve el propio aipager",
        b: "Viene activada, cada petición se comprueba con la firma de Telegram, y la página no carga nada de fuera: ni fuentes, ni scripts. aipager miniapp disable la desactiva.",
      },
    ],
    link: "Lo que hace la app",
  },

  langs: {
    eyebrow: "Quince idiomas",
    title: "En tu idioma, hasta en los dígitos.",
    lead: "Solo cambian las palabras de aipager: las tarjetas, las solicitudes, los botones, la barra fijada, /status, la Mini App, la documentación. Tus sesiones no: Claude responde en el idioma en que le escribes, y lo que aipager le manda a Claude va tal cual. Elige uno con /language o deja que siga el idioma de tu app de Telegram.",
    facts: [
      {
        t: "De derecha a izquierda, bien hecho",
        b: "El persa y el árabe se leen de derecha a izquierda, con dígitos persas (۰-۹) o árabes (٠-٩) y sus propios separadores, en Telegram y en la Mini App. Los nombres de sesión, las rutas, los comandos y el código mantienen su dirección.",
      },
      {
        t: "Escrito, no traducido",
        b: "Cada idioma se escribió como habla de verdad la gente que usa apps en él, con sus préstamos del inglés incluidos y con sus propias formas de plural (el árabe tiene seis).",
      },
      {
        t: "Tu chat, tu idioma",
        b: "Un chat privado puede seguir el idioma de tu app de Telegram. Un grupo tiene un solo idioma, que elige un admin, y el aviso que aparece al tocar un botón sale en el idioma de quien lo tocó.",
      },
      {
        t: "La documentación también",
        b: "El README y todas las páginas de docs/ están traducidos. Cuando una traducción y la página en inglés no coinciden, la correcta es la página en inglés.",
      },
    ],
    pinned: "Mensaje fijado",
  },

  under: {
    eyebrow: "Debajo del chat",
    title: "La verdad sigue estando en la terminal.",
    lead: "Claude Code corre en una terminal de verdad, dentro de dtach, así que nadie tiene que dejar una ventana abierta. Cada paso dispara un hook que manda un datagrama a aipager por un socket local, y aipager edita un mensaje en tu chat. Tus respuestas vuelven por el mismo camino: un veredicto al hook que tiene la acción en espera, o teclas escritas en la sesión.",
    nodes: [
      { t: "Claude Code", b: "dentro de dtach, sin ventana" },
      { t: "hook", b: "se dispara en cada paso" },
      { t: "aipager", b: "un proceso, con tu usuario" },
      { t: "Telegram", b: "el token de tu propio bot" },
      { t: "tus chats", b: "tu chat privado, el grupo de tu equipo" },
    ],
    facts: [
      {
        t: "Siéntate al teclado cuando quieras",
        b: "aipager session api se engancha a la sesión en marcha desde cualquier terminal. Escribe ahí, escribe en el chat: la misma sesión. Cierra la ventana y la sesión sigue, y el enganche acompaña a la sesión incluso si se reinicia.",
      },
      {
        t: "Nunca lee tu pantalla",
        b: "aipager escribe en la sesión y escucha los eventos del propio Claude Code. Lo que ves en tu chat sale de los hooks y de la conversación guardada, no de leer lo que aparece en la terminal.",
      },
      {
        t: "Nada espera al chat",
        b: "Un hook manda un datagrama y vuelve: unos 20 ms del tiempo de Claude Code. Si aipager no está escuchando, el evento se descarta sin más y Claude sigue; aipager se pone al día con los propios archivos de la sesión.",
      },
    ],
    hooks: "Dieciséis hooks, más la línea de estado de la que saca el modelo, el contexto y el costo. aipager está conectado a todos.",
  },

  trust: {
    eyebrow: "Seguridad",
    title: "Nada en medio.",
    lead: "aipager nunca habla con Anthropic. El único que lo hace es el propio Claude Code, con tu cuenta, en tu computadora. aipager lo arranca en una terminal y escucha los hooks que publica Claude Code. Ningún endpoint sacado por ingeniería inversa, ningún proxy, ninguna cuenta que no sea la tuya: la sesión que manejas desde el teléfono es la misma que manejarías desde el teclado.",
    cards: [
      {
        t: "No hay servidor de aipager.",
        b: "aipager habla con la Bot API de Telegram usando el token de tu propio bot. No hay cuenta de aipager ni servicio de aipager, ni la computadora de nadie más entre tu teléfono y la tuya.",
      },
      {
        t: "Solo responde a tus chats.",
        b: "aipager solo responde en los chats que aparecen en tu configuración. Quien encuentre el bot sin estar en ella recibe una sola línea que dice que el bot no está configurado para hablarle; nada de lo que mande llega a una sesión.",
      },
      {
        t: "Ningún puerto abierto.",
        b: "Solo escucha en loopback. La Mini App sale por un túnel de Cloudflare donde cada petición tiene que llevar la firma de Telegram, y aipager miniapp disable la desactiva.",
      },
      {
        t: "Tu token, tu archivo.",
        b: "El token del bot y los ids de los chats viven en ~/.config/aipager/aipager.yaml con permisos 600. No entran en el log de aipager, y se ocultan allí donde podrían colarse en uno.",
      },
      {
        t: "Nunca eleva privilegios.",
        b: "Ni sudo, ni setuid. Todo lo que escribe está en tu carpeta personal, en /tmp o en su propia carpeta de sockets, y todo lo que arranca (claude, dtach, los instaladores) corre con tu usuario.",
      },
      {
        t: "Claude Code sigue decidiendo.",
        b: "Tu settings.json dice qué hay que preguntar. aipager pasa la pregunta; nunca decide qué puede ejecutarse, y un botón que quedó de una tarea terminada se niega en vez de tocar el trabajo que corre ahora.",
      },
      {
        t: "El acceso se da en la computadora.",
        b: "Los miembros y los roles solo cambian con aipager config, en la computadora. Nada en Telegram ni en la Mini App puede añadir a una persona ni ampliar un rol.",
      },
      {
        t: "Cada respuesta queda registrada.",
        b: "Cada Permitir, cada Rechazar y cada respuesta va a ~/.claude/aipager-audit.jsonl, que solo crece, con quién lo tocó si fue en un grupo.",
      },
    ],
    link: "El modelo de seguridad",
  },

  install: {
    eyebrow: "Instalación",
    title: "Cuatro líneas. Guárdalas en Mensajes guardados.",
    lead: "Toca una línea para copiarla. Antes, dos cosas: un bot tuyo de @BotFather (toca Iniciar en él) y Claude Code ya conectado con tu cuenta en esta computadora. El asistente de la segunda línea te pide lo demás.",
    agent: {
      title: "O déjaselo al agente que ya tienes.",
      lead: "Pon el token del bot en un archivo que el agente nunca tenga que leer y dale esto a Claude Code:",
      link: "La guía que sigue",
    },
    saved: { name: "Mensajes guardados", count: "4 mensajes" },
    lines: [
      { note: "uv, pipx o Homebrew, el que tengas. Linux o macOS." },
      { note: "el token de tu bot de @BotFather, tu chat, los hooks de Claude Code" },
      { note: "mantiene aipager en marcha aunque salgas de tu cuenta" },
      { note: "Claude Code dentro de dtach. A partir de aquí, todo sigue en tu chat." },
    ],
    copied: "Copiado",
    pm: "¿Prefieres tu gestor de paquetes? uv, pipx, Homebrew, Docker, Nix, el AUR y Snap.",
    pmLink: "todas las formas de instalar",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Pregunta lo que quieras.",
    readBack: "arrastra para ver lo anterior",
    items: [
      {
        q: "¿En qué se diferencia de las apps móviles de Claude?",
        a: "Las apps de Claude hablan con el asistente que Anthropic tiene alojado. aipager refleja una sesión de Claude Code que corre en tu propia computadora: tu repo, tus herramientas, tu entorno.",
      },
      {
        q: "¿Mi código sale de mi computadora?",
        a: "Solo hasta tus propios chats de Telegram. aipager habla con Telegram usando el token de tu propio bot; no hay ningún servidor de aipager en medio.",
      },
      {
        q: "¿Pueden banearme la cuenta de Claude por esto?",
        a: "aipager nunca llama a Anthropic. Arranca el CLI oficial claude en tu computadora y lee los hooks que publica Claude Code, y tus mensajes se escriben en esa sesión igual que si estuvieras en el teclado: ningún endpoint sacado por ingeniería inversa, ningún proxy, ninguna cuenta compartida, nada que pase por el servidor de otro. Lo que ve Anthropic es tu propia cuenta de Claude Code haciendo lo que ya hace. Sus políticas de uso siguen cubriendo lo que le pidas, y un equipo con un solo bot sigue compartiendo tu suscripción: para eso, ejecuta aipager con su propia cuenta o con una clave con límite de gasto.",
      },
      {
        q: "¿Necesito una VPN o un puerto abierto?",
        a: "No. aipager consulta a Telegram por HTTPS, siempre hacia fuera, y no escucha en ningún puerto fuera de loopback, así que no hay nada que abrir ni nada que alcanzar desde la red. Tu teléfono habla con Telegram; Telegram habla con la conexión de salida de tu computadora.",
      },
      {
        q: "¿Y si Claude se descontrola?",
        a: "Las solicitudes esperan tu toque, /stop interrumpe la tarea y borra lo que haya en cola, /kill termina la sesión, y los botones que quedaron de una tarea terminada ya no actúan.",
      },
      {
        q: "¿Puede usarlo mi equipo?",
        a: "Sí. Mete el bot en un grupo con roles: owner, admin, user, read_only. Cada mensaje se ejecuta con los permisos de quien lo envía, un miembro sin can_manage trabaja dentro de su propia carpeta raíz, y cada decisión queda auditada.",
      },
      {
        q: "¿Puedo mandarle un audio o una captura?",
        a: "Las dos cosas. El audio se transcribe en tu computadora y se escribe en la sesión como si lo hubieras tecleado tú; una foto o un archivo se guarda en tu computadora y a Claude se le pasa la ruta, con tu pie de foto como mensaje.",
      },
      {
        q: "¿Habla mi idioma?",
        a: "Quince. Eliges el tuyo con /language, o aipager sigue el idioma de tu app de Telegram. El persa y el árabe se leen de derecha a izquierda, con sus propios dígitos. Solo cambia el texto de aipager; Claude responde en el idioma en que le escribes.",
      },
      {
        q: "¿Hay un panel?",
        a: "/app abre una Mini App dentro de Telegram: una ficha por sesión, un visor de diff para cada Write y cada Edit, los ajustes y un toque para detener. Viene activada, cada petición se comprueba con la firma de Telegram, y aipager miniapp disable la desactiva.",
      },
      {
        q: "¿Qué es dtach?",
        a: "Un programita que desengancha terminales. Mantiene vivo a Claude Code cuando se cierra la terminal o se cae el SSH, así que una respuesta que mandas una hora después todavía llega a una sesión en marcha. Viene con aipager.",
      },
      {
        q: "¿Sigue funcionando si salgo de mi cuenta?",
        a: "aipager service install mantiene aipager en marcha con systemd o launchd, y las sesiones viven dentro de dtach, así que sobreviven a la terminal que las arrancó. También hay versiones para Docker, Nix, AUR y Snap.",
      },
      {
        q: "¿Cómo lo actualizo?",
        a: "/update revisa aipager y Claude Code e instala la versión nueva, y luego 🔄 Reiniciar ahora lo pone en marcha ahí mismo, ya corra en una terminal, en tmux, en Docker o como servicio. Tus sesiones siguen corriendo mientras tanto.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Nada. Tiene licencia MIT, el bot es tuyo, y Claude Code sigue usando el plan o la clave que ya usa.",
      },
    ],
  },

  cta: {
    title: "Añade Claude a tus chats.",
    lead: "Luego cierra la terminal y vete a disfrutar la noche.",
    copy: "Copiar",
  },

  footer: { changelog: "Cambios", issues: "Issues" },

  docs: {
    title: "Documentación",
    description: "Documentación de referencia de aipager: arquitectura, hooks, comandos, resolución de problemas y seguridad.",
    onThisPage: "En esta página",
    translated: "Esta página es una traducción de la página en inglés; si no coinciden, la versión en inglés es la correcta.",
    english: "Inglés",
    source: "El original en GitHub",
    onGitHub: "Estas páginas en GitHub",
    sourceNote: "El markdown del repo es el mismo texto que estás leyendo.",
    prev: "Anterior",
    next: "Siguiente",
    groups: ["Empieza aquí", "Referencia", "Ponerlo en marcha"],
  },

  demo: {
    people: { you: "Tú" },
    typing: "escribiendo",
    isTyping: "está escribiendo",
    days: { today: "Hoy", yesterday: "Ayer", monday: "Lunes" },
    chats: {
      aipager: { name: "aipager", subtitle: "bot" },
      team: { name: "backend-team", subtitle: "5 miembros, 3 en línea" },
      mom: { name: "Mamá", subtitle: "en línea" },
      friends: { name: "Fútbol 5 del viernes ⚽", subtitle: "9 miembros" },
      sara: { name: "Sara", subtitle: "últ. vez recientemente" },
      saved: { name: "Mensajes guardados", subtitle: "" },
    },
    folders: { all: "Todos los chats", personal: "Personal", work: "Trabajo", bots: "Bots" },
    seed: {
      oldPrompt: "haz que las sesiones inactivas caduquen a los 30 minutos",
      oldAnswer: "Listo. El almacén de sesiones ahora hace caducar las sesiones inactivas a los 30 minutos; pasan los 212 tests.",
      teamFlaky: "el login de prod vuelve a fallar a ratos 😬 ¿alguien?",
      teamSaw: "yo también lo vi, dos veces en la última hora",
      momEat: "¿Ya comiste? 🙂",
      friendsPitch: "cancha reservada, viernes a las 7",
      friendsIn: "me apunto 🙋",
      friendsBall: "me apunto, llevo la pelota nueva",
      saraMerged: "te hice merge del PR 🚀",
      saraThanks: "graciasss",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "sí, hice pasta 🍝 ¿y tú?",
      momLunch: "¿comemos el domingo a la 1? 😊",
      youLunch: "a la 1 ❤️",
      teamRun: "@aipagerbot /web ejecuta el e2e de login contra staging",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "¿quién se apunta el viernes? faltan 2 ⚽",
      youIn: "me apunto 🙋‍♂️",
      saraVacation: "¿ya decidiste lo de las vacaciones? 🏖",
      youTwoMinutes: "dos minutos 😄",
      youBook: "Lisboa, 12–19 de marzo ☀️ vuelos 193 €, hotel 142 €",
      saraBook: "síii, resérvalo 🎉",
    },
    prompts: {
      fix: "arregla el test e2e de login que falla a veces",
      trip: "una semana en Lisboa en marzo: mira primero el clima, luego 3 hoteles por debajo de 180 € y vuelos desde Berlín. Si el clima pinta mal, prueba con Sevilla.",
      more: "lanza un par de agentes para eso: uno con los hoteles por debajo de 180 € y otro con los vuelos desde Berlín",
      push: "haz push también de la rama del arreglo y abre el PR",
      teamRun: "ejecuta el e2e de login contra staging",
    },
    claude: {
      plan: "Voy a correr el test de login unas cuantas veces y a mirar dónde falla.",
      flaky: "Falla una de cada cinco veces, más o menos. Es cuestión de tiempos, no de lógica.",
      cookie: "El test hace clic antes de que se establezca la cookie de sesión. Espera 5s y cruza los dedos.",
      answer: "Arreglado. Ahora el test espera a la cookie de sesión en lugar de hacer una pausa de 5s. 10 vueltas seguidas, todas en verde.",
      teamTests: "Pasan 18 de 18 tests de login en staging. Ahí no aparece el fallo intermitente.",
      weather: "Primero el clima: no tiene sentido mirar precios para una semana de lluvia.",
      lisbon: "Lisboa en marzo: 18 °C de día y lluvia 2 de los 7 días. Suficiente, no hace falta Sevilla.",
      pr: "Subí fix/login-cookie y abrí el PR #214. El CI ya está corriendo.",
      teamShort: "Pasan 18 de 18 tests de login en staging.",
      twoAgents: "Dos agentes entonces: uno a las camas y otro a los asientos.",
      interim: "Lisboa va: 18 °C y dos días de lluvia. Los dos agentes están buscando; vuelvo con la lista corta.",
      shortlist:
        "Hoteles: Casa Baleal 142 € la noche, Lx Boutique 165 €, Santa Justa 178 €, los tres andando hasta la Baixa. Vuelos: TAP directo, 89 € de ida el 12 y 104 € de vuelta el 19. Dime y te los reservo.",
    },
    question: {
      verb: "¿Subir el timeout o esperar a la cookie?",
      question: "¿Subir el timeout o esperar a la cookie?",
      options: ["Subir el timeout", "Esperar a la cookie", "Las dos cosas"],
      title: "Arreglo",
      body: "El test hace una pausa de 5s antes de hacer clic.",
    },
    captions: {
      restAuto: "Una sesión de Claude Code descansando en tu computadora, en Modo Automático, donde arranca cada sesión nueva.",
      restAsk: "Una sesión de Claude Code descansando en tu computadora, en Modo Preguntar: pregunta antes de cada acción.",
      restFull: "Una sesión de Claude Code descansando en tu computadora. Antes del siguiente trabajo, le quitas las comprobaciones.",
      held: "En pausa mientras miras alrededor. Déjalo un momento y la noche sigue.",
      arrived: "👀 significa que llegó. aipager lo escribe en la sesión, igual que si estuvieras en el teclado.",
      took: "👍 significa que Claude lo tomó. A partir de aquí es una sola tarjeta, que se edita sola mientras corre la tarea.",
      glance: "Claude corre el test unas cuantas veces. Cada paso que da edita la misma tarjeta.",
      momFirst: "Mamá preguntó hace veinte minutos. Aquí nada te necesita, así que le respondes.",
      sent: "Enviado. Sales del chat, como hace cualquiera.",
      workAuto:
        "Modo Automático, donde arranca cada sesión nueva: la propia comprobación de seguridad de Claude Code ejecutó la lectura y el test por su cuenta. Ninguno de los dos llegó a ti.",
      askRead: "Modo Preguntar: cada acción te espera. Esta solo quiere leer un archivo.",
      askTest: "Y otra vez para el test. En Modo Automático ninguna de las dos habría preguntado.",
      workFull: "Modo Acceso total: Claude Code no pregunta nada y aipager no tiene nada que pasarte. Solo ves lo que hizo.",
      momAgain: "Mamá otra vez. La sesión sigue trabajando mientras tanto; no necesita ninguna ventana abierta.",
      team: "El grupo del equipo. Cualquiera de la lista de personas permitidas puede mencionar al bot; cada mensaje se ejecuta con el rol de quien lo envía.",
      teamSara:
        "Sara es admin en este grupo, así que su test se ejecuta. El mensaje llega a Claude con la marca de quién lo envió y del rol con el que corre.",
      teamSam: "Sam es user en este grupo. Su rol no puede usar Bash, así que la acción se rechaza antes de ejecutarse.",
      questionAuto:
        "Ahora algo que solo puedes responder tú. Un modo decide qué se ejecuta sin preguntar; una pregunta como esta te llega en cualquier modo.",
      questionAsk: "Una pregunta, no un permiso: una decisión de Claude, con un botón por opción.",
      buzzed: "El teléfono vibró en el brazo del sofá. Tres botones, un toque.",
      answerTyped: "Tu respuesta se escribe en la sesión como si estuvieras en el teclado.",
      friends: "Familia, amigos, trabajo y Claude: una sola app, la que miras de todas formas.",
      answerDone: "Listo. La respuesta llega como cualquier otro mensaje y la barra fijada se calla.",
      evening: "Un test intermitente arreglado desde el sofá, entre una pregunta de Mamá y un partido el viernes.",
      saraPing: "No todo lo que suena es trabajo.",
      second: "Una segunda sesión, creada desde el chat: sin terminal, sin ssh.",
      newReady: "aipager la arranca en tu computadora y te la devuelve lista, en el modo en el que arrancan las sesiones nuevas.",
      weather: "Claude mira primero lo que decide todo lo demás y cuenta lo que encontró.",
      queued: "Enviado mientras sigue trabajando: aipager se lo pasa al momento, Claude lo pone en cola, y el 👀 dice que entró.",
      queueLine: "La línea de abajo dice qué está esperando, y al tocarla el mensaje le llega a Claude a mitad del paso.",
      tookIt:
        "Claude lo toma al final del paso: 👍, se va el gris, desaparece la línea y la tarjeta se mueve debajo del mensaje que responde.",
      agents: "Claude manda dos a la vez. Cada uno tiene su propia fila, y la tarjeta sigue lo que hace cada uno.",
      agentsWork: "Ya van por su cuenta: cada uno usa unas cuantas herramientas, y tú no tienes nada que hacer.",
      twoSessions:
        "Ahora hay dos sesiones en marcha en este chat. Un mensaje normal va a la sesión a la que van tus mensajes; para llegar a la otra, respondes a uno de los suyos.",
      hold: "Mantén presionado y Telegram te ofrece lo que puedes hacer con el mensaje.",
      reply: "Responder. El cuadro de mensaje queda contestando a ese mensaje, y de ahí saca aipager a qué sesión va.",
      aimed: "Se escribió en api, no en trip.",
      interim: "La tarea termina antes que ellos, así que la respuesta sale con una línea en vivo debajo para el trabajo que sigue en marcha.",
      apiFirst: "api responde primero; solo tenía una cosa que hacer.",
      liveLine: "aipager mantiene esa línea al día por su cuenta mientras ellos trabajan.",
      bothBack: "Vuelven los dos. aipager junta las dos líneas en una sola, y Claude se despierta con lo que encontraron.",
      shortlist: "Lo que encontraron vuelve como una respuesta propia, escrita cuando Claude ha leído los dos informes.",
      human: "Y solo queda la parte que una máquina no debería hacer por ti.",
      end: "Dos sesiones, tres agentes y una semana en Lisboa, desde un sofá. Nada quedó corriendo, nada quedó por tocar.",
      resting: "Esta sesión está descansando. Antes de darle el siguiente trabajo, le quitas las comprobaciones.",
      fullWho: "El Modo Acceso total es para los admins, y para ti, en tu chat privado con el bot.",
      fullRestart:
        "Entrar o salir del Modo Acceso total reinicia la sesión y conserva la conversación. Entre el Modo Preguntar y el Modo Automático no se reinicia nada.",
    },
    switch: {
      default: "por defecto",
      lines: [
        "Cada acción se detiene y espera tu toque.",
        "Las acciones seguras se ejecutan solas; las arriesgadas esperan tu permiso.",
        "Nada se detiene. Nada pregunta.",
      ],
    },
    cable: { idle: "esperando una tarea", quiet: "nada nuevo", flick: "el cable es de verdad · dale un toque", daemon: "aipager" },
    wire: {
      cardEdited: "tarjeta editada · Bash ×1",
      twoCalls: "dos acciones, nada que tocar",
      trace: "la traza, y lo que encontró",
      permNeeded: "🔐 Necesita tu permiso",
      readRuns: "veredicto · se ejecuta la lectura",
      testRuns: "veredicto · se ejecuta el test",
      threeCalls: "tres acciones, sin comprobaciones",
      question: "❓ una pregunta, con botones",
      answerTyped: "respuesta escrita en la sesión",
      claudeAnswer: "💬 la respuesta de Claude",
      sessionIn: "una sesión en ~/travel",
      typedTrip: "escrito en claude-trip",
      newCardTrip: "una tarjeta nueva · trip",
      lisbon: "Lisboa en marzo · 18 °C",
      queued: "claude-trip · en cola",
      tookIt: "lo tomó · 👍",
      twoAgents: "🤖 dos agentes",
      aimed: "dirigido a claude-api",
      cardApi: "una tarjeta · api",
      interim: "💬 trip · una respuesta provisional",
      thePr: "💬 api · el PR",
      flightsDone: "✅ vuelos · 7 herramientas usadas",
      hotelsDone: "✅ hoteles · 11 herramientas usadas",
      shortlist: "💬 trip · la lista corta",
      switchFull: "¿cambiar a Modo Acceso total?",
      restarting: "reiniciando, se conserva la conversación",
      typedApi: "escrito en claude-api",
      newCardApi: "una tarjeta nueva · api",
      yourMessage: "tu mensaje",
      aReply: "una respuesta · api",
    },
    hints: {
      cancel: "Cancelar dejaría api como está. Esta noche toca el Modo Acceso total: prueba con el otro botón.",
      deny: "Rechazar bloquearía la acción de verdad. Esta noche necesita que el test se ejecute: prueba con Permitir.",
      stop: "Detener interrumpiría la tarea. Prueba con Permitir.",
    },
    menu: ["Responder", "Copiar texto", "Fijar", "Reenviar", "Seleccionar", "Eliminar"],
    composer: "Escribe un mensaje…",
    search: "Buscar",
  },
};
