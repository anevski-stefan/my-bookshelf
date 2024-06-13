# Book Management App

This is a Book Management application built with React and Supabase, providing functionalities to add, update, delete, and visualize books data. This application also includes a dashboard to display visual data analytics.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Configuration](#api-configuration)
- [Components](#components)
- [License](#license)

## Features

- Add a new book with details such as title, author, genre, and status.
- Update book details.
- Delete a book.
- Visualize books data using charts (Books Read per Month, Genre Distribution, Books by Author).

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
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Usage

1. **Start the development server:**

   ```bash
   npm start
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5173/
   ```

## Folder Structure

```plaintext
src/
│
├── components/
│   ├── BookCard.tsx
│
├── pages/
│   ├── AddBook.tsx
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── UpdateBook.tsx
│
├── config/
│   └── supabaseClient.ts
│
├── App.tsx
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

- **App.tsx:** The main application component that sets up the routes.
- **BookCard.tsx:** A component to display book details and provide options to edit or delete the book.
- **AddBook.tsx:** A page to add a new book.
- **UpdateBook.tsx:** A page to update an existing book.
- **Dashboard.tsx:** A page that displays various charts and graphs about the books data.
- **supabaseClient.ts:** Configuration file for Supabase client.

### Routes

- `/`: Home page that lists all books.
- `/add`: Page to add a new book.
- `/:id`: Page to update a book (where `id` is the book's ID).
- `/dashboard`: Dashboard page to display charts and graphs.
