# 🛍️ Shopper – MERN Stack E-commerce Website

Shopper is a full-featured e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes user authentication, product management, admin controls, cart functionality, and an order system — designed as a learning project to understand full-stack development.

## 🚀 Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Forgot password with email verification via Nodemailer

### 🛒 Shopping Experience (Frontend)
- View all products
- Product detail page
- Add/remove items from cart
- Update item quantity
- Cart saved in both MongoDB and localStorage

### 📦 Order Management
- Place orders
- Order summary including product details, quantity, and total amount
- Orders saved in MongoDB with status tracking

### 🖼️ Image Upload
- Product image uploads via Multer

### 📬 Newsletter Subscription
- Subscribe to newsletter (protected route)

## 🧑‍💼 Admin Panel
- Admin login
- Add new products with images and details
- View product list and manage inventory

## 📁 Project Structure

The project consists of three main parts:

- `frontend/` – User-facing React app for browsing products, cart, and placing orders  
- `backend/` – Node.js + Express backend with MongoDB for managing users, products, orders, and emails  
- `admin/` – Separate React app for admins to log in and manage product listings  

## ⚙️ Tech Stack

- **Frontend & Admin**: React.js, Fetch, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Email Services**: Nodemailer

## 🧠 Learning Goals

This project was built to:
- Practice full-stack development with the MERN stack
- Implement user and admin roles with authentication
- Manage frontend/backend interactions in an e-commerce flow
- Handle image uploads and email notifications

## 📩 Contact

Feel free to reach out if you have suggestions or want to collaborate!

**Developer**: Tejas Birla  
**Email**: [tejasbirla3@gmail.com]
---
