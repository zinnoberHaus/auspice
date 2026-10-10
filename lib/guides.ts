export type GuideTradition = "tarot" | "iching" | "fengshui" | "astrology" | "reflection";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  tradition: GuideTradition;
  tool: Exclude<GuideTradition, "reflection">;
  date: string;
  sections: { heading: string; paragraphs: string[]; sourceRefs?: number[] }[];
  sources: { label: string; url: string }[];
};

export const traditionLabels: Record<GuideTradition, string> = {
  tarot: "Tarot",
  iching: "I Ching",
  fengshui: "Feng shui",
  astrology: "Astrology",
  reflection: "Reflective practice",
};

const tarotHistory = {
  label: "The Metropolitan Museum of Art — The history and structure of tarot cards",
  url: "https://www.metmuseum.org/perspectives/tarot-2",
};
const coinMethod = {
  label: "I Ching with Clarity — Casting a hexagram with three coins",
  url: "https://www.onlineclarity.co.uk/learn/beginners/casting-a-hexagram-with-3-coins/",
};
const changingLines = {
  label: "I Ching with Clarity — An introduction to primary and relating hexagrams",
  url: "https://www.onlineclarity.co.uk/reading/free-online-i-ching/",
};
const questionMethod = {
  label: "I Ching with Clarity — Your question",
  url: "https://www.onlineclarity.co.uk/learn/beginners/your-question/",
};
const roomPosition = {
  label: "Anjie Cho — Feng shui and the commanding position",
  url: "https://www.anjiecho.com/holistic-spaces-blog/feng-shui-to-welcome-2022",
};
const birthTime = {
  label: "Astrodienst — Birth time and chart calculations",
  url: "https://www.astro.com/faq/fq_de_time_e.htm",
};
const tropicalZodiac = {
  label: "Astrodienst — Precession and the tropical zodiac",
  url: "https://www.astro.com/faq/fq_ua_precession_e.htm",
};
const reflectionModel = {
  label: "University of Edinburgh — What? So what? Now what?",
  url: "https://reflection.ed.ac.uk/reflectors-toolkit/reflecting-on-experience/what-so-what-now-what",
};

export const guides: Guide[] = [
  {
    slug: "tarot-career-reflection",
    title: "A three-card tarot exercise for a career crossroads",
    description: "Explore a career decision with a three-card reflection: what matters, what needs attention, and one practical step you can take next.",
    tradition: "tarot",
    tool: "tarot",
    date: "2026-10-10",
    sections: [
      {
        heading: "Give the decision a shape",
        paragraphs: [
          "A career question can hold several questions at once: whether to leave, what to pursue, and how to manage the transition. Before drawing anything, describe the decision in one sentence. For example: I am deciding whether to explore a role with more responsibility while keeping my current job for now. That sentence gives the exercise a useful boundary.",
          "Set down three things you already know, such as your working hours, the tasks you enjoy, or a conversation you have been avoiding. Keep these facts beside the reading. The cards can offer images to think with; they cannot establish a manager's intentions, the future of a company, or whether an offer will arrive.",
        ],
      },
      {
        heading: "Use three positions with a clear purpose",
        paragraphs: [
          "This is an original Auspice exercise: give the first card the position What deserves more room? Give the second What needs a closer look? Give the third What small experiment could I try? Draw one card for each position and describe what you actually notice in its image before looking for an interpretation.",
          "A picture of someone carrying a heavy load might bring workload to mind. Ask which responsibility you would change, who could help, and what evidence shows the problem is persistent. The image is a starting point for your own associations, rather than an instruction to resign. An unfamiliar card can be useful too: record the question it creates instead of forcing it to fit.",
        ],
      },
      {
        heading: "Turn an impression into an experiment",
        paragraphs: [
          "Suppose your reflection points toward learning something new. An experiment could be a thirty-minute conversation with someone doing the work, a small course exercise, or asking to observe a project. Choose a step that gives you information without committing you to a whole new career. Write down what you hope to learn and when you will review it.",
          "Keep two separate notes: The reading brought up… and The evidence I still need is…. If a card feels encouraging, you still need to assess the offer, conditions, and trade-offs. If a card feels difficult, you can investigate the concern without treating the image as a verdict on your abilities.",
        ],
      },
      {
        heading: "Leave space for your answer to change",
        paragraphs: [
          "Save the question, the three positions, and your proposed experiment. Return after you have taken the step. Ask what you learned that was not visible before, and whether the original question still fits. A useful session can end with a better question, even when it does not settle the decision.",
          "Tarot has a history beyond divination: The Met describes fifteenth-century Italian cards and their use in games. The career spread here is a contemporary reflective exercise, not a recovered historical formula. You can adapt its wording to your situation while keeping your own judgment at the center.",
        ],
        sourceRefs: [0],
      },
    ],
    sources: [tarotHistory],
  },
  {
    slug: "better-tarot-questions",
    title: "How to ask a tarot question you can actually work with",
    description: "Move from an overwhelming yes-or-no question to a focused tarot reflection with examples for work, relationships, and everyday choices.",
    tradition: "tarot",
    tool: "tarot",
    date: "2026-10-10",
    sections: [
      {
        heading: "Start with the part that belongs to you",
        paragraphs: [
          "A useful question gives you something to notice or do. Will everyone approve of my choice? leaves you waiting for knowledge about other people's minds. What would help me explain this choice clearly? invites you to examine your reasons and prepare a conversation. The second question does not remove uncertainty, but it brings your attention to your own participation.",
          "Write your first question exactly as it arrives, even if it feels messy. Underline the part you can influence. That might be your preparation, a boundary, an assumption, or your next conversation. Use that part as the center of the question you bring to the cards.",
        ],
      },
      {
        heading: "Make the scope small enough to explore",
        paragraphs: [
          "What is my purpose? may be meaningful, but it is also large. Try a smaller companion question: Which part of this week's work felt worth doing, and what would give it more space? For a move, you might ask: Which everyday need have I overlooked while comparing these two homes? For a relationship: What am I finding difficult to say directly?",
          "These are Auspice's original prompts. They do not depend on a particular spread. Choose one, add a sentence of context, and leave the rest for another day. Combining five decisions into one reading usually makes it harder to tell which observation belongs to which situation.",
        ],
      },
      {
        heading: "Describe first, interpret second",
        paragraphs: [
          "After drawing, name an ordinary feature of the card: a figure standing still, an open landscape, a repeated shape. Then write your association. Separating what you see from what you make of it creates room for more than one reading. Someone else's interpretation can be a useful possibility without becoming the only correct answer.",
          "If the card seems unrelated, try asking what would make the image relevant or what its opposite would look like. You can also write that it did not connect. There is no need to manufacture a message or keep drawing until something agreeable appears. A completed exercise can be brief and inconclusive.",
        ],
      },
      {
        heading: "Close with one sentence you can revisit",
        paragraphs: [
          "Finish with: I want to pay closer attention to…. Add a small observation or conversation that could test your idea. When you return to the entry, record what happened as well as what did not. This makes your journal a record of your thinking rather than a collection of selected successes.",
          "There is no single question format inherited from the earliest tarot. The Met's account describes cards that developed for play, with divinatory associations emerging later. The open-ended method in this guide is a present-day choice for reflection, not a claim about how every tarot tradition must work.",
        ],
        sourceRefs: [0],
      },
    ],
    sources: [tarotHistory],
  },
  {
    slug: "i-ching-three-coin-method",
    title: "How to cast an I Ching hexagram with three coins",
    description: "Record six coin casts from the bottom up, understand values 6 through 9, and see how changing lines create a relating hexagram.",
    tradition: "iching",
    tool: "iching",
    date: "2026-10-10",
    sections: [
      {
        heading: "Prepare a question and a place to record it",
        paragraphs: [
          "The I Ching, also called Yijing or Book of Changes, is consulted through hexagrams made of six lines. Before casting, write a question and a short account of the situation. This helps you remember what you were considering when you return to the result later. You need three distinguishable coins and somewhere to record six numbers.",
          "This guide uses the coin convention described by I Ching with Clarity: assign heads a value of 3 and tails a value of 2. Choose the convention before you begin and keep it throughout. Other casting methods exist; a digital result should tell you which procedure it represents.",
        ],
        sourceRefs: [0, 1],
      },
      {
        heading: "Cast six times, building from the bottom",
        paragraphs: [
          "Toss all three coins together and add their values. A total of 6 is a changing broken line; 7 is an unchanging solid line; 8 is an unchanging broken line; 9 is a changing solid line. Record the first result at the bottom of your drawing. Repeat five more times, placing each new line above the last.",
          "Keep the numbers as well as the drawing. In this notation, 6 and 9 preserve information that an ordinary broken or solid line alone would lose. Number the positions 1 through 6 from bottom to top so that line references remain unambiguous.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Read the change without losing the original",
        paragraphs: [
          "The original six lines form the primary hexagram. To draw the relating hexagram, change each 6 from broken to solid and each 9 from solid to broken. Leave 7 and 8 alone. If there are no changing lines, there is no altered pattern to draw. I Ching with Clarity describes the primary, changing lines, and relating hexagram as distinct parts of a reading.",
          "For a worked notation example, imagine your bottom-to-top sequence is 7, 8, 6, 7, 9, 8. Positions 3 and 5 change; the others stay put. This example teaches the procedure only. It is not a reading generated for you, and it does not assign a personal meaning to that combination.",
        ],
        sourceRefs: [1],
      },
      {
        heading: "Move from a recorded cast to reflection",
        paragraphs: [
          "Use a translation or commentary that identifies its author, and keep its wording distinct from your own notes. An unfamiliar image may need time and context. Start by asking which tension in your question the image brings into focus, and write down more than one plausible connection. Different commentaries may offer different emphases.",
          "Save your original question, six values, changing positions, and first response before revisiting the situation. Add later observations underneath rather than rewriting the first impression. The cast is a symbolic prompt; decisions about your life still need facts, conversations, and your judgment.",
        ],
      },
    ],
    sources: [coinMethod, changingLines],
  },
  {
    slug: "i-ching-questions",
    title: "Finding a clear question for an I Ching reading",
    description: "Prepare an I Ching question with a specific context, room for reflection, and a way to revisit what the reading brought into focus.",
    tradition: "iching",
    tool: "iching",
    date: "2026-10-10",
    sections: [
      {
        heading: "Name the uncertainty beneath the question",
        paragraphs: [
          "You might arrive with a question about whether to move, accept an invitation, or start a project. Before casting, finish this sentence: The part I find hardest to understand is…. Your answer may reveal that the real uncertainty concerns timing, a relationship, your own hesitation, or information you have not yet gathered.",
          "In her beginner guidance, Hilary Barrett recommends writing the question before casting and focusing on your understanding and choices. Auspice's exercise below builds on that general approach with original examples. It is one way to prepare, rather than a rule binding every I Ching practice.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Write enough context to remember the moment",
        paragraphs: [
          "Try three short lines: what is happening, what remains uncertain, and what choice is actually available. For example: A friend has invited me to collaborate. We have not agreed on how to divide the work. I can ask for a planning conversation before committing. This is more useful context than a broad question about whether the partnership is destined to succeed.",
          "Then write one question such as: What deserves attention before I enter this collaboration? A question about your participation allows a reading to bring up preparation, expectations, or boundaries without pretending to reveal your friend's private thoughts. Keep names and sensitive details out if they do not change the question.",
        ],
      },
      {
        heading: "Let the response expand the question",
        paragraphs: [
          "When you encounter the hexagram and any changing lines, note the words or images that stand out. Explain the connection in your own language. If an image suggests patience, ask what useful preparation could happen while you wait. If it suggests movement, ask what small step would be reversible. These questions turn an association into something you can examine.",
          "You do not have to decide immediately what every part means. Record two possible interpretations and the evidence that would distinguish them. If you cannot find a connection, keep that uncertainty visible. Repeatedly recasting the same question can bury the first result under a growing number of interpretations.",
        ],
      },
      {
        heading: "Choose a natural time to return",
        paragraphs: [
          "Pick a review point connected to the situation: after the planning conversation, after visiting the home, or after trying a different routine. At that point, compare what you expected with what actually happened. Notice both connections and mismatches. The journal is there to help you understand your own process, not to prove that every phrase was a prediction.",
          "If the situation changes substantially, a new question may be more useful than a revised version of the old one. Write what changed before another reading. Over time, the record can show which questions led to meaningful action and which were too broad to help.",
        ],
      },
    ],
    sources: [questionMethod],
  },
  {
    slug: "feng-shui-bedroom-layout",
    title: "A thoughtful feng shui approach to bedroom layout",
    description: "Explore the commanding position, map the bedroom you actually have, and try a small layout change without chasing a perfect room.",
    tradition: "fengshui",
    tool: "fengshui",
    date: "2026-10-10",
    sections: [
      {
        heading: "Begin with the room you have",
        paragraphs: [
          "Draw a simple plan showing the door swing, windows, bed, storage, and the routes you use each day. Mark what cannot move: built-in furniture, a radiator, an accessibility aid, or a necessary work area. A useful layout starts with those realities. It does not require a large bedroom or new purchases.",
          "Write one intention for the space, such as making the walk to the door clearer or giving evening routines a more settled place. Choose something you can observe. A room can feel different after a small adjustment without the change proving a claim about luck, relationships, or health.",
        ],
      },
      {
        heading: "Understand the commanding position as a practice",
        paragraphs: [
          "In her published feng shui guidance, Anjie Cho describes a bed position from which the door is visible, without placing the bed directly in its path, and with support from a wall behind the headboard. This is commonly called the commanding position. Here it is a traditional layout idea to explore, not a guarantee about what the room will cause.",
          "Sit or lie where you normally rest and look toward the entrance. Compare that view with another feasible placement on your plan. Avoid moving heavy furniture alone, blocking exits, covering heaters, or reducing the space needed for mobility. If the room cannot accommodate the suggested position, it is a constraint to work with rather than a personal failure.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Try one change with a clear purpose",
        paragraphs: [
          "Choose a manageable experiment: move a frequently used object within reach, clear the path around the bed, or remove an item that repeatedly catches your attention when you want to settle down. Keep what is useful and meaningful to you. A lived-in room does not have to look empty to support a deliberate routine.",
          "Before changing anything, write a short observation of the current layout. After several ordinary evenings, write another. Describe what became easier or more awkward. Changing one thing at a time makes that comparison clearer than replacing the entire room at once.",
        ],
      },
      {
        heading: "Keep different kinds of questions separate",
        paragraphs: [
          "A symbolic question might be: What do I want this part of my home to represent? A practical one might be: Can I open this drawer without moving the chair? Both can matter, but they ask for different kinds of answers. A compass-based consultation also needs orientation and a clearly identified method; a photograph alone does not establish those details.",
          "Record your chosen change and its purpose in your journal. If the layout remains inconvenient, revise it. The goal of this exercise is a more considered relationship with your space, not conformity to an imaginary perfect bedroom or a promise that arranging furniture will solve unrelated problems.",
        ],
      },
    ],
    sources: [roomPosition],
  },
  {
    slug: "feng-shui-house-viewing",
    title: "Feng shui questions to bring to a house viewing",
    description: "Use a home viewing to notice arrival, movement, room placement, and everyday fit, while keeping impressions separate from property checks.",
    tradition: "fengshui",
    tool: "fengshui",
    date: "2026-10-10",
    sections: [
      {
        heading: "Make room for both impressions and facts",
        paragraphs: [
          "A home viewing can move quickly. Before you arrive, write three ordinary activities the home needs to support: getting ready together in the morning, quiet work, welcoming friends, or moving comfortably between rooms. Keep these needs with you so an attractive finish does not become your only point of comparison.",
          "Use this guide as an observation exercise inspired by feng shui's attention to placement. It is not a property inspection or an assessment of a neighborhood's future. Keep legal, structural, accessibility, and financial checks with the appropriate qualified people. An appealing impression is worth recording, but it does not establish those facts.",
        ],
      },
      {
        heading: "Notice the experience of arriving",
        paragraphs: [
          "Walk the route you would actually use with bags, a stroller, or mobility equipment if relevant. Notice where you would put shoes, keys, deliveries, and coats. Ask whether doors can open comfortably and whether an everyday arrival would interrupt someone else's activity. These observations make the entrance concrete rather than assigning it a vague good-or-bad label.",
          "Write what you observed before writing how it felt. The hallway has no storage is different from The entrance feels unsettled. You might solve the first with a small piece of furniture; the second may need another visit to understand. Keeping both notes allows your first impression to evolve.",
        ],
      },
      {
        heading: "Imagine the main furniture before the decoration",
        paragraphs: [
          "Practitioner Anjie Cho's discussion of the commanding position asks whether the bed can face a visible entrance without sitting directly in its path. Use that as one question when imagining the bedroom. Sketch a plausible bed placement and check whether it leaves useful room for doors, storage, and movement.",
          "Do the same for the place where you would spend the most waking time. Where would you sit, and what would you see? Would two people need the same corner for different activities? The exercise is to notice trade-offs. No home needs to satisfy every symbolic preference, and a floor plan does not decide whether a place is right for you.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Leave with questions you can follow up",
        paragraphs: [
          "After the visit, divide your notes into observed, felt, and still unknown. Put the narrow staircase under observed, the sense of welcome under felt, and evening noise under still unknown. Ask how to verify each important unknown before making a decision. If you can revisit, use the next visit to answer those questions rather than simply repeating the first impression.",
          "For a reflection, choose one tension: What am I prioritizing when I compare openness with privacy? or Which daily need am I minimizing because I like the view? You can explore that question without recording the property's exact address or identifying its occupants. Let the reflection help you name priorities, while the practical checks establish whether the home meets them.",
        ],
      },
    ],
    sources: [roomPosition],
  },
  {
    slug: "understanding-your-sun-sign",
    title: "What a Sun sign tells you—and what it leaves out",
    description: "Understand the tropical Sun-sign convention, why calendar dates are approximate, and how to use sign themes as prompts rather than fixed labels.",
    tradition: "astrology",
    tool: "astrology",
    date: "2026-10-10",
    sections: [
      {
        heading: "Know which zodiac a description uses",
        paragraphs: [
          "A Sun sign is the zodiac sign assigned to the Sun's position at birth within a chosen astrological system. In the tropical zodiac, the circle is divided into twelve equal signs, with Aries beginning at the March equinox. These signs are not the same thing as the unevenly sized astronomical constellations that share their names, as Astrodienst's explanation of precession makes clear.",
          "A tropical and a sidereal reading can therefore use different conventions without either being a transcription error. Check the system named by the source before comparing labels. This guide concerns tropical Sun-sign reflection; it is not a guide to every astrological tradition.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Treat calendar boundaries with care",
        paragraphs: [
          "The familiar date ranges printed beside signs are a convenient calendar shorthand. A precise placement comes from the Sun's position for the relevant moment. If your birthday is close to a change of sign, a month-and-day lookup should be treated as approximate rather than used to settle the question with false precision.",
          "Keep track of what you actually supplied: a date, a known time, or an approximate time. A detailed-looking answer does not add information that was missing from the input. If a source needs more birth data for a precise calculation, it should make that need visible.",
        ],
      },
      {
        heading: "Use a theme as a question, not an identity test",
        paragraphs: [
          "Try this original Auspice exercise with any sign description you are reading. Choose one theme that interests you, such as initiative, steadiness, curiosity, or care. Write about a specific time when you expressed it and another when you did not. Include the circumstances in both cases. A useful reflection makes room for differences instead of asking you to agree with every adjective.",
          "For example, a prompt about initiative might lead you to notice that starting personal projects feels easier than speaking in a meeting. The next useful question concerns that difference: preparation, the people involved, or the stakes. You do not need a fixed personality label to explore it.",
        ],
      },
      {
        heading: "Keep the scale of the reading honest",
        paragraphs: [
          "A Sun-sign prompt uses one part of an astrological framework. It should not be presented as a full natal chart, a diagnosis of your personality, or evidence about another person's compatibility with you. Likewise, a description cannot decide your career or a relationship on your behalf.",
          "Save one observation you would like to test in ordinary life. You might notice when you volunteer to lead, how you respond to a changed plan, or what helps you ask for support. Return to concrete experiences when you revisit the entry. The value of the exercise is in the attention it invites, rather than how completely a sign seems to define you.",
        ],
      },
    ],
    sources: [tropicalZodiac],
  },
  {
    slug: "astrology-unknown-birth-time",
    title: "Exploring astrology when you do not know your birth time",
    description: "Learn why birth time matters for a chart, how to keep uncertain information visible, and what to do before trusting a precise rising sign.",
    tradition: "astrology",
    tool: "astrology",
    date: "2026-10-10",
    sections: [
      {
        heading: "Unknown is a useful answer",
        paragraphs: [
          "If you do not know your birth time, record it as unknown. A guessed time entered into an exact field can make the resulting chart look more certain than its inputs justify. There is no need to choose a convenient hour just to complete a form, and there is no reason to treat uncertainty as a failure to know yourself.",
          "Astrodienst's birth-time guidance explains that the timing affects chart positions and that its unknown-time option uses a hypothetical noon while omitting houses. That is a software convention, not a discovery that the person was born at noon. A service should distinguish an assumed time from a recorded one.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Separate a record from a recollection",
        paragraphs: [
          "If you want to investigate, begin with records already available to you or ask the relevant records office what information it holds. Availability varies. A relative's memory can be worth noting, but keep the original wording: around breakfast is not the same as 8:02 a.m. Store the source alongside the time rather than silently converting an estimate into a precise fact.",
          "You can make a small data note with three fields: value, source, and confidence. For example: morning; family recollection; approximate. This keeps later interpretations anchored to what you know. Avoid sharing certificates or unnecessary identifying details simply to receive a general reflection.",
        ],
      },
      {
        heading: "Be cautious with time-sensitive placements",
        paragraphs: [
          "The ascendant and houses depend on the birth moment and location. Astrodienst emphasizes that even relatively small differences in time can change its chart interpretation. A precise rising sign supplied without a reliable time deserves a question about the calculation and assumptions behind it.",
          "Do not infer a birth time solely because a description feels familiar. You can enjoy a theme without treating agreement as verification of a historical fact. If you compare charts made with different assumed times, keep them clearly labeled as alternatives rather than choosing the most flattering one as the true record.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Choose an exercise that fits the information",
        paragraphs: [
          "You can work with a clearly labeled general prompt or an approximate Sun-sign reflection without pretending it contains a full chart. Ask a source what it can and cannot calculate from the information available. Near a sign boundary, even the Sun-sign label may need more care than a simple date range suggests.",
          "For a journal entry, try: Which parts of this description invite a useful question, and which feel unrelated to my experience? Give one concrete example of each. The reflection remains yours even when the birth record is incomplete. Keep any missing information visible and allow it to stay missing unless stronger evidence becomes available.",
        ],
      },
    ],
    sources: [birthTime],
  },
  {
    slug: "reflective-reading-journal",
    title: "How to keep a reading journal that helps you reflect",
    description: "Keep the question, interpretation, evidence, and next step distinct so your tarot, I Ching, or astrology journal remains useful when you return.",
    tradition: "reflection",
    tool: "tarot",
    date: "2026-10-10",
    sections: [
      {
        heading: "Capture the moment before interpreting it",
        paragraphs: [
          "Begin with the date, the question you asked, and two sentences about the situation. Record any cards, lines, or supplied birth details separately from the interpretation. You are preserving the starting point so that a later outcome does not quietly reshape your memory of what the reading originally said.",
          "There is no need for a polished entry. A few accurate sentences are more useful than a page you feel obliged to finish. If a question involves another person, leave out identifying details that do not help your reflection. Choose deliberately what you save and what you would be comfortable exporting or sharing.",
        ],
      },
      {
        heading: "Give observation and meaning different places",
        paragraphs: [
          "Use two short headings: What I noticed and What I made of it. Under the first, record the image or phrase that drew your attention. Under the second, describe your association and why it connected. Add a third line for a different possible interpretation. This small separation keeps your response open to revision.",
          "For example: I noticed a figure standing at a threshold. I connected it to an invitation I have delayed answering. Another possibility is that I am thinking about the preparation needed before saying yes. None of these notes establishes what will happen; they reveal the questions the image brought forward for you.",
        ],
      },
      {
        heading: "Add one action or observation",
        paragraphs: [
          "The University of Edinburgh's Reflection Toolkit describes a simple sequence of describing an experience, exploring its meaning, and considering what follows. You can use that general distinction without turning a journal into an assignment. Auspice's version is to finish with one small thing you will observe, ask, or try.",
          "Make the step specific enough to recognize later: ask which parts of the project are flexible, sketch two bedroom arrangements, or note when a particular concern arises during the week. A next step can also be gathering information before acting. It does not have to be a major change.",
        ],
        sourceRefs: [0],
      },
      {
        heading: "Return without rewriting the beginning",
        paragraphs: [
          "At a natural review point, add a dated follow-up beneath the original entry. What happened? What surprised you? Which part of your first interpretation did not fit? Record a mismatch as readily as a connection. Otherwise, the journal can gradually become a record of only the moments that seem to confirm your expectations.",
          "Look for recurring questions more than repeated predictions. You may discover that several readings concern the same unfinished conversation or an overlooked need. Use that pattern to choose your next practical step, and allow old entries to remain unresolved. You can pause, delete, or stop the practice whenever it no longer feels useful.",
        ],
      },
    ],
    sources: [reflectionModel],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guideReadingMinutes(guide: Guide): number {
  const words = guide.sections.flatMap((section) => section.paragraphs).join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const guideSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://auspice-red.vercel.app").replace(/\/$/, "");
