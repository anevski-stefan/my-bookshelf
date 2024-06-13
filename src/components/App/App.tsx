import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddBook from "../../pages/AddBook";
import Home from "../../pages/Home";
import UpdateBook from "../../pages/Update";
import Dashboard from "../../pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddBook />} />
        <Route path="/:id" element={<UpdateBook />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
