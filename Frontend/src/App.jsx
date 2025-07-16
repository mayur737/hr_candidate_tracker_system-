import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/auth/Auth";
import DeAuth from "./components/auth/Deauth";
import { ContextProvider } from "./contexts/GlobalContext";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Missing from "./pages/Missing";
import DashboardLayout from "./layout/DashboardLayout";
import CandidateList from "./pages/CandidateList";
import AddCandidate from "./pages/AddCandidate";
import BulkUpload from "./pages/BulkUpload";

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route element={<DeAuth />}>
            <Route path="/" element={<Login />} />
          </Route>
          <Route element={<Auth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/candidates" element={<CandidateList />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/edit-candidate/:id" element={<AddCandidate />} />
              <Route path="/bulk-upload" element={<BulkUpload />} />
            </Route>
          </Route>
          <Route path="*" element={<Missing />} />
        </Routes>
        <ToastContainer />
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;
