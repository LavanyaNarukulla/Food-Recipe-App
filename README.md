# 🍲 Food Recipe App

## Project Description
Food Recipe App is a full-stack web application that helps users discover, create, manage, and save their favorite food recipes.

## Features
- User registration and login
- Browse and search recipes
- Filter recipes by category and difficulty
- View recipe details, ingredients, and cooking instructions
- Add new recipes
- Edit and delete your own recipes
- Save and manage favorite recipes
- Recipe images and cooking time
- User-specific recipe access

## Technologies Used

**Frontend**
- React
- Vite
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt

## Project Structure

```text
Food-Recipe-App/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── .gitignore
```

## Requirements
- Node.js and npm
- MongoDB running locally

## How to Run the Project

### 1. Start the Backend

Open Terminal and run:

```bash
cd Food-Recipe-App/backend
npm install
```

Create a `backend/.env` file containing:

```text
JWT_SECRET=your_private_random_secret
```

Replace the example value with your own private random secret. Never upload the `.env` file.

Start the backend:

```bash
node server.js
```

The backend runs at `http://localhost:5000`.

### 2. Start the Frontend

Open a second Terminal window and run:

```bash
cd Food-Recipe-App/frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## Database
The application uses MongoDB with a local database named `food_recipe_app`.

## Project Purpose
This project was developed as part of Full Stack Web Development to practice frontend development, backend APIs, database integration, and user authentication.

## Author
Food Recipe App Project
