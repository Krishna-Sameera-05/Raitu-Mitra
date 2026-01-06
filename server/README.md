# AgriConnect Backend Server

Backend API server for AgriConnect with MongoDB authentication.

## Features

- ✅ MongoDB database connection
- ✅ User authentication (signup/login) for 3 roles:
  - Farmer
  - Landowner
  - Admin
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
The `.env` file is already configured with your MongoDB connection string.

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
  - Check if server is running

### Authentication

#### Signup
- **POST** `/api/auth/signup`
- Body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer"
}
```
- Roles: `farmer`, `landowner`, `admin`

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer"
}
```

#### Verify Token
- **GET** `/api/auth/verify`
- Headers:
```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### User Collection
```javascript
{
  fullName: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: String (enum: ['farmer', 'landowner', 'admin']),
  createdAt: Date
}
```

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Role-based authentication ensures users can only access their designated portal
- Input validation on all endpoints
- CORS configured for frontend (http://localhost:5173)

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## MongoDB Connection

The server connects to MongoDB Atlas using the connection string in `.env`:
```
mongodb+srv://Anits:JUSTcool$$HACKER++@cluster-1.h7xadtq.mongodb.net/agriconnect
```

Database name: `agriconnect`

## Testing the API

You can test the API using:
- Postman
- cURL
- Thunder Client (VS Code extension)
- The frontend application

Example cURL command:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Farmer",
    "email": "farmer@test.com",
    "password": "password123",
    "role": "farmer"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas IP whitelist includes your current IP
- Check if the connection string is correct in `.env`
- Ensure MongoDB Atlas cluster is running

### Port Already in Use
If port 5000 is already in use, change the PORT in `.env`:
```
PORT=5001
```

## Frontend Integration

The frontend is configured to connect to this backend at `http://localhost:5000/api`.

Make sure both servers are running:
1. Backend: `cd server && npm run dev` (port 5000)
2. Frontend: `npm run dev` (port 5173)
