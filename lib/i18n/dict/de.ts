import type { Dict } from "./types";

/**
 * German, written the way a German app talks to people: plain, du, short
 * sentences, no officialese. The words for the product's own ideas (Sitzung,
 * Karte, Berechtigungsanfrage, Auto-Modus, Warteschlange…) are the ones
 * aipager itself uses in Telegram and in the Mini App.
 */
export const de: Dict = {
  meta: {
    title: "aipager: Claude Code meldet sich",
    description:
      "aipager startet deine Sitzungen von Claude Code in einem abgekoppelten Terminal und spiegelt sie in Telegram: Du siehst ihnen beim Arbeiten zu, erlaubst, worum sie bitten, und schickst die nächste Nachricht. Es läuft auf deinem Computer.",
  },

  nav: {
    modes: "Modi",
    app: "Mini App",
    how: "So geht’s",
    install: "Installieren",
    security: "Sicherheit",
    faq: "FAQ",
    docs: "Docs",
    language: "Sprache wechseln",
  },

  hero: {
    title: "Claude ist ein Chat mehr.",
    lead: "aipager bringt deine Sitzungen von Claude Code nach Telegram, zwischen deine Familie, deine Freunde und dein Team. Es läuft auf deinem Computer.",
    agentInstall: "Lass es deinen Agenten installieren",
    docs: "Docs",
    security: "Sicherheit",
    meta: "Linux & macOS · MIT · rund eine Minute",
  },

  modes: {
    eyebrow: "Berechtigungsmodi",
    title: "Drei Modi. Du startest im Auto-Modus.",
    lead: "Jede Sitzung läuft in einem der drei Modi, pro Sitzung eingestellt und jederzeit mit /mode änderbar. Der Fragen-Modus hält vor jeder Aktion an. Der Auto-Modus, in dem jede neue Sitzung startet, lässt die Sicherheitsprüfung von Claude Code die sicheren Aufrufe durchlassen und die riskanten für dich anhalten. Der Vollzugriff-Modus führt alles ohne jede Prüfung aus. Ein Modus steuert nur die Berechtigungsanfragen von Claude Code, sonst nichts: In einer Gruppe wird ein Tool, das die Rolle eines Mitglieds nicht nutzen darf, trotzdem abgelehnt, egal, was der Modus sagt.",
    legend: [
      { k: "Erlauben", v: "nur diesen einen Aufruf" },
      { k: "Ablehnen", v: "Claude blockiert den Aufruf" },
      { k: "Immer erlauben", v: "fügt die Regel hinzu, die Claude anbietet, wenn es eine gibt" },
      { k: "Stoppen", v: "unterbricht die Aufgabe, statt zu antworten" },
    ],
    ask: {
      tag: "/mode ask",
      note: "Jeder Aufruf wartet auf dich, auch das Lesen einer Datei.",
      quote: "Ich schaue mir zuerst den Cookie-Helper an.",
      read: "Read: der Cookie-Helper",
      needs: "Braucht deine Erlaubnis",
    },
    auto: {
      tag: "Standard",
      note: "Das Lesen und der Testlauf gingen von allein durch. Ein Befehl gegen staging gehört zu den riskanten, also hat die Prüfung ihn angehalten.",
      quote: "Der Test klickt, bevor das Session-Cookie gesetzt ist.",
      risky: "Bash: Die neuesten Sessions auf staging ansehen",
    },
    full: {
      tag: "/mode full",
      note: "Keine Prüfungen, keine Buttons. Nur die Antwort, wenn Claude fertig ist.",
      ask: "fix den flaky Login-E2E-Test",
      quote: "Der Test klickt, bevor das Session-Cookie gesetzt ist. Er schläft 5 s und hofft.",
    },
    facts: [
      {
        t: "/mode",
        b: "Zeigt einen Button für jeden anderen Modus; /mode ask, /mode auto und /mode full wechseln sofort. Neue Sitzungen starten im Auto-Modus, außer der Chat hat es unter /settings → Neue Sitzungen anders eingestellt.",
      },
      {
        t: "Fragen-Modus ⇄ Auto-Modus, ohne Unterbrechung",
        b: "Kein Neustart, auch während Claude arbeitet: aipager drückt Shift+Tab in der Sitzung, und die Karte zeigt den Wechsel an, bis Claude Code den neuen Modus bestätigt.",
      },
      {
        t: "Der Vollzugriff-Modus braucht einen Neustart",
        b: "Der Wechsel in den Vollzugriff-Modus oder aus ihm heraus startet die Sitzung neu; die Unterhaltung bleibt erhalten. Nur ein Admin kann eine Sitzung in diesem Modus starten oder eine laufende dorthin umschalten (oder du, in deinem eigenen privaten Chat mit dem Bot).",
      },
      {
        t: "Fragen kommen trotzdem",
        b: "Ein Modus steuert Berechtigungsanfragen, keine Entscheidungen: Wenn Claude dich etwas fragt, landen die Buttons in jedem Modus in deinem Chat.",
      },
    ],
  },

  places: {
    eyebrow: "Wo es sich abspielt",
    title: "Drei Chats. Alles andere ist einfach dein Leben.",
    chats: [
      {
        name: "aipager",
        tag: "Bot",
        preview: "api · Arbeitet · 3:14 · Read ×2 · Bash ×2",
        title: "Dein Chat mit Claude",
        body: "Ein Chat für alle deine Sitzungen. Pro Aufgabe eine Karte, die sich selbst aktualisiert, Anfragen, die du mit einem Tippen beantwortest, und eine angeheftete Leiste, die zeigt, was auf dich wartet. Eine normale Nachricht geht an die Sitzung, die in der Leiste steht; /web schickt die nächste woandershin, und danach gehen deine Nachrichten dorthin.",
      },
      {
        name: "backend-team",
        tag: "Gruppe · Teambetrieb",
        preview: "Sara: @aipagerbot /web lass den Login-E2E gegen staging laufen",
        title: "Die Gruppe deines Teams",
        body: "Steck den Bot in eine Gruppe, und alle auf der Liste der erlaubten Personen können ihn erwähnen. Jede Nachricht läuft mit der Rolle der Person, die sie schickt; ein Tool, das diese Rolle nicht nutzen darf, wird abgelehnt, bevor es läuft, und jede Entscheidung landet im Audit-Log, mit dem Namen der Person, die getippt hat.",
      },
      {
        name: "Jim",
        tag: "eigener Chat mit dem Bot",
        preview: "web · Braucht deine Erlaubnis",
        title: "Jemand anderes, im eigenen Chat",
        body: "Nimm den privaten Chat eines Teammitglieds mit dem Bot dazu: Das Mitglied steuert seine eigenen Sitzungen, mit eigener Rolle und eigenem Stammordner: Claude arbeitet für das Mitglied in diesem Ordner und liest nichts in deinem Home-Ordner außerhalb davon. Wer nur zuschauen soll, bekommt in deiner Gruppe read_only.",
      },
    ],
    chips: [
      ["/status", "/new", "/mode", "/stop", "/app", "/<sitzung> <nachricht>"],
      ["owner", "admin", "user", "read_only"],
      ["Stammordner der Mitglieder", "~/aipager-users/<label>", "read_only", "/new"],
    ],
    roles: {
      title: "Vier Rollen und pro Rolle eine Tool-Regel.",
      lead: "Es zählt die Rolle, die du in dem Chat hast, in dem du gerade bist. Ein Tool, das eine Rolle nicht nutzen darf, wird abgelehnt, bevor es läuft, ohne Nachfrage. Nichts in Telegram und nichts in der Mini App ändert, wer auf der Liste der erlaubten Personen steht: nur aipager config, auf dem Computer.",
      can: "Darf",
      rows: [
        "Nachrichten an eine Sitzung schicken",
        "Erlauben, Ablehnen, Claudes Fragen beantworten",
        "Bash und alles andere, was Code ausführt",
        "Vollzugriff-Modus, die /settings einer Gruppe, /update",
        "Wo ihre Sitzungen arbeiten dürfen",
        "Dateien mit Anmeldedaten lesen (~/.ssh, …)",
      ],
      anywhere: "überall",
      rootFolder: "im Stammordner",
      ownChat: "im eigenen Chat",
      link: "Teambetrieb im Detail",
    },
  },

  day: {
    eyebrow: "Im Alltag",
    title: "Nutz es wie einen Chat.",
    lead: "Keine Konsole mit Chat-Anstrich: Alles, was du in Telegram sowieso machst, geht auch hier. Sprich auf dem Heimweg eine Sprachnachricht ein, wirf den Screenshot rein, schreib den nächsten Gedanken, bevor der letzte fertig ist.",
    items: [
      {
        t: "Sag es einfach",
        b: "Schick eine Sprachnachricht: aipager wandelt sie auf deinem eigenen Computer in Text um (nie in irgendeiner Cloud), schickt dir zurück, was es verstanden hat, und tippt sie in die Sitzung, als hättest du sie geschrieben.",
      },
      {
        t: "Ein Screenshot vom Bug",
        b: "Fotos und Dateien landen in einem Ordner auf deinem Computer, und Claude bekommt den Pfad, mit deiner Bildunterschrift als Nachricht oder mit „check this: …“, wenn du keine geschrieben hast. Schick mehrere auf einmal, und sie gehen als eine Nachricht raus.",
      },
      {
        t: "Schick die nächste sofort",
        b: "Deine Nachricht geht in dem Moment an Claude, in dem du sie sendest, auch mitten in einer Aufgabe: 👀, solange Claudes eigene Warteschlange sie hält, 👍, wenn Claude sie annimmt. „⚡ Jetzt senden“ gibt sie weiter, ohne das Ende des Schritts abzuwarten.",
      },
      {
        t: "Nie als Antwort gelesen",
        b: "Eine Nachricht, die du schickst, während eine Berechtigungsanfrage offen ist, wird zurückgehalten, statt als Antwort auf die Anfrage zu zählen, und geht an die Sitzung, sobald du die Anfrage beantwortet hast.",
      },
      {
        t: "Agenten und Hintergrundbefehle, mitgezählt",
        b: "Jeder Hintergrund-Agent, den Claude startet, bekommt eine eigene Zeile auf der Karte mit dem, was er gerade tut, und ein Befehl, der im Hintergrund weiterläuft, zeigt seine eigene Uhr, bis er endet.",
      },
      {
        t: "Es sagt dir Bescheid",
        b: "Eine Warnung zum Kontext, eine Komprimierung, eine Sitzung, die beendet ist oder nichts mehr meldet, eine Aufgabe, die ungewöhnlich lange läuft: Der Chat sagt es dir, ohne dass du nachsehen musst.",
      },
      {
        t: "Die Buttons sind schon da",
        b: "Unter dem Eingabefeld liegt eine Tastatur: ein Button pro laufender Sitzung, dann Status, Stop und Neu…, dann Vorlagen › für die Nachrichten, die du immer wieder tippst, und Befehle › für alles, was Claude Code selbst erledigt.",
      },
      {
        t: "/status, der ganze Chat auf einmal",
        b: "Alle Sitzungen in einer Liste, die du direkt bedienen kannst: was jede gerade tut, ihr Modell, wie viel Kontext noch bleibt, was sie gekostet hat, was in ihrer Warteschlange steht, mit „Stoppen“, „Antworten“ und dem Rest des Menüs bei jeder einzelnen.",
      },
    ],
    heard: "Gehört:",
    said: "fix den flaky Login-E2E-Test",
  },

  app: {
    eyebrow: "Die Mini App",
    title: "Ein Dashboard, ohne Telegram zu verlassen.",
    lead: "/app zeigt alle Sitzungen auf einmal: eine Kachel pro Sitzung, mit ihrem Kontext-Ring, ihrem Ordner, ihrem Modell und dem, was sie gekostet hat. Du antwortest weiter im Chat; die App ist für den Überblick über alle da und für das, was im Chat umständlich ist, etwa Änderungen (diff) lesen oder eine Einstellung ändern.",
    tabs: { sessions: "Sitzungen", settings: "Einstellungen" },
    summary: { needs: "braucht dich", working: "arbeiten", resting: "bereit", spent: "ausgegeben", finished: "beendet" },
    needsYou: "Brauchen dich",
    answerInChat: "Im Chat antworten",
    states: { working: "arbeitet", needs: "braucht dich", resting: "bereit" },
    settings: {
      updates: "Updates",
      upToDate: "Alles ist aktuell.",
      check: "Nach Updates suchen",
      language: "App-Sprache",
      languageNote: "Nur der eigene Text von aipager. Claudes Antworten bleiben gleich.",
      chatPrefs: "Chat-Einstellungen",
      chatPrefsNote: "Sie gelten für jede Sitzung in diesem Chat.",
      rows: [
        { k: "So sieht die Antwort aus", v: "Arbeitskarte + eigene Antwort" },
        { k: "Diff-Vorschauen", v: "Aus" },
        { k: "Karten-Updates bei langen Aufgaben", v: "An" },
        { k: "Neue Sitzungen" },
      ],
    },
    close: "Schließen",
    facts: [
      {
        t: "Alle Sitzungen auf einem Bildschirm",
        b: "Eine Kachel pro Sitzung, mit Kontext-Ring, wem sie gehört, Modell und Kosten. Darüber eine Zeile, die sagt, wie es im Chat steht: was arbeitet, was bereit ist, was der Tag gekostet hat, wie viele beendet sind. Mit dem + startest du eine weitere: ein Name, einer der Ordner, die du schon nutzt, ein Modell.",
      },
      {
        t: "Was auf dich wartet, steht oben",
        b: "Eine Sitzung, die auf deine Antwort zu einer Berechtigungsanfrage oder Frage wartet, steht ganz oben, mit dem, was sie fragt. „Im Chat antworten“ schickt die Anfrage samt Buttons wieder ans Ende des Chats, und du beantwortest sie dort.",
      },
      {
        t: "Eine Seite pro Sitzung",
        b: "Oben der Zustand, „Arbeitet (3:12)“ oder „Bereit, zuletzt aktiv vor 5 Min.“, und mit einem Tippen „Stoppen“ oder „Fortsetzen“. Darunter die zuletzt genutzten Tools, die letzte Antwort, die Modellauswahl, die Dateien, die Claude in dieser Aufgabe geändert hat, als Änderungen (diff), und die eigenen Einstellungen dieser Sitzung.",
      },
      {
        t: "aipager liefert die App selbst aus",
        b: "Sie ist standardmäßig an, jede Anfrage an die App wird anhand der Signatur von Telegram geprüft, und die Seite lädt nichts von anderswo: keine Schriften, keine Skripte. aipager miniapp disable schaltet sie aus.",
      },
    ],
    link: "Was die App kann",
  },

  langs: {
    eyebrow: "Fünfzehn Sprachen",
    title: "In deiner Sprache, bis hin zu den Ziffern.",
    lead: "Nur die eigenen Wörter von aipager ändern sich: Karten, Anfragen, Buttons, die angeheftete Leiste, /status, die Mini App, die Docs. Deine Sitzungen nicht: Claude antwortet in der Sprache, in der du schreibst, und was aipager an Claude schickt, bleibt, wie es war. Wähl eine mit /language oder lass aipager die Sprache deiner Telegram-App übernehmen.",
    facts: [
      {
        t: "Von rechts nach links, und zwar richtig",
        b: "Persisch und Arabisch laufen von rechts nach links, mit persischen (۰-۹) oder arabisch-indischen (٠-٩) Ziffern und eigenen Trennzeichen, in Telegram und in der Mini App. Sitzungsnamen, Pfade, Befehle und Code behalten ihre eigene Richtung.",
      },
      {
        t: "Geschrieben, nicht übersetzt",
        b: "Jede Sprache ist so geschrieben, wie die Leute, die ihre Apps in dieser Sprache nutzen, wirklich reden, Lehnwörter inklusive, und mit ihren eigenen Pluralformen (Arabisch hat sechs).",
      },
      {
        t: "Dein Chat, deine Sprache",
        b: "Ein privater Chat kann die Sprache deiner Telegram-App übernehmen. Eine Gruppe hat eine Sprache, die ein Admin festlegt, und ein Hinweis nach einem Tippen erscheint in der Sprache der Person, die getippt hat.",
      },
      {
        t: "Die Docs auch",
        b: "Die README und jede Seite unter docs/ sind übersetzt. Wenn eine Übersetzung und die englische Seite voneinander abweichen, gilt die englische Fassung.",
      },
    ],
    pinned: "Angeheftete Nachricht",
  },

  under: {
    eyebrow: "Unter dem Chat",
    title: "Maßgeblich bleibt das Terminal.",
    lead: "Claude Code läuft in einem echten Terminal, in dtach, also muss niemand ein Fenster offen halten. Jeder Schritt löst einen Hook aus, der ein Datagramm über einen lokalen Socket an aipager schickt, und aipager bearbeitet eine Nachricht in deinem Chat. Deine Antworten gehen denselben Weg zurück: eine Entscheidung an den Hook, der den Aufruf hält, oder Tastenanschläge in die Sitzung.",
    nodes: [
      { t: "Claude Code", b: "in dtach, kein Fenster nötig" },
      { t: "Hook", b: "löst bei jedem Schritt aus" },
      { t: "aipager", b: "ein Prozess, unter deinem Benutzer" },
      { t: "Telegram", b: "dein eigener Bot-Token" },
      { t: "deine Chats", b: "dein privater Chat, die Gruppe deines Teams" },
    ],
    facts: [
      {
        t: "Setz dich jederzeit davor",
        b: "aipager session api verbindet dich aus jedem Terminal mit der laufenden Sitzung. Tipp dort, tipp im Chat: dieselbe Sitzung. Schließ das Fenster, und sie läuft weiter; die Verbindung folgt der Sitzung sogar durch einen Neustart.",
      },
      {
        t: "Es liest nie deinen Bildschirm",
        b: "aipager tippt in die Sitzung und hört auf die eigenen Ereignisse von Claude Code. Was dein Chat zeigt, kommt aus den Hooks und der gespeicherten Unterhaltung, nicht aus dem Auslesen eines Terminals.",
      },
      {
        t: "Nichts wartet auf den Chat",
        b: "Ein Hook schickt ein Datagramm und ist fertig; das kostet Claude Code etwa 20 ms. Hört aipager gerade nicht zu, fällt das Ereignis einfach weg und Claude macht weiter; aipager holt später aus den eigenen Dateien der Sitzung nach, was gefehlt hat.",
      },
    ],
    hooks: "Sechzehn Hooks, dazu die Statuszeile, die Modell, Kontext und Kosten liefert. aipager ist an jeden einzelnen davon angeschlossen.",
  },

  trust: {
    eyebrow: "Sicherheit",
    title: "Nichts dazwischen.",
    lead: "aipager spricht nie mit Anthropic. Das tut nur Claude Code selbst, mit deinem eigenen Login, auf deinem eigenen Computer. aipager startet es in einem Terminal und hört auf die Hooks, die Claude Code veröffentlicht. Kein nachgebauter Endpunkt, kein Proxy, kein Konto außer deinem: Die Sitzung, die du vom Handy aus steuerst, ist dieselbe, die du an der Tastatur steuern würdest.",
    cards: [
      {
        t: "Kein aipager-Server.",
        b: "aipager spricht mit der Telegram Bot API über deinen eigenen Bot-Token. Es gibt kein aipager-Konto und keinen aipager-Dienst, und zwischen deinem Handy und deinem Computer steht kein fremder Computer.",
      },
      {
        t: "Nur deine Chats bekommen Antwort.",
        b: "aipager antwortet nur in den Chats, die in deiner Konfiguration stehen. Fremde, die den Bot finden, bekommen nur eine Zeile, dass er nicht für sie eingerichtet ist; nichts, was sie schicken, erreicht eine Sitzung.",
      },
      {
        t: "Kein offener Port.",
        b: "aipager lauscht nur auf Loopback. Die Mini App geht über einen Cloudflare-Tunnel nach außen, wo jede Anfrage Telegrams Signatur tragen muss, und aipager miniapp disable schaltet sie aus.",
      },
      {
        t: "Dein Token, deine Datei.",
        b: "Der Bot-Token und die Chat-IDs liegen in ~/.config/aipager/aipager.yaml mit den Dateirechten 600. Sie kommen nicht ins Log von aipager und werden überall geschwärzt, wo sie doch in ein Log rutschen könnten.",
      },
      {
        t: "Es holt sich nie mehr Rechte.",
        b: "Kein sudo, kein setuid. Alles, was es schreibt, liegt in deinem Home-Ordner, in /tmp oder in seinem eigenen Socket-Ordner, und jeder Prozess, den es startet (claude, dtach, die Installer), läuft unter deinem Benutzer.",
      },
      {
        t: "Claude Code entscheidet weiter.",
        b: "In deiner settings.json steht, wofür nachgefragt werden muss. aipager reicht die Frage nur weiter; es entscheidet nie, was laufen darf, und ein Button aus einer fertigen Aufgabe ist veraltet und greift nicht in die Arbeit ein, die gerade läuft.",
      },
      {
        t: "Zugang gibt es nur am Computer.",
        b: "Mitglieder und Rollen ändern sich nur mit aipager config, auf dem Computer. Nichts in Telegram und nichts in der Mini App fügt eine Person hinzu oder erweitert eine Rolle.",
      },
      {
        t: "Jede Antwort steht im Audit-Log.",
        b: "Jedes Erlauben, jedes Ablehnen und jede Antwort wird an ~/.claude/aipager-audit.jsonl angehängt (nie überschrieben), in einer Gruppe mit dem Namen der Person, die getippt hat.",
      },
    ],
    link: "Das Sicherheitsmodell",
  },

  install: {
    eyebrow: "Installieren",
    title: "Vier Zeilen. Ab in die Gespeicherten Nachrichten.",
    lead: "Tipp auf eine Zeile, um sie zu kopieren. Zwei Dinge vorher: ein eigener Bot von @BotFather (tipp dort auf „Starten“) und Claude Code, auf diesem Computer angemeldet. Der Assistent in Zeile zwei fragt den Rest ab.",
    agent: {
      title: "Oder gib es dem Agenten, den du schon hast.",
      lead: "Leg den Bot-Token in eine Datei, die der Agent nie lesen muss, und gib Claude Code dann das hier:",
      link: "Die Anleitung, der er folgt",
    },
    saved: { name: "Gespeicherte Nachrichten", count: "4 Nachrichten" },
    lines: [
      { note: "uv, pipx oder Homebrew, was du eben hast. Linux oder macOS." },
      { note: "dein Bot-Token von @BotFather, dein Chat, die Hooks von Claude Code" },
      { note: "hält aipager am Laufen, auch wenn du dich abmeldest" },
      { note: "Claude Code in dtach. Ab hier übernimmt dein Chat." },
    ],
    copied: "Kopiert",
    pm: "Lieber dein Paketmanager? uv, pipx, Homebrew, Docker, Nix, das AUR und Snap.",
    pmLink: "alle Wege zur Installation",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Frag einfach.",
    readBack: "zieh, um nachzulesen",
    items: [
      {
        q: "Was ist der Unterschied zu den Claude-Apps fürs Handy?",
        a: "Die Apps von Claude sprechen mit dem gehosteten Assistenten von Anthropic. aipager spiegelt eine Sitzung von Claude Code, die auf deinem eigenen Computer läuft: dein Repo, deine Tools, deine Umgebung.",
      },
      {
        q: "Verlässt mein Code meinen Computer?",
        a: "Nur bis in deine eigenen Telegram-Chats. aipager spricht mit Telegram über deinen eigenen Bot-Token; dazwischen steht kein aipager-Server.",
      },
      {
        q: "Kann mein Claude-Konto dadurch gesperrt werden?",
        a: "aipager spricht nie mit Anthropic. Es startet die offizielle claude-CLI auf deinem Computer und liest die Hooks, die Claude Code veröffentlicht, und deine Nachrichten werden genau so in diese Sitzung getippt, als säßest du an der Tastatur: kein nachgebauter Endpunkt, kein Proxy, kein geteiltes Konto, nichts über fremde Server. Anthropic sieht dein eigenes Login von Claude Code, das genau das tut, was es sonst auch tut. Für das, worum du Claude bittest, gelten weiter die Nutzungsrichtlinien von Anthropic, und ein Team an einem Bot teilt sich trotzdem dein Abo: Für ein Team lässt du aipager besser unter einem eigenen Konto laufen oder nimmst einen API-Key mit Ausgabenlimit.",
      },
      {
        q: "Brauche ich ein VPN oder einen offenen Port?",
        a: "Nein. aipager fragt Telegram von sich aus über HTTPS ab und lauscht auf keinem Port außerhalb von Loopback, also gibt es nichts weiterzuleiten und nichts, was aus dem Netz erreichbar wäre. Dein Handy spricht mit Telegram; Telegram spricht mit der ausgehenden Verbindung deines Computers.",
      },
      {
        q: "Was, wenn Claude aus dem Ruder läuft?",
        a: "Anfragen warten auf dein Tippen, /stop unterbricht die Aufgabe und löscht alles aus der Warteschlange, /kill beendet die Sitzung, und Buttons aus einer fertigen Aufgabe sind veraltet und tun nichts mehr.",
      },
      {
        q: "Kann mein Team es nutzen?",
        a: "Ja. Steck den Bot in eine Gruppe mit Rollen: owner, admin, user, read_only. Jede Nachricht läuft mit den Berechtigungen der Person, die sie schickt, ein Mitglied ohne can_manage arbeitet in seinem Stammordner, und jede Entscheidung landet im Audit-Log.",
      },
      {
        q: "Kann ich ihm eine Sprachnachricht oder einen Screenshot schicken?",
        a: "Beides. Eine Sprachnachricht wird auf deinem Computer in Text umgewandelt und in die Sitzung getippt, als hättest du sie geschrieben; ein Foto oder eine Datei wird lokal gespeichert, und Claude bekommt den Pfad, mit deiner Bildunterschrift als Nachricht.",
      },
      {
        q: "Spricht es meine Sprache?",
        a: "Fünfzehn, gewählt mit /language oder von deiner Telegram-App übernommen. Persisch und Arabisch laufen von rechts nach links, mit eigenen Ziffern. Nur der eigene Text von aipager ändert sich; Claude antwortet in der Sprache, in der du schreibst.",
      },
      {
        q: "Gibt es ein Dashboard?",
        a: "/app öffnet eine Mini App in Telegram: eine Kachel pro Sitzung, eine Diff-Ansicht für jedes Write und Edit, die Einstellungen, Stoppen mit einem Tippen. Sie ist standardmäßig an, jede Anfrage wird anhand der Signatur von Telegram geprüft, und aipager miniapp disable schaltet sie aus.",
      },
      {
        q: "Was ist dtach?",
        a: "Ein winziges Programm, das ein Terminal abkoppelt. Es hält Claude Code am Laufen, nachdem das Terminal zugeht oder SSH abbricht, sodass eine Antwort, die du eine Stunde später schickst, noch eine laufende Sitzung erreicht. Es ist bei aipager dabei.",
      },
      {
        q: "Läuft es weiter, wenn ich mich abmelde?",
        a: "aipager service install hält aipager unter systemd oder launchd am Laufen, und die Sitzungen selbst laufen in dtach, also überleben sie das Terminal, das sie gestartet hat. Es gibt auch Pakete für Docker, Nix, das AUR und Snap.",
      },
      {
        q: "Wie aktualisiere ich es?",
        a: "/update prüft aipager und Claude Code und installiert die neue Version, danach startet „🔄 Jetzt neu starten“ aipager dort neu, wo es läuft: in einem Terminal, in tmux, in Docker oder als Dienst. Deine Sitzungen laufen die ganze Zeit weiter.",
      },
      {
        q: "Was kostet es?",
        a: "Nichts. Es steht unter der MIT-Lizenz, der Bot gehört dir, und Claude Code nutzt weiter den Plan oder den Key, den es schon nutzt.",
      },
    ],
  },

  cta: {
    title: "Hol Claude in deine Chats.",
    lead: "Dann mach das Terminal zu und genieß deinen Abend.",
    copy: "Kopieren",
  },

  footer: { changelog: "Changelog", issues: "Issues" },

  docs: {
    title: "Docs",
    description: "Das Nachschlagewerk zu aipager: Architektur, Hooks, Befehle, Fehlerbehebung, Sicherheit.",
    onThisPage: "Auf dieser Seite",
    translated: "Diese Seite ist eine Übersetzung der englischen Seite; wenn die beiden voneinander abweichen, gilt die englische Fassung.",
    english: "English",
    source: "Quelle auf GitHub",
    onGitHub: "Diese Seiten auf GitHub",
    sourceNote: "Das Markdown im Repo ist derselbe Text, den du hier liest.",
    prev: "Zurück",
    next: "Weiter",
    groups: ["Hier anfangen", "Nachschlagen", "Im Betrieb"],
  },

  demo: {
    people: { you: "Du" },
    typing: "schreibt",
    isTyping: "schreibt",
    days: { today: "Heute", yesterday: "Gestern", monday: "Montag" },
    chats: {
      aipager: { name: "aipager", subtitle: "Bot" },
      team: { name: "backend-team", subtitle: "5 Mitglieder, 3 online" },
      mom: { name: "Mama", subtitle: "online" },
      friends: { name: "Freitagskick ⚽", subtitle: "9 Mitglieder" },
      sara: { name: "Sara", subtitle: "zuletzt kürzlich online" },
      saved: { name: "Gespeicherte Nachrichten", subtitle: "" },
    },
    folders: { all: "Alle Chats", personal: "Privat", work: "Arbeit", bots: "Bots" },
    seed: {
      oldPrompt: "inaktive Sessions nach 30 Minuten ablaufen lassen",
      oldAnswer: "Fertig. Der Session-Store lässt inaktive Sessions jetzt nach 30 Minuten ablaufen; 212 Tests laufen durch.",
      teamFlaky: "login auf prod ist wieder flaky 😬 jemand ne idee?",
      teamSaw: "hab ich auch gesehen, zweimal in der letzten Stunde",
      momEat: "Hast du schon gegessen? 🙂",
      friendsPitch: "platz gebucht, freitag 19 uhr",
      friendsIn: "bin dabei 🙋",
      friendsBall: "bin dabei, bring den neuen ball mit",
      saraMerged: "hab deinen PR gemerged 🚀",
      saraThanks: "dankeee",
      savedConfig: "aipager config",
    },
    says: {
      youPasta: "ja! pasta gemacht 🍝 und du?",
      momLunch: "Sonntag Mittagessen um eins? 😊",
      youLunch: "13 Uhr ❤️",
      teamRun: "@aipagerbot /web lass den Login-E2E gegen staging laufen",
      teamKubectl: "@aipagerbot /web kubectl rollout restart deploy/api",
      friendsWho: "wer ist freitag dabei? brauchen noch 2 ⚽",
      youIn: "bin dabei 🙋‍♂️",
      saraVacation: "hast du dich wegen urlaub schon entschieden? 🏖",
      youTwoMinutes: "zwei Minuten 😄",
      youBook: "Lissabon, 12.–19. März ☀️ Flüge 193 €, Hotel 142 €",
      saraBook: "jaaa!! buch das 🎉",
    },
    prompts: {
      fix: "fix den flaky Login-E2E-Test",
      trip: "eine Woche Lissabon im März: schau dir zuerst das Wetter an, dann 3 Hotels unter 180 € und Flüge ab Berlin. Wenn das Wetter schlecht aussieht, probier Sevilla.",
      more: "schick ein paar Agenten dafür los: einen für Hotels unter 180 €, einen für Flüge ab Berlin",
      push: "push außerdem den Fix-Branch und mach den PR auf",
      teamRun: "lass den Login-E2E gegen staging laufen",
    },
    claude: {
      plan: "Ich lasse den Login-Test ein paar Mal laufen und schaue, wo er fehlschlägt.",
      flaky: "Er fällt etwa bei jedem fünften Lauf durch. Ein Timing-Problem, kein Logikfehler.",
      cookie: "Der Test klickt, bevor das Session-Cookie gesetzt ist. Er schläft 5 s und hofft.",
      answer: "Behoben. Der Test wartet jetzt auf das Session-Cookie, statt 5 s zu schlafen. 10 Läufe hintereinander, alle grün.",
      teamTests: "18 von 18 Login-Tests laufen auf staging durch. Der Fehler zeigt sich dort nicht.",
      weather: "Erst das Wetter: Es bringt nichts, eine Woche Regen durchzurechnen.",
      lisbon: "Lissabon im März: tagsüber 18 °C, Regen an 2 von 7 Tagen. Reicht, Sevilla brauchen wir nicht.",
      pr: "fix/login-cookie gepusht und PR #214 aufgemacht. Die CI läuft darauf.",
      teamShort: "18 von 18 Login-Tests laufen auf staging durch.",
      twoAgents: "Dann zwei Agenten: einer für die Betten, einer für die Sitze.",
      interim: "Lissabon steht: 18 °C, zwei Regentage. Beide Agenten suchen noch; ich melde mich mit der engeren Auswahl.",
      shortlist:
        "Hotels: Casa Baleal 142 € pro Nacht, Lx Boutique 165 €, Santa Justa 178 €, alle in Laufweite zur Baixa. Flüge: TAP direkt, 89 € hin am 12. und 104 € zurück am 19. Sag Bescheid, dann reserviere ich beides.",
    },
    question: {
      verb: "Timeout erhöhen oder auf das Cookie warten?",
      question: "Timeout erhöhen oder auf das Cookie warten?",
      options: ["Timeout erhöhen", "Auf das Cookie warten", "Beides"],
      title: "Fix",
      body: "Der Test schläft 5 s, bevor er klickt.",
    },
    captions: {
      restAuto: "Eine Sitzung von Claude Code liegt auf deinem Laptop bereit, im Auto-Modus, in dem jede neue Sitzung startet.",
      restAsk: "Eine Sitzung von Claude Code liegt auf deinem Laptop bereit, im Fragen-Modus: Sie fragt vor jeder Aktion.",
      restFull: "Eine Sitzung von Claude Code liegt auf deinem Laptop bereit. Vor der nächsten Aufgabe schaltest du ihre Prüfungen ab.",
      held: "Pausiert, solange du dich umsiehst. Warte einen Moment, und der Abend geht weiter.",
      arrived: "👀 heißt: angekommen. aipager tippt deine Nachricht in die Sitzung, genau so, als säßest du an der Tastatur.",
      took: "👍 heißt: Claude hat die Nachricht angenommen. Ab hier übernimmt eine Karte, die sich während der Aufgabe selbst aktualisiert.",
      glance: "Claude lässt den Test ein paar Mal laufen. Jeder Schritt aktualisiert dieselbe Karte.",
      momFirst: "Mama hat vor zwanzig Minuten gefragt. Hier braucht dich gerade nichts, also antwortest du ihr.",
      sent: "Gesendet. Du gehst aus dem Chat raus, so wie jeder.",
      workAuto:
        "Der Auto-Modus, in dem jede neue Sitzung startet: Die Sicherheitsprüfung von Claude Code hat das Lesen und den Testlauf von allein durchgelassen. Keines von beiden kam zu dir.",
      askRead: "Der Fragen-Modus: Jeder Aufruf wartet auf dich. Dieser will nur eine Datei lesen.",
      askTest: "Und noch einmal für den Testlauf. Im Auto-Modus hätte keiner von beiden gefragt.",
      workFull: "Der Vollzugriff-Modus: Claude Code fragt nichts, und aipager hat nichts weiterzureichen. Du siehst nur, was Claude getan hat.",
      momAgain: "Mama noch einmal. Die Sitzung läuft hinter dir weiter; sie braucht kein offenes Fenster.",
      team: "Die Gruppe des Teams. Alle auf der Liste der erlaubten Personen können den Bot erwähnen; jede Nachricht läuft mit der Rolle der Person, die sie schickt.",
      teamSara:
        "Sara ist Admin in dieser Gruppe, also geht ihr Testlauf durch. Die Nachricht erreicht Claude mit dem Vermerk, wer sie geschickt hat und mit welcher Rolle sie läuft.",
      teamSam: "Sam hat in dieser Gruppe die Rolle user. Bash ist für diese Rolle gesperrt, also wird der Aufruf abgelehnt, bevor er läuft.",
      questionAuto:
        "Jetzt etwas, das nur du beantworten kannst. Ein Modus entscheidet, was ohne Nachfrage läuft; eine Frage wie diese kommt in jedem Modus zu dir.",
      questionAsk: "Eine Frage, keine Berechtigungsanfrage: eine Entscheidung von Claude, mit einem Button pro Option.",
      buzzed: "Dein Handy hat auf der Sofalehne gebrummt. Drei Buttons, ein Tippen.",
      answerTyped: "Deine Antwort wird in die Sitzung getippt, als säßest du an der Tastatur.",
      friends: "Familie, Freunde, Arbeit und Claude: eine App, die du sowieso aufmachst.",
      answerDone: "Fertig. Die Antwort landet wie jede andere Nachricht, und die angeheftete Leiste wird ruhig.",
      evening: "Ein flaky Test, vom Sofa aus behoben, zwischen einer Frage von Mama und einem Spiel am Freitag.",
      saraPing: "Nicht alles, was sich meldet, ist Arbeit.",
      second: "Eine zweite Sitzung, aus dem Chat gestartet: kein Terminal, kein ssh.",
      newReady: "aipager startet sie auf deinem Computer und gibt sie bereit zurück, in dem Modus, in dem neue Sitzungen starten.",
      weather: "Claude prüft das, woran alles andere hängt, und sagt, was dabei herauskam.",
      queued: "Gesendet, während Claude noch arbeitet: aipager gibt die Nachricht sofort weiter, Claude stellt sie in die Warteschlange, und das 👀 sagt, dass sie drin ist.",
      queueLine: "Die Zeile darunter sagt, worauf sie wartet, und ein Tippen darauf gibt die Nachricht mitten im Schritt an Claude.",
      tookIt:
        "Claude nimmt sie am Ende des Schritts an: 👍, das Grau verschwindet, die Zeile geht weg, und die Karte rutscht unter die Nachricht, die sie beantwortet.",
      agents: "Claude schickt zwei auf einmal los. Jeder bekommt eine eigene Zeile, und die Karte folgt dem, was jeder gerade tut.",
      agentsWork: "Jetzt sind sie auf sich gestellt: ein paar Tools pro Agent, und für dich nichts zu tun.",
      twoSessions:
        "In diesem Chat laufen jetzt zwei Sitzungen. Eine normale Nachricht geht an die Sitzung, die in der angehefteten Leiste steht; um die andere zu erreichen, antwortest du auf eine ihrer Nachrichten.",
      hold: "Halt sie gedrückt, und Telegram zeigt dir, was du mit ihr machen kannst.",
      reply: "Antworten. Das Eingabefeld antwortet auf diese Nachricht, und aipager liest daraus ab, wohin sie geht.",
      aimed: "In api getippt, nicht in trip.",
      interim: "Die Aufgabe ist vor den Agenten fertig, also geht die Antwort mit einer Live-Zeile darunter raus, für die Arbeit, die noch läuft.",
      apiFirst: "api antwortet zuerst; dort war nur die eine Sache zu tun.",
      liveLine: "aipager hält diese Zeile von allein aktuell, während die Agenten arbeiten.",
      bothBack: "Beide zurück. aipager fasst die Zeile zusammen, und Claude wird mit dem geweckt, was die Agenten gefunden haben.",
      shortlist: "Was sie gefunden haben, kommt als eigene Antwort zurück, geschrieben, nachdem Claude beide Berichte gelesen hat.",
      human: "Bleibt nur der Teil, den dir kein Computer abnehmen sollte.",
      end: "Zwei Sitzungen, drei Agenten und eine Woche Lissabon, vom Sofa aus. Nichts läuft mehr, nichts ist mehr anzutippen.",
      resting: "Diese Sitzung ist bereit. Bevor du ihr die nächste Aufgabe gibst, schaltest du ihre Prüfungen ab.",
      fullWho: "Der Vollzugriff-Modus ist für Admins, und für dich, in deinem eigenen privaten Chat mit dem Bot.",
      fullRestart:
        "Der Wechsel in den Vollzugriff-Modus oder aus ihm heraus startet die Sitzung neu; die Unterhaltung bleibt erhalten. Zwischen Fragen-Modus und Auto-Modus startet gar nichts neu.",
    },
    switch: {
      default: "Standard",
      lines: [
        "Jeder Aufruf hält an und wartet auf dein Tippen.",
        "Sichere Aufrufe laufen von allein; riskante warten auf deine Erlaubnis.",
        "Nichts hält an. Nichts fragt.",
      ],
    },
    cable: { idle: "wartet auf eine Aufgabe", quiet: "nichts Neues", flick: "das Kabel ist echt · zupf dran", daemon: "aipager" },
    wire: {
      cardEdited: "Karte aktualisiert · Bash ×1",
      twoCalls: "zwei Aufrufe, nichts anzutippen",
      trace: "der Trace, und was er zeigt",
      permNeeded: "🔐 Braucht deine Erlaubnis",
      readRuns: "Entscheidung · das Lesen läuft",
      testRuns: "Entscheidung · der Test läuft",
      threeCalls: "drei Aufrufe, keine Prüfungen",
      question: "❓ eine Frage, mit Buttons",
      answerTyped: "Antwort eingetippt",
      claudeAnswer: "💬 Claudes Antwort",
      sessionIn: "eine Sitzung in ~/travel",
      typedTrip: "in claude-trip getippt",
      newCardTrip: "eine neue Karte · trip",
      lisbon: "Lissabon im März · 18 °C",
      queued: "claude-trip · in der Warteschlange",
      tookIt: "angenommen · 👍",
      twoAgents: "🤖 zwei Agenten",
      aimed: "an claude-api gerichtet",
      cardApi: "eine Karte · api",
      interim: "💬 trip · eine Zwischenantwort",
      thePr: "💬 api · der PR",
      flightsDone: "✅ Flüge · 7 Tools genutzt",
      hotelsDone: "✅ Hotels · 11 Tools genutzt",
      shortlist: "💬 trip · die engere Auswahl",
      switchFull: "in den Vollzugriff-Modus wechseln?",
      restarting: "startet neu, Unterhaltung bleibt",
      typedApi: "in claude-api getippt",
      newCardApi: "eine neue Karte · api",
      yourMessage: "deine Nachricht",
      aReply: "eine Antwort · api",
    },
    hints: {
      cancel: "„Abbrechen“ würde api so lassen, wie es ist. Dieser Abend geht im Vollzugriff-Modus weiter: Probier den anderen Button.",
      deny: "„Ablehnen“ würde den Aufruf wirklich blockieren. Dieser Abend braucht den Testlauf: Tippe auf „Erlauben“.",
      stop: "„Stoppen“ würde die Aufgabe unterbrechen. Tippe auf „Erlauben“.",
    },
    menu: ["Antworten", "Text kopieren", "Anheften", "Weiterleiten", "Auswählen", "Löschen"],
    composer: "Nachricht schreiben…",
    search: "Suche",
  },
};
