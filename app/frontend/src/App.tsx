import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAuthStore } from "./context/store";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import ProtectedRoute from "./components/ProtectedRoute";




const AppContent = () => {


  const isAuth = useAuthStore((state) => state.isAuth);



  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route element={<ProtectedRoute isAllowed={isAuth} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/registro" element={<RegistroPage />} />
      </Route>

    </Routes>
  );
};

function App() {
  return (
    <>
      <BrowserRouter basename="/rdt">
        <AppContent />
        <ToastContainer 
          position="top-right"
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
      </BrowserRouter>
    </>
  );
}

export default App;