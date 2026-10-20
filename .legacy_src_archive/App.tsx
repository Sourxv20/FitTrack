import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home/Home";
import Gym from "./pages/Gym/Gym";
import Running from "./pages/Running/Running";
import Progress from "./pages/Progress/Progress";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Layout>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/running" element={<Running />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

      </Layout>
    </BrowserRouter>
  );
}

export default App;