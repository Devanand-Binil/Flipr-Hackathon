# 📘 Flipr-Hackathon-FE

Frontend repository for the Flipr Hackathon project.

This project is a modern React-based web application that serves as the frontend for the Flipr Hackathon platform. It integrates with the backend (Flipr-Hackathon-BE) and offers seamless user experience and authentication powered by Clerk.

---

## 🚀 Getting Started

### 📦 Prerequisites

Make sure you have the following installed:

* **Node.js** (v18+ recommended)
* **npm** (v9+ recommended)
* **Git**

### 📂 Clone the Repository

```bash
git clone https://github.com/Devanand-Binil/Flipr-Hackathon-FE.git
cd Flipr-Hackathon-FE
```

### 📁 Environment Setup

Create a `.env` file in the root directory and configure it with the appropriate values:

```bash
# Clerk Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

> ℹ️ Make sure these values match the environment of your backend and Clerk project settings.

### 📦 Install Dependencies

```bash
npm install
```

### 🧪 Development Mode

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

---

## 📁 Project Structure

```
Flipr-Hackathon-FE
├── src
│   ├── components         # Reusable UI components
│   ├── hooks              # Custom React hooks
│   ├── pages              # Route-based components
│   ├── router             # Route guards and setup
│   ├── lib                # Helper utilities (e.g., env.ts)
│   └── styles             # Tailwind or CSS files
├── public                 # Static files
├── .env                  # Environment variables
├── vite.config.ts        # Vite configuration
└── package.json
```

---

## 🔐 Authentication

This project uses [Clerk.dev](https://clerk.dev) for authentication. Ensure you’ve set up your Clerk project and used the correct publishable key in the `.env` file.

---

## 💡 Contributing

We welcome contributions to improve and extend this project.

### 🧪 Add a New Feature

1. **Create a new branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit**:

   ```bash
   git add .
   git commit -m "✨ Add your feature"
   ```

3. **Push to GitHub**:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** on GitHub from your feature branch to `main`.

---

## 🛠️ Scripts

```bash
npm run dev       # Start development server
npm run build     # Build the production version
npm run preview   # Preview the production build
```

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 🌐 Related Projects

* [Flipr-Hackathon-BE](https://github.com/Devanand-Binil/Flipr-Hackathon-BE) — Backend API for this frontend project

---

