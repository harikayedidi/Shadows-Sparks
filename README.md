
# Shadows & Sparks - Solo Card Survival Game  

**Shadows & Sparks** is a fast-paced solo card survival game built entirely using AI agents inside **VS Code** — featuring animated cards, immersive sound, and mobile-first design.  
The twist? **Light is dangerous. Darkness is safe.** Every card you draw is a gamble between survival and defeat.

---

## 🚀 Project Summary

This project explores how far **AI-assisted development** can go when building a complete game end-to-end inside VS Code. From concept to code to polish, everything was created using a combination of AI agents, prompt engineering, and LLM completions.

The goal was to build a polished game with sound effects, responsive UI, and engaging motion — with minimal manual coding.

- Built using **React**, **TailwindCSS**, and **Framer Motion** (via motion.dev)
- Developed using **Roo Code Agent**, **GitHub Copilot**, **Claude 3.5 Sonnet**, and **ChatGPT/GPT-4o**
- Prompts were refined, split, and iterated to develop game logic, styling, animations, accessibility, and UX
- Card back images and visual assets were generated using **ChatGPT 4o image generation**

> The initial version looked nothing like the final result — it evolved significantly across dozens of multi-turn prompts.

---

## 🎮 Gameplay

You are **SPARK**, a rogue android escaping the Lumen Spire. **Light burns. Darkness hides.** Climb 10 sublevels to the surface.

- You start with **5 core integrity**.
- **Scan** a sector to reveal 3 doors. Each door gives a sensor reading: **COLD** (safe), **LUMEN** (light trap), **SIGNAL** (a choice) or **CACHE** (gear).
- Sensors are about 70% accurate, so a reading can lie. An **Oracle Node** can make them perfect for a couple of sectors.
- **Pick a door** to enter. The card flips to show what's really inside.
- **Signals** give you a decision with a tradeoff: gamble, trade gear for repairs, accept a Mirror Protocol (heal now, but the next room turns into a trap), and more.
- **Win** by reaching the surface. Escaping once unlocks **Endless Descent**, where traps get more common and the sensors get worse the deeper you go.

### Gear (3 slots)

| Gear | Effect |
| --- | --- |
| Shadow Cloak | Restore 1 integrity and slip through the current sector |
| Light Shield | Absorb the next light trap |
| Scanner Pulse | Reveal what's behind every door (use while choosing) |
| Nano Patch | Restore 1 integrity |
| Blink Drive | Reroll the doors (use while choosing) |

Click a gear slot to use it, or **drag it onto your core integrity bar**.

### Controls

| Action | Mouse / touch | Keyboard |
| --- | --- | --- |
| Scan the next sector | Click or drag the scanner | `Space` / `Enter` |
| Enter a door | Click it or drag it upward | `1` `2` `3` |
| Answer a signal | Click an option | `1` `2` |
| Use gear | Click or drag onto the core | `Q` `W` `E` |
| Mute / help | Top-right icons | `M` / `H` |
| Restart after a run | Panel button | `R` |

---

## 🌌 Sectors

Pick a sector on the title screen. Each one has its own palette, particles, card back and ambient synth drone:

- **Cryo Vault**: frozen data halls under permafrost
- **Reactor Core**: molten conduits, ash in the air
- **Bio Dome**: overgrown labs, glowing spores

---

## ✨ Features

- 🧭 Real choices: three doors per sector with sensor readings that can lie
- 🃏 Tactile cards: 3D tilt with a holographic sheen, flip reveals, and drag-to-act on the deck, doors and gear
- 🗺️ A depth map showing your route and how far you are from the surface
- 🔊 Generative ambient audio that gets tenser as integrity drops, plus a heartbeat when you're critical
- 💥 Screen shake, damage flashes and haptics on supported phones
- 📜 A typewriter transmission log that tells the story as you climb
- ⌨️ Full keyboard play, ARIA labels, and reduced-motion support
- 💾 Remembers your sector, sound setting, Endless unlock and best depth

### Code layout

- `src/game/engine.js`: pure, seeded game reducer (all rules live here)
- `src/data/`: room, item, signal content and sector themes
- `src/hooks/`: React wiring (game loop, sound/visual effects, keyboard, tilt)
- `src/components/`: UI components
- `src/utils/audio.js`: Web Audio engine (samples, synth blips, ambient drone)

---

## 🧠 AI Workflow

This project was built entirely using AI tools inside VS Code:

- **Roo Code Agent** for writing logic, UI, and state  
- Prompts iterated and structured using **GitHub Copilot** + **ChatGPT**  
- Model used: **Claude 3.5 Sonnet**, occasionally switching to **GPT-4o**  
- Card backs and visuals generated with **ChatGPT 4o (image mode)**  
- Used Roo's rewrite tool to break large tasks into atomic prompts  
- Final output includes code, layout, animation, accessibility, and logic — all AI-assisted

---

## ⚙️ Tech Stack

- **Frontend**: React  
- **Styling**: Tailwind CSS  
- **Animations**: motion.dev (Framer Motion)  
- **AI Tooling**: Roo Code Agent, Claude 3.5, ChatGPT 4o, GitHub Copilot  

---

## 🛠️ Setup Instructions

```bash
git clone https://github.com/harikayedidi/Shadows-Sparks.git
cd Shadows-Sparks
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## 🧪 What’s Next

- Introduce a scoring system and stat-based leaderboards
- Expand card types and procedural card generation using AI
- Add multiple levels of difficulty (e.g. Easy, Normal, Hard) to increase replay value

---

## 📜 License

This project is open-source and free to use. Attribution appreciated but not required.
