// Select UI elements
const sliderTemperature = document.querySelector('#temperature');
const sliderTopK = document.querySelector('#top-k');
const labelTemperature = document.querySelector('#label-temperature');
const labelTopK = document.querySelector('#label-top-k');
const resultElement = document.querySelector('#summary-output');
const makeStoryButton = document.getElementById("summarize-button");
const promptInput = document.getElementById("memory-summary-text");
const iconSwitchEl = document.getElementById("iconSwitch");
const resetButton = document.getElementById("reset-button");
const toggleButton = document.getElementById("toggleButton");
const instructionPanel = document.getElementById("instruction-panel");
const charCounter = document.getElementById("char-counter");

let session; // AI session instance

// Constants
const MAX_CHARS = 4000;

/**
 * Updates the memory words in the textarea and updates the character counter.
 * @param {string} text - The text to update.
 */
function updateMemoryWords(text) {
  if (!text) return;
  updateCharCount(text);
  promptInput.value = text;
}

/**
 * Updates the character counter and checks if input exceeds the limit.
 * @param {string} inputText - The text to count characters for.
 */
function updateCharCount(inputText) {
  const charCount = inputText.length;
  charCounter.textContent = `Characters: ${charCount}/${MAX_CHARS}`;

  // Handle text length restrictions
  if (charCount > MAX_CHARS) {
    charCounter.style.color = "red";
    makeStoryButton.disabled = true;
    alert("Text exceeds 4000 characters. Please shorten it.");
  } else {
    charCounter.style.color = "";
    makeStoryButton.disabled = false;
  }
}

// Restore last session data from Chrome storage
chrome.storage.session.get('lastVisializerWord', ({ lastVisializerWord }) => {
  updateMemoryWords(lastVisializerWord);
});

// Listen for storage changes and update memory words
chrome.storage.session.onChanged.addListener((changes) => {
  const lastWordChange = changes['lastVisializerWord'];
  if (lastWordChange) {
    updateMemoryWords(lastWordChange.newValue);
  }
});

// DOMContentLoaded Event - Initializes event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Character count on input
  promptInput.addEventListener("input", () => {
    updateCharCount(promptInput.value);
  });

  // Story generation
  makeStoryButton.addEventListener("click", async () => {
    const textPrompt = promptInput.value.trim();
    const userPrompt = `
      Write a very short and funny story using the following list of words, ensuring each word is used exactly once.
      Keep it concise and under 100 words.
      Use humor and unexpected twists to make the story both entertaining and easy to remember.
      ${textPrompt}
    `;

    try {
      const params = {
        systemPrompt: 'You are a helpful and friendly assistant and story teller',
        temperature: sliderTemperature.value,
        topK: sliderTopK.value,
      };

      showLoading();
      let response = await runPrompt(userPrompt, params);
      response = highlightWords(response, textPrompt);
      showResponse(response);
    } catch (e) {
      alert(e);
    }
  });

  // Reset button functionality
  resetButton.addEventListener("click", reset);
});

// Toggles the instruction panel visibility
toggleButton.addEventListener("click", () => {
  instructionPanel.classList.toggle("open");
  toggleButton.textContent = instructionPanel.classList.contains("open")
    ? "Hide Instructions"
    : "Show Instructions";
});

/**
 * Displays the AI-generated response.
 * @param {string} responseText - The response to display.
 */
function showResponse(responseText) {
  resultElement.innerHTML = responseText;
}

/**
 * Initializes the AI engine by validating Chrome's AI capabilities.
 */
async function initAIEngine() {
  if (!('aiOriginTrial' in chrome)) {
    showResponse('Error: chrome.aiOriginTrial not supported in this browser - Please click on Instruction button below');
    makeStoryButton.disabled = true;
    promptInput.disabled = true;
    return;
  }

  const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
  console.log('Model default:', defaults);

  if (defaults.available !== 'readily') {
    showResponse(`Model not yet available (current state: "${defaults.available}")`);
    makeStoryButton.disabled = true;
    promptInput.disabled = true;
    return;
  }

  sliderTemperature.value = defaults.defaultTemperature;
  sliderTopK.value = Math.min(defaults.defaultTopK, 3); // Limit TopK to 3
  labelTopK.textContent = sliderTopK.value;
  sliderTopK.max = defaults.maxTopK;
  labelTemperature.textContent = defaults.defaultTemperature;

  makeStoryButton.disabled = false;
  promptInput.disabled = false;
}
initAIEngine();

/**
 * Runs the AI prompt with the given parameters.
 * @param {string} prompt - The prompt for the AI.
 * @param {object} params - The AI parameters (temperature, topK).
 * @returns {Promise<string>} The AI response.
 */
async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }
    return session.prompt(prompt);
  } catch (e) {
    console.error('Prompt failed:', e);
    reset();
    throw e;
  }
}

/**
 * Resets the AI session and UI elements.
 */
async function reset() {
  if (session) {
    session.destroy();
    session = null;
  }
  resultElement.innerHTML = "";
  promptInput.value = "";
}

/**
 * Shows a loading indicator while the AI processes the prompt.
 */
function showLoading() {
  showResponse(`
    <div id="loading" class="loading-container">
      <span class="loading-icon material-symbols-outlined">autorenew</span>
      AI is thinking. Please wait :D
    </div>
  `);
}

/**
 * Highlights the words in the text based on a provided word list.
 * @param {string} text - The text to highlight.
 * @param {string|array} wordList - The list of words to highlight.
 * @returns {string} - The text with highlighted words.
 */
function highlightWords(text, wordList) {
  if (typeof wordList === "string") {
    wordList = wordList.split(/[\n,]+/).map(word => word.trim()).filter(word => word);
  }

  if (!Array.isArray(wordList)) {
    console.error("Invalid wordList format:", wordList);
    return text;
  }

  const escapedWords = wordList.map(word =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

  return text.replace(regex, "<b>$1</b>");
}

/**
 * Shows an element by removing the 'hidden' attribute.
 * @param {HTMLElement} element - The element to show.
 */
function show(element) {
  element.removeAttribute('hidden');
}

/**
 * Hides an element by adding the 'hidden' attribute.
 * @param {HTMLElement} element - The element to hide.
 */
function hide(element) {
  element.setAttribute('hidden', '');
}
