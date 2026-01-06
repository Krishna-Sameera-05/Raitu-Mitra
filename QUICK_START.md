# 🚀 Quick Start Guide - AgriConnect with MongoDB

## ✅ What's Been Set Up

Your AgriConnect application now has a **complete MongoDB backend** for authentication!

### Features Implemented:
- ✅ MongoDB Atlas database connection
- ✅ User signup and login for all 3 roles (Farmer, Landowner, Admin)
- ✅ Secure password hashing
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Session persistence

## 🎯 Running the Application

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: ac-9ayiobard-00-01.h7xadtq.mongodb.net
📦 Database: agriconnect
🚀 Server running on port 5000
```

**Keep this terminal running!**

### Step 2: Start the Frontend (New Terminal)

Open a **new terminal** and run:

```bash
npm run dev
```

You should see:
```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 3: Open the Application

Open your browser and go to: **http://localhost:5173**

## 📝 How to Use

### Creating a New Account

1. Click on your desired role (Farmer, Landowner, or Admin)
2. Click "Sign up for free" at the bottom
3. Fill in:
   - Full Name
   - Email
   - Password (minimum 6 characters)
4. Click "Sign In" (it will create your account)
5. You'll be logged in automatically!

### Logging In

1. Click on your role
2. Enter your email and password
3. Click "Sign In"
4. Access your dashboard!

### Important Notes

- **Each role has separate authentication**
- You can create different accounts for different roles
- Passwords are securely hashed in the database
- Sessions persist even after closing the browser
- Click "Logout" to sign out

## 🔐 Test Accounts

You can create test accounts like:

**Farmer:**
- Email: `farmer@test.com`
- Password: `password123`

**Landowner:**
- Email: `landowner@test.com`
- Password: `password123`

**Admin:**
- Email: `admin@test.com`
- Password: `password123`

## 🗄️ Database Information

- **Database**: MongoDB Atlas
- **Database Name**: `agriconnect`
- **Collection**: `users`
- **Connection**: Already configured and working!

## 📊 What Happens Behind the Scenes

### When you sign up:
1. Frontend sends your data to backend
2. Backend hashes your password
3. User is saved to MongoDB
4. JWT token is generated
5. Token is stored in your browser
6. You're logged in!

### When you log in:
1. Frontend sends credentials to backend
2. Backend finds your user in MongoDB
3. Password is verified
4. JWT token is generated
5. You're authenticated!

## 🛠️ Troubleshooting

### "Cannot connect to backend"
- Make sure the backend server is running (Step 1)
- Check that it's running on port 5000

### "User already exists"
- This email is already registered
- Try logging in instead
- Or use a different email

### "Invalid credentials"
- Check your email and password
- Make sure you're using the correct role

### Backend won't start
- Make sure you're in the `server` directory
- Run `npm install` first
- Check if port 5000 is available

## 📁 Project Structure

```
project/
├── server/              ← Backend (MongoDB + Express)
│   ├── config/         ← Database connection
│   ├── models/         ← User schema
│   ├── routes/         ← API endpoints
│   └── index.js        ← Main server file
│
└── src/                ← Frontend (React + Vite)
    ├── components/     ← UI components
    ├── lib/           ← API service
    └── App.tsx        ← Main app
```

## ✨ Next Steps

Now that authentication is working, you can:

1. **Add more features to each dashboard**
   - Land listings for farmers
   - Property management for landowners
   - Admin controls

2. **Enhance the UI**
   - Add profile pages
   - Create settings pages
   - Build notification systems

3. **Extend the backend**
   - Add more API endpoints
   - Create data models for lands, requests, etc.
   - Implement search and filtering

## 🎉 You're All Set!

Your AgriConnect application is now running with:
- ✅ MongoDB database
- ✅ Secure authentication
- ✅ Role-based access
- ✅ Modern React frontend
- ✅ RESTful API backend

**Happy coding!** 🚀
