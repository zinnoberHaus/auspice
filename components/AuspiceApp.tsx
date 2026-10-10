"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import AlmanacToday from "./AlmanacToday";
import TarotTable from "./TarotTable";
import { HomePlanner, DatePlanner } from "./AlmanacTools";

type Tool =
  | "today"
  | "tarot"
  | "iching"
  | "astrology"
  | "fengshui"
  | "synthesis"
  | "journal"
  | "account"
  | "homes"
  | "dates";
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
    homes: <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" /></>,
    dates: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 5h3m3 0h3"/></>,
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
  return <span className="auspice-logo"><span className="logo-mark" aria-hidden="true">吉</span>{!compact && <span>Auspice</span>}</span>;
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
  id: Tradition;
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
  homes: "Home & place",
  dates: "Timing & dates",
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


function ReadingForm({
  tradition,
  user,
  sessionReady,
  usage,
  onReadingSaved,
  initialQuestion = "",
  initialContext = "",
}: {
  tradition: (typeof traditions)[number];
  user: Member | null;
  sessionReady: boolean;
  usage: { used: number; limit: number } | null;
  onReadingSaved: () => void;
  initialQuestion?: string;
  initialContext?: string;
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [birthDate, setBirthDate] = useState("");
  const [context, setContext] = useState(initialContext);
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
    <>
    {tradition.id === "tarot" && <TarotTable />}
    <div className="reading-layout">
      <section className="reading-form-wrap">
        <div className={`tool-emblem tradition-${tradition.id}`}>
          <TraditionArt tradition={tradition.id} />
        </div>
        {tradition.id === "tarot" ? <h2>A personal tarot reading</h2> : <h1>{tradition.name}</h1>}
        <p className="tool-description">{tradition.description}</p>
        <form onSubmit={submit} className="reading-form">
          <label className="form-field">
            <span>{tradition.question}</span>
            <textarea
              id="reading-question"
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
    </>
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
  const [night, setNight] = useState(false);
  const [readingSeed, setReadingSeed] = useState<{ question: string; context: string; key: string } | null>(null);
  useEffect(() => {
    try { setNight(localStorage.getItem("auspice-theme") === "night" || (!localStorage.getItem("auspice-theme") && /Electron/i.test(navigator.userAgent))); } catch { /* The theme works in memory when storage is unavailable. */ }
  }, []);
  function toggleTheme() {
    const next = !night;
    setNight(next);
    try { localStorage.setItem("auspice-theme", next ? "night" : "paper"); } catch { /* Optional preference storage. */ }
  }
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
  const selectTool = useCallback((tool: Tool) => {
    setActiveTool(tool);
    setReadingSeed(null);
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
  }, []);
  useEffect(() => {
    const askShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        selectTool("synthesis");
        requestAnimationFrame(() => document.getElementById("reading-question")?.focus());
      }
    };
    document.addEventListener("keydown", askShortcut);
    return () => document.removeEventListener("keydown", askShortcut);
  }, [selectTool]);
  const askFromPlanner = (tool: "fengshui" | "synthesis", question: string, context = "") => {
    selectTool(tool);
    setReadingSeed({ question, context, key: crypto.randomUUID() });
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
    <div className="sanctuary" data-theme={night ? "night" : "paper"} data-tool={activeTool}>
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
        <button className="sidebar-ask" onClick={() => selectTool("synthesis")}><span aria-hidden="true">問</span> Ask a question <kbd>⌘K</kbd></button>
        <nav aria-label="Sanctuary navigation">
          <div className="sidebar-nav-group">{navItem("today")}{navItem("journal")}</div>
          <p className="sidebar-label">Life</p>
          <div className="sidebar-nav-group">{navItem("homes")}{navItem("dates")}{navItem("synthesis")}</div>
          <p className="sidebar-label">Cast & explore</p>
          <div className="sidebar-nav-group">{traditions.filter(tradition => tradition.id !== "synthesis").map((tradition) => navItem(tradition.id))}</div>
          <p className="sidebar-label">The library</p>
          <div className="sidebar-nav-group"><a href="/guides" className="sidebar-link"><AuspiceIcon name="journal" size={20}/><span>Practice guides</span></a><a href="/download" className="sidebar-link"><AuspiceIcon name="arrow" size={20}/><span>Desktop & mobile</span></a></div>
        </nav>
        <div className="sidebar-bottom">
          <button className="studio-toggle" onClick={toggleTheme} aria-pressed={night}><AuspiceIcon name="today" size={18}/><span>{night ? "Return to paper" : "Night studio"}</span></button>
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
              Almanac<span className="breadcrumb-divider">/</span>
            </span>
            <span>{toolName[activeTool]}</span>
          </div>
          <button className="header-ask" onClick={() => selectTool("synthesis")}><span aria-hidden="true">問</span><span>Ask anything. Start with what matters.</span><kbd>⌘K</kbd></button>
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
            <AlmanacToday onSelect={selectTool} name={user?.name} />
          ) : activeTool === "journal" ? (
            <Journal
              user={user}
              sessionReady={sessionReady}
              onSelect={selectTool}
            />
          ) : activeTool === "homes" || activeTool === "dates" ? null : activeTool === "account" ? (
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
              key={`${activeTool}-${readingSeed?.key || "empty"}`}
              initialQuestion={readingSeed?.question}
              initialContext={readingSeed?.context}
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
          <div hidden={activeTool !== "homes"}><HomePlanner onAsk={(question, context) => askFromPlanner("fengshui", question, context)}/></div>
          <div hidden={activeTool !== "dates"}><DatePlanner onAsk={(question, context) => askFromPlanner("synthesis", question, context)}/></div>
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
