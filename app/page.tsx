"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/ChatBox";
import PersonaSwitcher from "@/components/PersonaSwitcher";
import { PersonaId, personaMeta } from "@/lib/personas";

const PERSONA_STORAGE_KEY = "active-persona";

export default function Home() {
  const [persona, setPersona] = useState<PersonaId>("anshuman");
  const meta = personaMeta[persona];

  useEffect(() => {
    const saved = window.localStorage.getItem(PERSONA_STORAGE_KEY);
    if (saved === "anshuman" || saved === "abhimanyu" || saved === "kshitij") {
      setPersona(saved);
      return;
    }
    window.localStorage.setItem(PERSONA_STORAGE_KEY, persona);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PERSONA_STORAGE_KEY, persona);
  }, [persona]);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 700px at 20% -10%, color-mix(in srgb, var(--color-accent-1) 18%, transparent), transparent 60%), radial-gradient(900px 500px at 100% 0%, color-mix(in srgb, var(--color-accent-2) 18%, transparent), transparent 55%), var(--color-bg-canvas)",
      }}
    >
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Persona Chatbot
              </p>
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-manrope)", color: "var(--color-text-on-dark)" }}
              >
                Talk to {meta.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                {meta.role}
              </p>
            </div>
            <PersonaSwitcher persona={persona} setPersona={setPersona} />
          </div>
        </header>

        <div className="mt-6">
          <ChatBox persona={persona} />
        </div>
      </section>
    </main>
  );
}