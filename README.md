<div align="center">
  <img src="public/logo.png" alt="Infyn Home Tab Logo" width="120" />
  <h1>∞ Infyn Home Tab</h1>
  <p><strong>A Sleek, High-Performance, Privacy-First Developer New Tab Homescreen for Chromium Browsers</strong></p>

  <p>
    <a href="https://github.com/imvicky69/infyn-home-tab/releases"><img src="https://img.shields.io/github/v/release/imvicky69/infyn-home-tab?include_prereleases&logo=github&color=00B4D8&label=Release" alt="Latest Release"></a>
    <a href="https://developer.chrome.com/docs/extensions/mv3/intro/"><img src="https://img.shields.io/badge/Chrome_Extension-Manifest_v3-4285F4?logo=googlechrome&logoColor=white" alt="Manifest V3"></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19"></a>
    <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite"></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
    <a href="https://infyn.software"><img src="https://img.shields.io/badge/Ecosystem-infyn.software-7C3AED?logo=safari&logoColor=white" alt="Infyn Software"></a>
    <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/Contributions-Welcome-blue.svg" alt="Contributions Welcome"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-emerald.svg" alt="License: MIT"></a>
  </p>
</div>

---

## 🌟 Overview

**Infyn Home Tab** transforms your default browser new-tab page into a futuristic, distraction-free productivity workstation. Designed specifically for software engineers, designers, power users, and makers, it unifies your daily workflow into an ultra-responsive, beautifully animated glassmorphic dashboard.

Whether you're monitoring your active **GitHub repositories**, jumping between **Firebase console services**, tracking sprint tasks in a fluid **Todo manager**, drafting ideas in a **scratchpad**, or entering deep focus with the **Pomodoro timer**, Infyn Home Tab delivers an instantaneous, zero-latency experience every time you open a tab.

Infyn Home Tab is 100% open source and part of the **[Infyn](https://infyn.software)** family of privacy-first software tools.

---

## ⚡ Core Philosophy

- **🔒 100% Client-Side Privacy (Zero Cloud Telemetry):** Your notes, shortcuts, todos, and project configurations are stored strictly on your device using `chrome.storage.local` and `localStorage`. No analytics, no user tracking, and no external databases.
- **⚡ Blazing Fast Cold Boot:** Built on React 19, TypeScript, Vite, and Tailwind CSS v4. Loads in sub-milliseconds without stutter or blank frames.
- **💻 Developer-Centric by Default:** Native widgets for GitHub repositories (with 1-click clone and branch navigation) and Firebase Cloud Consoles.
- **🎯 Distraction-Free Focus:** Built-in Pomodoro timer with persistent background worker synchronization and live countdown badges in your browser toolbar.
- **🎨 State-of-the-Art Aesthetics:** Interactive WebGL / OGL live particle shaders (`Lightfall`), curated ambient wallpapers, and dark/light modes.
- **🚫 100% Free & Open Source:** No paywalls, no tracking ads, no pro subscriptions, and no lock-in.

---

## 📥 Easy Download & Installation Guide

Infyn Home Tab works on all Chromium-based desktop web browsers including **Google Chrome**, **Brave**, **Arc Browser**, **Microsoft Edge**, **Opera**, and **Vivaldi**.

### ⚡ Method 1: Install Pre-Built Bundle (Recommended / Quickest)

1. **Download the Extension:**
   - Head to the [**Latest GitHub Releases**](https://github.com/imvicky69/infyn-home-tab/releases) page.
   - Download the pre-built `infyn-home-tab-v*.zip` (or extract from this repository's `dist/` directory).
2. **Extract the ZIP file:**
   - Extract the contents to a folder on your computer (e.g., `Documents/infyn-home-tab`).
3. **Open Extensions Manager in your browser:**
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Brave**: Navigate to `brave://extensions/`
   - **Edge**: Navigate to `edge://extensions/`
   - **Arc**: Open `arc://extensions/`
4. **Enable Developer Mode:**
   - Toggle the **"Developer mode"** switch in the top-right corner.
5. **Load the Extension:**
   - Click the **"Load unpacked"** button in the top-left toolbar.
   - Select the extracted folder containing `manifest.json`.
6. **Done! 🎉**
   - Press <kbd>Ctrl</kbd> + <kbd>T</kbd> (or <kbd>Cmd</kbd> + <kbd>T</kbd> on macOS) to launch your new Infyn Home Tab!

---

### 🛠️ Method 2: Build & Install From Source

If you want the bleeding-edge version or want to contribute code:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/imvicky69/infyn-home-tab.git
   cd infyn-home-tab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the production extension bundle:**
   ```bash
   npm run build
   ```
   *This compiles the TypeScript files, generates the Tailwind v4 styles, and bundles the extension into the `dist/` folder.*

4. **Load into your browser:**
   - Open `chrome://extensions/`
   - Turn on **Developer mode** (top-right switch).
   - Click **Load unpacked** and select the `dist/` directory in your cloned repo.

---

### 🔄 How to Update

When a new version is released:
1. Download or pull the latest code and re-run `npm run build` (or download the updated ZIP).
2. Visit `chrome://extensions/` and click the **Reload (🔄)** icon on the Infyn Home Tab card.
3. Your notes, bookmarks, and settings will remain intact, safely preserved in local storage!

---

## 🌐 Supported Browsers

| Browser | Compatibility | Engine |
| :--- | :---: | :--- |
| **Google Chrome** | ✅ Fully Supported | Chromium |
| **Brave Browser** | ✅ Fully Supported | Chromium |
| **Arc Browser** | ✅ Fully Supported | Chromium |
| **Microsoft Edge** | ✅ Fully Supported | Chromium |
| **Opera / Opera GX** | ✅ Fully Supported | Chromium |
| **Vivaldi** | ✅ Fully Supported | Chromium |

---

## ✨ Key Features & Capabilities

### 🖥️ Multi-Screen Workspace Layout
Seamlessly glide between your work contexts with smooth vertical snap navigation:
- **Screen 1 (Home):** Ambient live clock, greeting, weather card, calendar, and quick-launch shortcut apps.
- **Screen 2 (Productivity):** Focus & Pomodoro timer, auto-saving scratchpad notes, and interactive priority task manager.
- **Screen 3 (Dev):** Developer command center with GitHub repository quick-actions and Firebase project consoles.
- *Fully customizable: reorder, hide, or resize widgets directly from the bottom customize toolbar.*

---

### 🚀 Developer Command Center

#### 🐙 GitHub Repositories Widget
- **Instant Project Switching:** Quickly switch between your pinned GitHub projects.
- **Branch & Repo Info:** View active branch, repo owner, and description at a glance.
- **1-Click Git Clone:** Copy `git clone https://github.com/owner/repo.git` straight to your clipboard.
- **Quick Links:** Direct access to Commits, Branches, Pull Requests, Issues, Releases, and GitHub Actions.

#### 🔥 Firebase Cloud Projects Widget
- **Direct Console Deep-Links:** Jump directly into project-specific Firebase console tools in 1 click:
  - 👥 **Authentication** (User management)
  - 🗄️ **Firestore Database** (Data browser)
  - 📦 **Cloud Storage** (Buckets & media)
  - ⚡ **Cloud Functions** (Logs & execution status)
  - 🌐 **Firebase Hosting** (Domains & releases)
  - ⚙️ **Project Settings & Security Rules**

---

### ⏱️ Integrated Focus & Pomodoro Timer
- **Tailored Modes:** Quick presets for **25m Focus**, **5m Short Break**, and **45m Deep Work**.
- **Browser Icon Badge Sync:** Displays live countdown minutes (e.g. `25m`, `14m`) directly on your extension icon in the Chrome toolbar.
- **Persistent Background Worker:** Powered by a Manifest V3 background service worker and `chrome.alarms` so your timer keeps counting down even when you close the tab.
- **1-Click Icon Toggle:** Click the pinned extension icon in your browser toolbar to immediately start or pause your focus session.
- **Floating Overlay:** Optional floating mini-timer overlay that remains visible as you scroll between screens.

---

### 🔍 Multi-Engine Omnisearch
- **Keyboard Trigger:** Hit <kbd>/</kbd> or <kbd>Cmd</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> from anywhere on the page to jump into search.
- **Instant Engine Switching:**
  - 🔍 **Google**
  - 🤖 **ChatGPT**
  - 🕵️ **ChatGPT Anonymous** (automatically opens ChatGPT in temporary/incognito mode without chat history storage)
  - 🧠 **Perplexity AI**
  - 🦆 **DuckDuckGo**
  - 🐙 **GitHub**
  - 📺 **YouTube**
- **Smart URL Detection:** Type any valid web address (e.g., `github.com` or `localhost:3000`) and press Enter to navigate directly without executing a search query.

---

### 📝 Auto-Sync Scratchpad Notes
- **Instant Scratchpad:** Clean, distraction-free markdown and text drafting canvas.
- **Cross-Tab Synchronization:** Edits sync in real-time across all open tabs via browser storage events.
- **Zero Loss:** Every keystroke is saved locally instantly.

---

### ✅ Priority Todo & Task Manager
- **Priority Starring:** Mark critical items with a star to keep them front and center.
- **Categorical Tags:** Organize tasks with tags like `Work`, `Personal`, `Dev`, or `Study`.
- **Inline Editing:** Tap any task to modify its text on the fly.
- **Completed Filter & Batch Cleanup:** Easily review completed tasks or wipe them with one click.

---

### 🎨 Visual Customization & Live Shaders
- **Live Particle Shaders (`Lightfall`):** Custom WebGL shader with fluid particle light streaks, interactive cursor deflection, and glowing trails.
- **Curated Wallpaper Themes:** Silk Aurora, Deep Ocean Blue, Purple Nebula, Sunset Glow, Cyber Mesh, Clean Light Silk, Emerald Borealis, Midnight Obsidian, Cosmic Velvet, Electric Indigo, Carbon Titanium, and Deep Marine Cyan.
- **Dark & Light Modes:** Tailored contrast presets for optimal day and night viewing.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> | Focus Omnisearch bar |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Focus Omnisearch bar |
| <kbd>Esc</kbd> | Close modals, search engine picker, or blur search bar |
| <kbd>Enter</kbd> | Execute search query or navigate to entered URL |

---

## 🛠️ Tech Stack & Architecture

- **Core Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite 8](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **3D / Shader Engine:** [OGL](https://github.com/oframe/ogl) (Minimal WebGL library)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Extension Platform:** Chrome Extensions [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) (Background Service Workers & Chrome Alarms)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 🤝 Contributing

We love contributions! Infyn Home Tab is open source, and whether you're fixing a typo, adding a new developer widget, enhancing keyboard accessibility, or submitting a new wallpaper gradient, your help is welcome.

Please read our [**Contributing Guide (CONTRIBUTING.md)**](CONTRIBUTING.md) for step-by-step instructions on setting up your local environment, running the dev server, and opening a pull request.

```bash
# Start local development server with Hot Module Replacement
npm run dev

# Run Oxlint
npm run lint

# Build extension distribution
npm run build
```

---

## 🌐 The Infyn Ecosystem

Infyn Home Tab is part of the **Infyn** suite of privacy-respecting, client-side tools:

| Project | Description | Repository | Website |
| :--- | :--- | :--- | :--- |
| **∞ Infyn** | Fast, 100% free, client-side PDF & Image web utilities (Zero server uploads) | [imvicky69/infyn](https://github.com/imvicky69/infyn) | [infyn.software](https://infyn.software) |
| **Infyn DL** | Universal, local-first media and music downloader for Windows & Android | [imvicky69/infyn-dl](https://github.com/imvicky69/infyn-dl) | [GitHub Releases](https://github.com/imvicky69/infyn-dl/releases) |
| **Infyn Home Tab** | Sleek, privacy-first developer new tab dashboard for Chromium browsers | [imvicky69/infyn-home-tab](https://github.com/imvicky69/infyn-home-tab) | [infyn.software](https://infyn.software) |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by [**Vicky**](https://github.com/imvicky69) & the **[Infyn](https://infyn.software)** community.
