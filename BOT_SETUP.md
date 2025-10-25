# Discord Bot Setup Instructions

## 🤖 Bot Invite Link

Use Your Generated Bot link to invite your bot to Discord servers with the correct permissions:

### What this includes:
- **Scopes**: `bot` + `applications.commands` (required for slash commands)
- **Permissions**: 
  - View Channels (1024)
  - Send Messages (2048) 
  - Read Message History (65536)
  - Use Slash Commands (built-in with applications.commands scope)

## 🔧 If Commands Still Don't Appear

### Option 1: Wait (Recommended)
- Global slash commands can take up to 1 hour to appear
- Server-specific commands appear immediately

### Option 2: Force Refresh Discord
1. Close Discord completely
2. Restart Discord
3. Check your server again

### Option 3: Re-register Commands as Guild-Specific
If you want instant command registration, we can modify the bot to register commands for your specific server instead of globally.

## 🔍 Check Bot Status
- ✅ Bot is online as "{BotName#1234}"
- ✅ Commands successfully registered
- ✅ Bot is connected to Discord

## 📝 Next Steps
1. Use the invite link above to add the bot to your server
2. Wait a few minutes for commands to appear
3. Type `/` in your Discord server to see available commands
4. Look for `/archive` in the command list