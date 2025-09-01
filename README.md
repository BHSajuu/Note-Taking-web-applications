Note Taking Web Application
A modern, full-stack note-taking application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. This application provides a seamless and secure platform for users to create, manage, and edit their notes with a rich, intuitive interface. It features robust user authentication, a dynamic and responsive layout, and an AI-powered assistant to enhance the note-taking experience.
▶️ View Live Demo
✨ Features
Secure User Authentication:
Sign up and log in using Email and OTP.
Seamless one-click sign-up and login with a Google Account (OAuth 2.0).
All user actions are protected using JSON Web Tokens (JWT) for secure API communication.
Dynamic Note Management:
A beautiful, welcoming dashboard to view all your notes at a glance.
Create, read, update, and delete (CRUD) notes with ease.
Rich Text Editor:
Powered by TinyMCE, the editor allows for advanced text formatting including font families, font sizes, lists, colors, and more.
Responsive Two-Column Editor Layout:
Clicking "Create Note" or an existing note transitions to a dedicated editor view.
A persistent sidebar lists all notes for quick navigation between them.
The title of the note can be edited directly within the sidebar.
Fully responsive design with a collapsible sidebar for an optimal experience on mobile devices.
AI-Powered Assistant:
An integrated AI assistant to help summarize long notes, correct grammar, or generate ideas directly within the editor.
Professional & Modern UI:
Built with Tailwind CSS for a clean, utility-first design.
Uses lucide-react for crisp and clear icons.
Thoughtful loading states and user feedback for a smooth user experience.
🛠️ Technology Stack
This project is a monorepo containing both the frontend and backend code.


Category
Technology / Library
Frontend
React (Vite), TypeScript, Tailwind CSS, React Router, Axios, TinyMCE, Lucide-React
Backend
Node.js, Express.js, TypeScript
Database
MongoDB (with Mongoose)
Authentication
JWT, Passport.js (Google OAuth 2.0), Bcrypt.js, Nodemailer (for OTP)
AI Integration
Google Generative AI (Gemini)
Deployment
Frontend: Vercel, Backend: Render, Database: MongoDB Atlas
Version Control
Git & GitHub

🚀 Getting Started
To run this project locally, follow these steps:
Prerequisites
Node.js (v18 or later recommended)
npm or yarn
Git
A MongoDB Atlas account or a local MongoDB instance.
A Google Cloud Platform account for OAuth credentials.
A TinyMCE account for the rich text editor API key.
A Google AI API Key for the AI assistant.
1. Clone the Repository
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name


2. Backend Setup
# Navigate to the backend folder
cd Backend

# Install dependencies
npm install

# Create a .env file in the Backend directory and add the following variables:
MONGO_URI="your_mongodb_connection_string"
PORT=5001
JWT_SECRET="your_jwt_secret"
CLIENT_URL="http://localhost:5173"

# For Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# For Nodemailer (OTP emails)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"

# For AI Assistant
GEMINI_API_KEY="your_google_ai_api_key"

# Start the backend development server
npm run dev


3. Frontend Setup
# Navigate to the frontend folder from the root directory
cd Frontend

# Install dependencies
npm install

# Create a .env.local file in the Frontend directory and add the following:
VITE_API_URL="http://localhost:5001"
VITE_TINYMCE_API_KEY="your_tinymce_api_key"

# Start the frontend development server
npm run dev


Your application should now be running!
Frontend: http://localhost:5173
Backend: http://localhost:5001
Screenshots
(Optional but highly recommended: Add screenshots of your application here. For example: Login Page, Dashboard, Editor View)
Login Page
Dashboard





Acknowledgements
This project was built as part of an assignment and showcases a wide range of full-stack development skills.
