# 🚀 Launchpad

**Launch Your Ideas. Discover the Future.**

Launchpad is a modern, full-stack platform designed for developers to showcase their projects, find inspiration, and connect with a community of creators. Whether you're building the next big thing or looking for your next collaborator, Launchpad provides the tools to put your work in the spotlight.

---

## ✨ Features

- **🔐 Secure Authentication**: Robust user sign-up and sign-in powered by JWT and Bcrypt.
- **📱 Responsive UI**: A premium, modern interface built with Tailwind CSS 4 and Shadcn/UI.
- **📂 Project Management**: Full CRUD capabilities for showcasing your projects with titles, descriptions, tech stacks, and links.
- **🔍 Discovery Hub**: Explore a trending section of projects from the global community.
- **👤 Developer Profiles**: Dedicated profile pages showcasing all projects built by a developer.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Launchpad.git
cd Launchpad
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run the frontend:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```text
Launchpad/
├── backend/            # Express server, MongoDB models, and routes
│   ├── controllers/    # Business logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── middlewares/    # Custom Express middlewares
├── frontend/           # Vite + React 19 application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth and State management
│   │   ├── pages/      # Route pages
│   │   └── lib/        # API utilities and helpers
└── README.md           # You are here!
```

---

## 🛣️ Roadmap

- [ ] **Comments Section**: Interactive feedback loops for every project.
- [ ] **User Notifications**: Get notified when someone interacts with your project.
- [ ] **Dark Mode Support**: Seamless transition between light and dark themes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
