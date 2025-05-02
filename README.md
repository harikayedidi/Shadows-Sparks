
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

- Start with **5 HP**
- Each turn, **draw a card**:
  - **Dark Room** (Grey glow): Safe spaces like Quiet Corridors or Dim Chambers
  - **Light Trap** (White glow): Damage traps
    - 1 HP: Light Beam, Flickering Lantern
    - 2 HP: Blinding Flash, Light Array
  - **Items** (Yellow border): Go into your inventory
    - Shadow Cloak: Heal 1 HP + skip next turn
    - Light Shield: Block next light trap
  - **Choice Cards** (Rainbow glow): Make risky or rewarding decisions
    - Gamble Rune: 50/50 risk or reward
    - Wishing Flame: Trade 1 HP for an item
    - Twisted Mirror: Heal now, trap next
    - Fountain of Echoes: Heal 2 HP
    - Sealed Scroll: Gain a Shadow Cloak

- **Win** if you survive 10 turns
- **Unlock Endless Mode** after your first win

---

## 🌈 Themes

Choose your visual environment:

- **Frozen Crypts** – Cool blues with snowfall  
- **Ashen Depths** – Dark red, ember-filled  
- **Void Garden** – Lush green with floating leaves

Each theme comes with:
- Custom card backs
- Themed background particles
- Button glow and draw animations

---

## ✨ Features

- 🃏 Fast-paced solo card gameplay (2–5 min sessions)  
- 💥 Card draw animations and responsive glow effects  
- 🔊 Sound effects for cards, damage, items, and outcomes  
- 🗃️ Inventory + item usage system  
- 📜 Auto-scrolling game log with live updates  
- 🌓 Dynamic theme switching with smooth transitions  
- 📱 Fully responsive with **touch support** and **mobile optimization**  
- ♿ Accessibility support (keyboard nav, screen readers, ARIA labels)

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
git clone https://github.com/your-username/shadows-and-sparks.git
cd shadows-and-sparks
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## 🧪 What’s Next

- Add full keyboard support and full focus management for accessibility
- Introduce a scoring system and stat-based leaderboards
- Expand card types and procedural card generation using AI
- Add multiple levels of difficulty (e.g. Easy, Normal, Hard) to increase replay value

---

## 📜 License

This project is open-source and free to use. Attribution appreciated but not required.
