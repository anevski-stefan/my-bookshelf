import { useEffect, useState } from "react";
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
  }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
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
      const fetchedBooks = await fetchBooks();
      setBooks(fetchedBooks);

      setGenreDistribution(transformGenreDistributionData(fetchedBooks));
      setAuthorCounts(transformAuthorCountsData(fetchedBooks));
      setStatusCounts(calculateStatusCounts(fetchedBooks));
    };

    getBooksData();
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="Dashboard p-4 space-y-8">
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
      </div>
      <div className="flex space-x-4">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Genre Distribution</h2>
          <div className="h-64">
            <Pie data={genreDistribution} />
          </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Books by Author</h2>
          <div className="h-64">
            <Bar data={authorCounts} options={options} />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Books by Status</h2>
        <div className="h-64">
          <Doughnut data={statusCounts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
