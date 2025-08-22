# VenusFront - AGORA Decision War Room

A modern, interactive web application showcasing The Venus Project's autonomous city council decision-making system with AI agents and blockchain-based staking protocols.

## 🌟 Features

### 🔐 Password Protection
- Secure access control with customizable password
- Beautiful animated login screen
- Session persistence with localStorage

### 🏛️ AGORA Chain Interface
- Real-time blockchain event feed
- Interactive staking protocols for 10 AI agents
- Live pool statistics and field strength metrics
- Wallet integration (Phantom support)

### 🤖 AI Agent System
- **ALPHA** - Infrastructure & Habitat Design
- **BETA** - Energy Systems
- **GAMMA** - Food & Agriculture
- **DELTA** - Ecology & Restoration
- **EPSILON** - Social & Wellbeing
- **ZETA** - Transportation & Mobility
- **ETA** - Health & Medical
- **THETA** - Education & Knowledge
- **IOTA** - Resource Management
- **KAPPA** - Culture, Ethics & Governance

### 💰 Staking & Governance
- VPC token staking system
- Influence score tracking
- Access tickets and reputation system
- Lock period management (7, 30, 90 days)

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Real-time updates and live feeds
- Interactive help system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/greaterdan/THE-VENUS-PROJECT.git
   cd THE-VENUS-PROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file (optional - uses placeholder keys for development)
   XAI_API_KEY=your_xai_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to `http://localhost:4000`
   - Enter the password: `venus2024`
   - Explore the AGORA Decision War Room!

## 🏗️ Project Structure

```
VenusFront/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
├── server/                # Backend Express server
│   ├── contracts/         # Smart contract simulations
│   ├── routes/            # API routes
│   └── websocket/         # Real-time communication
├── shared/                # Shared types and schemas
└── attached_assets/       # Images and media files
```

## 🔧 Configuration

### Password Protection
To change the default password, edit `client/src/components/PasswordProtection.tsx`:
```typescript
const correctPassword = "your_new_password_here";
```

### API Keys
The application uses XAI API for AI agent conversations. Set up your API keys in the environment variables or use the placeholder keys for development.

## 🎯 Key Features Explained

### AGORA Chain
- **Live Feed**: Real-time blockchain events showing staking activities and agent interactions
- **Staking Protocols**: Each agent has its own staking pool with unique metrics
- **Field Strength**: Impact measurements across ecological, efficiency, and resilience dimensions
- **Faucet System**: Resource allocation when sufficient VPC is staked

### Help System
- Comprehensive documentation accessible via the Help button
- Explains all features and agent domains
- Interactive modal with smooth animations

### Wallet Integration
- Phantom wallet support for staking operations
- Real-time balance and position tracking
- Secure transaction handling

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, WebSocket, Drizzle ORM
- **Database**: Neon PostgreSQL (serverless)
- **AI**: XAI API for agent conversations
- **Blockchain**: Solana wallet integration

## 🌐 Deployment

The application is designed to run on platforms like:
- Vercel (frontend)
- Railway (backend)
- Replit (full-stack)

## 📝 License

This project is part of The Venus Project's open-source initiative for sustainable city planning and resource-based economics.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please refer to The Venus Project's official channels or create an issue in this repository.

---

**Built with ❤️ for The Venus Project's vision of sustainable, intelligent cities.**
