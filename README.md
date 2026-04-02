# 🎬 SCSDB — Smart Cinema Search Database

<p align="center">
  <b>A modern, high-performance movie discovery web app built with React, Vite, and TMDB API</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Vite-Fast-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-Modern-teal?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/API-TMDB-green" />
</p>

---

## 🚀 Overview

**SCSDB (Smart Cinema Search Database)** is a sleek and responsive movie web application designed to deliver a seamless browsing experience. Users can explore trending, popular, and top-rated movies with real-time data, smooth animations, and an intuitive UI.

---

## ✨ Key Features

* 🔥 Real-time **Trending Movies**
* ⭐ Explore **Popular & Top Rated** content
* 🎬 Detailed **Movie Information Pages**
* ▶️ Integrated **Trailer Playback**
* 🔍 Smart **Search Functionality**
* ♾️ **Infinite Scrolling** for continuous browsing
* 🎨 Clean & modern UI using Tailwind CSS
* ⚡ Lightning-fast performance with Vite
* 🎞️ Smooth animations using GSAP & Framer Motion

---

## 🛠️ Tech Stack

| Category    | Technology Used     |
| ----------- | ------------------- |
| Frontend    | React.js (Vite)     |
| Styling     | Tailwind CSS        |
| State Mgmt  | Redux Toolkit       |
| API         | TMDB API            |
| HTTP Client | Axios               |
| Routing     | React Router DOM    |
| Animations  | GSAP, Framer Motion |

---

## 📁 Project Architecture

```
SCSDB/
├── public/
│   ├── favicon.svg
│   └── assets
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── templates/
│   │   └── Home.jsx
│   ├── utils/
│   │   └── Axios.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/scsdb.git
cd scsdb
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure API Key

* Visit: https://www.themoviedb.org/
* Generate your **Bearer Token**

Update in:

```
src/utils/Axios.jsx
```

```javascript
Authorization: "Bearer YOUR_TMDB_API_KEY"
```

---

### 4️⃣ Run Development Server

```bash
npm run dev
```

🌐 Open in browser:

```
http://localhost:5173
```

---

## 📸 Preview

> 🚧 Add screenshots or demo GIFs here for better presentation

---

## 🌟 Roadmap / Future Enhancements

* 🔐 User Authentication (Login/Register)
* ❤️ Watchlist & Favorites System
* 📱 Fully Responsive Mobile Optimization
* 🌍 Multi-language Support
* 🤖 AI-based Movie Recommendations
* 📊 User Dashboard & Analytics

---

## 🤝 Contribution Guidelines

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — free to use and modify.

---

## 👨‍💻 Author

**Om Jaiswal**
🎓 BCA Student | 💻 Frontend Developer 

---

## ⭐ Support

If you found this project helpful:

👉 Give it a **star ⭐ on GitHub**
👉 Share it with others

---

<p align="center">
  🚀 Built with passion & modern web technologies
</p>
