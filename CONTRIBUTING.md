# Contributing to Infyn Home Tab 🚀

Thank you for your interest in contributing to **Infyn Home Tab**! We welcome contributions from everyone—whether it's fixing a bug, adding a new developer widget, optimizing performance, or improving documentation.

Infyn Home Tab is part of the **Infyn** open-source ecosystem ([infyn.software](https://infyn.software)).

---

## 🛠️ Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or newer)
- `npm` (comes with Node.js)
- A Chromium-based browser (Google Chrome, Brave, Arc, Microsoft Edge, Opera, or Vivaldi)

### 1. Clone the Repository

```bash
git clone https://github.com/imvicky69/infyn-home-tab.git
cd infyn-home-tab
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server (Browser Mode)

For quick UI iteration, you can run Vite's live dev server:

```bash
npm run dev
```

Visit `http://localhost:5173` to preview and tweak widgets with Hot Module Replacement (HMR).

### 4. Build Extension & Test in Browser

To test the full Chrome Extension behavior (including background service worker, Chrome storage, and new-tab override):

```bash
npm run build
```

Then load the unpacked extension in your browser:
1. Navigate to `chrome://extensions/` (or `brave://extensions/`, `edge://extensions/`).
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select the `dist/` directory inside this repository.
4. Open a new tab (`Ctrl+T` or `Cmd+T`) to test your changes.

---

## 📂 Project Architecture

```
├── public/
│   ├── background.js       # Manifest V3 background service worker (timer, badge)
│   ├── manifest.json       # Chrome extension manifest
│   └── logo.png, icon.svg  # Icons & brand assets
├── src/
│   ├── App.tsx             # Main homescreen layout & screen navigation
│   ├── components/
│   │   ├── GithubWidget.tsx           # GitHub Repos & quick launcher widget
│   │   ├── FirebaseProjectsWidget.tsx # Firebase cloud console launcher widget
│   │   ├── FocusTimerWidget.tsx       # Pomodoro / focus timer widget
│   │   ├── TodoListWidget.tsx         # Task manager with priority starring
│   │   ├── NotesWidget.tsx            # Scratchpad note widget
│   │   ├── AppGrid.tsx                # Customizable shortcut grid
│   │   ├── SearchBar.tsx              # Multi-engine omnisearch bar
│   │   ├── LiveWallpaper.tsx          # WebGL shader wallpaper container
│   │   ├── Lightfall.tsx              # Interactive OGL particle stream shader
│   │   ├── CustomizeModal.tsx         # Drag-and-drop & screen layout customization
│   │   ├── SettingsModal.tsx          # Appearance, clock & search settings
│   │   ├── WeatherCard.tsx            # Live weather card
│   │   └── CalendarCard.tsx           # Minimalist calendar widget
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces and data models
│   └── utils/
│       ├── storage.ts      # LocalStorage & Chrome Storage persistence layer
│       └── timer.ts        # Focus timer logic and synchronization
├── index.html              # Extension entrypoint
├── package.json
└── vite.config.ts          # Vite & Tailwind CSS v4 configuration
```

---

## 📋 Contribution Workflow

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/awesome-new-widget
   ```
3. **Make Your Changes**:
   - Write clean, type-safe TypeScript code.
   - Maintain the fast, privacy-first ethos (no third-party tracking or external server dependencies).
   - Ensure the UI aligns with Infyn's modern glassmorphism design language.
4. **Verify & Lint**:
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit Your Changes**:
   ```bash
   git commit -m "feat: add awesome new widget"
   ```
6. **Push to Your Fork**:
   ```bash
   git push origin feature/awesome-new-widget
   ```
7. **Open a Pull Request** against the `main` branch of `imvicky69/infyn-home-tab`.

---

## 💡 Ideas for Contributions

- 🔌 **New Developer Widgets**: Docker containers monitor, Vercel / Netlify deployment status, npm package lookup, or bundle size tracker.
- 🎨 **New Wallpaper Themes**: Additional WebGL shaders or curated CSS gradients.
- ⌨️ **Custom Keybindings**: More keyboard shortcuts for lightning-fast power-user navigation.
- 🌐 **Localization / i18n**: Translations for international users.

---

## 💬 Community & Feedback

Have questions or feature ideas?
- Open an [Issue](https://github.com/imvicky69/infyn-home-tab/issues)
- Visit our website: [infyn.software](https://infyn.software)
- Explore sister projects: [Infyn Web Utilities](https://github.com/imvicky69/infyn) & [Infyn DL](https://github.com/imvicky69/infyn-dl)
