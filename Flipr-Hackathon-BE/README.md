# 🚀 Flipr-Hackathon-BE

A scalable and extensible **Node.js + Express** backend built for the **Flipr Hackathon**. This repository provides a structured and modular backend system designed to integrate with modern frontend applications and support full-stack deployment.

---

## 📆 Tech Stack

* **Node.js** + **Express**
* **MongoDB (Mongoose)** for database
* **dotenv** for environment configuration
* **CORS**, **Helmet** for security
* **Nodemon** for development
* Optional integrations: **JWT Auth**, and more

---

## ⚙️ Getting Started

Follow the steps below to clone and run the backend server locally.

### 1. 🚀 Clone the Repository

```bash
git clone https://github.com/Devanand-Binil/Flipr-Hackathon-BE.git
cd Flipr-Hackathon-BE
```

### 2. 📆 Install Dependencies

```bash
npm install
```

### 3. 🔐 Environment Setup

This project uses a `.env` file to manage environment-specific variables. A `.env` template is included in the repository.

**Steps:**

* Open the `.env` file in the root directory.
* Fill in the required values:

```env
NODE_ENV=development
PORT=5000
HOST=localhost
MONGO_URI=your-mongodb-uri
ALLOW_ALL_ORIGINS=false
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
LOG_LEVEL=debug
```

> 🔐 Never commit secrets like `JWT_SECRET` or `MONGO_URI` to a public repo.

---

### 4. 🚦 Run the Development Server

```bash
npx nodemon index.js
```

> The server should now be running on [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```bash
Flipr-Hackathon-BE/
️️️️
🗄 src/                 # Source code
🗄   🗄 routes/          # API route definitions
🗄   🗄 controllers/     # Route logic handlers
🗄   🗄 models/          # Mongoose models
🗄   🗄 config/          # Config files, env loaders
🗄   🗄 middleware/      # Custom middleware
️
📄 .env                 # Environment configuration
📄 index.js             # App entry point
📄 package.json         # Project manifest
📄 README.md            # You're here
```

---

## 🧪 Testing the API

You can test the endpoints using tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/).

Make sure your MongoDB URI and any external services like Piston API are properly configured.

---

## 🛠️ Contributing

We welcome community contributions! Follow the steps below to contribute a feature or bugfix:

### 🆕 Create a New Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 💻 Make Your Changes Locally

Make sure to follow the existing code structure and standards. Add clear comments and maintain consistency.

### ✅ Commit Your Changes

```bash
git add .
git commit -m "✨ Added new feature: <short description>"
```

### 🚀 Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 🔁 Open a Pull Request

1. Go to your forked repository on GitHub.
2. Click on `Compare & pull request`.
3. Fill in details and submit your PR for review.

> Make sure your PR has a meaningful title, a clear description, and passes all tests/lint checks.

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

*This project was built with ❤️ for the Flipr Hackathon.*
