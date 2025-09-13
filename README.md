# Pokemon AI Chatbot 🤖⚡

An AI-powered Pokemon chatbot built with React Native, Expo, and Anthropic's Claude API. Chat with an AI assistant that has extensive knowledge about Pokemon and can help you with Pokemon-related questions!

## Features

- 🤖 AI-powered conversations using Anthropic's Claude
- ⚡ Pokemon knowledge and assistance
- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Modern React Native UI
- 🔄 Real-time chat interface
- 🧪 Comprehensive test coverage

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An [Anthropic API key](https://console.anthropic.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RenanMomesso/pokemon_ai_chat.git
   cd pokemon_ai_chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Open `.env` and replace the placeholder with your actual Anthropic API key:
   ```env
   # Get your API key from: https://console.anthropic.com/
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
   NODE_ENV=development
   ```

   **⚠️ Important:** Never commit your actual API key to version control. The `.env` file is already in `.gitignore`.

## Getting Your Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## Running the App

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Choose your platform:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan the QR code with [Expo Go](https://expo.dev/go) app on your phone

## Building for Production

### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

4. **Set up environment variables for EAS**
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_ANTHROPIC_API_KEY --value your_api_key_here
   ```

5. **Build for Android**
   ```bash
   eas build --platform android
   ```

6. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
src/
├── app/                 # Expo Router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── services/           # API services (AI, Pokemon)
├── tools/              # AI tools and utilities
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Ensure you've copied `.env.example` to `.env`
   - Verify your API key is correctly set in the `.env` file
   - Make sure the variable name is exactly `EXPO_PUBLIC_ANTHROPIC_API_KEY`
