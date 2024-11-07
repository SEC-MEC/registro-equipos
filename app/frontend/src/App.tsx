import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAuthStore } from "./context/store";
import { ToastContainer } from "react-toastify";  
import 'react-toastify/ReactToastify.css';
import {ProtectedRoute} from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";




const AppContent = () => {

  
  const isAuth = useAuthStore((state) => state.isAuth);

  return (
    <Routes>    
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute isAllowed={isAuth} />}>
      <Route path="/auth" element={<Dashboard />} />
      <Route path="/registro" element={<RegisterPage />} />
      </Route>

    </Routes>
  );
};

function App() {
  return (
    <>
      <BrowserRouter basename="/inventario">
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