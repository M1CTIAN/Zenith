# ✨ Zenith Discord Bot

Zenith is an AI-powered Discord bot that provides intelligent responses to user questions, translates text between languages, and can generate images from text descriptions.

![Zenith Bot Logo](https://cdn.discordapp.com/attachments/1337794530493071481/1345651768679333889/DALLE_2025-03-01_18.57.14_-_A_creative_and_mature_logo_for_a_Discord_bot_named_Zenith_featuring_an_abstract_futuristic_design_inspired_by_the_concept_of_a_peak_or_summit._Inc.jpg?ex=67c5535e&is=67c401de&hm=3ebde091d4f8816a032e10571835698b5aac4612b4dae9a610fe2e5164208110&)

## 🌟 Features

- 🧠 **AI Conversations**: Ask Zenith questions and receive thoughtful responses powered by advanced language models
- 🌐 **Translation**: Translate text between multiple languages with natural-sounding results
- 🎨 **Image Generation**: Create images from text descriptions using stable diffusion models
- 🔧 **Slash Commands**: Easy-to-use Discord slash commands
- 📐 **Math Support**: Properly formatted LaTeX rendering for mathematical expressions

## 🚀 Setup

### 📋 Prerequisites

- Node.js v16.9.0 or higher
- A Discord account and a registered application/bot
- A Hugging Face account with API key

### 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/M1CTIAN/zenith-discord-bot.git
   cd zenith-discord-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a [`.env`](.env) file** in the root directory with:

   ```env
   DISCORD_TOKEN=your_discord_bot_token
   HF_API_KEY=your_huggingface_api_key
   HF_API_ENDPOINT=https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
   HF_IMAGE_API_ENDPOINT=https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0
   TEST_GUILD_ID=your_discord_server_id_for_testing
   ```

4. **Start the bot**
   ```bash
   node index.js
   ```

### 🔗 Adding the Bot to Your Server

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to the "OAuth2" tab
4. In "OAuth2 URL Generator", select the following scopes:
   - `bot`
   - `applications.commands`
5. Select these bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Use Slash Commands
   - Read Message History
6. Copy the generated URL and open it in your browser
7. Select the server where you want to add the bot

## 🎮 Usage

Zenith uses slash commands for all interactions:

| Command                               | Description                                       |
| ------------------------------------- | ------------------------------------------------- |
| `/ask <question>`                     | Ask Zenith a question                             |
| `/translate <text> <target> [source]` | Translate text between languages                  |
| `/image <prompt>`                     | Generate an image based on the text description   |
| `/help`                               | Display help information about available commands |

### Translation Example

The translation feature supports 12 languages including English, Spanish, French, German, Chinese, Japanese, and more. The source language can be auto-detected if not specified.

```
/translate text:Hello, how are you? target:Spanish
```

## 📁 Project Structure

```
/Zenith
  /commands      # Slash command handlers
    - ask.js
    - help.js
    - image.js
    - translate.js
  /events        # Discord event handlers
    - interactionCreate.js
    - ready.js
  /services      # External services
    - ai.js      # AI text generation, image generation, translation
    - express.js # Web server
  /utils         # Helper functions
    - helpers.js # Message splitting, formatting
  index.js       # Main entry point
  package.json   # Dependencies
  .env           # Environment variables
```

## 🌐 Deployment

### 🔄 Render

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Add your environment variables in the Render dashboard

### 🚂 Railway

1. Push your code to a GitHub repository
2. Create a new project on Railway
3. Connect your GitHub repository
4. Add your environment variables in the Railway dashboard

## ❓ Troubleshooting

| Issue                      | Solution                                                   |
| -------------------------- | ---------------------------------------------------------- |
| 🚫 **Command not found**   | Make sure you've properly registered slash commands        |
| 🤖 **AI not responding**   | Check your Hugging Face API key and endpoint               |
| ⏱️ **Long response times** | The AI model may be loading, especially on first use       |
| 🌐 **Translation issues**  | Try specifying both source and target languages explicitly |

## 👏 Credits

- 🤗 Powered by [Hugging Face](https://huggingface.co/) AI models
- 🎭 Built with [Discord.js](https://discord.js.org/)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <i>Star ⭐ this repository if you found it useful!</i>
</div>
