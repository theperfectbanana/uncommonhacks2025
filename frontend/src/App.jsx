import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateSimulation from "./pages/CreateSimulation";
import PerformanceReview from "./pages/PerformanceReview";

function App() {
  return (
    <Box w={"100vw"} h={"100vh"} bgColor={"rgb(12, 6, 46)"}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateSimulation />} />
        <Route path="/review" element={<PerformanceReview />} />
      </Routes>
    </Box>
 );
}

export default App;
