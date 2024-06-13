import { Link } from "react-router-dom";
import supabase from "../../config/supabaseClient";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    created_at: string;
    author: string;
    genre: string;
    status: string;
  };
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onDelete }: BookCardProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("books")
      .delete()
      .eq("id", book.id)
      .select();

    if (error) {
      console.error("Error deleting book:", error.message);
      return;
    }

    if (data) {
      console.log("Deleted book:", data);
      onDelete(book.id);
    }
  };

  return (
    <div className="sm:w-full md:w-full mb-4 px-2">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
          <p className="text-sm text-gray-600 mb-1">Genre: {book.genre}</p>
          <p className="text-sm text-gray-600 mb-1">Status: {book.status}</p>
          <p className="text-sm text-gray-500">
            Created at: {formatDate(book.created_at)}
          </p>{" "}
        </div>
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
          <Link
            to={"/" + book.id}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
