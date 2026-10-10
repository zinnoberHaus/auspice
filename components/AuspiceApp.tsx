"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type Tool =
  | "today"
  | "tarot"
  | "iching"
  | "astrology"
  | "fengshui"
  | "synthesis"
  | "journal"
  | "account";
type Tradition = "tarot" | "iching" | "astrology" | "fengshui" | "synthesis";
type Member = { id: string; name: string; email: string };
type Reading = {
  id: string;
  tradition: Tradition;
  title: string;
  summary: string;
  symbols: { name: string; detail: string }[];
  sections: { title: string; text: string }[];
  practice: string;
  createdAt: string;
  note?: string;
};
type IconName =
  | Tool
  | "arrow"
  | "star"
  | "close"
  | "menu"
  | "check"
  | "trash"
  | "leaf"
  | "sun";

export function AuspiceIcon({
  name,
  size = 22,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    today: (
      <>
        <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6 8.5 8.5 0 1 0 20.4 14.2Z" />
        <path d="m17 3 .5 1.5L19 5l-1.5.5L17 7l-.5-1.5L15 5l1.5-.5Z" />
      </>
    ),
    tarot: (
      <>
        <rect x="6" y="3" width="13" height="18" rx="2" />
        <path d="m4 5-2 1 3 15m7.5-14 1.1 3.4 3.4 1.1-3.4 1.1-1.1 3.4-1.1-3.4L8 11.5l3.4-1.1Z" />
      </>
    ),
    iching: (
      <>
        <path d="M4 5h16M4 9h6m4 0h6M4 13h16M4 17h6m4 0h6M4 21h16" />
      </>
    ),
    astrology: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" />
      </>
    ),
    fengshui: (
      <>
        <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" />
        <path d="M8 10h.01M16 10h.01" />
      </>
    ),
    synthesis: (
      <>
        <path d="m9 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2Zm10 12 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" />
      </>
    ),
    journal: (
      <>
        <path d="M4 3h13a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V3Zm0 14h15M8 3v14m3-9h5m-5 4h4" />
      </>
    ),
    account: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    star: (
      <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z" />
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    trash: (
      <>
        <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C10 1 3 7 5 14s12 8 15-11ZM4 22l11-13" />
      </>
    ),
    sun: (
      <>
        <path d="M3 18h18M5 15a7 7 0 0 1 14 0M12 2v3M3 6l2 2m14 0 2-2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

export function AuspiceLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="auspice-logo">
      <span className="logo-mark">
        <AuspiceIcon name="star" size={25} />
      </span>
      {!compact && (
        <span>
          auspice<span className="logo-dot">.</span>
        </span>
      )}
    </span>
  );
}

export function CelestialDial({ className = "" }: { className?: string }) {
  return (
    <div className={`celestial-dial ${className}`} aria-hidden="true">
      <svg viewBox="0 0 380 380" fill="none">
        <circle cx="190" cy="190" r="164" />
        <circle cx="190" cy="190" r="151" />
        <circle cx="190" cy="190" r="117" />
        <circle cx="190" cy="190" r="86" />
        <path
          d="M190 26v328M26 190h328M74 74l232 232M74 306 306 74"
          className="dial-grid"
        />
        <path d="m190 69 70 121-70 121-70-121Z" />
        <path d="m69 190 121-70 121 70-121 70Z" />
        <circle cx="190" cy="190" r="37" className="dial-center" />
        <path
          d="m190 168 5.5 16.5L212 190l-16.5 5.5L190 212l-5.5-16.5L168 190l16.5-5.5Z"
          className="dial-star"
        />
        {Array.from({ length: 48 }, (_, i) => (
          <path
            key={i}
            d={`M190 29v${i % 4 === 0 ? 11 : 5}`}
            transform={`rotate(${i * 7.5} 190 190)`}
          />
        ))}
        <circle cx="190" cy="73" r="5" className="dial-dot" />
        <circle cx="307" cy="190" r="5" className="dial-dot" />
        <circle cx="190" cy="307" r="5" className="dial-dot" />
        <circle cx="73" cy="190" r="5" className="dial-dot" />
        <path d="M177 40h26M177 340h26M40 177v26M340 177v26" />
        <text x="190" y="102" textAnchor="middle">
          ☽
        </text>
        <text x="277" y="196" textAnchor="middle">
          ☉
        </text>
        <text x="190" y="289" textAnchor="middle">
          ☷
        </text>
        <text x="104" y="196" textAnchor="middle">
          ✧
        </text>
      </svg>
    </div>
  );
}

const traditions: {
  id: Exclude<Tool, "today" | "journal" | "account">;
  name: string;
  subtitle: string;
  description: string;
  question: string;
  prompts: string[];
}[] = [
  {
    id: "tarot",
    name: "Tarot",
    subtitle: "See another possibility",
    description:
      "Let the cards offer a fresh perspective on what’s on your mind.",
    question: "What would you like to explore?",
    prompts: [
      "What deserves my attention right now?",
      "How can I approach a career change?",
      "What could help me feel more connected?",
    ],
  },
  {
    id: "iching",
    name: "I Ching",
    subtitle: "Move with change",
    description:
      "Explore a question through the imagery of the Book of Changes.",
    question: "What is changing in your life?",
    prompts: [
      "How can I respond to this transition?",
      "What might patience make possible?",
      "What should I consider before taking action?",
    ],
  },
  {
    id: "astrology",
    name: "Astrology",
    subtitle: "Explore your inner seasons",
    description:
      "Use the symbolic language of the zodiac to reflect on your patterns and possibilities.",
    question: "What would you like to understand?",
    prompts: [
      "What helps me feel grounded?",
      "How can I bring my strengths to work?",
      "What patterns do I bring to relationships?",
    ],
  },
  {
    id: "fengshui",
    name: "Feng shui",
    subtitle: "Feel at home in your space",
    description:
      "Make room for ease with thoughtful reflections on the places you live and work.",
    question: "What would you like your space to support?",
    prompts: [
      "How can I make my bedroom feel calmer?",
      "What should I notice when choosing a home?",
      "How can my workspace support focus?",
    ],
  },
  {
    id: "synthesis",
    name: "A holistic reading",
    subtitle: "Bring the traditions together",
    description:
      "Invite tarot, the I Ching, astrology, and feng shui into one considered reflection on your question.",
    question: "What’s on your mind?",
    prompts: [
      "How can I feel more settled in a new chapter?",
      "What could help me find direction in my work?",
      "How can I bring more balance into everyday life?",
    ],
  },
];
const toolName: Record<Tool, string> = {
  today: "Today",
  tarot: "Tarot",
  iching: "I Ching",
  astrology: "Astrology",
  fengshui: "Feng shui",
  synthesis: "Holistic reading",
  journal: "My journal",
  account: "My account",
};

function TraditionArt({ tradition }: { tradition: string }) {
  if (tradition === "synthesis")
    return (
      <div className="tradition-art synthesis-art" aria-hidden="true">
        <AuspiceIcon name="synthesis" size={53} />
      </div>
    );
  if (tradition === "tarot")
    return (
      <div className="tradition-art tarot-art" aria-hidden="true">
        <span />
        <span />
        <span>
          <AuspiceIcon name="star" size={25} />
        </span>
      </div>
    );
  if (tradition === "iching")
    return (
      <div className="tradition-art iching-art" aria-hidden="true">
        <span />
        <span className="broken" />
        <span />
        <span className="broken" />
        <span />
        <span className="broken" />
      </div>
    );
  if (tradition === "astrology")
    return (
      <div className="tradition-art astrology-art" aria-hidden="true">
        <AuspiceIcon name="astrology" size={61} />
        <span />
      </div>
    );
  return (
    <div className="tradition-art fengshui-art" aria-hidden="true">
      <div />
      <AuspiceIcon name="fengshui" size={40} />
    </div>
  );
}

async function responseData<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error || "That didn’t go through. Please try again.");
  return data as T;
}

function ReadingNote({
  reading,
  onSaved,
}: {
  reading: Reading;
  onSaved?: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState(reading.note || "");
  const [storedNote, setStoredNote] = useState(reading.note || "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      await responseData(
        await fetch(`/api/readings/${encodeURIComponent(reading.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note }),
        }),
      );
      setStoredNote(note);
      setMessage("Your reflection is saved.");
      onSaved?.(reading.id, note);
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Your reflection couldn’t be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="reading-note" onSubmit={save}>
      <div className="note-heading">
        <AuspiceIcon name="journal" size={23} />
        <div>
          <h2>What stays with you?</h2>
          <p>A private note, in your own words.</p>
        </div>
      </div>
      <label className="form-field">
        <span className="sr-only">Your reflection</span>
        <textarea
          className="input"
          rows={4}
          placeholder="A thought, a question, a small next step…"
          maxLength={5000}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setMessage("");
          }}
          disabled={busy}
        />
      </label>
      <div className="note-actions">
        <button
          className="button-secondary"
          disabled={busy || note === storedNote}
        >
          {busy ? "Saving…" : "Save my reflection"}
        </button>
        <span>{note.length.toLocaleString()} / 5,000</span>
      </div>
      {message && (
        <p
          className={failed ? "inline-error" : "note-saved"}
          role={failed ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}

function ReadingView({
  reading,
  saved,
  onBack,
  onNoteSaved,
}: {
  reading: Reading;
  saved?: boolean;
  onBack: () => void;
  onNoteSaved?: (id: string, note: string) => void;
}) {
  return (
    <article className="reading-result">
      <button className="back-link" onClick={onBack}>
        ← Back to your practice
      </button>
      <div className="reading-result-meta">
        <span>
          <AuspiceIcon
            name={
              reading.tradition === "synthesis" ? "star" : reading.tradition
            }
            size={17}
          />
          {reading.tradition === "synthesis"
            ? "A holistic reflection"
            : toolName[reading.tradition]}
        </span>
        {saved && (
          <span>
            <AuspiceIcon name="check" size={15} />
            Saved to your journal
          </span>
        )}
      </div>
      <h1>{reading.title}</h1>
      <p className="reading-summary">{reading.summary}</p>
      {reading.symbols?.length > 0 && (
        <div className="reading-symbols">
          {reading.symbols.map((symbol, index) => (
            <div className="reading-symbol" key={`${symbol.name}-${index}`}>
              <span className="symbol-mark">
                <AuspiceIcon name="star" size={21} />
              </span>
              <h3>{symbol.name}</h3>
              <p>{symbol.detail}</p>
            </div>
          ))}
        </div>
      )}
      <div className="reading-sections">
        {reading.sections?.map((section, index) => (
          <section key={`${section.title}-${index}`}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </div>
      {reading.practice && (
        <section className="practice-note">
          <AuspiceIcon name="leaf" size={26} />
          <div>
            <h2>A small practice</h2>
            <p>{reading.practice}</p>
          </div>
        </section>
      )}
      {saved && <ReadingNote reading={reading} onSaved={onNoteSaved} />}
      <p className="reading-footnote">
        A perspective to reflect on, with every choice still yours.
      </p>
    </article>
  );
}

function Today({
  onSelect,
  user,
}: {
  onSelect: (tool: Tool) => void;
  user: Member | null;
}) {
  const [draw, setDraw] = useState<{ name: string; detail: string } | null>(
    null,
  );
  const [drawing, setDrawing] = useState(false);
  const [drawError, setDrawError] = useState("");
  const drawCard = async () => {
    setDrawing(true);
    setDrawError("");
    try {
      const data = await responseData<{ name: string; detail: string }>(
        await fetch("/api/draw", { cache: "no-store" }),
      );
      setDraw(data);
    } catch (error) {
      setDrawError(
        error instanceof Error
          ? error.message
          : "Your card couldn’t be drawn. Try again.",
      );
    } finally {
      setDrawing(false);
    }
  };
  return (
    <>
      <div className="page-intro">
        <div>
          <p className="quiet-label">Your space to pause</p>
          <h1>
            {user?.name
              ? `Welcome, ${user.name.split(" ")[0]}.`
              : "A little perspective.\nA little possibility."}
          </h1>
        </div>
        <p>
          Come as you are.
          <br />
          See what opens up.
        </p>
      </div>
      <div className="today-feature">
        <section className="sanctuary-hero">
          <div className="sanctuary-hero-copy">
            <span className="pill">
              <span />A moment for yourself
            </span>
            <h2>
              Make room for
              <br />
              what comes next.
            </h2>
            <p>
              Ancient wisdom. Fresh perspectives.
              <br />A practice that’s entirely your own.
            </p>
            <button className="button" onClick={() => onSelect("tarot")}>
              Explore your question
              <AuspiceIcon name="arrow" size={18} />
            </button>
          </div>
          <CelestialDial />
        </section>
        <aside className="daily-pause">
          <div className="pause-icon">
            <AuspiceIcon name="leaf" size={29} />
          </div>
          <p className="quiet-label">A simple beginning</p>
          <h2>
            Before you look
            <br />
            for an answer,
            <br />
            take a breath.
          </h2>
          <p>
            Let your shoulders settle. Notice what’s here. There’s no need to
            have it all figured out.
          </p>
          <span className="pause-duration">A pause, at your own pace</span>
        </aside>
      </div>
      <section className="traditions-section">
        <div className="section-heading">
          <div>
            <h2>Follow your curiosity</h2>
            <p>Different traditions. New ways of seeing.</p>
          </div>
          <span className="section-ornament">
            <AuspiceIcon name="star" size={18} />
          </span>
        </div>
        <div className="tradition-grid">
          {traditions
            .filter((tradition) => tradition.id !== "synthesis")
            .map((tradition) => (
              <button
                key={tradition.id}
                className={`tradition-card tradition-${tradition.id}`}
                onClick={() => onSelect(tradition.id)}
              >
                <TraditionArt tradition={tradition.id} />
                <h3>{tradition.name}</h3>
                <p>{tradition.subtitle}</p>
                <span className="tradition-open">
                  <AuspiceIcon name="arrow" size={18} />
                </span>
              </button>
            ))}
        </div>
        <button
          className="synthesis-invitation"
          onClick={() => onSelect("synthesis")}
        >
          <AuspiceIcon name="synthesis" size={24} />
          <span>
            <strong>Let the traditions meet.</strong>
            <small>Explore one question through several perspectives.</small>
          </span>
          <AuspiceIcon name="arrow" size={19} />
        </button>
      </section>
      <div className="today-lower">
        <section className="daily-card-section">
          <div
            className={`mini-tarot ${draw ? "is-drawn" : ""}`}
            aria-hidden="true"
          >
            <div>
              <AuspiceIcon name={draw ? "sun" : "star"} size={35} />
              <span>{draw ? "Your card" : "Auspice"}</span>
            </div>
          </div>
          <div>
            <p className="quiet-label">A free moment of reflection</p>
            <h2>{draw ? draw.name : "One card. An open mind."}</h2>
            <p aria-live="polite">
              {draw
                ? draw.detail
                : "Draw a card and see what its imagery brings to mind. No question needed."}
            </p>
            {drawError && (
              <p className="inline-error" role="alert">
                {drawError}
              </p>
            )}
            <button className="text-link" onClick={drawCard} disabled={drawing}>
              {drawing
                ? "Drawing your card…"
                : draw
                  ? "Draw another card"
                  : "Draw a card"}
              <AuspiceIcon name="arrow" size={16} />
            </button>
          </div>
        </section>
        <section className="journal-invitation">
          <AuspiceIcon name="journal" size={26} />
          <h2>A place to return to.</h2>
          <p>Keep your readings together and notice what stays with you.</p>
          <button className="text-link" onClick={() => onSelect("journal")}>
            Open my journal
            <AuspiceIcon name="arrow" size={16} />
          </button>
        </section>
      </div>
      <p className="sanctuary-footnote">
        <AuspiceIcon name="star" size={14} />
        Wisdom to explore. Space to decide.
      </p>
    </>
  );
}

function ReadingForm({
  tradition,
  user,
  sessionReady,
  usage,
  onReadingSaved,
}: {
  tradition: (typeof traditions)[number];
  user: Member | null;
  sessionReady: boolean;
  usage: { used: number; limit: number } | null;
  onReadingSaved: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [context, setContext] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [result, setResult] = useState<{
    reading: Reading;
    saved: boolean;
  } | null>(null);
  const requestId = useRef<string | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setAuthRequired(false);
    try {
      requestId.current ??= crypto.randomUUID();
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.current,
          tradition: tradition.id,
          question: question.trim(),
          ...(birthDate ? { birthDate } : {}),
          ...(context.trim() ? { context: context.trim() } : {}),
        }),
      });
      if (response.status === 401) setAuthRequired(true);
      const data = await response.json();
      if (!response.ok) {
        if (
          response.status !== 409 ||
          !String(data.error).includes("still being prepared")
        )
          requestId.current = null;
        throw new Error(
          data.error || "Your reading couldn’t be completed. Please try again.",
        );
      }
      requestId.current = null;
      setResult(data);
      onReadingSaved();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your reading couldn’t be completed. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (result)
    return (
      <ReadingView
        reading={result.reading}
        saved={result.saved}
        onBack={() => setResult(null)}
      />
    );
  return (
    <div className="reading-layout">
      <section className="reading-form-wrap">
        <div className={`tool-emblem tradition-${tradition.id}`}>
          <TraditionArt tradition={tradition.id} />
        </div>
        <h1>{tradition.name}</h1>
        <p className="tool-description">{tradition.description}</p>
        <form onSubmit={submit} className="reading-form">
          <label className="form-field">
            <span>{tradition.question}</span>
            <textarea
              className="input"
              rows={4}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                requestId.current = null;
              }}
              placeholder="Take a moment. Write what’s on your mind…"
              required
              minLength={8}
              maxLength={1200}
              disabled={busy}
            />
            <span className="field-hint">
              An open question often leaves more room for discovery.
            </span>
          </label>
          {(tradition.id === "astrology" || tradition.id === "synthesis") && (
            <label className="form-field">
              <span>
                Your date of birth <small>(optional)</small>
              </span>
              <input
                className="input"
                type="date"
                value={birthDate}
                onChange={(event) => {
                  setBirthDate(event.target.value);
                  requestId.current = null;
                }}
                max={new Date().toISOString().slice(0, 10)}
                disabled={busy}
              />
              <span className="field-hint">
                Used for a sun-sign reflection. This isn’t a full natal chart.
              </span>
            </label>
          )}
          {(tradition.id === "fengshui" || tradition.id === "synthesis") && (
            <label className="form-field">
              <span>
                Tell us about your space <small>(optional)</small>
              </span>
              <textarea
                className="input"
                rows={3}
                value={context}
                onChange={(event) => {
                  setContext(event.target.value);
                  requestId.current = null;
                }}
                placeholder="Room, layout, natural light, how you use it…"
                maxLength={1800}
                disabled={busy}
              />
            </label>
          )}
          <div className="question-suggestions">
            <span>A place to start</span>
            {tradition.prompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => {
                  setQuestion(prompt);
                  requestId.current = null;
                }}
                disabled={busy}
              >
                {prompt}
                <AuspiceIcon name="arrow" size={14} />
              </button>
            ))}
          </div>
          {error && (
            <div className="status-message error" role="alert">
              {error}
              {authRequired && (
                <>
                  {" "}
                  <a href="/account">Sign in to continue</a>.
                </>
              )}
            </div>
          )}
          {sessionReady && !user && !authRequired && (
            <p className="signin-note">
              <AuspiceIcon name="journal" size={17} />
              <span>
                <a href="/account">Create an account or sign in</a> to receive a
                personal reading and keep it in your journal.
              </span>
            </p>
          )}
          {user && usage && (
            <p className="reading-allowance">
              {Math.max(0, usage.limit - usage.used)} of {usage.limit} free
              readings remaining this month.
            </p>
          )}
          <button
            className="button reading-submit"
            type="submit"
            disabled={busy || !sessionReady}
          >
            {busy ? (
              <>
                <span className="loading-dot" />
                Preparing your reflection…
              </>
            ) : (
              <>
                Begin my reading
                <AuspiceIcon name="star" size={18} />
              </>
            )}
          </button>
          <p className="form-fine-print">
            For reflection and personal exploration. Your decisions remain your
            own.
          </p>
        </form>
      </section>
      <aside className="reading-aside">
        <div className="reading-aside-visual">
          <CelestialDial />
        </div>
        <h2>
          Hold the question
          <br />
          lightly.
        </h2>
        <p>
          A reading can offer a different angle, a useful question, or a moment
          of clarity. Take what resonates and leave space for your own judgment.
        </p>
        <div className="reading-aside-note">
          <AuspiceIcon name="leaf" size={21} />
          <span>You don’t need to believe anything to be curious.</span>
        </div>
      </aside>
    </div>
  );
}

function Journal({
  user,
  sessionReady,
  onSelect,
}: {
  user: Member | null;
  sessionReady: boolean;
  onSelect: (tool: Tool) => void;
}) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState<Reading | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await responseData<{ readings: Reading[] }>(
        await fetch("/api/readings", { cache: "no-store" }),
      );
      setReadings(data.readings);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your journal couldn’t be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (user) void load();
    else if (sessionReady) setLoading(false);
  }, [user, sessionReady, load]);
  const remove = async (id: string) => {
    setDeleting(id);
    setError("");
    try {
      await responseData(
        await fetch(`/api/readings/${encodeURIComponent(id)}`, {
          method: "DELETE",
        }),
      );
      setReadings((previous) =>
        previous.filter((reading) => reading.id !== id),
      );
      setConfirmDelete(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "This reading couldn’t be deleted.",
      );
    } finally {
      setDeleting(null);
    }
  };
  if (opened)
    return (
      <ReadingView
        reading={opened}
        saved
        onBack={() => setOpened(null)}
        onNoteSaved={(id, note) =>
          setReadings((previous) =>
            previous.map((reading) =>
              reading.id === id ? { ...reading, note } : reading,
            ),
          )
        }
      />
    );
  return (
    <section className="journal-page">
      <div className="page-intro">
        <div>
          <p className="quiet-label">Your reflections, together</p>
          <h1>My journal</h1>
        </div>
        <AuspiceIcon name="journal" size={35} />
      </div>
      <p className="tool-description">
        Return to a thought. Notice a pattern. Make room for what you’re
        learning.
      </p>
      {error && (
        <div className="status-message error" role="alert">
          {error}{" "}
          <button className="text-link" onClick={load}>
            Try again
          </button>
        </div>
      )}
      {loading || !sessionReady ? (
        <p className="loading-message" role="status">
          Opening your journal…
        </p>
      ) : !user ? (
        <div className="empty-state">
          <div className="empty-icon">
            <AuspiceIcon name="journal" size={32} />
          </div>
          <h2>Your own little collection of insight.</h2>
          <p>Create an account to keep your personal readings in one place.</p>
          <a className="button" href="/account">
            Open my account
            <AuspiceIcon name="arrow" size={18} />
          </a>
        </div>
      ) : !readings.length && !error ? (
        <div className="empty-state">
          <div className="empty-icon">
            <AuspiceIcon name="leaf" size={32} />
          </div>
          <h2>A fresh page.</h2>
          <p>
            Your readings will find a home here. Start with whatever is on your
            mind today.
          </p>
          <button className="button" onClick={() => onSelect("tarot")}>
            Begin a reading
            <AuspiceIcon name="arrow" size={18} />
          </button>
        </div>
      ) : (
        <div className="journal-list">
          {readings.map((reading) => (
            <article className="journal-entry" key={reading.id}>
              <button
                className="journal-entry-open"
                onClick={() => setOpened(reading)}
              >
                <span className="journal-entry-icon">
                  <AuspiceIcon
                    name={
                      reading.tradition === "synthesis"
                        ? "star"
                        : reading.tradition
                    }
                    size={25}
                  />
                </span>
                <span className="journal-entry-text">
                  <span className="entry-date">
                    {reading.tradition === "synthesis"
                      ? "Holistic reflection"
                      : toolName[reading.tradition]}
                    <span> / </span>
                    {new Date(reading.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <h2>{reading.title}</h2>
                  <p>{reading.summary}</p>
                </span>
                <AuspiceIcon name="arrow" size={18} />
              </button>
              {confirmDelete === reading.id ? (
                <div className="delete-confirm">
                  <span>
                    Delete this reading and its note? This cannot be undone.
                  </span>
                  <button
                    onClick={() => remove(reading.id)}
                    disabled={deleting === reading.id}
                  >
                    {deleting === reading.id
                      ? "Deleting…"
                      : "Delete permanently"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    disabled={deleting === reading.id}
                  >
                    Keep it
                  </button>
                </div>
              ) : (
                <button
                  className="delete-reading"
                  onClick={() => setConfirmDelete(reading.id)}
                  aria-label={`Delete ${reading.title}`}
                >
                  <AuspiceIcon name="trash" size={16} />
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AuspiceApp({
  initialTool = "today",
  initialUser = null,
}: {
  initialTool?: Tool;
  initialUser?: Member | null;
}) {
  const [activeTool, setActiveTool] = useState<Tool>(initialTool);
  const [user, setUser] = useState<Member | null>(initialUser);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [today, setToday] = useState("");
  useEffect(() => {
    let current = true;
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
    fetch("/api/session", { cache: "no-store" })
      .then((response) =>
        responseData<{
          user: Member | null;
          usage?: { used: number; limit: number };
        }>(response),
      )
      .then((data) => {
        if (current) {
          setUser(data.user);
          setUsage(data.usage || null);
        }
      })
      .catch(() => {
        if (current)
          setSessionError(
            "Your account could not be checked. Please refresh to reconnect.",
          );
      })
      .finally(() => {
        if (current) setSessionReady(true);
      });
    return () => {
      current = false;
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const sidebar = document.getElementById("sanctuary-sidebar");
    const focusable = () =>
      Array.from(
        sidebar?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) || [],
      );
    focusable()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.querySelector<HTMLButtonElement>(".mobile-menu-button")?.focus();
    };
  }, [menuOpen]);
  const selectTool = (tool: Tool) => {
    setActiveTool(tool);
    setMenuOpen(false);
    window.history.replaceState(
      null,
      "",
      tool === "today" ? "/sanctuary" : `/sanctuary?tool=${tool}`,
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      document
        .getElementById("sanctuary-content")
        ?.focus({ preventScroll: true }),
    );
  };
  const navItem = (tool: Tool) => (
    <button
      key={tool}
      className={`sidebar-link ${activeTool === tool ? "active" : ""}`}
      onClick={() => selectTool(tool)}
      aria-current={activeTool === tool ? "page" : undefined}
    >
      <AuspiceIcon name={tool} size={21} />
      <span>{toolName[tool]}</span>
      {activeTool === tool && <span className="nav-active-dot" />}
    </button>
  );
  return (
    <div className="sanctuary">
      <a href="#sanctuary-content" className="skip-link">
        Skip to content
      </a>
      <aside
        id="sanctuary-sidebar"
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen || undefined}
        aria-label="Sanctuary navigation"
        className={`sanctuary-sidebar ${menuOpen ? "is-open" : ""}`}
      >
        <a href="/" className="sidebar-logo" aria-label="Auspice home">
          <AuspiceLogo />
        </a>
        <button
          className="mobile-menu-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        >
          <AuspiceIcon name="close" />
        </button>
        <div className="sidebar-caption">A little wisdom, every day.</div>
        <nav aria-label="Sanctuary navigation">
          <div className="sidebar-nav-group">{navItem("today")}</div>
          <p className="sidebar-label">Explore</p>
          <div className="sidebar-nav-group">
            {traditions.map((tradition) => navItem(tradition.id))}
          </div>
          <p className="sidebar-label">Your space</p>
          <div className="sidebar-nav-group">{navItem("journal")}</div>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <AuspiceIcon name="star" size={18} />
            <p>
              The next chapter
              <br />
              starts with a pause.
            </p>
          </div>
          <a href="/account" className="sidebar-account">
            <span className="avatar">
              {user?.name?.charAt(0).toUpperCase() || (
                <AuspiceIcon name="account" size={18} />
              )}
            </span>
            <span>
              <strong>{user?.name || "Your sanctuary"}</strong>
              <small>
                {user ? "Manage your account" : "Make yourself at home"}
              </small>
            </span>
            <AuspiceIcon name="arrow" size={16} />
          </a>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="menu-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="sanctuary-body" inert={menuOpen}>
        <header className="sanctuary-header">
          <div className="header-breadcrumb">
            <button
              className="mobile-menu-button icon-button"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <AuspiceIcon name="menu" />
            </button>
            <span className="desktop-breadcrumb">
              Your sanctuary<span className="breadcrumb-divider">/</span>
            </span>
            <span>{toolName[activeTool]}</span>
          </div>
          <div className="header-date">
            <AuspiceIcon name="sun" size={18} />
            <span>{today || "Take your time"}</span>
          </div>
          <a
            href="/account"
            className="header-avatar"
            aria-label="Your account"
          >
            {user?.name?.charAt(0).toUpperCase() || (
              <AuspiceIcon name="account" size={18} />
            )}
          </a>
        </header>
        <main className="sanctuary-main" id="sanctuary-content" tabIndex={-1}>
          {sessionError && (
            <div className="status-message error session-error" role="alert">
              {sessionError}{" "}
              <button
                className="text-link"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          )}
          {activeTool === "today" ? (
            <Today onSelect={selectTool} user={user} />
          ) : activeTool === "journal" ? (
            <Journal
              user={user}
              sessionReady={sessionReady}
              onSelect={selectTool}
            />
          ) : activeTool === "account" ? (
            <section className="empty-state">
              <AuspiceIcon name="account" size={32} />
              <h1>Your account</h1>
              <p>Manage your profile and your practice.</p>
              <a className="button" href="/account">
                Manage my account
              </a>
            </section>
          ) : (
            <ReadingForm
              key={activeTool}
              tradition={
                traditions.find((tradition) => tradition.id === activeTool)!
              }
              user={user}
              sessionReady={sessionReady}
              usage={usage}
              onReadingSaved={() =>
                setUsage((previous) =>
                  previous ? { ...previous, used: previous.used + 1 } : null,
                )
              }
            />
          )}
        </main>
      </div>
      <nav
        className="mobile-bottom-nav"
        inert={menuOpen}
        aria-label="Quick navigation"
      >
        {(["today", "tarot", "iching", "journal"] as Tool[]).map((tool) => (
          <button
            key={tool}
            onClick={() => selectTool(tool)}
            className={activeTool === tool ? "active" : ""}
            aria-current={activeTool === tool ? "page" : undefined}
          >
            <AuspiceIcon name={tool} size={21} />
            <span>{tool === "journal" ? "Journal" : toolName[tool]}</span>
          </button>
        ))}
        <button onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}>
          <AuspiceIcon name="menu" size={21} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
