# 🎯 Discord Message Archive System

A full-stack TypeScript application that allows you to archive Discord messages with ease. Features a modern React web interface, Express.js API, and Discord bot integration.

## ✨ Features

### 🤖 Discord Bot Integration
- **Slash Commands**: Use `/archive` to save messages instantly
- **"Caught in 4K" GIF**: Automatically posts and removes a fun GIF when archiving
- **URL Support**: Archive specific messages using Discord message URLs
- **Auto-Registration**: Bot commands are automatically registered on startup

### 🎨 Modern Web Interface
- **Material Design Dark Theme**: Beautiful dark UI with gold accents
- **Smart Filtering**: Cascading dropdowns for servers and channels
- **Message Sorting**: Toggle between newest/oldest first
- **Rich Content Display**: View attachments, embeds, and reactions
- **Responsive Design**: Works seamlessly on desktop and mobile

### 🚀 Robust Backend
- **RESTful API**: Express.js with comprehensive endpoints
- **Database**: SQLite for development, easily configurable for production
- **Type Safety**: Full TypeScript integration with shared types
- **Auto-Migration**: Database schema automatically managed

## 📁 Project Structure

```
discord-archive-system/
├── 🎨 frontend/          # React TypeScript web app (Vite + SCSS)
├── 🚀 backend/           # Express API server (TypeORM + SQLite)
├── 🤖 bot/               # Discord bot (Discord.js + Slash Commands)
├── 📦 shared/            # Shared TypeScript types and utilities
├── 📄 package.json       # Workspace management & scripts
├── 🔧 BOT_SETUP.md       # Detailed Discord bot setup guide
└── 📖 README.md          # This comprehensive guide
```

## 🎯 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Discord account and server (for bot testing)
- Basic knowledge of Discord bot setup

### Installation
```bash
# Clone and install all dependencies
npm install --legacy-peer-deps

# Build the shared package (required first)
npm run build:shared
```

## 🛠️ Discord Bot Setup

### Step 1: Create Discord Application
1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section → "Add Bot"
4. Copy the **Bot Token** (keep it secret!)
5. Enable "Message Content Intent" if you plan to read message content

### Step 2: Generate Invite URL
1. Go to "OAuth2" → "URL Generator"
2. Select Scopes: `bot` + `applications.commands`
3. Select Bot Permissions:
   - Read Messages
   - Read Message History
   - Send Messages
   - Use Slash Commands
4. Copy the generated URL and invite bot to your server

For detailed setup instructions, see **BOT_SETUP.md**

## ⚙️ Environment Configuration
Create environment files with your Discord bot credentials:

**`bot/.env`**
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_client_id_here
API_BASE_URL=http://localhost:3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**`backend/.env`**
```env
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/archive.db
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_KEY=dev_api_key_123
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🚀 Running the Application

### Start All Services (Recommended)
```bash
npm run dev
```
This starts all three services concurrently.

### Or Start Services Individually
```bash
# Terminal 1 - Backend (http://localhost:3001)
npm run dev:backend

# Terminal 2 - Discord Bot
npm run dev:bot

# Terminal 3 - Frontend (http://localhost:3000)  
npm run dev:frontend
```

### First Run Checklist
- ✅ Backend starts and creates SQLite database
- ✅ Discord bot connects and registers slash commands  
- ✅ Frontend loads at http://localhost:3000
- ✅ Test `/archive` command in your Discord server

## � How to Use

### Discord Bot Commands

**Archive Last Message in Channel**
```
/archive
```
Posts a "caught in 4K" GIF, archives the last message, then removes the GIF.

**Archive Specific Message by URL**
```
/archive message_url: https://discord.com/channels/123.../456.../789...
```
Right-click any Discord message → "Copy Message Link" → paste in command.

### Web Interface Features

**🏠 Homepage** - `http://localhost:3000`
- Browse all archived messages in a clean, modern interface
- Material Design dark theme with gold accents
- Responsive design works on all devices

**🔍 Smart Filtering**
- **Server Dropdown**: Filter by Discord server
- **Channel Dropdown**: Cascades based on selected server
- **Real-time Updates**: Filters update instantly with database data

**📋 Message Management** 
- **Sorting**: Toggle between newest/oldest first
- **Rich Display**: See attachments, embeds, reactions, and timestamps
- **Delete**: Remove archived messages you no longer need
- **Message Links**: Direct links back to original Discord messages

**🔎 Search & Navigation**
- Search messages by content
- Pagination for large collections
- Message metadata display (author, timestamps, etc.)

## �️ Development Guide

### Available Scripts

**Workspace Commands**
```bash
npm run dev              # 🚀 Start all services (recommended)
npm run build            # 📦 Build all packages  
npm run build:shared     # 📦 Build shared package only
npm install              # 📥 Install all dependencies
```

**Individual Service Commands**
```bash
npm run dev:frontend     # 🎨 React app (http://localhost:3000)
npm run dev:backend      # 🚀 Express API (http://localhost:3001)
npm run dev:bot          # 🤖 Discord bot service
```

### 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/messages` | Get paginated archived messages |
| `GET` | `/api/messages/:id` | Get specific message details |
| `POST` | `/api/messages/archive` | Archive a new Discord message |
| `DELETE` | `/api/messages/:id` | Delete archived message |
| `GET` | `/api/metadata/servers` | Get list of servers with messages |
| `GET` | `/api/metadata/channels` | Get channels for a server |
| `GET` | `/health` | API health check |

### 🗃️ Database Schema

**SQLite Development Database** (`backend/data/archive.db`)
- **ArchivedMessage**: Main message entity with content, metadata
- **MessageAttachment**: File attachments (images, documents, etc.)
- **MessageEmbed**: Rich embeds with titles, descriptions, media
- **MessageReaction**: Emoji reactions and counts
- **Auto-migrations**: Schema updates automatically in development

### 🏗️ Architecture

**Frontend** (React + TypeScript + Vite)
- Modern React with TypeScript
- SCSS styling with Material Design theme
- Vite for fast development and building
- Shared types for API compatibility

**Backend** (Node.js + Express + TypeORM)
- RESTful API with Express.js
- TypeORM for database management
- SQLite for development (easily configurable for PostgreSQL/MySQL)
- Comprehensive error handling and logging

**Bot** (Discord.js + TypeScript)
- Modern Discord.js v14 with slash commands
- Automatic command registration and deployment
- Integration with backend API for message archiving
- Fun "caught in 4K" GIF feature

**Shared Package** (TypeScript)
- Common types across all services
- Utility functions (formatting, validation)
- Dual CommonJS/ESM support for compatibility

## � Production Deployment

### Build for Production
```bash
# Build all services for production
npm run build

# Individual builds
npm run build:frontend    # Creates optimized static files in frontend/dist
npm run build:backend     # Compiles TypeScript to JavaScript  
npm run build:bot         # Compiles TypeScript to JavaScript
```

### Environment Setup
1. **Database**: Switch from SQLite to PostgreSQL/MySQL for production
2. **Environment Variables**: Update URLs, tokens, and API keys
3. **CORS**: Configure allowed origins for your production domain
4. **Rate Limiting**: Implement rate limiting for API endpoints

### Deployment Options
- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- **Backend**: Deploy to Railway, Render, Heroku, or VPS
- **Bot**: Run on VPS, Railway, or dedicated server
- **Database**: Use managed PostgreSQL (Supabase, Railway, etc.)

## 🔒 Security Considerations

- Keep Discord bot tokens secure and never commit to version control
- Use environment variables for all sensitive configuration
- Implement proper CORS policies for production
- Consider rate limiting and authentication for public deployments
- Regularly rotate API keys and tokens

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes and test thoroughly
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Add tests for new features
- Update documentation as needed
- Test Discord bot commands thoroughly

## 📊 Project Status

**Current Version**: 1.0.0

**✅ Completed Features**
- Discord bot with slash commands
- Material Design dark theme frontend  
- Smart filtering and message sorting
- Shared TypeScript package integration
- "Caught in 4K" GIF feature
- Full message archiving (content, attachments, embeds, reactions)

**🔮 Future Enhancements**
- User authentication system
- Real-time updates with WebSockets
- Export functionality (JSON, CSV, PDF)
- Message search with full-text indexing
- Advanced Discord bot commands
- Message analytics and statistics
- Bulk message operations

## � License

This project is open source and available under the **MIT License**.

---

## 🎉 Getting Started

Your Discord Archive System is ready to use! Here's your action plan:

### Immediate Steps
1. **🤖 Test the Bot**: Use `/archive` in your Discord server
2. **🎨 Explore the UI**: Visit http://localhost:3000 and browse messages
3. **🔍 Try Filtering**: Use the server/channel dropdowns to filter messages
4. **📱 Test Responsive**: Check the interface on different screen sizes

### Customization Ideas  
- **🎨 Styling**: Modify SCSS variables in `frontend/src/styles/main.scss`
- **🤖 Bot Features**: Add new slash commands in `bot/src/commands/`
- **📊 Analytics**: Add message statistics and charts
- **🔐 Auth**: Implement user accounts and permissions

### Need Help?
- Check **BOT_SETUP.md** for detailed Discord setup
- Review API documentation in this README
- Examine the TypeScript types in the `shared/` package
- Look at existing components for code patterns

**Happy archiving! 🚀📚**