import { PersonaId, personaMeta } from "@/lib/personas";
import { useMemo } from "react";

const PERSONA_STORAGE_KEY = "active-persona";

type Props = {
  persona: PersonaId;
  setPersona: (p: PersonaId) => void;
};

export default function PersonaSwitcher({ persona, setPersona }: Props) {
  const personas = useMemo(() => Object.values(personaMeta), []);

  const handleSwitch = (next: PersonaId) => {
    if (next === persona) return;
    window.localStorage.setItem(PERSONA_STORAGE_KEY, next);
    setPersona(next);
  };

  return (
    <div
      className="glass flex items-center gap-1 p-1 rounded-full border"
      style={{
        borderColor: "color-mix(in srgb, var(--color-border-subtle) 80%, transparent)",
      }}
    >
      {personas.map((p) => {
        const active = p.id === persona;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSwitch(p.id)}
            className="h-9 px-4 rounded-full flex items-center gap-2 text-sm font-semibold transition-all"
            style={{
              transitionDuration: "var(--motion-base)",
              transitionTimingFunction: "var(--ease-out)",
              background: active ? "var(--color-surface-2)" : "transparent",
              border: active ? "1px solid var(--color-border-subtle)" : "1px solid transparent",
              color: active ? "var(--color-text-on-dark)" : "var(--color-text-muted)",
            }}
          >
            <span
              className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-extrabold"
              style={{
                background: `color-mix(in srgb, var(${p.accentVar}) 82%, var(--color-surface-2))`,
                color: "var(--color-text-on-dark)",
                fontFamily: "var(--font-manrope)",
              }}
            >
              {p.initials}
            </span>
            <span className="hidden sm:block">{p.name.split(" ")[0]}</span>
          </button>
        );
      })}
    </div>
  );
}