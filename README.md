# memory-story-ai
A Chrome Extension that allows users to create short, funny, and memorable stories powered by AI. It features keyword highlighting, real-time text validation, AI parameter controls, and persistent session data.
Features

    🎯 AI-Powered Story Generation: Create concise and humorous stories using custom keywords.
    📝 Word Highlighting: Automatically highlights specified words in the generated story.
    🎚️ Dynamic Controls: Adjust AI settings, such as Temperature and Top-K, directly from the extension UI.
    🔁 Persistent Data: Restores the last session data using Chrome Storage APIs.
    📖 Instruction Panel: A collapsible instruction panel to guide users on setup.
    🌐 Native Chrome Integration: Uses Chrome's AI Origin Trial for language model capabilities.

Getting Started
1. Prerequisites

    Browser: Google Chrome (Dev or Canary channel recommended).
    Version: Chrome 128 or later with AI Origin Trial support.

2. Setup AI in Chrome

Follow these steps to enable Chrome's AI Origin Trial:

    Download Chrome Dev/Canary: Google Chrome Channels.
    Enable the required flags:
        Open chrome://flags/#optimization-guide-on-device-model and set it to Enabled BypassPerfRequirement.
        Open chrome://flags/#prompt-api-for-gemini-nano and set it to Enabled.
    Download the optimization guide:
        Open chrome://components/, find Optimization Guide On Device Model, and ensure it’s fully downloaded.
    Relaunch Chrome.

Installing the Extension

    Clone this repository:

    git clone https://github.com/haruthuc/memory-story-ai.git
    cd ai-story-generator-extension

    Open Chrome and navigate to chrome://extensions.

    Enable Developer mode (toggle in the top right corner).

    Click Load unpacked and select the cloned project folder.

    The extension will now appear in the Chrome toolbar!

Usage
1. Open the Extension

Click on the extension icon in the Chrome toolbar to launch the UI.
2. Generate a Story

    Enter a list of keywords (comma- or newline-separated) in the input field.
    Adjust the Temperature and Top-K sliders to control the AI’s creativity and output style.
    Click the Summarize button to generate a short and funny story.

3. Highlight Words

Keywords from the input are automatically highlighted in the generated story.
4. Reset or Toggle Instructions

    Use the Reset button to clear all inputs and outputs.
    Toggle the Instructions panel for setup help.

Technologies Used

    Chrome Extensions API: For storage, runtime, and UI interactions.
    AI Integration: Chrome AI Origin Trial for story generation.
    Frontend: HTML5, CSS3, JavaScript (Vanilla).
    Icons: Google Material Symbols.

Contributing

We welcome contributions! To contribute:

    Fork the repository.
    Create a new branch for your feature:

git checkout -b feature-name

Commit your changes:

    git commit -m "Add feature description"

    Push to your forked repository and create a Pull Request.

License

This project is licensed under the MIT License.
Acknowledgments

    Google Chrome for enabling the AI Origin Trial.
    Material Symbols for providing lightweight, scalable icons.
    The open-source community for supporting Chrome Extension development.
