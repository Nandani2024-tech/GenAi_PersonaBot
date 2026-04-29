export type PersonaId = "anshuman" | "abhimanyu" | "kshitij";

export const personaMeta: Record<
  PersonaId,
  { id: PersonaId; name: string; initials: string; role: string; accentVar: string; quickPrompts: string[] }
> = {
  anshuman: {
    id: "anshuman",
    name: "Anshuman Singh",
    initials: "AS",
    role: "Co‑Founder · Scaler & InterviewBit",
    accentVar: "--color-accent-2",
    quickPrompts: [
      "Why do engineers get stuck?",
      "How should I build fundamentals fast?",
      "How do I think in first principles?",
      "What should I do this week to level up?",
    ],
  },
  abhimanyu: {
    id: "abhimanyu",
    name: "Abhimanyu Saxena",
    initials: "AbS",
    role: "Co‑Founder · Scaler & InterviewBit",
    accentVar: "--color-accent-1",
    quickPrompts: [
      "How do I get clarity in my career?",
      "What should I focus on for 6 months?",
      "How do I build consistency that compounds?",
      "How do I choose projects that matter?",
    ],
  },
  kshitij: {
    id: "kshitij",
    name: "Kshitij Mishra",
    initials: "KM",
    role: "Head of Instructors · Scaler",
    accentVar: "--color-accent-2",
    quickPrompts: [
      "I know theory—how do I apply it?",
      "What project should I build next?",
      "How do I create faster feedback loops?",
      "How do I stop quitting midway?",
    ],
  },
};

