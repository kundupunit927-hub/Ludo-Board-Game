🎲 Classic Ludo Game

<p align="center"> <strong>A modern, smooth and interactive Classic Ludo experience built with React, Vite and TypeScript.</strong> </p>

<p align="center"> <a href="https://classic-ludo-game.ai.studio/">🎮 Play Game</a> · <a href="#-installation">Installation</a> · <a href="#-development">Development</a> </p>

🎮 Overview

Classic Ludo Game is a modern web-based Ludo project designed to bring the familiar board-game experience to the browser with a clean interface, responsive interactions and modern web technologies.

The project is built using React 19, Vite, TypeScript, Tailwind CSS, Motion, and Lucide React.

🌐 Live Demo

Play the game online:

https://classic-ludo-game.ai.studio/

✨ Highlights
🎲 Classic Ludo-inspired gameplay experience
⚡ Fast Vite-powered development environment
⚛️ React 19 component architecture
📘 TypeScript support
🎨 Tailwind CSS 4 styling
🎬 Motion-powered animations
🧩 Lucide icon library
🤖 Google GenAI integration capability
🖥️ Express backend support
🌐 Modern ES Module architecture
📱 Designed for a modern web experience
🖼️ Screenshots

Add screenshots of the game here to showcase the UI.

docs/
└── screenshots/
    ├── home.png
    ├── game-board.png
    ├── player-selection.png
    └── game-result.png

Example:

![Game Home Screen](docs/screenshots/home.png)
🛠️ Tech Stack
Technology	Purpose
React 19	UI and component architecture
TypeScript	Type-safe development
Vite	Development server and build tool
Tailwind CSS 4	Styling and responsive UI
Motion	Animations and transitions
Lucide React	UI icons
Express	Backend/server functionality
Google GenAI	Generative AI integration
dotenv	Environment configuration
TSX	TypeScript execution
esbuild	JavaScript/TypeScript bundling
📦 Installation
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
2. Open the project
cd react-example
3. Install dependencies
npm install
🔐 Environment Configuration

Create a .env file in the project root if your implementation requires environment variables:

GEMINI_API_KEY=your_api_key_here
⚠️ Important

Never commit secret API keys to GitHub.

Add the following to .gitignore:

.env
.env.local
.env.*.local

node_modules/
dist/
🚀 Development

Start the development server:

npm run dev

The project is configured to run on:

http://localhost:3000

The Vite configuration uses:

vite --port=3000 --host=0.0.0.0
🏗️ Production Build

Create an optimized production build:

npm run build

The production files will be generated inside:

dist/
👀 Preview Production Build

To locally preview the production build:

npm run preview
🔍 Type Checking

Run TypeScript validation:

npm run lint

This executes:

tsc --noEmit
🧹 Clean Build Files

To remove generated files:

npm run clean

This removes:

dist/
server.js

The current clean command uses rm -rf, so Windows users may need an equivalent PowerShell command.

📜 NPM Scripts
Script	Command	Description
dev	vite --port=3000 --host=0.0.0.0	Start development server
build	vite build	Create production build
preview	vite preview	Preview production build
clean	rm -rf dist server.js	Remove generated files
lint	tsc --noEmit	Type-check project
🧩 Suggested Project Architecture

A scalable structure for the project can look like:

classic-ludo-game/
│
├── public/
│   ├── images/
│   ├── sounds/
│   └── icons/
│
├── src/
│   ├── components/
│   │   ├── Board/
│   │   ├── Dice/
│   │   ├── Player/
│   │   ├── Token/
│   │   └── UI/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   └── Game/
│   │
│   ├── game/
│   │   ├── gameEngine.ts
│   │   ├── gameRules.ts
│   │   ├── player.ts
│   │   └── dice.ts
│   │
│   ├── services/
│   │   └── ...
│   │
│   ├── hooks/
│   │   └── ...
│   │
│   ├── utils/
│   │   └── ...
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
🎲 Game Concept

The project is based around the classic Ludo board-game concept.

A traditional Ludo game generally uses four player colors and four tokens per player. Players roll dice and move their tokens around the board, attempting to get all of their tokens into the home area before their opponents.

A typical ruleset includes:

🎲 Rolling the dice
6 allowing a token to leave the starting area
🚶 Moving tokens according to the dice result
⚔️ Capturing opponent tokens
🏠 Moving tokens toward the home area
🏆 Winning by getting all tokens home

The exact rules implemented by this project should be treated as the project's own game logic.

🤖 AI Integration

The project includes the Google GenAI package:

"@google/genai": "^2.4.0"

This provides the foundation for adding AI-powered functionality.

Possible applications include:

🤖 AI opponents
🧠 Difficulty levels
🎯 Move recommendations
💬 AI-assisted game interactions
📊 Gameplay analysis

Any AI gameplay behavior should be implemented and documented according to the actual application logic.

🎨 UI & Animation

The project uses Tailwind CSS 4 for styling and Motion for animations.

This combination can be used to create:

Smooth token movement
Dice animations
Turn transitions
Winning animations
Button interactions
Modal transitions
Responsive layouts

Lucide React provides scalable SVG icons throughout the interface.

📱 Responsive Design

The application can be designed to work across:

💻 Desktop
🖥️ Large screens
📱 Mobile browsers
📲 Tablets

For the best experience, game-board dimensions and controls should adapt to the available screen size.

⚡ Performance

The project uses Vite for fast development and optimized production builds.

Recommended production practices:

Lazy-load large components
Optimize image assets
Compress audio files
Avoid unnecessary React re-renders
Keep game-state updates localized
Minimize large dependencies
Use production builds for deployment
🔒 Security

If AI APIs or other server-side services are used:

Never expose private API keys in client-side JavaScript.
Store secrets in environment variables.
Prefer server-side API requests for sensitive operations.
Validate requests on the backend.
Do not commit .env files.
Keep dependencies updated.
🌍 Deployment

Build the project:

npm run build

The generated application will be available in:

dist/

The frontend can then be deployed to a static hosting platform.

If Express is used for server-side functionality, deploy the backend separately or configure the server to serve the generated frontend.

🧪 Recommended Development Workflow
# Install dependencies
npm install

# Start development
npm run dev

# Type-check
npm run lint

# Build production version
npm run build

# Preview production build
npm run preview
🗺️ Roadmap

Potential future improvements:

👥 Local multiplayer

🤖 Multiple AI difficulty levels

🌐 Online multiplayer

🏆 Leaderboards

👤 Player profiles

🎨 Multiple board themes

🪙 Coins/rewards system

🔊 Sound effects

🎵 Background music

✨ Advanced token animations

📊 Match statistics

🌍 Multi-language support

📱 PWA/mobile support

🔐 User authentication

☁️ Cloud game saves

📄 License

No license is currently specified in the provided package.json.

If this project is intended to be open source, add a license such as MIT or another license appropriate for your project.

Example:

MIT License
🤝 Contributing

Contributions are welcome.

Fork the repository.
Create a feature branch.
git checkout -b feature/new-feature
Make your changes.
Run type checking.
npm run lint
Create a production build.
npm run build
Commit your changes.
git commit -m "Add new feature"
Push the branch.
git push origin feature/new-feature
Open a Pull Request.
⭐ Support

If you like the project, consider giving the repository a ⭐ on GitHub.

🎮 Play Online

Classic Ludo Game:
https://classic-ludo-game.ai.studio/

<p align="center"> Made with ❤️ using React, TypeScript and Vite. </p>
