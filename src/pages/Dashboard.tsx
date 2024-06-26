import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import supabase from "../config/supabaseClient";

// Registering the Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: string;
  created_at: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
    borderWidth?: number;
    percentage?: boolean;
  }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genreDistribution, setGenreDistribution] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [authorCounts, setAuthorCounts] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [statusCounts, setStatusCounts] = useState<ChartData>({
    labels: ["Available", "Checked Out", "Unavailable"],
    datasets: [
      {
        label: "Books by Status",
        data: [0, 0, 0],
        backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
      },
    ],
  });
  const [totalBooks, setTotalBooks] = useState<number>(0);

  const fetchBooks = async (): Promise<Book[]> => {
    const { data, error } = await supabase.from("books").select("*");

    if (error) {
      console.error("Error while fetching books:", error.message);
      return [];
    }
    return data as Book[];
  };

  const transformGenreDistributionData = (books: Book[]): ChartData => {
    const genreCounts = books.reduce((acc: Record<string, number>, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(genreCounts),
      datasets: [
        {
          data: Object.values(genreCounts),
          backgroundColor: [
            "#e74c3c",
            "#2980b9",
            "#f1c40f",
            "#1abc9c",
            "#8e44ad",
            "#e67e22",
          ],
        },
      ],
    };
  };

  const transformAuthorCountsData = (books: Book[]): ChartData => {
    const authorCounts = books.reduce((acc: Record<string, number>, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(authorCounts),
      datasets: [
        {
          label: "Books by Author",
          data: Object.values(authorCounts),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          percentage: false,
        },
      ],
    };
  };

  const calculateStatusCounts = (books: Book[]): ChartData => {
    const availableCount = books.filter(
      (book) => book.status === "Available"
    ).length;
    const checkedOutCount = books.filter(
      (book) => book.status === "Checked Out"
    ).length;
    const unavailableCount = books.filter(
      (book) => book.status === "Unavailable"
    ).length;

    const total = availableCount + checkedOutCount + unavailableCount;
    setTotalBooks(total);

    return {
      labels: ["Available", "Checked Out", "Unavailable"],
      datasets: [
        {
          label: "Books by Status",
          data: [availableCount, checkedOutCount, unavailableCount],
          backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
        },
      ],
    };
  };

  useEffect(() => {
    const getBooksData = async () => {
      try {
        setLoading(true);
        const fetchedBooks = await fetchBooks();
        setBooks(fetchedBooks);
        setFilteredBooks(fetchedBooks);

        setGenreDistribution(transformGenreDistributionData(fetchedBooks));
        setAuthorCounts(transformAuthorCountsData(fetchedBooks));
        setStatusCounts(calculateStatusCounts(fetchedBooks));
      } catch (err) {
        setError("Failed to fetch books data");
      } finally {
        setLoading(false);
      }
    };

    getBooksData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const fetchedBooks = await fetchBooks();
    setBooks(fetchedBooks);
    setFilteredBooks(fetchedBooks);
    setGenreDistribution(transformGenreDistributionData(fetchedBooks));
    setAuthorCounts(transformAuthorCountsData(fetchedBooks));
    setStatusCounts(calculateStatusCounts(fetchedBooks));
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            let label = context.label || "";
            const value = context.raw;

            if (context.dataset.percentage !== false) {
              const percentage = ((value / books.length) * 100).toFixed(0);
              label += `: ${percentage}% (${value})`;
            } else {
              label += `: ${value}`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="text-3xl font-bold mx-auto">
          Book Management Dashboard
        </h1>

        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={refreshData}
        >
          Refresh
        </button>
      </div>
      <p className="text-lg font-semibold w-full flex justify-center">
        Total Books: {totalBooks}
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Genre Distribution</h2>
            <div className="h-64">
              <Pie data={genreDistribution} options={options} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Books by Author</h2>
            <div className="h-64">
              <Bar data={authorCounts} options={options} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Books by Status</h2>
            <div className="h-64">
              <Doughnut data={statusCounts} options={options} />
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 border border-gray-300 rounded p-5">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search by Title"
            className="p-2 border border-gray-300 rounded mr-4"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <h2 className="text-xl font-semibold mb-4">Filtered Books</h2>
        {filteredBooks.length === 0 ? (
          <p className="text-lg">No books found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <li key={book.id} className="py-4">
                <p className="text-lg">
                  - <span className="font-semibold">{book.title}</span> by{" "}
                  {book.author}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
