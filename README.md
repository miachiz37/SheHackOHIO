# HackOHI/O – Team She++
PantryPal Prototype

Contributors
Harker LeCroy – Firebase integration, full-stack developer
Mia Chizever – Frontend setup
Dani Bolton - AI and data modeling
Andi Stewart - Backend setup

PantryPal is a prototype developed for HackOHI/O -- a 24-hour hackathon at Ohio state (10/25/25 and 10/26/25). PantryPal is an AI tool that allows users to have user preferences saved from a one time signup. After that, at any time users can input ingredients they currently possess, and PantryPal will output recipes they can make with said ingredients that align with there food preferences and goals, as well as learning user likes and dislikes.   

This project demonstrates a full-stack application built with React, Node.js, Firebase, and Express.

---

## Overview

The prototype includes a frontend built with React (Vite, Zustand, and TailwindCSS v4) and a backend powered by Node.js, Express, and Firebase Admin SDK.

---

## Tech Stack

**Frontend**
- React + Vite
- Zustand (global state management)
- Firebase Authentication and Firestore
- TailwindCSS v4 for styling
- Sonner (notifications)

**Backend**
- Node.js / Express
- Firebase Admin SDK
- dotenv for environment configuration
- CORS-enabled REST API

---

## Project Structure
SheHackOHIO/
├── Frontend/ # React + Vite application
│ ├── src/
│ │ ├── pages/ # Login, Onboarding, Plan, etc.
│ │ ├── store/ # Zustand global store
│ │ ├── firebasebackend/ # Firebase client configuration
│ │ └── index.css # TailwindCSS + custom theme
│ └── vite.config.js
│
├── Backend/ # Express + Firebase Admin API
│ ├── server/
│ │ ├── index.js # Main server entry point
│ │ └── firebaseAdmin.js # Admin SDK setup
│ ├── .env # Environment variables (not tracked)
│ └── package.json
│
└── README.md

## Local Setup

1. Clone the repository
```bash
git clone https://github.com/miachiz37/SheHackOHIO.git
cd SheHackOHIO

2. Install dependencies

Install separately for the backend and frontend:
cd Backend && npm install
cd ../Frontend && npm install

3. Configure environment variables

Create a .env file inside Backend/:
PORT=8080
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOURKEYDATA\n-----END PRIVATE KEY-----\n"

4. Run the backend
cd Backend
npm run dev
//Expected output:
Firebase Admin initialized
Server listening on port 8080

5. Run the frontend
cd Frontend
npm run dev

Then open http://localhost:5173
 in your browser.


## Current features
- User authentication with Firebase
- User profile creation through backend /api/users
- Pantry and dietary preference management via Zustand store
- Basic recipe recommendations based on pantry items and preferences
- TailwindCSS v4 custom theme and responsive layout

##Future Improvements
- Enhance UI design and responsiveness
- Implement cloud deployment (Vercel + Render)
- Improve communication with AI features and rest of project
