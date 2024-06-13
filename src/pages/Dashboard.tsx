// src/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
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
  const [booksPerMonth, setBooksPerMonth] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [genreDistribution, setGenreDistribution] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [authorCounts, setAuthorCounts] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const fetchBooks = async (): Promise<Book[]> => {
    const { data, error } = await supabase.from("books").select("*");

    if (error) {
      console.error("Error while fetching books:", error.message);
      return [];
    }
    return data as Book[];
  };

  const transformBooksPerMonthData = (books: Book[]): ChartData => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const booksPerMonth = new Array(12).fill(0);

    books.forEach((book) => {
      const month = new Date(book.created_at).getMonth();
      booksPerMonth[month] += 1;
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Books Read",
          data: booksPerMonth,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
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

  useEffect(() => {
    const getBooksData = async () => {
      const fetchedBooks = await fetchBooks();
      setBooks(fetchedBooks);

      setBooksPerMonth(transformBooksPerMonthData(fetchedBooks));
      setGenreDistribution(transformGenreDistributionData(fetchedBooks));
      setAuthorCounts(transformAuthorCountsData(fetchedBooks));
    };

    getBooksData();
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
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
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Books Read per Month</h2>
        <div className="h-64">
          <Bar data={booksPerMonth} options={options} />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Genre Distribution</h2>
        <div className="h-64">
          <Pie data={genreDistribution} />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Books by Author</h2>
        <div className="h-64">
          <Bar data={authorCounts} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
