
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

## 🎮 How to play

You are **SPARK**, a little robot escaping a tower full of lights. **Light hurts you. Dark rooms are safe.**

1. **Draw doors.** Tap the deck or press `Space`. You get 3 doors.
2. **Pick one.** Each door has a tag that hints at what's inside. Tags are *usually* right (about 7 in 10 times).
3. **Climb.** Get through 10 floors without running out of health. Win once to unlock **Endless**.

| Tag | What it usually means |
| --- | --- |
| DARK | Safe. Nothing hurts you. |
| BRIGHT | A light trap. Lose 1 or 2 health. |
| EVENT | Something happens and you pick what to do. |
| LOOT | A free item. |

### Items

| Item | What it does |
| --- | --- |
| Shadow Cloak | Heal 1 and skip this floor |
| Shield | Blocks the next bright trap |
| X-Ray | Shows what is behind every door |
| Repair Kit | Heal 1 |
| Reroll | Swap the doors for new ones |

Tap an item to use it, or **drag it onto your health**.

### Upgrades, bosses and twists

- **Upgrades:** after floors 2, 5 and 7 you pick 1 of 3 upgrades that last the whole run (Night Vision, Sunglasses, Lucky Coin, Extra Door, Spare Battery and more). Some combo well together.
- **Bosses:** floors 5 and 10 have a boss. You stay on the floor until you find enough dark rooms to sneak past.
- **Twists:** some floors get a special rule, like *Lights Out* (no tags), *Hurry!* (8-second timer), *Upside Down* (DARK and BRIGHT swapped) or *Lucky Floor* (marked free loot).

### Controls

| Action | Mouse / touch | Keyboard |
| --- | --- | --- |
| Draw doors | Tap or drag the deck | `Space` / `Enter` |
| Pick a door | Tap it or drag it up | `1`–`4` |
| Pick an event option or upgrade | Tap it | `1` `2` `3` |
| Use an item | Tap it or drag onto health | `Q` `W` `E` `R` |
| Sound / help | Top-right icons | `M` / `H` |
| Play again | Panel button | `R` |

### Comfort settings

Open **⚙ Settings** to change:

- **Motion:** Full, Reduced (no shaking, tilting or looping effects) or Off (no animation at all). Defaults to Reduced if your device asks for less motion.
- **Glow:** turn the neon glow off for a flat, calm look.
- **Sound**, and a button to show the beginner tips again.

---

## 🌌 Looks

Pick a look on the title screen. Each one has its own colors, particles, card back and ambient music:

- **Ice Vault**: icy and quiet
- **Fire Core**: hot and smoky
- **Bio Garden**: green and glowing

---

## ✨ Features

- 🧭 Real choices: doors with tags that can lie, items, risky events, and run-long upgrades
- 👾 Boss floors and random floor twists so no two runs play the same
- 💡 Short first-time tips instead of a wall of rules
- 🃏 Tactile cards: 3D tilt, flip reveals, and drag-to-act on the deck, doors and items
- 🗺️ A floor map showing your route and the boss floors ahead
- 🔊 Ambient audio that gets tenser as your health drops, plus haptics on supported phones
- ♿ Full keyboard play, ARIA labels, and Motion/Glow settings
- 💾 Remembers your look, settings, Endless unlock and best run

### Code layout

- `src/game/engine.js`: pure, seeded game reducer (all rules live here)
- `src/data/`: rooms, items, upgrades, twists, bosses and looks
- `src/hooks/`: React wiring (game loop, effects, settings, tips, keyboard, tilt)
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

### Hosting

The game deploys to **GitHub Pages** on every push to `main` (see `.github/workflows/deploy-pages.yml`). In the repo, go to **Settings → Pages** and set the source to **GitHub Actions**. It will be live at `https://harikayedidi.github.io/Shadows-Sparks/`.

---

## 🧪 What’s Next

- A daily run with the same seed for everyone
- A shop between floors and more upgrades that combo
- Difficulty levels (Easy, Normal, Hard)

---

## 📜 License

This project is open-source and free to use. Attribution appreciated but not required.
