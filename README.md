# Note Taking Web Application

A modern, full-stack note-taking application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. This application provides a seamless and secure platform for users to create, manage, and edit their notes with a rich, intuitive interface. It features robust user authentication, a dynamic and responsive layout, and an AI-powered assistant to enhance the note-taking experience.

 **Live demo:** https://note-taking-web-applications.vercel.app/ <br>
                Backend deploy in Render so wait render to start :- https://note-app-server-4lej.onrender.com/ 

## Features
- **Secure authentication**
  - Sign up and log in using Email and OTP.
  - Seamless one-click sign-up and login with a Google Account (OAuth 2.0).
  - All user actions are protected using JSON Web Tokens (JWT) for secure API communication.

- **Dynamic note management**
  - A beautiful, welcoming dashboard to view all your notes at a glance
  - Create, read, update, and delete (CRUD) notes with ease.

- **Rich text editor**
  - Powered by TinyMCE, the editor allows for advanced text formatting including font families, font sizes, lists, colors, and more.

- **Responsive two-column editor**
  - Clicking "Create Note" or an existing note transitions to a dedicated editor view.
  - A persistent sidebar lists all notes for quick navigation between them.
  - Fully responsive design with a collapsible sidebar for an optimal experience on mobile devices.
    
- **AI-powered assistant**
  - An integrated AI assistant to help summarize long notes, correct grammar, or generate ideas directly within the editor.


## Technology Stack
This project is a monorepo containing both the frontend and backend code.

| Category       | Technology / Library                                                                 |
|----------------|---------------------------------------------------------------------------------------|
| Frontend       | React (Vite), TypeScript, Tailwind CSS, React Router, Axios, TinyMCE, lucide-react   |
| Backend        | Node.js, Express.js, TypeScript                                                       |
| Database       | MongoDB (Mongoose)                                                                    |
| Authentication | JWT, Passport.js (Google OAuth 2.0), Bcrypt.js, Nodemailer (OTP)                     |
| AI Integration | Google Generative AI (Gemini)                                                         |
| Deployment     | Frontend: Vercel, Backend: Render, DB: MongoDB Atlas                                  |
| Version Control| Git & GitHub                                                                          |



## Project Structure
    repo-root/
    ├─ Frontend/ # Vite + React + TS app (TinyMCE, Tailwind, Router, Axios)
    ├─ Backend/ # Express + TS API (JWT, OAuth, OTP email)
    └─ README.md

## Installation

### 1) Clone the repository
```bash
git clone https://github.com/BHSajuu/Note-Taking-web-applications
cd Note-Taking-web-applications

# Backend Setup
cd Backend

# install deps
npm install

# start backend (dev)
npm run dev

# Backend .env template
  MONGO_URI="your_mongodb_connection_string"
  PORT=5001
  JWT_SECRET="your_jwt_secret"
  CLIENT_URL="http://localhost:5173"
  
  # Google OAuth
  GOOGLE_CLIENT_ID="your_google_client_id"
  GOOGLE_CLIENT_SECRET="your_google_client_secret"


  # Nodemailer (OTP emails)
  EMAIL_USER="your_email@gmail.com"
  EMAIL_PASS="your_gmail_app_password"
  
  # AI Assistant
  GEMINI_API_KEY="your_google_ai_api_key"


# Frontend Setup
  cd Frontend
  
  # install deps
  npm install
  
  # start frontend (dev)
  npm run dev

#Frontend .env.local template
   VITE_TINYMCE_API_KEY="your_tinymce_api_key"

```

## Acknowledgements
This project was built as part of an assignment and showcases a wide range of full-stack development skills.

