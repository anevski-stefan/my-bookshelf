import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient.ts";
import BookCard from "../components/BookCard/BookCard.tsx";
import { Link } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  created_at: string;
  author: string;
  genre: string;
  status: string;
}

export default function Home() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", id)
        .select();

      if (error instanceof Error) {
        console.error("Error while deleting the book:", error.message);
        return;
      }

      setBooks((prevBooks) => {
        if (prevBooks) {
          return prevBooks.filter((book) => book.id !== id);
        }
        return prevBooks;
      });
    } catch (error) {
      console.error(
        "Deleting failed:",
        error instanceof Error ? error.message : "Error"
      );
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase.from("books").select();

        if (error) {
          setFetchError("Could not fetch the books!");
          setBooks(null);
          console.error("Supabase error:", error.message);
        } else {
          setBooks(data);
          setFetchError(null);
        }
      } catch (error) {
        if (error instanceof Error) {
          setFetchError("An error occurred while fetching the books!");
          console.error("Fetch error:", error.message);
        } else {
          setFetchError("An error occurred while fetching the books!");
          console.error("Fetch error:", error);
        }
        setBooks(null);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Left Menu */}
          <div className="sm:col-span-1">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Menu
                </h2>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="block text-blue-500 hover:text-blue-600"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="block text-blue-500 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/add"
                      className="block text-blue-500 hover:text-blue-600"
                    >
                      Add Book
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* End of Left Menu */}

          {/* Main Content */}
          <div className="sm:col-span-3">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-800">
                  My Library Management
                </h1>
              </div>
              <div className="px-4 sm:px-6 py-6">
                {fetchError && (
                  <div
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                    role="alert"
                  >
                    <p>{fetchError}</p>
                  </div>
                )}
                {books ? (
                  books.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {books.map((book) => (
                        <li
                          key={book.id}
                          className="col-span-1 bg-white rounded-lg shadow"
                        >
                          <BookCard book={book} onDelete={handleDelete} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-center mt-4">
                      No books found.
                    </p>
                  )
                ) : (
                  <p className="text-gray-600 text-center mt-4">Loading...</p>
                )}
              </div>
            </div>
          </div>
          {/* End of Main Content */}
        </div>
      </div>
    </div>
  );
}
