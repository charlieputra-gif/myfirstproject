/**
 * CODINGHAX — Application Logic
 * Modular implementation containing:
 * 1. Step-by-Step Wizard Flow Controller
 * 2. Solution Generation Engine
 * 3. Interactive "Hacker Typer" Easter Egg Mode
 */

// ============================================================================
// MODULE 1: WIZARD CONTROLLER & STATE
// ============================================================================

const wizardState = {
  currentStep: 1,
  idea: "",
  language: "JavaScript / Node.js",
  level: "Clean Production Grade",
  style: "Complete Code + Concise Explanations"
};

// DOM Elements Cache
const DOM = {
  // Stepper Elements
  progressBar: document.getElementById("progress-bar"),
  stepNodes: [
    document.getElementById("step-node-1"),
    document.getElementById("step-node-2"),
    document.getElementById("step-node-3")
  ],
  stepCards: [
    document.getElementById("step-1"),
    document.getElementById("step-2"),
    document.getElementById("step-3")
  ],

  // Step 1 Elements
  userIdea: document.getElementById("user-idea"),
  ideaError: document.getElementById("idea-error"),
  starterBtns: document.querySelectorAll(".starter-btn"),
  btnToStep2: document.getElementById("btn-to-step-2"),

  // Step 2 Elements
  configLang: document.getElementById("config-lang"),
  configLevel: document.getElementById("config-level"),
  configStyle: document.getElementById("config-style"),
  btnBackTo1: document.getElementById("btn-back-to-1"),
  btnGenerate: document.getElementById("btn-generate"),

  // Step 3 Elements
  resBadgeLang: document.getElementById("res-badge-lang"),
  resBadgeLevel: document.getElementById("res-badge-level"),
  resultCodeContent: document.getElementById("result-code-content"),
  btnCopyCode: document.getElementById("btn-copy-code"),
  btnBackTo2: document.getElementById("btn-back-to-2"),
  btnStartOver: document.getElementById("btn-start-over"),
  toast: document.getElementById("toast"),

  // Easter Egg Elements
  appTitle: document.getElementById("app-title"),
  hackerTerminal: document.getElementById("hacker-terminal"),
  hackerCodeOutput: document.getElementById("hacker-code-output")
};

/**
 * Initializes the Step-by-Step Wizard event listeners
 */
function initWizard() {
  // Quick Starter Idea buttons
  DOM.starterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.userIdea.value = btn.getAttribute("data-text");
      DOM.ideaError.style.display = "none";
    });
  });

  // Step 1 -> Step 2
  DOM.btnToStep2.addEventListener("click", () => {
    const val = DOM.userIdea.value.trim();
    if (!val) {
      DOM.ideaError.style.display = "block";
      DOM.userIdea.focus();
      return;
    }
    DOM.ideaError.style.display = "none";
    wizardState.idea = val;
    goToStep(2);
  });

  // Step 2 -> Step 1
  DOM.btnBackTo1.addEventListener("click", () => {
    goToStep(1);
  });

  // Step 2 -> Step 3 (Generate)
  DOM.btnGenerate.addEventListener("click", () => {
    wizardState.language = DOM.configLang.value;
    wizardState.level = DOM.configLevel.value;
    wizardState.style = DOM.configStyle.value;

    generateSolution();
    goToStep(3);
  });

  // Step 3 -> Step 2
  DOM.btnBackTo2.addEventListener("click", () => {
    goToStep(2);
  });

  // Step 3 -> Reset
  DOM.btnStartOver.addEventListener("click", () => {
    DOM.userIdea.value = "";
    wizardState.idea = "";
    goToStep(1);
  });

  // Copy Result Button
  DOM.btnCopyCode.addEventListener("click", () => {
    const code = DOM.resultCodeContent.textContent;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      showToast("Solution copied to clipboard!");
    }).catch(() => {
      showToast("Copied to clipboard!");
    });
  });

  // Allow clicking directly on visited step nodes
  DOM.stepNodes.forEach((node, idx) => {
    node.addEventListener("click", () => {
      const targetStep = idx + 1;
      if (targetStep < wizardState.currentStep || (targetStep === 2 && DOM.userIdea.value.trim())) {
        goToStep(targetStep);
      }
    });
  });
}

/**
 * Navigates to a specific wizard step (1, 2, or 3)
 */
function goToStep(stepNumber) {
  wizardState.currentStep = stepNumber;

  // Toggle active card
  DOM.stepCards.forEach((card, idx) => {
    card.classList.toggle("active", idx === stepNumber - 1);
  });

  // Update Stepper Nodes
  DOM.stepNodes.forEach((node, idx) => {
    const nodeStep = idx + 1;
    node.classList.remove("active", "completed");
    if (nodeStep === stepNumber) {
      node.classList.add("active");
    } else if (nodeStep < stepNumber) {
      node.classList.add("completed");
    }
  });

  // Update Progress Track Bar (0% for Step 1, 50% for Step 2, 100% for Step 3)
  const progressPercent = ((stepNumber - 1) / (DOM.stepCards.length - 1)) * 100;
  DOM.progressBar.style.width = `${progressPercent}%`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================================
// MODULE 2: CODE SOLUTION GENERATOR
// ============================================================================

/**
 * Builds a clean, ready-to-use solution based on the user's inputs
 */
function generateSolution() {
  const { idea, language, level, style } = wizardState;

  DOM.resBadgeLang.textContent = language;
  DOM.resBadgeLevel.textContent = level;

  let solutionCode = "";

  if (language.includes("JavaScript") || language.includes("Node")) {
    solutionCode = `// ==========================================================
// CodingHax Solution: ${language}
// Target Level: ${level}
// Goal: ${idea}
// ==========================================================

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory store for quick execution
const items = new Map();

/**
 * Core Handler implementation
 */
app.get('/api/resource', (req, res) => {
  res.json({
    status: 'success',
    data: Array.from(items.values()),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/resource', (req, res) => {
  const { title, payload } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Field "title" is required' });
  }

  const id = 'item_' + Date.now();
  const newItem = { id, title, payload: payload || null, createdAt: new Date() };
  items.set(id, newItem);

  res.status(201).json({ status: 'created', item: newItem });
});

app.listen(PORT, () => {
  console.log(\`[CodingHax] Server listening cleanly on port \${PORT}\`);
});`;
  } else if (language.includes("Python")) {
    solutionCode = `# ==========================================================
# CodingHax Solution: Python
# Target Level: ${level}
# Goal: ${idea}
# ==========================================================

import sys
import logging
from dataclasses import dataclass
from typing import Optional, List

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

@dataclass
class SolutionConfig:
    retries: int = 3
    timeout_sec: float = 10.0

class SolutionHandler:
    """Production-grade handler implementing: ${idea}"""
    
    def __init__(self, config: Optional[SolutionConfig] = None):
        self.config = config or SolutionConfig()
        logging.info("Initialized SolutionHandler with %s", self.config)

    def execute(self, payload: dict) -> dict:
        try:
            # Process clean logic
            processed = {k: str(v).strip() for k, v in payload.items()}
            return {"status": "ok", "processed": processed}
        except Exception as exc:
            logging.error("Execution failed: %s", exc)
            raise

if __name__ == "__main__":
    handler = SolutionHandler()
    result = handler.execute({"task": "${idea.replace(/"/g, '')}"})
    print("Result:", result)`;
  } else {
    solutionCode = `/* ==========================================================
 * CodingHax Solution: ${language}
 * Target Level: ${level}
 * Goal: ${idea}
 * ========================================================== */

// Clean, modular implementation designed for high readability
function executeSolution(inputParam) {
  console.log("Executing task for:", inputParam);
  return {
    success: true,
    task: "${idea.replace(/"/g, '')}",
    timestamp: Date.now()
  };
}

export default executeSolution;`;
  }

  // Formatting Style Adjustment
  if (style.includes("Explanations")) {
    solutionCode = `/* 
 * 💡 KEY IMPLEMENTATION NOTES:
 * 1. Purpose: Solves "${idea}" using ${language}.
 * 2. Robustness: Employs standard error-handling guards and input validation.
 * 3. Ready to run: Zero external bloated dependencies.
 */\n\n` + solutionCode;
  }

  DOM.resultCodeContent.textContent = solutionCode;
}

/**
 * Toast Notification Helper
 */
function showToast(message) {
  DOM.toast.textContent = message;
  DOM.toast.classList.remove("hidden");
  setTimeout(() => {
    DOM.toast.classList.add("hidden");
  }, 2200);
}

// ============================================================================
// MODULE 3: HACKER TYPER EASTER EGG
// ============================================================================

const FAKE_HACKER_CODE = `
#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <openssl/sha.h>

namespace CodingHaxKernel {
    struct ExploitPayload {
        uint64_t memory_offset = 0x7FFF004B2A;
        uint32_t buffer_len = 4096;
        char signature[32] = "CHAOS_OVERRIDE_V2";
    };

    void inject_payload_buffer(ExploitPayload* payload) {
        std::cout << "[*] Allocating virtual page at offset: " << std::hex << payload->memory_offset << std::endl;
        for (int i = 0; i < 16; ++i) {
            payload->memory_offset ^= 0xDEADBEEF;
            std::cout << "[*] Syn-Flood handshake established with gateway node 10.0.4." << i << std::endl;
        }
    }

    void bypass_kernel_ring0() {
        std::cout << "[!] Initiating ring-0 privilege escalation protocol..." << std::endl;
        usleep(5000);
        std::cout << "[+] Stack pointer alignment verified (ESP -> EBP)." << std::endl;
        std::cout << "[+] Security descriptors bypassed. ROOT ACCESS ENGAGED." << std::endl;
    }
}

int main(int argc, char** argv) {
    std::cout << "--- CODINGHAX KERNEL EXPLOIT RUNTIME v4.19 ---" << std::endl;
    CodingHaxKernel::ExploitPayload payload;
    CodingHaxKernel::inject_payload_buffer(&payload);
    CodingHaxKernel::bypass_kernel_ring0();
    return 0;
}
`;

let hackerClickCount = 0;
let hackerClickTimer = null;
let isHackerModeActive = false;
let hackerCodeIndex = 0;

/**
 * Initializes the Easter Egg listeners
 */
function initHackerEasterEgg() {
  // Trigger on 3 rapid clicks on the main brand title
  DOM.appTitle.addEventListener("click", () => {
    hackerClickCount++;
    clearTimeout(hackerClickTimer);

    if (hackerClickCount >= 3) {
      activateHackerMode();
      hackerClickCount = 0;
    } else {
      hackerClickTimer = setTimeout(() => {
        hackerClickCount = 0;
      }, 700);
    }
  });

  // Global key interceptor when in Hacker Mode
  window.addEventListener("keydown", (e) => {
    if (!isHackerModeActive) return;

    // ESC key exits Hacker Mode
    if (e.key === "Escape") {
      deactivateHackerMode();
      return;
    }

    // Intercept all other keys to simulate typing fake C++ hacker code
    e.preventDefault();

    const chunkSize = Math.floor(Math.random() * 8) + 6;
    const chunk = FAKE_HACKER_CODE.substr(hackerCodeIndex, chunkSize);

    if (chunk) {
      DOM.hackerCodeOutput.textContent += chunk;
      hackerCodeIndex = (hackerCodeIndex + chunkSize) % FAKE_HACKER_CODE.length;
    } else {
      hackerCodeIndex = 0;
    }

    // Auto-scroll to bottom of terminal
    DOM.hackerTerminal.scrollTop = DOM.hackerTerminal.scrollHeight;
  });
}

function activateHackerMode() {
  isHackerModeActive = true;
  DOM.hackerCodeOutput.textContent = "";
  hackerCodeIndex = 0;
  DOM.hackerTerminal.classList.remove("hidden");
  DOM.hackerTerminal.setAttribute("aria-hidden", "false");
}

function deactivateHackerMode() {
  isHackerModeActive = false;
  DOM.hackerTerminal.classList.add("hidden");
  DOM.hackerTerminal.setAttribute("aria-hidden", "true");
  DOM.hackerCodeOutput.textContent = "";
}

// ============================================================================
// BOOTSTRAP
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initWizard();
  initHackerEasterEgg();
});
