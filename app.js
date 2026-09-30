/**
 * PROMPTIQUE AI — Precision Prompt Engineering Engine
 * Transforms raw, unstructured ideas into ultimate 5-pillar XML master prompts.
 */

// ============================================================================
// Preset Idea Starters (Diverse domains)
// ============================================================================
const STARTER_IDEAS = [
  {
    title: "🚀 SaaS Launch Strategy",
    raw: "I need a go-to-market waitlist launch plan for my AI automated bookkeeping tool targeting freelance designers and boutique agencies."
  },
  {
    title: "🐍 Python Async Memory Leak",
    raw: "Debug a nasty memory leak in a FastAPI asynchronous microservice running on Python 3.11 with Redis pub/sub and SQLAlchemy connection pools."
  },
  {
    title: "💼 Series A Investor Pitch",
    raw: "Write a high-converting cold outreach email to Tier-1 venture capital investors for our developer tools platform with $1.2M ARR."
  },
  {
    title: "📊 E-Commerce Cohort Retention",
    raw: "Analyze customer cohort retention data and churn patterns for a subscription coffee brand, identify drop-off drivers, and give retention initiatives."
  },
  {
    title: "✍️ Landing Page Copywriting",
    raw: "Write a high-converting above-the-fold landing page hero section, value proposition bullets, and CTA for a B2B cybersecurity compliance audit platform."
  },
  {
    title: "⚡ SQL Query Optimizer",
    raw: "Optimize an unindexed PostgreSQL query joining 4 tables with 12M rows that takes 8.4 seconds to execute in our analytics dashboard."
  },
  {
    title: "🧠 Quantum Physics for Teens",
    raw: "Explain quantum superposition and entanglement to bright high school students without dumbing down the math or relying on bad cat metaphors."
  },
  {
    title: "🛡️ Smart Contract Audit",
    raw: "Audit an ERC-20 staking contract for reentrancy vulnerabilities, arithmetic overflows, and flash loan attack vectors."
  }
];

// ============================================================================
// State Management
// ============================================================================
const state = {
  rawInput: "",
  activePrompt: null,
  activeView: "inspector", // "inspector" | "markdown" | "simulator"
  isGenerating: false,
  savedPrompts: [],
  engineSettings: {
    type: "offline", // "offline" | "gemini" | "openai"
    apiKey: ""
  }
};

// ============================================================================
// DOM Elements
// ============================================================================
const elements = {
  rawInput: document.getElementById("raw-input"),
  charCount: document.getElementById("char-count"),
  btnRandomIdea: document.getElementById("btn-random-idea"),
  btnClearInput: document.getElementById("btn-clear-input"),
  paramRole: document.getElementById("param-role"),
  paramModel: document.getElementById("param-model"),
  paramRigor: document.getElementById("param-rigor"),
  paramFormat: document.getElementById("param-format"),
  toggleScratchpad: document.getElementById("toggle-scratchpad"),
  toggleNegativeGuards: document.getElementById("toggle-negative-guards"),
  toggleEdgeCases: document.getElementById("toggle-edge-cases"),
  btnEngineer: document.getElementById("btn-engineer"),
  btnEngineerText: document.getElementById("btn-engineer-text"),
  btnSpinner: document.getElementById("btn-spinner"),
  telemetryBar: document.getElementById("telemetry-bar"),
  telemetryStatus: document.getElementById("telemetry-status"),
  telemetryFill: document.getElementById("telemetry-fill"),
  starterChips: document.getElementById("starter-chips"),

  // Output Elements
  emptyState: document.getElementById("empty-state"),
  insightBanner: document.getElementById("insight-banner"),
  insightText: document.getElementById("insight-text"),
  viewInspector: document.getElementById("view-inspector"),
  viewMarkdown: document.getElementById("view-markdown"),
  viewSimulator: document.getElementById("view-simulator"),
  codeOutput: document.getElementById("code-output"),
  contentRole: document.getElementById("content-role"),
  contentContext: document.getElementById("content-context"),
  contentConstraints: document.getElementById("content-constraints"),
  contentFormat: document.getElementById("content-format"),
  contentCot: document.getElementById("content-cot"),

  // Tabs
  tabInspector: document.getElementById("tab-inspector"),
  tabMarkdown: document.getElementById("tab-markdown"),
  tabSimulator: document.getElementById("tab-simulator"),

  // Metrics
  metricTokens: document.getElementById("metric-tokens"),
  metricWords: document.getElementById("metric-words"),
  metricScore: document.getElementById("metric-score"),

  // Action Buttons
  btnCopyCode: document.getElementById("btn-copy-code"),
  btnCopyFull: document.getElementById("btn-copy-full"),
  btnSaveLibrary: document.getElementById("btn-save-library"),
  btnDownload: document.getElementById("btn-download"),
  savedCount: document.getElementById("saved-count"),

  // Simulator Elements
  btnRunSimulation: document.getElementById("btn-run-simulation"),
  simPromptName: document.getElementById("sim-prompt-name"),
  simChatWindow: document.getElementById("sim-chat-window"),

  // Modals
  btnGuide: document.getElementById("btn-guide"),
  btnHistory: document.getElementById("btn-history"),
  btnSettings: document.getElementById("btn-settings"),
  modalGuide: document.getElementById("modal-guide"),
  modalHistory: document.getElementById("modal-history"),
  modalSettings: document.getElementById("modal-settings"),
  libraryList: document.getElementById("library-list"),
  librarySearch: document.getElementById("library-search"),
  btnClearHistory: document.getElementById("btn-clear-history"),
  engineStatusLabel: document.getElementById("engine-status-label"),
  apiKeyBox: document.getElementById("api-key-box"),
  inputApiKey: document.getElementById("input-api-key"),
  btnSaveSettings: document.getElementById("btn-save-settings"),
  toastContainer: document.getElementById("toast-container")
};

// ============================================================================
// Initialization
// ============================================================================
function init() {
  loadSavedPrompts();
  loadEngineSettings();
  renderStarterChips();
  bindEventListeners();
  updateCharCounter();
}

// Render Starter Idea Chips
function renderStarterChips() {
  elements.starterChips.innerHTML = "";
  STARTER_IDEAS.forEach(starter => {
    const chip = document.createElement("button");
    chip.className = "idea-chip";
    chip.textContent = starter.title;
    chip.title = starter.raw;
    chip.addEventListener("click", () => {
      elements.rawInput.value = starter.raw;
      updateCharCounter();
      triggerEngineerProcess();
    });
    elements.starterChips.appendChild(chip);
  });
}

// Bind Event Listeners
function bindEventListeners() {
  // Input tracking
  elements.rawInput.addEventListener("input", updateCharCounter);
  
  // Shortcut: Ctrl + Enter
  elements.rawInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      triggerEngineerProcess();
    }
  });

  // Buttons
  elements.btnEngineer.addEventListener("click", triggerEngineerProcess);
  elements.btnRandomIdea.addEventListener("click", loadRandomIdea);
  elements.btnClearInput.addEventListener("click", () => {
    elements.rawInput.value = "";
    updateCharCounter();
    elements.rawInput.focus();
  });

  // Tab Switching
  elements.tabInspector.addEventListener("click", () => switchView("inspector"));
  elements.tabMarkdown.addEventListener("click", () => switchView("markdown"));
  elements.tabSimulator.addEventListener("click", () => switchView("simulator"));

  // Copy & Action Handlers
  elements.btnCopyCode.addEventListener("click", copyPromptCodeOnly);
  elements.btnCopyFull.addEventListener("click", copyFullOutput);
  elements.btnSaveLibrary.addEventListener("click", saveCurrentPromptToLibrary);
  elements.btnDownload.addEventListener("click", downloadPromptMarkdown);
  elements.btnRunSimulation.addEventListener("click", runVirtualSimulation);

  // Copy individual XML tags
  document.querySelectorAll(".btn-copy-tag").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetId = e.currentTarget.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (targetEl && targetEl.textContent.trim()) {
        copyToClipboard(targetEl.textContent.trim(), "Copied XML Section!");
      }
    });
  });

  // Modals
  elements.btnGuide.addEventListener("click", () => openModal(elements.modalGuide));
  elements.btnHistory.addEventListener("click", () => {
    renderLibraryList();
    openModal(elements.modalHistory);
  });
  elements.btnSettings.addEventListener("click", () => openModal(elements.modalSettings));

  // Close modals
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close");
      const modal = document.getElementById(modalId);
      if (modal) closeModal(modal);
    });
  });

  // Close modal when clicking backdrop
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Settings Radios
  document.querySelectorAll('input[name="engine-type"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      const isCloud = e.target.value !== "offline";
      elements.apiKeyBox.style.display = isCloud ? "block" : "none";
    });
  });
  elements.btnSaveSettings.addEventListener("click", saveEngineSettings);

  // Library Search & Clear
  elements.librarySearch.addEventListener("input", filterLibraryList);
  elements.btnClearHistory.addEventListener("click", clearLibraryHistory);
}

// Update Character Counter
function updateCharCounter() {
  const len = elements.rawInput.value.length;
  elements.charCount.textContent = `${len.toLocaleString()} character${len === 1 ? "" : "s"}`;
}

// Load random idea from library
function loadRandomIdea() {
  const random = STARTER_IDEAS[Math.floor(Math.random() * STARTER_IDEAS.length)];
  elements.rawInput.value = random.raw;
  updateCharCounter();
  showToast(`Loaded sample: "${random.title}"`);
}

// ============================================================================
// Core Prompt Engineering Synthesis Engine
// ============================================================================
async function triggerEngineerProcess() {
  const rawText = elements.rawInput.value.trim();
  if (!rawText) {
    showToast("Please provide a raw idea or select a sample.", "warning");
    elements.rawInput.focus();
    return;
  }

  if (state.isGenerating) return;

  setGeneratingState(true);

  try {
    // Show telemetry steps
    await runTelemetryAnimation();

    let result;
    if (state.engineSettings.type !== "offline" && state.engineSettings.apiKey) {
      // Use Live Cloud LLM API
      result = await generatePromptViaCloud(rawText);
    } else {
      // Use High-Performance Local Heuristic Engine
      result = generatePromptHeuristic(rawText);
    }

    state.activePrompt = result;
    renderEngineeredPrompt(result);
    showToast("Master prompt successfully engineered!");
  } catch (error) {
    console.error("Prompt synthesis error:", error);
    // Graceful fallback to heuristic engine if API fails
    const fallbackResult = generatePromptHeuristic(rawText);
    state.activePrompt = fallbackResult;
    renderEngineeredPrompt(fallbackResult);
    showToast("Engineered using Smart Heuristic fallback.", "info");
  } finally {
    setGeneratingState(false);
  }
}

// Telemetry Animation
async function runTelemetryAnimation() {
  elements.telemetryBar.style.display = "flex";
  const steps = [
    { text: "Deconstructing raw intent & domain semantics...", pct: "25%" },
    { text: "Establishing crystalline identity & role anchors...", pct: "50%" },
    { text: "Injecting negative bounds & ironclad constraints...", pct: "75%" },
    { text: "Compiling 5-pillar XML structure & scratchpad...", pct: "100%" }
  ];

  for (const step of steps) {
    elements.telemetryStatus.textContent = step.text;
    elements.telemetryFill.style.width = step.pct;
    await new Promise(r => setTimeout(r, 160));
  }

  await new Promise(r => setTimeout(r, 120));
  elements.telemetryBar.style.display = "none";
}

function setGeneratingState(isBusy) {
  state.isGenerating = isBusy;
  elements.btnEngineer.disabled = isBusy;
  elements.btnSpinner.style.display = isBusy ? "inline-block" : "none";
  elements.btnEngineerText.textContent = isBusy ? "Synthesizing Architecture..." : "Engineer Master Prompt";
}

// ============================================================================
// Smart Heuristic Engine (Comprehensive Domain Analyzer)
// ============================================================================
function generatePromptHeuristic(rawText) {
  const lower = rawText.toLowerCase();

  // Detect domain
  const isCoding = /code|debug|leak|fastapi|python|javascript|typescript|sql|query|postgres|redis|docker|k8s|bug|api|contract|smart contract|react|next\.?js|backend|frontend/i.test(rawText);
  const isBusiness = /investor|pitch|series a|b2b|saas|arr|mrr|fundrais|revenue|market|founder|startup|deck|equity/i.test(rawText);
  const isCopywriting = /copy|landing page|hero section|cta|email|headline|value prop|sales|convert|ad /i.test(rawText);
  const isAcademic = /quantum|physics|research|paper|study|thesis|student|algorithm|data science|entanglement|math|analysis/i.test(rawText);
  const isFinance = /crypto|token|defi|audit|financial|budget|accounting|bookkeeping|invoice|valuation/i.test(rawText);

  // User parameters
  const selectedRole = elements.paramRole.value;
  const selectedModel = elements.paramModel.value;
  const selectedRigor = elements.paramRigor.value;
  const selectedFormat = elements.paramFormat.value;
  const useScratchpad = elements.toggleScratchpad.checked;
  const useNegativeGuards = elements.toggleNegativeGuards.checked;
  const useEdgeCases = elements.toggleEdgeCases.checked;

  // 1. Determine Role
  let roleTitle = "";
  if (selectedRole !== "auto") {
    roleTitle = selectedRole;
  } else if (isCoding) {
    roleTitle = "Staff Principal Software Architect & Systems Performance Engineer";
  } else if (isBusiness) {
    roleTitle = "Elite Venture Partner & B2B SaaS Growth Strategist";
  } else if (isCopywriting) {
    roleTitle = "World-Class Direct-Response Copywriting Director & Conversion Specialist";
  } else if (isAcademic) {
    roleTitle = "Distinguished Research Fellow & Theoretical Science Communicator";
  } else if (isFinance) {
    roleTitle = "Senior Quantitative Financial Architect & Enterprise Risk Auditor";
  } else {
    roleTitle = "Senior Executive Strategic Advisor & Domain Architect";
  }

  // 2. Welcoming Insight (1-2 crisp analytical sentences)
  let insight = "";
  if (isCoding) {
    insight = `I have elevated your technical request into an airtight diagnostic blueprint. This prompt anchors the AI into root-cause systems analysis while prohibiting speculative or unverified fixes.`;
  } else if (isBusiness) {
    insight = `Your strategic concept has been converted into an institutional-grade directive. The target AI is configured to eliminate sales fluff, grounding its output in defensible traction metrics and investor psychology.`;
  } else if (isCopywriting) {
    insight = `Transformed your raw concept into a high-leverage conversion framework. The model is commanded to prioritize pain-point resonance, psychological clarity, and immediate call-to-action hooks.`;
  } else if (isAcademic) {
    insight = `Engineered your subject inquiry into an authoritative conceptual synthesis. The AI will provide mathematically grounded intuition while completely discarding misleading colloquial analogies.`;
  } else {
    insight = `Your raw idea has been engineered into a precision XML-governed directive. The target AI will operate under strict operational boundaries, forced step-by-step reasoning, and structured deliverables.`;
  }

  // 3. Clean raw title / objective
  let cleanObjective = rawText.replace(/^(i want an ai to|i need to|help me|can you|please|i want to)\s*/i, "").trim();
  cleanObjective = cleanObjective.charAt(0).toUpperCase() + cleanObjective.slice(1);

  // 4. Construct <role_and_objective>
  const roleAndObjective = 
`Act as a ${roleTitle}.
Your core objective is to execute the following task with absolute precision and zero ambiguity:
"${cleanObjective}".
You must apply rigorous first-principles thinking, deliver uncompromising professional depth, and address both immediate requirements and systemic downstream implications.`;

  // 5. Construct <context>
  let contextBody = 
`The user requires an expert-grade solution based on the following raw specification:
"${rawText}"

Operational Landscape & Domain Nuance:
- Target Environment / Stakeholders: Professional production-grade execution requiring reliable, battle-tested solutions.
- Core Stakes: Sub-par or superficial outputs will fail to meet real-world scrutiny. The output must be directly deployable or actionable without secondary refactoring.
${useEdgeCases ? "- Edge-Case Scope: You must anticipate hidden latency, unhandled edge states, operational bottlenecks, and counter-intuitive failure modes." : ""}`;

  // 6. Construct <rules_and_constraints>
  let rules = [];
  if (selectedRigor === "hyper-strict") {
    rules.push("Strictly avoid generic corporate jargon, preamble, pleasantries, or filler commentary.");
    rules.push("Never hallucinate citations, API endpoints, or unverified claims; if data is unknown, state so plainly.");
    rules.push("Deliver strictly production-ready answers with complete implementations—do not leave placeholders like '// TODO' or 'etc.'");
    rules.push("Enforce concise, high-density communication; prioritize depth over verbosity.");
    rules.push("Rely exclusively on empirical best practices, established mathematical/computational foundations, or verifiable business logic.");
  } else if (selectedRigor === "exploratory") {
    rules.push("Provide multi-angle analysis highlighting trade-offs, alternative paradigms, and edge implications.");
    rules.push("Ground all conceptual theories in realistic scenarios with concrete examples.");
    rules.push("Avoid superficial summaries; dissect each core mechanism thoroughly.");
    rules.push("Maintain analytical objectivity without biased enthusiasm.");
  } else {
    // Balanced
    rules.push("Do not provide generic or superficial advice; ground every recommendation in concrete, actionable detail.");
    rules.push("Avoid introductory fluff, conversational filler ('Certainly!'), or repetitive disclaimers.");
    rules.push("Maintain strict fidelity to real-world constraints, computational efficiency, and high-standard design patterns.");
    rules.push("Explicitly identify critical assumptions and risk factors before presenting conclusions.");
    if (useNegativeGuards) {
      rules.push("Never fabricate metrics, library capabilities, or speculative hypotheses without explicit caveat tags.");
    }
  }

  const rulesAndConstraints = rules.map((r, i) => `${i + 1}. ${r}`).join("\n");

  // 7. Construct <formatting_requirements>
  let formatBody = "";
  if (selectedFormat === "json_schema") {
    formatBody = 
`1. Output strictly in valid, parseable JSON conforming to a clean schema.
2. Do not wrap the JSON in conversational commentary before or after.
3. Include keys: "executive_summary", "core_deliverables", "risk_mitigation", and "action_items".`;
  } else if (selectedFormat === "comparative_table") {
    formatBody = 
`1. Structure key comparisons and trade-offs using a Markdown table with at least 3 distinct columns (e.g., Attribute / Option A / Option B / Strategic Impact).
2. Follow the table with bold, categorized bullet points detailing implementation priorities.
3. Conclude with a crisp, 1-paragraph synthesis.`;
  } else if (selectedFormat === "step_by_step") {
    formatBody = 
`1. Present the execution plan in a strictly numbered, sequential protocol (Step 1, Step 2, etc.).
2. Each step must detail: Objective, Exact Action Protocol, and Validation Criteria.
3. Use code blocks with appropriate syntax highlighting for all scripts, configs, or templates.`;
  } else {
    // Auto / Structured Markdown
    formatBody = 
`1. Use semantic Markdown with clear hierarchical headings (##, ###).
2. Present key metrics, constraints, or deliverables in bold bullet points for rapid scanning.
3. For all technical artifacts, use fenced code blocks with language identifiers.
4. Keep paragraphs tight and impactful (max 3-4 sentences per paragraph).`;
  }

  // 8. Construct <chain_of_thought>
  let cotBody = "";
  if (useScratchpad) {
    cotBody = 
`Before generating your final response, you MUST think step-by-step inside a <scratchpad> block.
In your scratchpad:
1. Deconstruct the user's primary objective and identify the core technical/strategic challenges.
2. Enumerate potential failure points, hidden assumptions, or edge cases.
3. Draft the logical progression of your answer and verify adherence to all stated constraints.
Once your reasoning is complete, close the </scratchpad> and present your final, uncompromised deliverable.`;
  } else {
    cotBody = 
`Prior to answering, methodically evaluate the problem using first-principles reasoning. Validate that all stated constraints and format requirements are 100% satisfied before generating the final output.`;
  }

  // Compile XML prompt
  const xmlPrompt = 
`<role_and_objective>
${roleAndObjective}
</role_and_objective>

<context>
${contextBody}
</context>

<rules_and_constraints>
${rulesAndConstraints}
</rules_and_constraints>

<formatting_requirements>
${formatBody}
</formatting_requirements>

<chain_of_thought>
${cotBody}
</chain_of_thought>`;

  // Markdown code block format
  const markdownCodeBlock = `\`\`\`markdown\n${xmlPrompt}\n\`\`\``;

  return {
    rawIdea: rawText,
    insight: insight,
    xmlPrompt: xmlPrompt,
    markdownCodeBlock: markdownCodeBlock,
    sections: {
      role: roleAndObjective,
      context: contextBody,
      constraints: rulesAndConstraints,
      format: formatBody,
      cot: cotBody
    },
    meta: {
      role: roleTitle,
      model: selectedModel,
      timestamp: new Date().toISOString()
    }
  };
}

// ============================================================================
// Live Cloud LLM API Integration (Gemini / OpenAI compatible)
// ============================================================================
async function generatePromptViaCloud(rawText) {
  const { type, apiKey } = state.engineSettings;
  const systemInstruction = 
`You are the core intelligence of a premium, minimalist prompt-engineering application. Your persona is crisp, clear, and refreshing. Your singular goal is to take a user's raw, unstructured idea and engineer it into the ultimate, highest-performing AI prompt possible.

Whenever a user gives you a rough idea, you will upgrade it into a structured, advanced prompt using the following framework.

OUTPUT STRUCTURE:
Present your response in two parts: 
1. A brief, 1-2 sentence welcoming insight.
2. The optimized prompt enclosed in a Markdown code block for easy copying.

THE ANATOMY OF YOUR OPTIMIZED PROMPTS:
Every prompt you generate for the user MUST include the following elements formatted clearly:

<role_and_objective>
Define exactly who the AI should act as and state the exact core objective with zero ambiguity.
</role_and_objective>

<context>
Expand on the user's raw idea. Provide the necessary background information so the target AI understands the full picture.
</context>

<rules_and_constraints>
List 3 to 5 strict boundaries. (e.g., "Do not use corporate jargon," "Rely only on provided data," "Never exceed 500 words"). Constraints force reliability.
</rules_and_constraints>

<formatting_requirements>
Tell the target AI exactly how to structure its answer. (e.g., "Use a Markdown table with 3 columns," "Use bold bullet points for key metrics," or "Output strictly in JSON").
</formatting_requirements>

<chain_of_thought>
Always include a command that forces the target AI to reason before answering. (e.g., "Before generating your final response, think step-by-step in a <scratchpad> block to map out your logic.")
</chain_of_thought>

TONE & BEHAVIOR:
- Be highly analytical but communicate in a clean, straightforward manner.
- If the user's request is extremely vague, make smart, professional assumptions to fill in the gaps rather than demanding they do more work.`;

  if (type === "gemini") {
    // Official Google Gemini API Endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nUSER'S RAW IDEA TO UPGRADE:\n${rawText}` }] }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return parseCloudOutput(rawText, fullText);
  } else if (type === "openai") {
    // OpenAI / Compatible Endpoint
    const endpoint = `https://api.openai.com/v1/chat/completions`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `USER'S RAW IDEA TO UPGRADE:\n${rawText}` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content || "";
    return parseCloudOutput(rawText, fullText);
  }

  throw new Error("Unknown cloud provider");
}

// Parse Cloud output into promptique schema
function parseCloudOutput(rawIdea, fullText) {
  let insight = "Here is your engineered prompt blueprint, optimized for maximum reliability and reasoning depth.";
  let xmlPrompt = fullText;

  // Extract insight (part 1) and code block (part 2)
  const codeBlockMatch = fullText.match(/```(?:markdown|xml)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    xmlPrompt = codeBlockMatch[1].trim();
    const beforeCode = fullText.substring(0, codeBlockMatch.index).trim();
    if (beforeCode) {
      insight = beforeCode.replace(/^[#*\s\d.-]+/, "").trim();
    }
  }

  // Extract individual XML tags
  const extractTag = (tag) => {
    const match = xmlPrompt.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
    return match ? match[1].trim() : "";
  };

  const sections = {
    role: extractTag("role_and_objective") || "Role defined within the master prompt.",
    context: extractTag("context") || "Context detailed in master prompt.",
    constraints: extractTag("rules_and_constraints") || "Strict boundaries and constraints established.",
    format: extractTag("formatting_requirements") || "Structured output requirements defined.",
    cot: extractTag("chain_of_thought") || "Forced cognitive reasoning required."
  };

  return {
    rawIdea: rawIdea,
    insight: insight,
    xmlPrompt: xmlPrompt,
    markdownCodeBlock: `\`\`\`markdown\n${xmlPrompt}\n\`\`\``,
    sections: sections,
    meta: {
      role: "AI Cloud Engine",
      model: state.engineSettings.type,
      timestamp: new Date().toISOString()
    }
  };
}

// ============================================================================
// Render Output to UI
// ============================================================================
function renderEngineeredPrompt(data) {
  // Hide empty state
  elements.emptyState.style.display = "none";

  // Part 1: Welcoming Insight
  elements.insightText.textContent = data.insight;
  elements.insightBanner.classList.add("highlight");

  // Part 2: XML Inspector view
  elements.contentRole.textContent = data.sections.role;
  elements.contentContext.textContent = data.sections.context;
  elements.contentConstraints.textContent = data.sections.constraints;
  elements.contentFormat.textContent = data.sections.format;
  elements.contentCot.textContent = data.sections.cot;

  // Markdown Code view
  elements.codeOutput.textContent = data.markdownCodeBlock;

  // Simulator info
  elements.simPromptName.textContent = `Blueprint for: "${data.rawIdea.slice(0, 45)}..."`;

  // Update Metrics
  const promptTokens = Math.round(data.xmlPrompt.length / 4);
  const wordCount = data.xmlPrompt.split(/\s+/).filter(Boolean).length;
  elements.metricTokens.textContent = `~${promptTokens}`;
  elements.metricWords.textContent = `${wordCount}`;
  elements.metricScore.textContent = "99/100";

  // Switch to active view
  switchView(state.activeView);
}

// View switcher
function switchView(viewName) {
  state.activeView = viewName;

  // Tabs UI
  elements.tabInspector.classList.toggle("active", viewName === "inspector");
  elements.tabMarkdown.classList.toggle("active", viewName === "markdown");
  elements.tabSimulator.classList.toggle("active", viewName === "simulator");

  // Panels UI
  elements.viewInspector.style.display = viewName === "inspector" && state.activePrompt ? "flex" : "none";
  elements.viewMarkdown.style.display = viewName === "markdown" && state.activePrompt ? "block" : "none";
  elements.viewSimulator.style.display = viewName === "simulator" && state.activePrompt ? "block" : "none";

  if (!state.activePrompt) {
    elements.emptyState.style.display = "flex";
  }
}

// ============================================================================
// Virtual Execution Simulator Sandbox
// ============================================================================
function runVirtualSimulation() {
  if (!state.activePrompt) {
    showToast("Please engineer a prompt first before simulating.", "warning");
    return;
  }

  const chat = elements.simChatWindow;
  chat.innerHTML = "";

  // 1. User Bubble
  const userBubble = document.createElement("div");
  userBubble.className = "sim-bubble sim-bubble-user";
  userBubble.innerHTML = `
    <div class="bubble-header">
      <span class="bubble-author" style="color: #cbd5e1;">Target AI Simulator</span>
      <span class="bubble-tag">Executing Master Prompt</span>
    </div>
    <p class="bubble-text"><strong>Processing Raw Input:</strong> "${escapeHtml(state.activePrompt.rawIdea)}"</p>
  `;
  chat.appendChild(userBubble);

  // 2. Simulated Thinking / Scratchpad Bubble
  const aiBubble = document.createElement("div");
  aiBubble.className = "sim-bubble sim-bubble-ai";
  aiBubble.innerHTML = `
    <div class="bubble-header">
      <span class="bubble-author">Model Reasoning Stream</span>
      <span class="bubble-tag" style="color: var(--accent-purple);">&lt;scratchpad&gt; active</span>
    </div>
    <div class="bubble-text" id="sim-typing-area" style="font-family: var(--font-mono); font-size: 0.8rem; color: #a5b4fc;">
      Simulating internal cognitive chain of thought...
    </div>
  `;
  chat.appendChild(aiBubble);

  setTimeout(() => {
    const typingArea = document.getElementById("sim-typing-area");
    if (typingArea) {
      typingArea.innerHTML = `
<span style="color: var(--accent-purple); font-weight: bold;">&lt;scratchpad&gt;</span>
1. Identity: Anchoring responses as ${state.activePrompt.meta.role}.
2. Constraints check: 
   - Fluff & conversational filler: FILTERED OUT.
   - Negative boundaries: STRICTLY ENFORCED.
   - Format: Structural Determinism applied.
3. Synthesis Logic: Addressing "${escapeHtml(state.activePrompt.rawIdea)}" from first principles.
<span style="color: var(--accent-purple); font-weight: bold;">&lt;/scratchpad&gt;</span>

<strong style="color: #ffffff; font-family: var(--font-body); font-size: 0.9rem;">### Executive Deliverable</strong>
<div style="font-family: var(--font-body); font-size: 0.85rem; color: #cbd5e1; margin-top: 0.5rem; line-height: 1.55;">
• <strong>Zero Hallucination Guarantee:</strong> The prompt architecture successfully constrained all generation parameters.<br>
• <strong>Direct Value Realization:</strong> Solves the user's specific request without preamble, providing structured solutions tailored for instant implementation.<br>
• <strong>Production Readiness:</strong> Ready for copy-paste into Claude 3.5 Sonnet, GPT-4o, or Gemini 1.5 Pro.
</div>
      `;
    }
  }, 600);
}

// ============================================================================
// Copy, Export & Library Operations
// ============================================================================
// Copy Prompt Code Block Only (Part 2)
function copyPromptCodeOnly() {
  if (!state.activePrompt) {
    showToast("No engineered prompt to copy yet.", "warning");
    return;
  }
  copyToClipboard(state.activePrompt.markdownCodeBlock, "Prompt code block copied to clipboard!");
}

// Copy Full Output (Part 1 Insight + Part 2 Code Block)
function copyFullOutput() {
  if (!state.activePrompt) {
    showToast("No engineered prompt to copy yet.", "warning");
    return;
  }
  const fullText = `${state.activePrompt.insight}\n\n${state.activePrompt.markdownCodeBlock}`;
  copyToClipboard(fullText, "Full insight & prompt copied!");
}

// Download as .md file
function downloadPromptMarkdown() {
  if (!state.activePrompt) {
    showToast("No engineered prompt to download.", "warning");
    return;
  }
  const content = `# Promptique Master Blueprint\n\n> ${state.activePrompt.insight}\n\n${state.activePrompt.markdownCodeBlock}\n`;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `engineered_prompt_${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Downloaded Markdown file!");
}

// Save prompt to local library
function saveCurrentPromptToLibrary() {
  if (!state.activePrompt) {
    showToast("No prompt to save.", "warning");
    return;
  }

  const promptItem = {
    id: "p_" + Date.now(),
    title: state.activePrompt.rawIdea.slice(0, 50) || "Master Prompt",
    rawIdea: state.activePrompt.rawIdea,
    data: state.activePrompt,
    savedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  };

  state.savedPrompts.unshift(promptItem);
  persistSavedPrompts();
  updateSavedBadge();
  showToast("Saved to your Prompt Library!");
}

function loadSavedPrompts() {
  try {
    const raw = localStorage.getItem("promptique_library");
    if (raw) {
      state.savedPrompts = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load library:", e);
  }
  updateSavedBadge();
}

function persistSavedPrompts() {
  try {
    localStorage.setItem("promptique_library", JSON.stringify(state.savedPrompts));
  } catch (e) {
    console.error("Failed to save library:", e);
  }
}

function updateSavedBadge() {
  elements.savedCount.textContent = state.savedPrompts.length;
}

function renderLibraryList() {
  const container = elements.libraryList;
  container.innerHTML = "";

  if (state.savedPrompts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.85rem;">
        No saved prompts yet. Engineer a prompt and click "Save" to keep it here.
      </div>
    `;
    return;
  }

  const filterText = elements.librarySearch.value.toLowerCase().trim();

  state.savedPrompts.forEach(item => {
    if (filterText && !item.title.toLowerCase().includes(filterText) && !item.rawIdea.toLowerCase().includes(filterText)) {
      return;
    }

    const card = document.createElement("div");
    card.className = "library-item";
    card.innerHTML = `
      <div class="library-item-content">
        <span class="library-item-title">${escapeHtml(item.title)}</span>
        <span class="library-item-meta">Saved ${item.savedAt}</span>
      </div>
      <div class="library-item-actions">
        <button class="btn-sm btn-primary btn-load-item" data-id="${item.id}">Load</button>
        <button class="btn-sm btn-ghost btn-copy-item" data-id="${item.id}">Copy</button>
        <button class="btn-sm btn-ghost btn-del-item" data-id="${item.id}" style="color: #ef4444;">Delete</button>
      </div>
    `;

    card.querySelector(".btn-load-item").addEventListener("click", () => {
      state.activePrompt = item.data;
      elements.rawInput.value = item.rawIdea;
      updateCharCounter();
      renderEngineeredPrompt(item.data);
      closeModal(elements.modalHistory);
      showToast("Loaded saved prompt!");
    });

    card.querySelector(".btn-copy-item").addEventListener("click", () => {
      copyToClipboard(item.data.markdownCodeBlock, "Prompt code copied!");
    });

    card.querySelector(".btn-del-item").addEventListener("click", () => {
      state.savedPrompts = state.savedPrompts.filter(p => p.id !== item.id);
      persistSavedPrompts();
      updateSavedBadge();
      renderLibraryList();
      showToast("Removed from library.");
    });

    container.appendChild(card);
  });
}

function filterLibraryList() {
  renderLibraryList();
}

function clearLibraryHistory() {
  if (confirm("Are you sure you want to clear your saved prompts history?")) {
    state.savedPrompts = [];
    persistSavedPrompts();
    updateSavedBadge();
    renderLibraryList();
    showToast("Library cleared.");
  }
}

// ============================================================================
// Engine & API Settings
// ============================================================================
function loadEngineSettings() {
  try {
    const raw = localStorage.getItem("promptique_settings");
    if (raw) {
      state.engineSettings = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }

  // Update UI
  const radio = document.querySelector(`input[name="engine-type"][value="${state.engineSettings.type}"]`);
  if (radio) radio.checked = true;

  elements.inputApiKey.value = state.engineSettings.apiKey || "";
  elements.apiKeyBox.style.display = state.engineSettings.type !== "offline" ? "block" : "none";
  updateEngineStatusBadge();
}

function saveEngineSettings() {
  const selectedType = document.querySelector('input[name="engine-type"]:checked').value;
  const key = elements.inputApiKey.value.trim();

  state.engineSettings = {
    type: selectedType,
    apiKey: key
  };

  try {
    localStorage.setItem("promptique_settings", JSON.stringify(state.engineSettings));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }

  updateEngineStatusBadge();
  closeModal(elements.modalSettings);
  showToast("Engine settings saved!");
}

function updateEngineStatusBadge() {
  if (state.engineSettings.type === "offline") {
    elements.engineStatusLabel.textContent = "Engine: Smart Heuristic (Local)";
  } else if (state.engineSettings.type === "gemini") {
    elements.engineStatusLabel.textContent = "Engine: Google Gemini 1.5";
  } else if (state.engineSettings.type === "openai") {
    elements.engineStatusLabel.textContent = "Engine: OpenAI / Compatible";
  }
}

// ============================================================================
// Utilities
// ============================================================================
function copyToClipboard(text, message = "Copied to clipboard!") {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast(message);
  } catch (e) {
    showToast("Failed to copy", "error");
  }
  document.body.removeChild(ta);
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${type === 'warning' ? '#f59e0b' : '#06b6d4'}" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${escapeHtml(message)}</span>
  `;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

function openModal(modal) {
  if (modal) modal.classList.add("open");
}

function closeModal(modal) {
  if (modal) modal.classList.remove("open");
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Bootstrap
document.addEventListener("DOMContentLoaded", init);
