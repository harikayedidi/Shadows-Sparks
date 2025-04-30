# Shadows and Sparks - Solo Card Survival Game 

🧠 **This game was mostly built using AI, based on prompts I gave.**


**Shadows and Sparks** is a fast-paced solo card game built with React, TailwindCSS, and motion.dev.
You must draw cards, survive dangerous encounters, and manage your inventory to make it through the darkness. Light is deadly — use it wisely!

---

## 🎮 Gameplay

- Start with 5 health points (HP).
- Each turn, **draw a card** from a shuffled deck:
  - **Dark Room** (Green background): Safe, no damage.
  - **Light Trap** (Green background): Lose 2 HP.
  - **Item** (Yellow background): Add to your inventory (max 2 items).
  - **Special Event** (Yellow background): Follow simple effects like losing HP or bonus draws.

- Use collected items to heal, avoid traps, or reroll cards.
- Survive **10 turns** without your HP reaching zero to win the game.
- Choose from three unique realms, each with its own visual theme:
  - **Frozen Crypts**: Icy blue theme with snowfall effects
  - **Ashen Depths**: Deep red theme with ember particles
  - **Void Garden**: Lush green theme with floating leaves

---

## ✨ Features

- Fast, solo gameplay (2-5 min rounds)
- Animated card flips and damage effects (using motion.dev)
- Colorful design with theme-specific visuals and particles
- Inventory system (hold and use items)
- Health tracking and win/lose screens
- Dynamic theme switching with smooth transitions
- Auto-scrolling game log with user scroll preservation
- Fully accessible with keyboard navigation and screen reader support

### 🎨 Theme System
- Each realm features unique:
  - Background gradients and particle effects
  - Card back designs
  - Button and border glow effects
  - Smooth transitions between themes

### ♿ Accessibility Features
- Full keyboard navigation support
- Clear focus indicators
- ARIA labels and roles
- Screen reader compatible game log
- Reduced motion support
- High contrast text and UI elements

---

## ⚙️ Tech Stack

- **Frontend**: React
- **Styling**: TailwindCSS
- **Animations**: motion.dev (Framer Motion for React)

---

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shadows-and-sparks.git
   cd shadows-and-sparks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play!

---

## 📜 License

This project is open-source and free to use. Attribution appreciated but not required. 🎴
