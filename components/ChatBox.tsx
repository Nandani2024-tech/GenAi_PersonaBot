"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PersonaId, personaMeta } from "@/lib/personas";

type Props = {
  persona: PersonaId;
};

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatBox({ persona }: Props) {
  const meta = personaMeta[persona];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pulseSuccess, setPulseSuccess] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const showEmpty = messages.length === 0;
  const quickPrompts = useMemo(() => meta.quickPrompts, [meta.quickPrompts]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", text: input },
    ];

    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, persona }),
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        { role: "bot", text: data.reply },
      ]);
      setPulseSuccess(true);
      window.setTimeout(() => setPulseSuccess(false), 240);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { role: "bot", text: "Error occurred" },
      ]);
      setError("Something went wrong. Please try again.");
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div
        className="glass rounded-2xl overflow-hidden border"
        style={{
          borderColor: "color-mix(in srgb, var(--color-border-subtle) 80%, transparent)",
          boxShadow: "var(--elevation-surface-2)",
        }}
      >
        {/* Top identity strip */}
        <div
          className="px-4 sm:px-5 py-4 border-b"
          style={{
            background: "var(--color-dominant)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-extrabold"
              style={{
                background: `color-mix(in srgb, var(${meta.accentVar}) 82%, var(--color-surface-2))`,
                color: "var(--color-text-on-dark)",
                fontFamily: "var(--font-manrope)",
              }}
            >
              {meta.initials}
            </div>
            <div className="min-w-0">
              <p
                className="text-[1.125rem] font-extrabold leading-tight truncate"
                style={{ fontFamily: "var(--font-manrope)", color: "var(--color-text-on-dark)" }}
              >
                {meta.name}
              </p>
              <p className="text-xs font-medium truncate" style={{ color: "var(--color-text-muted)" }}>
                {meta.role}
              </p>
            </div>
          </div>
        </div>

        {/* Stream */}
        <div
          className="h-[60vh] sm:h-[64vh] overflow-y-auto overflow-x-hidden px-4 sm:px-5 py-5"
          style={{ background: "var(--color-bg-canvas)" }}
        >
          {showEmpty ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-xl">
                <div
                  className="mx-auto h-[72px] w-[72px] rounded-full flex items-center justify-center text-2xl font-extrabold"
                  style={{
                    background: `color-mix(in srgb, var(${meta.accentVar}) 82%, var(--color-surface-2))`,
                    color: "var(--color-text-on-dark)",
                    fontFamily: "var(--font-manrope)",
                  }}
                >
                  {meta.initials}
                </div>
                <h2
                  className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight"
                  style={{ fontFamily: "var(--font-manrope)", color: "var(--color-text-on-dark)" }}
                >
                  Ask me something real.
                </h2>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                  {meta.role}
                </p>
                <p className="mt-4 text-sm italic">
                  <span className="shimmer-text">Pick a question below or type your own</span>
                </p>

                {/* Quick prompts */}
                <div
                  className="mt-5 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  style={{ paddingInline: "var(--space-4)" }}
                >
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={p}
                      type="button"
                      className="shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all active:scale-95"
                      style={{
                        background: "var(--color-surface-1)",
                        borderColor: "var(--color-border-subtle)",
                        color: "var(--color-text-secondary)",
                        transitionDuration: "var(--motion-base)",
                        transitionTimingFunction: "var(--ease-out)",
                        paddingRight: idx === quickPrompts.length - 1 ? "var(--space-4)" : undefined,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `var(${meta.accentVar})`;
                        e.currentTarget.style.color = "var(--color-text-on-dark)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border-subtle)";
                        e.currentTarget.style.color = "var(--color-text-secondary)";
                      }}
                      onClick={() => setInput(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={i}
                    className={`msg-enter flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser ? (
                      <div className="flex items-end gap-2 max-w-full">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-extrabold"
                          style={{
                            background: `color-mix(in srgb, var(${meta.accentVar}) 70%, var(--color-surface-2))`,
                            color: "var(--color-text-on-dark)",
                            fontFamily: "var(--font-manrope)",
                          }}
                        >
                          {meta.initials}
                        </div>
                        <div
                          className="max-w-[72%] md:max-w-[60%] rounded-2xl border px-4 py-3 text-sm leading-6"
                          style={{
                            background: "var(--color-surface-2)",
                            borderColor: "var(--color-border-subtle)",
                            color: "var(--color-text-secondary)",
                            borderLeftWidth: "2px",
                            borderLeftColor: `var(${meta.accentVar})`,
                            boxShadow: "var(--elevation-surface-1)",
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="max-w-[72%] md:max-w-[60%] rounded-2xl border px-4 py-3 text-sm leading-6 mr-1"
                        style={{
                          background: "color-mix(in srgb, var(--color-accent-1) 28%, var(--color-surface-1))",
                          borderColor: "color-mix(in srgb, var(--color-accent-1) 55%, transparent)",
                          color: "var(--color-text-secondary)",
                          boxShadow: "var(--elevation-surface-1)",
                        }}
                      >
                        {m.text}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading ? (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl border px-4 py-3 text-sm"
                    style={{
                      background: "var(--color-surface-2)",
                      borderColor: "var(--color-border-subtle)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--color-text-muted)" }} />
                      <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--color-text-muted)" }} />
                      <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--color-text-muted)" }} />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Error toast */}
        {error ? (
          <div className="px-4 sm:px-5 pb-3">
            <div
              className="rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-3"
              style={{
                background: "color-mix(in srgb, var(--color-error) 14%, var(--color-dominant))",
                borderColor: "color-mix(in srgb, var(--color-error) 40%, transparent)",
                color: "var(--color-text-secondary)",
              }}
            >
              <span className="truncate">{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 rounded-lg border px-3 py-1 text-xs font-semibold transition-all active:scale-95"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-border-subtle) 80%, transparent)",
                  color: "var(--color-text-on-dark)",
                  transitionDuration: "var(--motion-base)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        {/* Composer */}
        <div
          className="px-4 sm:px-5 pb-4 pt-3"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-dominant) 92%, transparent), transparent)",
          }}
        >
          <div
            className="glass rounded-2xl flex items-end gap-2 p-2 border"
            style={{
              borderColor: "color-mix(in srgb, var(--color-border-subtle) 80%, transparent)",
              boxShadow: "var(--elevation-surface-2)",
              transitionDuration: "var(--motion-slow)",
              transitionTimingFunction: "var(--ease-expressive)",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 resize-none outline-none rounded-xl px-4 py-3 text-sm leading-6"
              style={{
                minHeight: "44px",
                maxHeight: "120px",
                background: "var(--color-surface-1)",
                color: "var(--color-text-secondary)",
                border: "1px solid transparent",
              }}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading && input.trim()) void sendMessage();
                }
              }}
            />

            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !input.trim()}
              className={`relative z-10 h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                pulseSuccess ? "pulse-success" : ""
              }`}
              style={{
                background: "var(--color-accent-1)",
                color: "var(--color-text-on-dark)",
                boxShadow: "var(--elevation-surface-1)",
                transitionDuration: "var(--motion-base)",
                transitionTimingFunction: "var(--ease-out)",
                opacity: loading || !input.trim() ? 0.55 : 1,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "var(--elevation-glow-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "var(--elevation-surface-1)";
              }}
              aria-label="Send message"
            >
              {loading ? (
                <span
                  className="h-4 w-4 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "color-mix(in srgb, var(--color-text-on-dark) 35%, transparent)",
                    borderTopColor: "var(--color-text-on-dark)",
                  }}
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current"
                  style={{ strokeWidth: 2 }}
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span style={{ color: "var(--color-text-muted)" }}>
              Enter to send · Shift+Enter for new line
            </span>
            <span style={{ color: "var(--color-text-muted)" }}>
              {loading ? "Streaming…" : "Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}