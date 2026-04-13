# 🌟 Aarna App Native

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 📖 About
**Aarna App** is an interactive, magical educational and storytelling application built specifically for children. Migrated from a React Web application to a fully native Android and iOS experience, it brings a variety of mythological, historical, and moral stories as well as poems and fun games to your fingertips. 

It features dynamic dual-language capabilities, a complete voice-over text-to-speech option (in both English and Telugu), and personalized storytelling templates to make reading fun, engaging, and highly personalized for kids and parents!

## ✨ Features
* **Personalized Experience**: Collects kid's and parents' names locally to dynamically insert them into the storytelling narratives.
* **Vibrant Categorization**: Explore extensive story categories such as Mythology, Epics (Mahabharata, Ramayana), Moral Fables, and Animal Stories.
* **Interactive Story Viewer**: Full-screen story slider that synchronously maps illustrations with bilingual text blocks.
* **Text-to-Speech (TTS) Narrator**: Features a built-in "Read to Me" functionality utilizing Native TTS engines to read the story in Telugu first, followed by English.
* **Offline-Ready Profiles**: Utilizing local device storage to ensure you only set up your magic journey once.

## 🛠️ Tech Stack
* **Core Framework**: [React Native](https://reactnative.dev/) (v0.84)
* **Navigation**: [React Navigation](https://reactnavigation.org/) (Stack Navigator v7)
* **Backend Cloud**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
* **Local Storage**: `@react-native-async-storage/async-storage` for preserving profile configurations across app executions.
* **Sensory & Visuals**:
  * `react-native-tts`: For native text-to-speech generation.
  * `react-native-linear-gradient`: Providing rich, colorful Tailwind-inspired backgrounds matching the original web app.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have your environment set up for React Native CLI development. Refer to the [official React Native docs](https://reactnative.dev/docs/set-up-your-environment) for installing dependencies (Node, JDK, Android Studio, Xcode, etc.).

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-username/AarnaAppNative.git
   cd AarnaAppNative
   ```

2. **Install NPM packages**
   ```sh
   npm install
   ```

3. **Install CocoaPods (iOS only)**
   ```sh
   cd ios && pod install && cd ..
   ```

### Running the App

* **Start Metro Server:**
  ```sh
  npm start
  ```

* **Run on Android:**
  ```sh
  npm run android
  ```

* **Run on iOS:**
  ```sh
  npm run ios
  ```

> **Note on Text-to-Speech**: To properly test `react-native-tts`, ensure you are using a physical device or a simulator that has Voice/Language packs installed (specifically English and Telugu packages) for the best experience.

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
