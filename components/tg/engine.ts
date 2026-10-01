"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { storyFor, type Step } from "./story";
import { initialWorld, open, type ChatId, type Folder, type Mode, type World } from "./world";

const VERBS = ["Tinkering", "Pondering", "Investigating", "Deciphering", "Percolating", "Noodling", "Brewing", "Synthesizing"];
/** How long the story holds still after the reader clicked something. */
const HOLD_MS = 7000;
const NOTE_MS = 5200;

export interface Story {
  world: World;
  /** a prompt is waiting for the reader's tap */
  waiting: { chat: ChatId; msg: string } | null;
  openChat: (id: ChatId) => void;
  setFolder: (f: Folder) => void;
  tap: (chat: ChatId, msg: string, choice: number) => boolean;
  dismiss: (id: string) => void;
  /** the reader is looking around; the story waits for them */
  held: boolean;
}

export function useStory(active: boolean, mode: Mode): Story {
  const [world, setWorld] = useState<World>(() => initialWorld(mode));
  const [waiting, setWaiting] = useState<Story["waiting"]>(null);
  const [held, setHeld] = useState(false);
  const idx = useRef(0);
  const lastStepAt = useRef(0);
  const lastUser = useRef(-1e9);
  const gateSince = useRef<number | null>(null);
  const noteBorn = useRef(new Map<string, number>());
  const steps = useRef<Step[]>(storyFor(mode));

  // A new permission mode starts the evening again, in that mode.
  const shown = useRef(mode);
  useEffect(() => {
    if (shown.current === mode) return;
    shown.current = mode;
    steps.current = storyFor(mode);
    idx.current = 0;
    lastStepAt.current = performance.now();
    gateSince.current = null;
    lastUser.current = -1e9;
    setWaiting(null);
    setHeld(false);
    setWorld(initialWorld(mode));
  }, [mode]);

  const edit = useCallback((fn: (w: World) => void) => {
    setWorld((prev) => {
      const w = structuredClone(prev);
      fn(w);
      return w;
    });
  }, []);

  // The story: one step at a time.
  useEffect(() => {
    if (!active) return;
    lastStepAt.current = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const userBusy = now - lastUser.current < HOLD_MS;
      setHeld(userBusy && gateSince.current === null);
      const step = steps.current[idx.current];
      if (!step) {
        // The end: start the evening again.
        idx.current = 0;
        lastStepAt.current = now;
        gateSince.current = null;
        setWaiting(null);
        setWorld(initialWorld(shown.current));
        return;
      }
      if (now - lastStepAt.current < step.after) return;
      if (step.gate) {
        if (gateSince.current === null) {
          gateSince.current = now;
          setWaiting({ chat: step.gate.chat, msg: step.gate.msg });
        }
        // Tapped for the reader once they have left it alone long enough.
        if (!userBusy && now - gateSince.current >= step.gate.auto) {
          const g = step.gate;
          edit((w) => g.resolve(w, g.choice));
          gateSince.current = null;
          setWaiting(null);
          idx.current += 1;
          lastStepAt.current = now;
        }
        return;
      }
      if (userBusy) return;
      edit((w) => {
        if (step.open) open(w, step.open);
        if (step.caption) w.caption = step.caption;
        step.run?.(w);
      });
      idx.current += 1;
      lastStepAt.current = now;
    }, 60);
    return () => window.clearInterval(id);
  }, [active, edit]);

  // Claude keeps working: busy cards and spinners tick every second.
  useEffect(() => {
    if (!active) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      edit((w) => {
        for (const c of Object.values(w.chats)) {
          for (const m of c.msgs) {
            if (m.kind === "card" && m.mark === "⏳") {
              m.elapsed += 1;
              if (n % 3 === 0 && !["Testing", "Running", "Editing"].includes(m.verb)) m.verb = VERBS[(VERBS.indexOf(m.verb) + 1) % VERBS.length];
            }
          }
        }
        for (const p of w.panes) {
          if (!p.spinner) continue;
          p.secs += 1;
          if (n % 3 === 0 && !["Testing", "Running"].includes(p.spinner)) p.spinner = VERBS[(VERBS.indexOf(p.spinner) + 1) % VERBS.length];
        }
        // Notifications fade away on their own.
        const now = performance.now();
        for (const note of w.notes) if (!noteBorn.current.has(note.id)) noteBorn.current.set(note.id, now);
        w.notes = w.notes.filter((x) => now - (noteBorn.current.get(x.id) ?? now) < NOTE_MS);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [active, edit]);

  const touch = () => {
    lastUser.current = performance.now();
    setHeld(true);
  };

  const openChat = useCallback(
    (id: ChatId) => {
      touch();
      edit((w) => open(w, id));
    },
    [edit],
  );

  const setFolder = useCallback(
    (f: Folder) => {
      touch();
      edit((w) => {
        w.folder = f;
      });
    },
    [edit],
  );

  const tap = useCallback(
    (chat: ChatId, msg: string, choice: number): boolean => {
      const step = steps.current[idx.current];
      if (!step?.gate || step.gate.chat !== chat || step.gate.msg !== msg || gateSince.current === null) return false;
      const g = step.gate;
      edit((w) => g.resolve(w, choice));
      gateSince.current = null;
      setWaiting(null);
      idx.current += 1;
      lastStepAt.current = performance.now();
      // A tap answers the story; it doesn't pause it.
      lastUser.current = -1e9;
      setHeld(false);
      return true;
    },
    [edit],
  );

  const dismiss = useCallback(
    (id: string) =>
      edit((w) => {
        w.notes = w.notes.filter((n) => n.id !== id);
      }),
    [edit],
  );

  return { world, waiting, openChat, setFolder, tap, dismiss, held };
}
