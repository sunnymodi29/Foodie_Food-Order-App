# 🍽️ Foodie - Food Ordering Web App

A full-stack food ordering web application built with **React** (frontend), **Express.js** (backend), **Neon** (PostgreSQL database), and deployed using **Render**. Users can explore delicious meals, place orders, manage their profile, and enjoy a seamless food ordering experience.

## 🌐 Live Demo

[🔗 Visit the App](https://foodie-food-order-app.vercel.app)

---

## 🛠️ Tech Stack

### Frontend:
- **React**
- **React Router**
- **Fetch API** for HTTP requests
- **Context API**

### Backend:
- **Express.js**
- **Node.js**
- **RESTful API**

### Database:
- **Neon (PostgreSQL)**

### Deployment:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon

---

## 📦 Features

- 🍱 Browse and search food items
- 🛒 Add to cart and place orders
- 🔐 User authentication (login/signup)
- 🧾 Order history and tracking
- 👤 Profile management with address storage
- ⚙️ Admin panel for adding/updating food items

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/foodie-food-order-app.git
cd foodie-food-order-app

# Set up the frontend
npm install
npm run dev

# Open a new terminal, then set up the backend
cd backend
npm install
npm start

# Create a .env file inside the backend directory and add the following:
DATABASE_URL=your_neon_postgres_url
GROQ_API_KEY=your_groq_ai_api_url
