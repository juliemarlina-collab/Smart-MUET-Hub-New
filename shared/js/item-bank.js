/* Smart MUET · shared item bank. Lab content (Reading, Listening) and the
   "Review again" versions of every item a lab can save to smh.review.queue.v1.
   Edit questions here; the labs and review.html both read this file. */
window.SMHBank = (() => {
  "use strict";
  const foodBank = [
    "When the student council opened a small food bank in the library foyer last March, organisers expected about twenty visitors a week.",
    "Within a month, nearly eighty students were collecting basic items such as rice, oats and canned food.",
    "The council responded by moving the food bank to a larger room beside the cafeteria and recruiting volunteers from three different clubs.",
    "Not everyone welcomed the change at first.",
    "Some students worried that the new location was too public.",
    "To protect privacy, volunteers now prepare packs in advance so that visitors can collect them quickly.",
  ];
  const passages = {
    repair: {
      title: "Learning to Repair",
      text: [
        "Every second Saturday, a polytechnic workshop in Negeri Sembilan becomes a repair café. Residents bring broken fans, rice cookers and torn bags, and students from the electrical and fashion programmes help to fix them free of charge.",
        "The idea began as a final-year project, but it has continued long after the original team graduated. Lecturers say the sessions give students something a classroom cannot: customers who explain a problem in their own words. “You have to ask good questions before you touch a screwdriver,” says one volunteer.",
        "Not every item can be saved. When a repair is unsafe, volunteers explain why and suggest where the owner can recycle it. Even so, the organisers estimate that two out of three items leave the workshop working again.",
      ],
      questions: [
        {
          q: "What is the main purpose of the repair café?",
          options: [
            "To sell repaired items to residents",
            "To fix residents’ items for free while giving students practice",
            "To train residents to become electricians",
            "To collect broken items for recycling",
          ],
          answer: 1,
          hint: "Study: “main purpose” needs the overall idea of paragraph 1, not one detail.",
          why: "Paragraph 1 says students “help to fix them free of charge”, and paragraph 2 explains what students gain. Nothing is sold (A), residents are not trained (C), and recycling is only for unsafe items (D).",
          label: "Repair café: main purpose",
        },
        {
          q: "“It has continued long after the original team graduated” suggests that the project…",
          options: [
            "ended when the students left",
            "has become an established activity",
            "was never assessed",
            "needs new lecturers",
          ],
          answer: 1,
          hint: "Analyse: what does “continued long after” tell you about the project now?",
          why: "If it continues after its founders left, it has become a regular, established activity. A contradicts “continued”; C and D are not mentioned.",
          label: "Repair café: inference",
        },
        {
          q: "According to lecturers, what do students gain from the sessions?",
          options: [
            "Experience communicating with real customers",
            "More time with their lecturers",
            "Higher marks for their projects",
            "New tools for the workshop",
          ],
          answer: 0,
          hint: "Circle “lecturers say” and read the rest of that sentence.",
          why: "Lecturers mention “customers who explain a problem in their own words”, and the volunteer adds that you must ask good questions. The other options are not stated.",
          label: "Repair café: detail",
        },
        {
          q: "What happens when an item cannot be repaired safely?",
          options: [
            "Volunteers repair it anyway",
            "The owner pays a small fee",
            "Volunteers explain why and suggest recycling options",
            "It is thrown away at the workshop",
          ],
          answer: 2,
          hint: "Scan for “unsafe”, then read the whole sentence.",
          why: "“Volunteers explain why and suggest where the owner can recycle it.” The owner keeps control of the item; nothing says it is repaired anyway or thrown away there.",
          label: "Repair café: unsafe items",
        },
        {
          q: "“Two out of three items leave the workshop working again.” Which statement is supported?",
          options: [
            "Every item is repaired.",
            "Most items are repaired successfully.",
            "Only a third of visitors return.",
            "Unsafe items are the most common.",
          ],
          answer: 1,
          hint: "Nail: two out of three is more than half. Which option matches without going further?",
          why: "Two out of three means most items. A contradicts “Not every item can be saved”; C and D go beyond the evidence.",
          label: "Repair café: numbers",
        },
      ],
    },
    micro: {
      title: "Micro-volunteering",
      text: [
        "Volunteering once meant giving up whole weekends. Today, many students prefer micro-volunteering: short tasks that take between ten minutes and an hour, often completed online. A student might proofread a charity’s poster, translate a short notice or record an audiobook chapter for visually impaired readers.",
        "Supporters argue that this flexibility allows busy students to contribute without falling behind in their studies. Critics, however, warn that very short tasks rarely build lasting relationships with a community.",
        "A charity coordinator in Seremban partly agrees with the critics. “Micro-tasks bring us new helpers,” she says, “but our most committed volunteers usually started small and then chose to stay longer.” For her, the value of micro-volunteering lies less in the task itself than in what it can lead to.",
      ],
      questions: [
        {
          q: "What is micro-volunteering?",
          options: [
            "Volunteering only at weekends",
            "Short tasks, often done online",
            "Paid work for charities",
            "Long-term community projects",
          ],
          answer: 1,
          hint: "Look for the definition after the colon in paragraph 1.",
          why: "“Short tasks that take between ten minutes and an hour, often completed online.” A describes the old style of volunteering, which the text contrasts with.",
          label: "Micro-volunteering: definition",
        },
        {
          q: "Why do supporters like micro-volunteering?",
          options: [
            "It fits students’ busy schedules.",
            "It builds strong community ties.",
            "It pays students well.",
            "It replaces students’ studies.",
          ],
          answer: 0,
          hint: "Circle “supporters argue” and paraphrase the reason.",
          why: "“This flexibility allows busy students to contribute without falling behind” = it fits busy schedules. B is the critics’ concern in reverse.",
          label: "Micro-volunteering: supporters",
        },
        {
          q: "What is the critics’ main concern?",
          options: [
            "The tasks are too difficult.",
            "The tasks are rarely completed online.",
            "Short tasks seldom create lasting community connections.",
            "Students lose interest in their courses.",
          ],
          answer: 2,
          hint: "“However” introduces the critics. Read the clause after it.",
          why: "“Very short tasks rarely build lasting relationships with a community.” “Rarely” is paraphrased as “seldom”.",
          label: "Micro-volunteering: critics",
        },
        {
          q: "The coordinator’s attitude to the critics’ view is best described as…",
          options: [
            "completely opposed",
            "partly in agreement",
            "uninterested",
            "strongly in favour without reservation",
          ],
          answer: 1,
          hint: "Look for a word that limits how much she agrees.",
          why: "She “partly agrees”: micro-tasks bring new helpers, but committed volunteers usually stay longer. A and D are too absolute.",
          label: "Micro-volunteering: attitude",
        },
        {
          q: "According to the coordinator, the main value of micro-volunteering is…",
          options: [
            "the quality of each task",
            "the number of tasks completed",
            "its potential to lead to a longer commitment",
            "its online format",
          ],
          answer: 2,
          hint: "The final sentence compares “the task itself” with something else.",
          why: "“The value … lies less in the task itself than in what it can lead to” — starting small can lead to staying longer. A is the opposite of what she says.",
          label: "Micro-volunteering: main value",
        },
      ],
    },
  };  const model = [
    ["Hana", "Are we still meeting on Tuesday morning for the study group?"],
    ["Ravi", "That was the plan, but the lab is booked then. Wednesday afternoon is free."],
    ["Hana", "Wednesday’s no good for me. I’ve got a presentation. What about Thursday?"],
    ["Ravi", "Thursday afternoon works. Let’s make it then."],
  ];
  const extracts = {
    d3: [
      ["Man", "Did you finish reading the article for tomorrow’s tutorial?"],
      ["Woman", "I got [[halfway]] before my laptop battery died. [[I’ll read the rest]] on the train."],
    ],
    p3: [
      ["Narrator", "Speaker one."],
      ["Farid", "I took the café job mainly for the pay, to be honest. [[But what surprised me]] is how much [[easier it’s become to talk to strangers]]. At first I could hardly look customers in the eye. Now I actually enjoy chatting with them."],
      ["Narrator", "Speaker two."],
      ["Mei", "My shifts at the bookshop are only on weekends, so I have to [[plan my assignments carefully]] during the week. I used to leave everything until the last minute. Now [[I keep a schedule]], and honestly, my grades have improved because of it."],
      ["Narrator", "Speaker three."],
      ["Kumar", "People assume I’d meet lots of people at the phone repair kiosk, [[but it’s usually just me and the devices]]. What I’ve gained is [[hands-on skill]]. I can replace a screen in fifteen minutes now, which is really relevant to my electronics diploma."],
    ],
    q4: [
      ["Woman", "Shall we take the lift to the fifth floor?"],
      ["Man", "The queue’s huge. [[The stairs would be quicker]], wouldn’t they?"],
    ],
    q5: [
      ["Man", "Your presentation was great. Were you nervous?"],
      ["Woman", "[[My hands were shaking the whole time]], [[but I’m glad nobody noticed]]."],
    ],
  };
  const matchOptions = [
    "better time management",
    "new friendships",
    "confidence with customers",
    "extra money for family",
    "useful technical skills",
  ];
  const matchItems = [
    { speaker: "Speaker 1 · Farid", answer: 2, why: "Farid took the job for pay, but the benefit he stresses is talking to strangers more easily: confidence with customers (C). He never mentions family (D)." },
    { speaker: "Speaker 2 · Mei", answer: 0, why: "Mei plans her assignments and keeps a schedule: better time management (A). Improved grades are a result of that benefit." },
    { speaker: "Speaker 3 · Kumar", answer: 4, why: "Kumar says he does not meet many people (rejecting B) and has gained hands-on skill: useful technical skills (E)." },
  ];
  const mcq = {
    q4: {
      q: "4. What does the man suggest?",
      options: ["Waiting for the lift", "Using the stairs", "Going to another floor"],
      answer: 1,
      hint: "A question tag (“wouldn’t they?”) often makes a suggestion.",
      why: "“The stairs would be quicker, wouldn’t they?” is a polite suggestion. The long queue is his reason for not waiting (A).",
    },
    q5: {
      q: "5. How did the woman feel about her presentation?",
      options: ["Calm throughout", "Nervous but relieved", "Disappointed with her performance"],
      answer: 1,
      hint: "Listen for two feelings joined by “but”.",
      why: "Shaking hands = nervous; “glad nobody noticed” = relieved. Nothing suggests she was disappointed.",
    },
  };
  /* ---------- Review again: every item a lab can save, as one MCQ ---------- */
  const fb = foodBank.join(" ");
  const textCtx = (title, paras) => ({ type: "text", title, paras });
  const audioCtx = (title, lines) => ({ type: "audio", title, lines });
  const items = {
    "reading:drill-evidence": {
      context: textCtx("A food bank that grew", [fb]),
      q: "Which sentence shows that the food bank was more popular than expected?",
      options: [foodBank[0], foodBank[1], foodBank[2]],
      answer: 1,
      why: "Organisers expected about twenty a week, but nearly eighty came within a month. The contrast between the two numbers is the evidence.",
    },
    "reading:drill-paraphrase": {
      context: textCtx("A food bank that grew", [fb]),
      q: "“The council responded by moving the food bank to a larger room.” Which option means the same?",
      options: ["The council made the food bank smaller.", "The council relocated the service to a bigger space.", "The council asked the cafeteria to provide food."],
      answer: 1,
      why: "moving = relocated; a larger room = a bigger space. Same meaning, different words.",
    },
    "reading:drill-reference": {
      context: textCtx("A food bank that grew", [fb]),
      q: "“Not everyone welcomed the change at first.” What does “the change” refer to?",
      options: ["Opening the food bank in March", "Moving the food bank to a room beside the cafeteria", "Preparing packs in advance"],
      answer: 1,
      why: "A reference word usually points back to the sentence just before it, which describes the move. “The new location” in the next sentence confirms it.",
    },
    "listening:drill-predict": {
      context: null,
      q: "Before you listen: what type of answer does “Why is Aina late for class?” need?",
      options: ["a time", "a place", "a reason", "a feeling or opinion"],
      answer: 2,
      why: "“Why” asks for a reason. Predicting the type tells your ears what to catch.",
    },
    "listening:drill-signpost": {
      context: null,
      q: "“I was going to take the bus, but in the end my brother drove me.” How did the speaker get to campus?",
      options: ["By bus", "In her brother’s car", "On foot"],
      answer: 1,
      why: "“But in the end” cancels the bus plan and introduces what really happened. The bus is the distractor.",
    },
    "listening:drill-eliminate": {
      context: audioCtx("Short dialogue", extracts.d3),
      q: "What does the woman mean?",
      options: ["She has finished the article.", "She will complete the reading later.", "She has lost her laptop."],
      answer: 1,
      why: "She got “halfway” and will “read the rest on the train”. A flat battery is not a lost laptop.",
    },
    "writing:drill-structure": {
      context: null,
      q: "Which sentence is the best POINT (topic sentence) for a paragraph about smartphones in class?",
      options: [
        "For example, in a reading lesson, a lecturer can ask groups to look up unfamiliar terms.",
        "Allowing smartphones in class can support learning when their use is guided.",
        "Thus, with clear rules, smartphones become learning tools rather than distractions.",
      ],
      answer: 1,
      why: "The Point states one focused claim. “For example…” is the Example; “Thus…” is the Link.",
    },
    "writing:drill-explain": {
      context: null,
      q: "Point: “Learning a second language can improve students’ job prospects.” Which sentence explains it best?",
      options: [
        "Languages are very important nowadays.",
        "Many employers serve customers across the region, so staff who communicate in more than one language can take on wider responsibilities.",
        "I personally enjoy learning new languages.",
      ],
      answer: 1,
      why: "An explanation shows why or how. Only this option gives a cause that supports job prospects.",
    },
    "writing:drill-tone": {
      context: null,
      q: "You are replying to your club adviser, Puan Salmah. Which opening is most appropriate?",
      options: ["Hey Puan Salmah! What’s up?", "Dear Puan Salmah, thank you for your email about the leadership workshop.", "Yo, got your message about the thing."],
      answer: 1,
      why: "An adviser needs a formal greeting with her title and a clear reference to her email.",
    },
    "speaking:drill-structure": {
      context: null,
      q: "In a PREP response about building friendships, which sentence should come first?",
      options: [
        "For example, photography club members can plan an exhibition together.",
        "I suggest joining a campus club to build stronger friendships.",
        "Therefore, joining a club is a practical way to turn shared interests into lasting friendships.",
      ],
      answer: 1,
      why: "PREP starts with the Point: a direct recommendation. The example comes third and “Therefore…” closes.",
    },
    "speaking:drill-example": {
      context: null,
      q: "Which example best supports “clubs help students cooperate”?",
      options: [
        "My campus has many different clubs.",
        "In a photography club, students plan an exhibition together and divide tasks to meet a shared deadline.",
        "Friendship is very important to everyone.",
      ],
      answer: 1,
      why: "Planning an exhibition and dividing tasks show cooperation in action. The others only state facts or opinions.",
    },
    "speaking:drill-connection": {
      context: null,
      q: "“Students can learn to cooperate. _____, club members can organise a campus exhibition together.”",
      options: ["However", "For example", "Therefore"],
      answer: 1,
      why: "The second sentence illustrates the first, so “For example”. However = contrast; therefore = result.",
    },
  };
  Object.entries(passages).forEach(([pid, p]) =>
    p.questions.forEach((q, i) => {
      items["reading:" + pid + "-q" + (i + 1)] = {
        context: textCtx(p.title, p.text),
        q: q.q,
        options: q.options,
        answer: q.answer,
        why: q.why,
      };
    }),
  );
  /* ---------- SCAN Evidence Hunt (labs/scan-hunt.html) ----------
     Each passage: paras = arrays of sentences (numbered across the passage, from 0).
     Each question: type (S step), key (C step: question words that carry the meaning),
     ev (A step: accepted evidence sentence numbers), options + answer (N step),
     traps (one per option; the answer's entry is ""), why (full explanation). */
  const HUNT_TYPES = ["Main idea", "Detail", "Reference", "Word meaning", "Inference", "Writer’s view"];
  const HUNT_PLAIN = {
    "Main idea": "The big idea of the whole text",
    Detail: "One fact the text states",
    Reference: "What a word like “this” or “it” points to",
    "Word meaning": "What a word means here",
    Inference: "Something the text suggests, not says",
    "Writer’s view": "What the writer thinks",
  };
  const HUNT_TRAPS = {
    word: ["Word-Match Trap", "Repeats a word from the text but changes its meaning or context."],
    own: ["Own-Knowledge Trap", "May be true in real life, but the text does not say it."],
    far: ["Too-Far Trap", "Goes beyond the evidence, often with always, every, never, best or completely."],
  };
  const hunt = {
    campus: {
      title: "The Campus Bike Share",
      level: "Starter · short campus text · about 130 words",
      stage: "start",
      words: [["hostel", "a building where students live"], ["workshops", "rooms for practical work"], ["council", "a group chosen to make decisions"], ["reminder", "a message that helps you remember"]],
      paras: [
        [
          "Last semester, our polytechnic started a bike share scheme.",
          "There are now forty bicycles at four stations around the campus.",
          "Students can borrow a bike for free by scanning their student card.",
        ],
        [
          "Before the scheme, many students walked for fifteen minutes from the hostel to the workshops.",
          "Now the same trip takes about five minutes.",
          "Some students say they feel less tired in their morning classes.",
        ],
        [
          "However, there have been a few problems.",
          "Some riders forget to return the bikes, so the stations are sometimes empty in the evening.",
          "To solve this, the student council now sends a reminder message if a bike is not returned within two hours.",
        ],
        [
          "The council hopes to add ten more bicycles next year.",
          "It believes the scheme can make campus life healthier and easier.",
        ],
      ],
      questions: [
        {
          q: "How do students borrow a bike?",
          type: "Detail", key: ["how", "borrow", "bike"], ev: [2],
          options: ["By paying at the station", "By scanning their student card", "By asking the student council", "By booking one day earlier"],
          answer: 1,
          traps: ["Not in the text: many bike shares charge money in real life, but this one is free", "", "Word match: the council is in the text, but it sends reminders; it does not lend bikes", "Not in the text: booking is never mentioned"],
          tags: ["own", "", "word", "own"], nameIt: 0,
          why: "“Students can borrow a bike for free by scanning their student card.” B says exactly this.",
          label: "Evidence Hunt · Bike share: how to borrow",
        },
        {
          q: "The word “scheme” in paragraph 1 is closest in meaning to …",
          type: "Word meaning", key: ["scheme", "closest", "meaning"], ev: [0, 1],
          options: ["a plan or programme", "a bicycle shop", "a student card", "a trick to cheat people"],
          answer: 0,
          traps: ["", "Word match: bicycles are in the text, but nothing is sold", "Word match: the card is how you borrow, not what a scheme is", "Not in the text: “scheme” can sometimes mean a trick in real life, but here it is a useful service"],
          tags: ["", "word", "word", "own"], nameIt: 3,
          why: "The polytechnic “started a bike share scheme” with forty bikes at four stations: an organised plan or programme.",
          label: "Evidence Hunt · Bike share: scheme",
        },
        {
          q: "In paragraph 3, what does “this” in “To solve this” refer to?",
          type: "Reference", key: ["this", "refer"], ev: [7],
          options: ["Stations being empty because bikes are not returned", "Students walking for fifteen minutes", "The reminder message", "Students feeling tired in class"],
          answer: 0,
          traps: ["", "Word match: real words from paragraph 2, but that problem was solved by the bikes", "Word match: the message comes after “this”; it is the solution, not the problem", "Word match: from paragraph 2, and it is good news, not a problem"],
          tags: ["", "word", "word", "word"], nameIt: 2,
          why: "Read the sentence before: riders forget to return bikes, “so the stations are sometimes empty”. That is the problem the reminder solves.",
          label: "Evidence Hunt · Bike share: this",
        },
        {
          q: "What is the passage mainly about?",
          type: "Main idea", key: ["mainly", "about"], ev: [0, 10],
          options: ["A bike share scheme: how it helps, one problem and a solution", "Why students are always tired in class", "How to repair bicycles", "Why bicycles are better than buses"],
          answer: 0,
          traps: ["", "Too far: the text says “some” students feel “less tired”; it never says always", "Not in the text: repairs are never mentioned", "Not in the text: buses are never mentioned"],
          tags: ["", "far", "own", "own"], nameIt: 1,
          why: "The text introduces the scheme, gives its benefits, a problem and a solution, then the plan for next year. Only A covers it all.",
          label: "Evidence Hunt · Bike share: main idea",
        },
      ],
    },
    roofs: {
      title: "Cooling the City from the Roof",
      level: "MUET level · Part 4-style article · about 270 words",
      stage: "muet",
      words: [["heat island effect", "when a city is hotter than the green areas around it"], ["urban planners", "people who plan how a city grows"], ["absorb", "take in"], ["structural check", "an inspection to see if a building is strong enough"], ["maintenance", "looking after something so it keeps working"], ["grant", "money given for a special purpose"], ["council", "the local government of a town or city"]],
      paras: [
        [
          "On a hot afternoon in Kuala Lumpur, the air just above a dark concrete roof can be several degrees warmer than the air above a park.",
          "Urban planners call this the heat island effect, and it grows as cities replace trees with buildings and roads.",
          "One response that is attracting attention is surprisingly simple: covering roofs with plants.",
        ],
        [
          "A rooftop garden works in two ways.",
          "The soil and leaves absorb sunlight that would otherwise heat the roof, and the water released by the plants cools the surrounding air.",
          "Residents of a block of flats in Petaling Jaya that installed a garden two years ago say their top-floor units now need the air-conditioner for fewer hours each day.",
          "However, the building manager admits that the electricity savings are difficult to measure precisely, because the weather has varied so much.",
        ],
        [
          "The idea is not without problems.",
          "Older buildings may not be strong enough to carry the weight of wet soil, and a structural check can cost more than the garden itself.",
          "Maintenance is another concern.",
          "Without regular watering during the dry months, plants die quickly, and a brown roof provides little benefit.",
        ],
        [
          "For this reason, some councils now offer grants only to buildings that agree to a three-year care plan.",
          "Supporters believe this condition is fair.",
          "They argue that a garden which is abandoned after one season wastes public money and discourages others from trying.",
        ],
        [
          "Rooftop gardens will not solve the heat island effect on their own.",
          "Yet, as one planner put it, every green roof is a small step towards a city that people can comfortably walk in.",
        ],
      ],
      questions: [
        {
          q: "What is the passage mainly about?",
          type: "Main idea", key: ["mainly", "about"], ev: [2, 14],
          options: ["Why Kuala Lumpur is hotter than other cities", "How rooftop gardens can cool cities, and the problems they bring", "How to build a garden on an old building", "Why councils should stop giving grants"],
          answer: 1,
          traps: ["Not in the text: many people believe this, but the text never compares Kuala Lumpur with other cities", "", "Word match: “older buildings” appears, but only as one problem", "Opposite: councils give grants with a condition; nobody says stop"],
          tags: ["own", "", "word", "word"], nameIt: 0,
          why: "Paragraph 1 introduces green roofs as a response to heat (sentence 3), paragraphs 2–4 give benefits and problems, and the last paragraph weighs them up. Only B covers the whole text.",
          label: "Evidence Hunt · Roofs: main idea",
        },
        {
          q: "According to paragraph 2, how do the plants cool the air?",
          type: "Detail", key: ["how", "plants", "cool", "air"], ev: [4],
          options: ["By blocking wind from the roof", "Through the water they release", "By making the roof darker", "By reducing the use of air-conditioners"],
          answer: 1,
          traps: ["Not in the text: plants can block wind in real life, but the text never mentions wind", "", "Opposite: a dark roof is the hotter one", "Cause vs effect: less air-conditioning is a result, not how the cooling happens"],
          tags: ["own", "", "word", "word"], nameIt: 0,
          why: "“The water released by the plants cools the surrounding air.” B is a paraphrase of that sentence.",
          label: "Evidence Hunt · Roofs: how plants cool",
        },
        {
          q: "What does the building manager say about the electricity savings?",
          type: "Detail", key: ["building", "manager", "electricity", "savings"], ev: [6],
          options: ["They are large and easy to prove", "They cannot be measured exactly", "They have disappeared because of the weather", "They are bigger than the residents claim"],
          answer: 1,
          traps: ["Opposite: he says they are difficult to measure", "", "Word match: “weather” is there, but it makes measuring hard; nothing has disappeared", "Not in the text: he does not compare his view with the residents’"],
          tags: ["far", "", "word", "far"], nameIt: 2,
          why: "“The electricity savings are difficult to measure precisely.” Difficult to measure precisely = cannot be measured exactly.",
          label: "Evidence Hunt · Roofs: electricity savings",
        },
        {
          q: "In paragraph 4, what does “this condition” refer to?",
          type: "Reference", key: ["this", "condition", "refer"], ev: [11],
          options: ["The structural check for older buildings", "The three-year care plan needed for a grant", "The dry months", "The heat island effect"],
          answer: 1,
          traps: ["Wrong reference: “older buildings” and the check are real words from paragraph 3, but they are not the condition for a grant", "", "Wrong reference: the nearest noun before is not always the answer", "Wrong reference: too far back in the text"],
          tags: ["word", "", "word", "word"], nameIt: 0,
          why: "Read the sentence before: grants go “only to buildings that agree to a three-year care plan”. That requirement is the condition supporters think is fair.",
          label: "Evidence Hunt · Roofs: this condition",
        },
        {
          q: "The word “abandoned” in paragraph 4 is closest in meaning to …",
          type: "Word meaning", key: ["abandoned", "closest", "meaning"], ev: [13],
          options: ["left without care", "built too quickly", "paid for by the council", "shared with neighbours"],
          answer: 0,
          traps: ["", "Not in the text: speed of building is never discussed", "Word match: “public money” is nearby, but it is not the meaning of the word", "Not in the text: sharing is never mentioned"],
          tags: ["", "own", "word", "own"], nameIt: 2,
          why: "The paragraph is about the three-year care plan, and paragraph 3 says unwatered plants die. A garden “abandoned after one season” is one nobody looks after.",
          label: "Evidence Hunt · Roofs: abandoned",
        },
        {
          q: "What is the writer’s overall attitude towards rooftop gardens?",
          type: "Writer’s view", key: ["writer’s", "attitude", "towards"], ev: [14, 15],
          options: ["Strongly against them, because they cost too much", "Cautiously positive: useful, but not a complete solution", "Completely sure they will end the heat island effect", "Not interested, because the evidence is weak"],
          answer: 1,
          traps: ["Partly true: costs are mentioned, but the writer is not against them", "", "Too far: the writer says they will not solve it on their own", "Too far: one measurement is uncertain, but the writer still calls them a step forward"],
          tags: ["word", "", "far", "far"], nameIt: 2,
          why: "“Will not solve the heat island effect on their own. Yet … every green roof is a small step.” A limit plus a positive = cautiously positive.",
          label: "Evidence Hunt · Roofs: writer’s attitude",
        },
      ],
    },
    micro: {
      title: "Five Minutes a Day: Can Micro-learning Work?",
      level: "MUET level · Part 5-style article · about 240 words",
      stage: "muet",
      words: [["juggle", "try to do many things at the same time"], ["bursts", "short periods"], ["session", "one period of study"], ["productive", "useful; getting a lot done"], ["a catch", "a hidden problem"], ["froze", "suddenly could not speak"], ["routine", "things you do regularly"]],
      paras: [
        [
          "Language apps promise that five minutes a day is enough to learn a new language.",
          "For busy diploma students who juggle classes, part-time jobs and family duties, the offer is attractive.",
          "But how much can really be achieved in such short bursts?",
        ],
        [
          "Researchers who study memory say the answer depends less on the length of each session than on how often learners return.",
          "Short, frequent practice makes the brain retrieve words again and again, and each successful retrieval makes the memory stronger.",
          "In contrast, a single two-hour session the night before a test often feels productive but is quickly forgotten.",
        ],
        [
          "There is a catch, however.",
          "Most apps focus on vocabulary and simple sentences, so learners may recognise hundreds of words yet struggle to hold a real conversation.",
          "A lecturer in Melaka noticed this among her students: they scored well on app quizzes, but froze when asked to explain an idea aloud.",
        ],
        [
          "She now asks students to use the app as a warm-up rather than the whole workout.",
          "After their five minutes, they must record a one-minute voice note using at least three of the new words.",
          "At first, many students found the task uncomfortable.",
          "By the end of the semester, though, most said they felt more confident speaking in class.",
        ],
        [
          "Micro-learning, then, is neither a miracle nor a waste of time.",
          "It works best as one part of a routine that also includes speaking, writing and reading longer texts.",
        ],
      ],
      questions: [
        {
          q: "According to the researchers, what matters most when learning words?",
          type: "Detail", key: ["researchers", "matters", "most"], ev: [3],
          options: ["How long each session lasts", "How often learners practise", "Which app learners choose", "Studying the night before a test"],
          answer: 1,
          traps: ["Opposite: it depends less on the length", "", "Not in the text: choosing a good app may matter in real life, but the researchers never mention it", "Word match: the night before a test is the example that does not work"],
          tags: ["word", "", "own", "word"], nameIt: 2,
          why: "“Depends less on the length of each session than on how often learners return.” How often learners return = how often they practise.",
          label: "Evidence Hunt · Micro: what matters most",
        },
        {
          q: "The word “retrieve” in paragraph 2 is closest in meaning to …",
          type: "Word meaning", key: ["retrieve", "closest", "meaning"], ev: [4],
          options: ["bring back from memory", "translate into English", "forget completely", "write down neatly"],
          answer: 0,
          traps: ["", "Not in the text: translation is never mentioned", "Opposite: “forgotten” appears later in the paragraph, but retrieving words makes the memory stronger", "Not in the text: writing is not the point here"],
          tags: ["", "own", "word", "own"], nameIt: 2,
          why: "Retrieving words “again and again” makes “the memory stronger”, so retrieve means to bring something back from memory.",
          label: "Evidence Hunt · Micro: retrieve",
        },
        {
          q: "What can be inferred about a two-hour session the night before a test?",
          type: "Inference", key: ["inferred", "two-hour", "session"], ev: [5],
          options: ["It feels useful but does not help long-term memory", "It is the best way to prepare", "Students enjoy it more than apps", "It improves speaking skills"],
          answer: 0,
          traps: ["", "Too far: “the best way” goes far beyond the text, which says this session is quickly forgotten", "Too far: enjoyment is never mentioned", "Not in the text: speaking is discussed later, about apps"],
          tags: ["", "far", "own", "own"], nameIt: 1,
          why: "It “feels productive but is quickly forgotten”. Feels productive = feels useful; quickly forgotten = no long-term memory.",
          label: "Evidence Hunt · Micro: two-hour session",
        },
        {
          q: "What problem did the lecturer in Melaka notice?",
          type: "Detail", key: ["problem", "lecturer", "notice"], ev: [8, 7],
          options: ["Students could not afford the app", "Students did well on quizzes but could not speak with confidence", "Students did not like vocabulary quizzes", "Students forgot all the new words"],
          answer: 1,
          traps: ["Not in the text: cost is never mentioned", "", "Word match: “quizzes” is there, but they scored well on them", "Too far: “all” goes beyond the text; they recognised hundreds of words"],
          tags: ["own", "", "word", "far"], nameIt: 3,
          why: "“They scored well on app quizzes, but froze when asked to explain an idea aloud.” Froze = could not speak with confidence.",
          label: "Evidence Hunt · Micro: lecturer’s problem",
        },
        {
          q: "In paragraph 4, what does “the task” refer to?",
          type: "Reference", key: ["the", "task", "refer"], ev: [10],
          options: ["Using the app for five minutes", "Recording a one-minute voice note with new words", "Explaining an idea in class", "Taking the end-of-semester test"],
          answer: 1,
          traps: ["Wrong reference: “five minutes” is in the text, but that is the warm-up, not the task they found uncomfortable", "", "Wrong reference: that was the problem in paragraph 3", "Not in the text: no test is mentioned here"],
          tags: ["word", "", "word", "own"], nameIt: 0,
          why: "Read the sentence before: students “must record a one-minute voice note using at least three of the new words”. That is the task they found uncomfortable.",
          label: "Evidence Hunt · Micro: the task",
        },
        {
          q: "Which statement best sums up the writer’s conclusion?",
          type: "Writer’s view", key: ["sums", "up", "writer’s", "conclusion"], ev: [13, 14],
          options: ["Micro-learning apps should be banned", "Micro-learning helps most when combined with other practice", "Five minutes a day is enough to become fluent", "Apps are better teachers than lecturers"],
          answer: 1,
          traps: ["Too far: “banned” goes far beyond the text, which says it is “not a waste of time”", "", "Word match + too far: the first line is the apps’ promise, not the writer’s view", "Not in the text: apps and lecturers are not compared"],
          tags: ["far", "", "word", "own"], nameIt: 0,
          why: "“Neither a miracle nor a waste of time … works best as one part of a routine.” B says the same.",
          label: "Evidence Hunt · Micro: writer’s conclusion",
        },
      ],
    },
  };
  Object.entries(hunt).forEach(([pid, p]) => {
    const flat = p.paras.flat();
    p.questions.forEach((q, i) => {
      const para = p.paras.find((pa) => pa.includes(flat[q.ev[0]]));
      items["reading:hunt-" + pid + "-q" + (i + 1)] = {
        context: textCtx(p.title, [para.join(" ")]),
        q: q.q,
        options: q.options,
        answer: q.answer,
        why: q.why,
      };
    });
  });
  matchItems.forEach((m, i) => {
    items["listening:p3-" + (i + 1)] = {
      context: audioCtx("Three students talk about part-time jobs", extracts.p3),
      q: "What is the main benefit " + m.speaker + " mentions?",
      options: matchOptions,
      answer: m.answer,
      why: m.why,
    };
  });
  Object.entries(mcq).forEach(([id, m]) => {
    items["listening:" + id] = {
      context: audioCtx("Short dialogue", extracts[id]),
      q: m.q.replace(/^\d+\.\s*/, ""),
      options: m.options,
      answer: m.answer,
      why: m.why,
    };
  });
  /* ---------- Arcade content (arcade). Missed items become Review again questions. ---------- */
  const PEEL_PARTS = ["Point", "Explain", "Example", "Link"],
    PREP_PARTS = ["Point", "Reason", "Example", "Point again"];
  const arcade = {
    sort: [
      {
        id: "peel-internship",
        tech: "PEEL",
        skill: "writing",
        topic: "Should internships be compulsory?",
        parts: PEEL_PARTS,
        lines: [
          "Internships help polytechnic students become job-ready before they graduate.",
          "This is because they practise workplace skills that a classroom cannot fully teach.",
          "For example, an electrical student on placement learns to read wiring plans under a supervisor’s guidance.",
          "Therefore, internships should remain a compulsory part of every diploma.",
        ],
      },
      {
        id: "peel-social",
        tech: "PEEL",
        skill: "writing",
        topic: "Is social media useful for learning?",
        parts: PEEL_PARTS,
        lines: [
          "Social media can be a useful learning tool for young people.",
          "It gives them quick access to experts, tutorials and study groups at no cost.",
          "For instance, many students follow English teachers online to pick up new vocabulary every day.",
          "In short, when used wisely, social media supports learning rather than replacing it.",
        ],
      },
      {
        id: "prep-health",
        tech: "PREP",
        skill: "speaking",
        topic: "What is the best way to stay healthy?",
        parts: PREP_PARTS,
        lines: [
          "I believe regular exercise is the best way to stay healthy.",
          "This is because it strengthens the heart and also reduces stress.",
          "For example, my friends and I jog around the campus lake three evenings a week, and we feel more energetic.",
          "That is why I think exercise should be part of every student’s routine.",
        ],
      },
      {
        id: "peel-transport",
        tech: "PEEL",
        skill: "writing",
        topic: "How can cities reduce traffic jams?",
        parts: PEEL_PARTS,
        lines: [
          "Improving public transport is the best way to reduce traffic jams in cities.",
          "When buses and trains are frequent and affordable, fewer people need to drive to work.",
          "In the Klang Valley, the MRT lines have already given thousands of commuters an alternative to driving.",
          "Thus, investing in public transport benefits both commuters and the environment.",
        ],
      },
      {
        id: "prep-club",
        tech: "PREP",
        skill: "speaking",
        topic: "What is the most useful activity outside class?",
        parts: PREP_PARTS,
        lines: [
          "In my view, joining a club is the most useful activity outside class.",
          "The main reason is that it builds teamwork and communication skills.",
          "For instance, in the debate club I learnt to speak confidently in front of a crowd.",
          "So, I would encourage every new student to join at least one club.",
        ],
      },
    ],
    slice: [
      { id: "s1", skill: "listening", clue: "Let’s meet at the library at three. Actually, it’s being cleaned today, so the canteen is better.", q: "Where will they meet?", options: ["The library", "The canteen", "The lecture hall"], answer: 1, traps: { 0: "Changed-plan trap: the library is mentioned first, then rejected after “Actually”.", 2: "Not-mentioned trap: nobody says the lecture hall." }, why: "“Actually” signals a change of plan. The final decision is the canteen." },
      { id: "s2", skill: "listening", clue: "I was going to take the bus, but my brother offered me a lift, so I’ll go with him.", q: "How will the speaker travel?", options: ["By bus", "By train", "In his brother’s car"], answer: 2, traps: { 0: "Changed-plan trap: the bus was the old plan; “but” introduces the new one.", 1: "Not-mentioned trap: the train is never mentioned." }, why: "“but my brother offered me a lift, so I’ll go with him”: the final plan is his brother’s car." },
      { id: "s3", skill: "listening", clue: "The talk was meant to start at nine, but the speaker’s flight was delayed, so we’ve moved it to eleven.", q: "When will the talk start?", options: ["9 a.m.", "10 a.m.", "11 a.m."], answer: 2, traps: { 0: "Changed-plan trap: nine was the original time.", 1: "Guessing trap: ten is never said; it only sits between the two times." }, why: "The talk was moved to eleven. Listen to the end of the sentence for the final decision." },
      { id: "s4", skill: "listening", clue: "Honestly, I expected the workshop to be boring, but it turned out to be really useful.", q: "How does she feel about the workshop?", options: ["Bored", "Pleasantly surprised", "Angry"], answer: 1, traps: { 0: "Expectation trap: “boring” was what she expected, not what happened.", 2: "Not-mentioned trap: nothing suggests anger." }, why: "Expected boring, but “really useful”: she was pleasantly surprised." },
      { id: "s5", skill: "listening", clue: "Most people think the stadium is the main attraction here. However, what really brings tourists in is the night market.", q: "What attracts tourists most?", options: ["The stadium", "The night market", "The beach"], answer: 1, traps: { 0: "Contrast trap: “However” rejects the popular belief about the stadium.", 2: "Not-mentioned trap: the beach is never mentioned." }, why: "“However” introduces the speaker’s real point: the night market." },
      { id: "s6", skill: "reading", clue: "Only students with a valid matric card may borrow laptops, and each loan lasts three days.", q: "Who can borrow a laptop?", options: ["Any visitor to the library", "Students with a valid matric card", "Lecturers only"], answer: 1, traps: { 0: "Contradiction trap: “Only students” rules out other visitors.", 2: "Own-knowledge trap: lecturers are not mentioned in the text." }, why: "The text says “Only students with a valid matric card”." },
      { id: "s7", skill: "reading", clue: "The café’s profits rose slightly after it began offering vegetarian meals, though the owner says other factors were also involved.", q: "What can we infer?", options: ["Vegetarian meals were the only reason profits rose", "Vegetarian meals may have helped profits rise", "The café’s profits fell"], answer: 1, traps: { 0: "Too-far trap: “only” goes beyond the text; other factors were involved.", 2: "Contradiction trap: profits rose, not fell." }, why: "“Rose slightly … other factors were also involved” supports a careful inference: the meals may have helped." },
      { id: "s8", skill: "reading", clue: "Volunteers clean the beach every month, but most of the rubbish now comes from rivers, not visitors.", q: "Where does most of the rubbish come from?", options: ["Visitors", "Rivers", "Fishing boats"], answer: 1, traps: { 0: "Word-match trap: “visitors” appears in the text, but after “not”.", 2: "Own-knowledge trap: boats are a reasonable guess, but the text does not say so." }, why: "“most of the rubbish now comes from rivers, not visitors”." },
      { id: "s9", skill: "reading", clue: "Amira emailed the manager about the faulty printer. He replied that it would be replaced on Monday.", q: "Who does “He” refer to?", options: ["Amira", "The manager", "A technician"], answer: 1, traps: { 0: "Reference trap: Amira sent the email; “He” is the person who replied.", 2: "Not-mentioned trap: no technician appears in the text." }, why: "Amira emailed the manager, so the person who replied is the manager." },
      { id: "s10", skill: "reading", clue: "Enrolment in the evening class has doubled since the fees were reduced.", q: "Which sentence means the same?", options: ["More people joined after the class became cheaper", "The fees doubled after more people joined", "The evening class was cancelled"], answer: 0, traps: { 1: "Word-match trap: it reuses “doubled” and “fees” but reverses the meaning.", 2: "Not-stated trap: nothing says the class was cancelled." }, why: "Enrolment doubled = more people joined; fees reduced = cheaper. Same meaning, different words." },
    ],
  };
  /* ---------- Harder Arcade content: Diploma and Exam mode (MUET Band 3–5 level) ----------
     sortHard: no easy signpost words, plus one off-topic sentence (index 4) that goes in the bin. */
  arcade.sortHard = [
    {
      id: "h-peel-projects", tech: "PEEL", skill: "writing",
      topic: "Should polytechnics replace some exams with project-based assessment?",
      parts: PEEL_PARTS,
      lines: [
        "Project-based assessment gives a truer picture of what polytechnic students can actually do.",
        "A three-hour paper mainly rewards memory under pressure, whereas a project shows how a student plans, solves problems and works with others over several weeks.",
        "Civil engineering students who design and cost a small footbridge must apply theory in exactly the way a site engineer would.",
        "Replacing at least some written exams with projects would make a diploma a more reliable signal to employers.",
        "Many students also enjoy travelling home during the semester break.",
      ],
    },
    {
      id: "h-peel-parttime", tech: "PEEL", skill: "writing",
      topic: "Is part-time work harmful to diploma students?",
      parts: PEEL_PARTS,
      lines: [
        "Part-time work becomes harmful once it competes with study time instead of fitting around it.",
        "Students who work long hours often give up sleep and revision, the two things exam performance depends on most.",
        "A student who works a night shift before an 8 a.m. lab is unlikely to be fully alert, however motivated he is.",
        "The real question is not whether students should work, but how many hours they can work without damaging their studies.",
        "Convenience stores in Malaysia often stay open twenty-four hours a day.",
      ],
    },
    {
      id: "h-prep-ai", tech: "PREP", skill: "speaking",
      topic: "Should students be allowed to use AI tools for assignments?",
      parts: PREP_PARTS,
      lines: [
        "I think AI tools should be allowed, but only with clear rules on how they are used.",
        "Used well, they explain difficult ideas quickly; used carelessly, they let students skip the thinking an assignment is meant to build.",
        "Last semester our lecturer let us use AI to check grammar but asked for our first drafts too, so nobody could simply copy an answer.",
        "So the tool itself is not the problem; the rules around it decide whether it helps or harms learning.",
        "Some new phones even have an AI assistant built into the camera.",
      ],
    },
    {
      id: "h-peel-rail", tech: "PEEL", skill: "writing",
      topic: "Should Malaysia spend more on rail than on new highways?",
      parts: PEEL_PARTS,
      lines: [
        "Future transport spending should favour rail over new highways.",
        "New highways tend to fill with extra traffic within a few years, while one train line can move thousands of commuters an hour without adding a single car.",
        "Commuters along a busy rail corridor can reach the city centre on time even when the toll roads beside them are jammed.",
        "Prioritising rail is the more lasting answer to congestion, not merely the more popular one.",
        "Petrol prices in Malaysia are among the lowest in the region.",
      ],
    },
    {
      id: "h-prep-group", tech: "PREP", skill: "speaking",
      topic: "Is it better to revise alone or in a group?",
      parts: PREP_PARTS,
      lines: [
        "For revision, I find a small study group more effective than studying alone.",
        "Explaining a topic to friends shows me very quickly which parts I don't really understand.",
        "Before our Thermodynamics test, three of us each taught one chapter, and the gaps in my notes became obvious within an hour.",
        "That's why I'd recommend a small group, at least in the weeks before an exam.",
        "My favourite place to study is the second floor of the library.",
      ],
    },
    {
      id: "h-peel-language", tech: "PEEL", skill: "writing",
      topic: "Should English be used more in polytechnic lectures?",
      parts: PEEL_PARTS,
      lines: [
        "Wider use of English in technical lectures would better prepare graduates for industry.",
        "Manuals, standards and supplier correspondence in most technical fields are written in English, so graduates who are used to it adapt faster.",
        "An electronics graduate who can read a datasheet without translating it can troubleshoot a fault in minutes rather than hours.",
        "Using more English in lectures is an investment in employability, not a threat to the national language.",
        "English is spoken as a first language in more than fifty countries.",
      ],
    },
  ];
  arcade.sliceHard = [
    { id: "h1", skill: "listening", clue: "If the funding comes through by the end of the month, we’ll extend the programme to Kuantan; otherwise we’ll stick with Port Dickson and Seremban.", q: "What is certain about the programme?", options: ["It will run in Port Dickson and Seremban", "It will move to Kuantan", "It will end this month", "It has received new funding"], answer: 0, traps: { 1: "Condition trap: Kuantan depends on “if the funding comes through”.", 2: "Word-match trap: “end of the month” is the funding deadline, not the end of the programme.", 3: "Too-far trap: the funding has not been confirmed." }, why: "Port Dickson and Seremban continue either way. Kuantan is only possible “if the funding comes through”." },
    { id: "h2", skill: "listening", clue: "I wouldn’t say the new timetable is perfect, but it’s certainly an improvement on last semester’s.", q: "What is the speaker’s attitude to the new timetable?", options: ["Cautiously positive", "Completely satisfied", "Strongly critical", "Indifferent"], answer: 0, traps: { 1: "Overstatement trap: “wouldn’t say … perfect” rules out complete satisfaction.", 2: "Negative-word trap: “not perfect” is a mild reservation, not strong criticism.", 3: "Opposite trap: “certainly an improvement” is a clear opinion." }, why: "A small reservation (“not perfect”) plus a clear positive (“certainly an improvement”) = cautiously positive." },
    { id: "h3", skill: "listening", clue: "Registration closes on the fifteenth. Anyone who registered before the first gets the early-bird rate; everyone else pays the standard fee, unless you’re on the committee, in which case it’s waived.", q: "Aina registered on the tenth and is not on the committee. What does she pay?", options: ["The standard fee", "The early-bird rate", "Nothing", "She cannot register"], answer: 0, traps: { 1: "Date trap: early-bird was for registrations before the first.", 2: "Exception trap: only committee members pay nothing.", 3: "Deadline trap: the tenth is before the fifteenth, so she is in time." }, why: "After the first but before the fifteenth, and not on the committee: the standard fee." },
    { id: "h4", skill: "listening", clue: "The survey was meant to cover all four faculties, but in the end we only had time for engineering and business, so treat the results with caution.", q: "Why should the results be treated with caution?", options: ["Only part of the student population was surveyed", "The questions were badly written", "Engineering students did not respond", "The results were lost"], answer: 0, traps: { 1: "Not-mentioned trap: nothing is said about the questions.", 2: "Contradiction trap: engineering was one of the faculties surveyed.", 3: "Not-mentioned trap: the results exist; they are incomplete." }, why: "Two of four faculties were surveyed, so the results may not represent everyone." },
    { id: "h5", skill: "listening", clue: "A: Shall we book the hall for Friday? B: Friday’s fine by me, though Hana did say she’s got a site visit that afternoon. A: Then the morning it is.", q: "When will they most likely use the hall?", options: ["Friday morning", "Friday afternoon", "Thursday afternoon", "Whenever Hana is free"], answer: 0, traps: { 1: "Detail trap: Hana is busy in the afternoon, which is why they choose the morning.", 2: "Not-mentioned trap: Thursday is never suggested.", 3: "Too-vague trap: they fix a specific time." }, why: "“Then the morning it is” confirms Friday morning, around Hana’s site visit." },
    { id: "h6", skill: "listening", clue: "Contrary to what most people assume, the biggest drop in plastic use didn’t come from the bag ban itself but from shoppers bringing their own containers to the wet market.", q: "What caused the biggest drop in plastic use?", options: ["Shoppers bringing their own containers", "The plastic bag ban", "Wet markets selling less", "People’s assumptions"], answer: 0, traps: { 1: "Popular-belief trap: “Contrary to what most people assume” rejects the bag ban.", 2: "Twisted-detail trap: the wet market is where it happened, not the cause.", 3: "Word-match trap: “assume” is said, but assumptions don’t reduce plastic." }, why: "“didn’t come from … but from shoppers bringing their own containers”." },
    { id: "h7", skill: "reading", clue: "Although remote internships widen access for students in rural areas, employers report that interns who never meet their team in person take longer to build working relationships.", q: "What is the writer’s main point?", options: ["Remote internships have a benefit and a drawback", "Remote internships should be banned", "Rural students prefer remote internships", "Employers dislike rural interns"], answer: 0, traps: { 1: "Too-far trap: a drawback is not a call for a ban.", 2: "Not-stated trap: student preferences are not mentioned.", 3: "Distortion trap: the issue is meeting in person, not where interns live." }, why: "“Although” joins a benefit (wider access) and a drawback (slower relationships)." },
    { id: "h8", skill: "reading", clue: "The council’s claim that the new cycle lanes have “transformed” commuting is hard to square with its own data: daily cycle trips rose from 410 to 455.", q: "What is the writer’s attitude to the council’s claim?", options: ["Sceptical", "Supportive", "Neutral", "Confused by the data"], answer: 0, traps: { 1: "Opposite trap: “hard to square” means the writer doubts the claim.", 2: "Tone trap: the writer takes a clear position.", 3: "Word-match trap: the writer understands the data and uses it as evidence." }, why: "A rise from 410 to 455 is small, so “transformed” is “hard to square” with it: the writer is sceptical." },
    { id: "h9", skill: "reading", clue: "Few would dispute that the scheme was well-intentioned; whether it was well-executed is another matter.", q: "What does the writer imply?", options: ["Its aims were good, but it may have been poorly carried out", "It was a complete success", "Nobody supported it", "It has not started yet"], answer: 0, traps: { 1: "Opposite trap: “another matter” signals doubt about the execution.", 2: "Misread trap: “few would dispute” means most people agree the intentions were good.", 3: "Not-stated trap: “was” shows the scheme has already run." }, why: "Good intentions are accepted; “another matter” questions how well it was done." },
    { id: "h10", skill: "reading", clue: "The study tracked 2,000 graduates for five years and found that those who completed an industrial attachment earned 12% more, a gap the authors attribute partly, but not wholly, to the attachment itself.", q: "Which statement does the text support?", options: ["The attachment explains some of the pay gap", "The attachment explains all of the pay gap", "Graduates without an attachment earned 12% more", "The study lasted twelve years"], answer: 0, traps: { 1: "Overstatement trap: “partly, but not wholly”.", 2: "Reversal trap: those WITH an attachment earned more.", 3: "Number-swap trap: 12 is the percentage; the study lasted five years." }, why: "“partly, but not wholly” = the attachment explains some, not all, of the gap." },
    { id: "h11", skill: "reading", clue: "The proposal was shelved, not scrapped.", q: "What does the writer suggest about the proposal?", options: ["It may be considered again later", "It has been rejected for good", "It was approved", "It was put into storage"], answer: 0, traps: { 1: "Contrast trap: “not scrapped” rules out permanent rejection.", 2: "Not-stated trap: shelving is the opposite of approving.", 3: "Literal trap: “shelved” is figurative here." }, why: "Shelved = put aside for now; not scrapped = not cancelled. It could return." },
    { id: "h12", skill: "reading", clue: "Critics argue that the four-day week merely squeezes the same workload into fewer days. Supporters counter that it forces teams to cut pointless meetings.", q: "What does “counter” mean here?", options: ["Respond with an opposing argument", "Count the meetings", "Agree with the critics", "Measure productivity"], answer: 0, traps: { 1: "Word-form trap: “counter” here is not about counting.", 2: "Opposite trap: supporters disagree with the critics.", 3: "Not-stated trap: nothing is measured." }, why: "Supporters reply to the critics with an opposing point: they “counter” the argument." },
  ];
  arcade.bossHard = [
    { id: "hl1", skill: "listening", clue: "We were going to cap the class at thirty, but given the late applications, the dean has agreed to forty, provided we can find a bigger room.", q: "What is the final situation?", options: ["Forty places, if a bigger room is found", "Thirty places, confirmed", "Forty places, confirmed", "Registration has closed"], answer: 0, why: "“provided” makes forty conditional on a bigger room." },
    { id: "hl2", skill: "listening", clue: "Frankly, the venue was the least of our problems; it was the lack of volunteers that nearly sank the event.", q: "What was the main problem?", options: ["Too few volunteers", "The venue", "The weather", "The budget"], answer: 0, why: "“the least of our problems” downplays the venue; volunteers “nearly sank the event”." },
    { id: "hl3", skill: "listening", clue: "You’d think the morning session would be busier, but it’s actually the lunchtime slot that fills up first.", q: "Which session fills up first?", options: ["Lunchtime", "Morning", "Evening", "They fill equally"], answer: 0, why: "“You’d think … but actually” rejects the expectation: lunchtime fills first." },
    { id: "hl4", skill: "listening", clue: "I’m not against the idea in principle; I just don’t think we can afford it this year.", q: "What is the speaker’s view?", options: ["She supports the idea but not the timing", "She opposes the idea completely", "She thinks it is cheap", "She has not decided"], answer: 0, why: "“not against … in principle” = agrees with the idea; the problem is cost this year." },
    { id: "hk1", skill: "speaking", q: "Your partner says, “Online classes are always worse.” Which reply challenges this best?", options: ["“Always” may be too strong; recorded lectures can actually help revision.", "I disagree.", "Yes, online classes are terrible.", "Let’s talk about something else."], answer: 0, why: "Challenge the overgeneralisation politely and give a reason." },
    { id: "hk2", skill: "speaking", q: "Which line best moves a stuck discussion towards a decision?", options: ["We’ve covered cost and safety; shall we decide which matters more?", "I already gave my opinion.", "Can we start again?", "Everyone’s ideas are good."], answer: 0, why: "Summarise what was said, then propose how to decide." },
    { id: "hk3", skill: "speaking", q: "In Part 1, which answer develops the point best?", options: ["Sport builds discipline, because training forces you to plan your week; I learnt this in the futsal team.", "Sport is good and fun.", "I like sport very much.", "Sport, music and art are all good."], answer: 0, why: "Point + reason + personal example in one developed answer." },
    { id: "hk4", skill: "speaking", q: "Which phrase shows you are building on someone’s idea?", options: ["Adding to Mei’s point, the cost would also fall over time.", "Going back to my point…", "As I said before…", "That’s not what I meant."], answer: 0, why: "Naming the speaker and adding to their idea shows real interaction." },
    { id: "hr1", skill: "reading", clue: "While the policy has reduced littering in the town centre, residents of outlying areas say the rubbish has simply moved to their streets.", q: "What does the writer suggest?", options: ["The problem may have shifted rather than been solved", "The policy has failed everywhere", "Outlying areas were always cleaner", "Residents support the policy"], answer: 0, why: "Less litter in the centre, more on the edges: the problem “simply moved”." },
    { id: "hr2", skill: "reading", clue: "The report’s authors concede that their sample was small, yet they insist the trend is “unmistakable”.", q: "Which word shows the authors admit a weakness?", options: ["concede", "insist", "unmistakable", "trend"], answer: 0, why: "To concede is to admit something; the weakness is the small sample." },
    { id: "hr3", skill: "reading", clue: "Such incentives, critics say, reward the symptom rather than the cause.", q: "What do the critics believe?", options: ["The incentives miss the real problem", "The incentives are too expensive", "The incentives cause illness", "The critics support the incentives"], answer: 0, why: "Treating the symptom, not the cause, means the real problem remains." },
    { id: "hr4", skill: "reading", clue: "Attendance at the free clinics has risen, but it is too early to say whether community health has improved.", q: "Which conclusion is justified?", options: ["More people use the clinics; the health effect is unclear", "Community health has improved", "The clinics should close", "Attendance has fallen"], answer: 0, why: "Only attendance is known; “too early to say” about health." },
    { id: "hw1", skill: "writing", q: "Which sentence is the most academic?", options: ["The data suggest that the policy had a limited effect.", "The data shows the policy didn’t really do much.", "Basically, the policy was kind of useless.", "The policy? Not great, honestly."], answer: 0, why: "Hedged, precise and formal: “suggest … a limited effect”." },
    { id: "hw2", skill: "writing", q: "Which is the strongest thesis for “Should campuses ban single-use plastics?”", options: ["Campuses should ban single-use plastics because alternatives are cheap and the benefit is lasting.", "Plastic is a big problem in the world today.", "There are many views about plastic.", "In this essay I will talk about plastic."], answer: 0, why: "A thesis takes a position and previews the reasons." },
    { id: "hw3", skill: "writing", q: "Which linker best introduces a concession?", options: ["Admittedly,", "Moreover,", "As a result,", "For instance,"], answer: 0, why: "“Admittedly” accepts a point against your argument before you answer it." },
    { id: "hw4", skill: "writing", q: "Task 1: your friend asked for advice. Which closing fits best?", options: ["Let me know how it goes. I’m sure you’ll do well!", "Yours faithfully,", "I look forward to your favourable reply.", "End of message."], answer: 0, why: "A friendly, informal close suits a reply to a friend." },
  ];
  /* mix the option order once per visit so the right answer is never always first */
  const mix = (q) => {
    const order = q.options.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const traps = {};
    if (q.traps) Object.entries(q.traps).forEach(([k, v]) => (traps[order.indexOf(+k)] = v));
    q.options = order.map((i) => q.options[i]);
    q.answer = order.indexOf(q.answer);
    if (q.traps) q.traps = traps;
  };
  arcade.sliceHard.forEach(mix);
  arcade.bossHard.forEach(mix);
  arcade.sort.forEach((r) =>
    r.lines.forEach((line, i) => {
      items[r.skill + ":arcade-" + r.id + "-" + (i + 1)] = {
        context: textCtx(r.tech + " paragraph · " + r.topic, r.lines),
        q: "Which part of " + r.tech + " is this sentence? “" + line + "”",
        options: r.parts,
        answer: i,
        why: "In " + r.tech + ", this sentence is the " + r.parts[i] + ". " + ["It states the main idea.", r.tech === "PEEL" ? "It explains why the point is true." : "It gives the reason.", "It gives a specific case.", r.tech === "PEEL" ? "It links back to the question." : "It repeats the point to close."][i],
      };
    }),
  );
  arcade.slice.forEach((s) => {
    items[s.skill + ":arcade-slice-" + s.id] = {
      context: textCtx(s.skill === "listening" ? "You hear (transcript)" : "You read", [s.clue]),
      q: s.q,
      options: s.options,
      answer: s.answer,
      why: s.why,
    };
  });
  /* Monster Punch: quick-fire questions from all four papers (boss battle after each Vault level) */
  arcade.boss = [
    { id: "l1", skill: "listening", clue: "The shuttle bus leaves every twenty minutes, but after six it only comes once an hour.", q: "How often does the bus run after 6 p.m.?", options: ["Every twenty minutes", "Once an hour", "It stops running"], answer: 1, why: "“but after six it only comes once an hour”: the detail after “but” answers the question." },
    { id: "l2", skill: "listening", clue: "I’d love to join the trip, but I’ve got a lab report due on Friday.", q: "What does the speaker mean?", options: ["She will join the trip", "She cannot join because of her work", "She has finished her report"], answer: 1, why: "“I’d love to … but” is a polite refusal. The lab report is her reason." },
    { id: "l3", skill: "listening", clue: "Sorry, did you say room 3B? Oh, 3D. Got it, thanks.", q: "Which room is correct?", options: ["3B", "3D", "3E"], answer: 1, why: "The speaker checks 3B, is corrected, then confirms 3D." },
    { id: "l4", skill: "listening", clue: "We looked at three venues. The hall was too small and the café too noisy, so in the end we chose the garden.", q: "Which words tell you the final decision is coming?", options: ["We looked at", "too noisy", "so in the end"], answer: 2, why: "“so in the end” signals the conclusion. In CLUE, Understand the final decision, not the first idea." },
    { id: "l5", skill: "listening", clue: "The workshop is free for students, although materials cost ten ringgit.", q: "What do students need to pay for?", options: ["The workshop", "The materials", "Nothing at all"], answer: 1, why: "“although materials cost ten ringgit”: the workshop is free, the materials are not." },
    { id: "l6", skill: "listening", clue: "Most of us voted for the beach, but since it might rain, we’re going to the museum instead.", q: "Where will the group go?", options: ["The beach", "The museum", "Nowhere"], answer: 1, why: "“instead” marks the changed plan: the museum." },
    { id: "k1", skill: "speaking", q: "In the group discussion, which line invites a quiet member to speak?", options: ["What do you think about this, Hafiz?", "You’re wrong about that.", "Let me finish first."], answer: 0, why: "Inviting others by name shows interaction, which examiners reward in Part 2." },
    { id: "k2", skill: "speaking", q: "Which is the most polite way to disagree?", options: ["That’s a fair point, but I see it differently.", "No, that’s silly.", "Whatever you say."], answer: 0, why: "Acknowledge the idea first, then give your view. It keeps the discussion respectful." },
    { id: "k3", skill: "speaking", q: "In PREP, what comes right after your Point?", options: ["A reason", "Your conclusion", "A new topic"], answer: 0, why: "PREP = Point, Reason, Example, Point again." },
    { id: "k4", skill: "speaking", q: "Which is the strongest way to start your Part 1 answer?", options: ["I believe the most useful choice is a campus club.", "Um, I don’t really know much about this.", "Can I have more time, please?"], answer: 0, why: "State your point clearly in the first sentence, then develop it." },
    { id: "k5", skill: "speaking", q: "Near the end of the discussion, which line sums up the group’s view?", options: ["So, it seems we all agree that…", "Anyway, next question.", "I think I’m right, so that’s it."], answer: 0, why: "Summarising what the group agrees on is a strong way to conclude together." },
    { id: "k6", skill: "speaking", q: "Which sentence supports a point with an example?", options: ["For instance, my cousin saves RM50 a month by cycling.", "This is very important.", "In conclusion, cycling is good."], answer: 0, why: "A specific, real case (who, what, how much) makes your reason convincing." },
    { id: "r1", skill: "reading", clue: "The library’s new opening hours apply from 1 March, except on public holidays.", q: "When do the new hours NOT apply?", options: ["On public holidays", "From 1 March", "At weekends"], answer: 0, why: "“except on public holidays” limits the rule." },
    { id: "r2", skill: "reading", clue: "Despite heavy rain, the charity run attracted over 500 runners.", q: "What does “despite” show here?", options: ["A contrast", "A cause", "An example"], answer: 0, why: "Heavy rain would keep people away, yet many came: “despite” shows contrast." },
    { id: "r3", skill: "reading", clue: "Researchers found that students who slept more scored higher, but they warn this does not prove that sleep causes better results.", q: "What do the researchers say?", options: ["More sleep definitely improves scores", "There is a link, but the cause is not proven", "Sleep has no effect on scores"], answer: 1, why: "Option A goes too far; C contradicts the finding. The warning shows a link, not proof." },
    { id: "r4", skill: "reading", clue: "Hamid lent Ravi his notes because Ravi had missed the lecture.", q: "Who missed the lecture?", options: ["Hamid", "Ravi", "Both of them"], answer: 1, why: "The text states it directly: “because Ravi had missed the lecture”." },
    { id: "r5", skill: "reading", clue: "She was reluctant to speak at first, but soon joined in.", q: "What does “reluctant” mean?", options: ["Unwilling", "Excited", "Unable"], answer: 0, why: "“at first … but soon joined in” shows she did not want to speak at the start." },
    { id: "r6", skill: "reading", clue: "Sales of e-scooters tripled last year.", q: "Which sentence means the same?", options: ["Three times as many e-scooters were sold", "E-scooter sales fell by a third", "Three companies sold e-scooters"], answer: 0, why: "tripled = became three times as many." },
    { id: "w1", skill: "writing", q: "Which is the best opening for an email to your lecturer?", options: ["Dear Dr Lim,", "Hey Dr Lim!", "Yo Sir,"], answer: 0, why: "A formal email to a lecturer needs a formal greeting: “Dear + title + name”." },
    { id: "w2", skill: "writing", q: "Which is a clear topic sentence about the benefits of part-time work?", options: ["Part-time work teaches students to manage their time.", "Many people have jobs.", "My cousin works at a shop."], answer: 0, why: "A topic sentence gives one focused main idea (the P in PEEL)." },
    { id: "w3", skill: "writing", q: "Which linker adds a second reason?", options: ["Furthermore,", "However,", "For example,"], answer: 0, why: "“Furthermore” adds; “However” contrasts; “For example” introduces an example." },
    { id: "w4", skill: "writing", q: "What is the minimum length for Writing Task 2?", options: ["250 words", "100 words", "150 words"], answer: 0, why: "Task 2 (the extended essay) needs at least 250 words." },
    { id: "w5", skill: "writing", q: "Which sentence is a Link in a PEEL paragraph?", options: ["Therefore, part-time work prepares students for their future careers.", "For example, Aina works at a café on weekends.", "This is because they learn responsibility."], answer: 0, why: "The Link ties the paragraph back to the question, often with “Therefore” or “Thus”." },
    { id: "w6", skill: "writing", q: "Which is the most formal alternative to “a lot of”?", options: ["a large number of", "tons of", "loads of"], answer: 0, why: "Academic essays avoid informal phrases like “tons of” and “loads of”." },
  ];
  arcade.boss.forEach((b) => {
    items[b.skill + ":arcade-boss-" + b.id] = {
      context: b.clue ? textCtx(b.skill === "listening" ? "You hear (transcript)" : "You read", [b.clue]) : undefined,
      q: b.q,
      options: b.options,
      answer: b.answer,
      why: b.why,
    };
  });
  arcade.sortHard.forEach((r) =>
    r.lines.forEach((line, i) => {
      const opts = r.parts.concat(["Off-topic"]);
      items[r.skill + ":arcade-" + r.id + "-" + (i + 1)] = {
        context: textCtx(r.tech + " paragraph · " + r.topic, r.lines.slice(0, 4)),
        q: "Which part of " + r.tech + " is this sentence? “" + line + "”",
        options: opts,
        answer: i,
        why: i === 4 ? "This sentence does not support the answer: it is off-topic and belongs in the bin." : "In " + r.tech + ", this sentence is the " + r.parts[i] + ".",
      };
    }),
  );
  arcade.sliceHard.forEach((s) => {
    items[s.skill + ":arcade-slice-" + s.id] = { context: textCtx(s.skill === "listening" ? "You hear (transcript)" : "You read", [s.clue]), q: s.q, options: s.options, answer: s.answer, why: s.why };
  });
  arcade.bossHard.forEach((b) => {
    items[b.skill + ":arcade-boss-" + b.id] = { context: b.clue ? textCtx(b.skill === "listening" ? "You hear (transcript)" : "You read", [b.clue]) : undefined, q: b.q, options: b.options, answer: b.answer, why: b.why };
  });
  const skillOf = (id) => id.split(":")[0];
  return {
    reading: { foodBank, passages, hunt, huntTypes: HUNT_TYPES, huntPlain: HUNT_PLAIN, huntTraps: HUNT_TRAPS },
    listening: { model, extracts, matchOptions, matchItems, mcq },
    arcade,
    item: (id) => (items[id] ? { id, skill: skillOf(id), ...items[id] } : null),
    ids: () => Object.keys(items),
  };
})();
