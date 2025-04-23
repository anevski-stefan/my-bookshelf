# Book Management App

This is a Book Management application built with React, TypeScript, Vite, and Supabase, providing functionalities to add, update, delete, and visualize books data. This application also includes a dashboard to display visual data analytics.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Configuration](#api-configuration)
- [Components](#components)
- [License](#license)

## Features

- Add a new book with details such as title, author, genre, and status
- Update book details
- Delete a book
- Visualize books data using Chart.js (Books Read per Month, Genre Distribution, Books by Author, Books by Status)
- Responsive design with TailwindCSS
- Toast notifications for user feedback
- TypeScript support for better development experience

## Technologies

- React 18
- TypeScript
- Vite
- Supabase
- TailwindCSS
- React Router DOM
- Chart.js & React-Chartjs-2
- React Toastify
- GitHub Pages for deployment

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anevski-stefan/my-bookshelf.git
   cd my-bookshelf
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory with your Supabase credentials:**
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_ANON_KEY=your_supabase_anon_key
   ```

## Usage

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5173/
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

## Folder Structure

```plaintext
src/
│
├── components/
│   ├── App/
│   ├── BookCard/
│
├── pages/
│   ├── AddBook.tsx
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── Update.tsx
│
├── config/
│   └── supabaseClient.ts
│
├── main.tsx
└── index.css
```

## API Configuration

The application uses Supabase for backend operations. Make sure to configure your Supabase instance with a table named `books` and the following columns:

- `id` (primary key, UUID)
- `title` (text)
- `author` (text)
- `genre` (text)
- `status` (text)
- `created_at` (timestamp)

## Components

### Pages
- **Home.tsx:** The main page that lists all books
- **AddBook.tsx:** A page to add a new book
- **Update.tsx:** A page to update an existing book
- **Dashboard.tsx:** A page that displays various charts and graphs about the books data

### Components
- **BookCard:** A component to display book details and provide options to edit or delete the book
- **App:** The main application component that sets up the routes and layout

### Routes

- `/`: Home page that lists all books
- `/add`: Page to add a new book
- `/update/:id`: Page to update a book (where `id` is the book's ID)
- `/dashboard`: Dashboard page to display charts and graphs

## License

This project is open source and available under the MIT License.
