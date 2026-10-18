"use client";

import { AnimatePresence, motion } from "framer-motion";
import { digits } from "@/lib/i18n/locales";
import { useLocale } from "./locale-context";
import type { ChatId, World } from "./world";

/**
 * A Telegram notification: on the desk it slides in at the top right, on a
 * phone it drops over the conversation. Tapping one opens that chat.
 */
export function Notes({ world, onOpen, onDismiss, className }: { world: World; onOpen: (c: ChatId) => void; onDismiss: (id: string) => void; className: string }) {
  const locale = useLocale();
  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {world.notes.map((n) => {
          const c = world.chats[n.chat];
          // when the message came in, as the chat list shows it
          let time = "";
          for (const m of c.msgs) if (m.kind !== "day") time = m.time;
          const when = digits(time, locale);
          return (
            <motion.button
              key={n.id}
              type="button"
              layout
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              onClick={() => {
                onOpen(n.chat as ChatId);
                onDismiss(n.id);
              }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1e2733]/90 p-3 text-start shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] backdrop-blur-xl"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#2aabee] text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M21.5 4.3 2.9 11.5c-1 .4-1 1.1-.2 1.4l4.7 1.5 1.8 5.6c.2.6.4.7.9.7.4 0 .6-.2.9-.5l2.2-2.2 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.3c.3-1.2-.5-1.8-1.3-1.5ZM8.4 14l9.4-6-7.7 7.3-.3 3.2L8.4 14Z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 leading-snug">
                <span className="flex items-center justify-between text-[12.5px] font-semibold text-white">
                  {n.title}
                  <span className="text-[11px] font-normal text-white/45">{when}</span>
                </span>
                <span className="line-clamp-2 text-[12.5px] text-white/75">{n.body}</span>
              </span>
              <span className="sr-only">{c.name}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
