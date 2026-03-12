# 🍽️ Foodie - Food Ordering Web App

A full-stack food ordering web application built with **Next.js**, **PostgreSQL (Neon)**, and deployed on **Vercel**. Users can browse meals, place orders, manage their profile, and admins can manage the menu and orders through an admin dashboard.

The app uses **Next.js App Router** with **serverless API routes**, making it a modern full-stack React application with both frontend and backend in a single project.

---

## 🌐 Live Demo

🔗 **Visit the App:**
https://foodie-food-order-app.vercel.app

---

# 🛠️ Tech Stack

## Frontend

- **Next.js (App Router)**
- **React**
- **Context API**
- **Fetch API**
- **Custom Hooks**

## Backend

- **Next.js API Routes**
- **Node.js Runtime**
- **Serverless Functions**

## Database

- **PostgreSQL**
- **Neon Serverless Database**

## Authentication & Security

- **bcrypt** (password hashing)
- **Crypto (Node.js)** for secure token generation
- **Reset password via secure email token**

## Email Service

- **Nodemailer** for sending password reset emails

## AI Integration

- **Groq API** for generating AI-based meal descriptions for admins

## Deployment

- **Vercel** – Full stack deployment (frontend + backend)
- **Neon** – PostgreSQL database hosting

---

# 📦 Features

## User Features

- 🍱 Browse and explore meals
- 🛒 Add meals to cart
- 📦 Place food orders
- 📜 View complete order history
- 👤 Manage profile and addresses
- 🔐 Secure authentication (Signup/Login)
- 🔑 Forgot password with email reset link

## Admin Features

- 📊 Admin dashboard with analytics
- 🍔 Add new meals
- ✏️ Edit existing meals
- 🗑️ Delete meals
- 📦 Manage customer orders
- 🤖 Generate meal descriptions using AI

---

# 🚀 Getting Started

## 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/foodie-food-order-app.git
cd foodie-food-order-app
```

---

## 2️⃣ Install dependencies

```bash
npm install
```

---

## 3️⃣ Setup environment variables

Create a **`.env`** file in the root directory.

Example:

```env
DATABASE_URL=your_neon_postgres_connection_string

SMTP_HOST=smtp.gmail.com
SMTP_PORT=2525
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL=your_email@gmail.com

NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

GROQ_API_KEY=your_groq_api_key
```

---

## 4️⃣ Run the development server

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

# 📁 Project Structure

```
src
 ├── app
 │   ├── api
 │   │   ├── meals
 │   │   ├── orders
 │   │   │   └── user/[userid]
 │   │   ├── auth
 │   │   └── ai
 │   ├── admin
 │   ├── orders
 │   ├── profile
 │   └── reset-password/[token]
 │
 ├── components
 ├── hooks
 ├── store
 ├── util
 └── lib
```

---

# 🔐 Authentication Flow

1. User signs up or logs in
2. Passwords are securely hashed using **bcrypt**
3. Authentication state is managed via **Context API**
4. Forgot password flow:
   - User requests reset link
   - Secure token generated using **crypto**
   - Email sent via **Nodemailer**
   - Token validated before password reset

---

# 🧠 AI Integration

Admins can generate meal descriptions using **Groq AI API** directly from the admin dashboard.

This helps quickly create attractive menu descriptions.

---

# 🚀 Deployment

The app is deployed on:

- **Vercel** – Hosting frontend + serverless API routes
- **Neon** – PostgreSQL serverless database

Deployment is automatic via GitHub integration.

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed by **Sunny Modi**
