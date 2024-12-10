import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../context/store";
import { loginRequest, auth } from "../api/auth";
import { Eye, EyeOff, Lock, User } from "lucide-react";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [pass, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false)
  const setToken = useAuthStore(state => state.setToken);
  const setProfile = useAuthStore(state => state.setProfile);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginRequest,
    onError: (error: any) => {
      console.log("desde onError");
      toast.error(error);
    },
    onSuccess: async (response: any) => {
      if (response && response.data && response.data.token) {
        const token = response.data.token;
        setToken(token);
        const isAuth = await auth();
        setProfile(isAuth);
        navigate("/auth");
      } else {
        toast.error("Datos incorrectos");
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = { usuario, pass };

    try {
      mutation.mutate(userData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
     <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl shadow-2xl overflow-hidden">
        <div className=" p-8">
          <h1 className="text-center font-bold text-3xl mb-2 dark:text-white">Inicia sesión</h1>
          <p className="text-center dark:text-white">Ingresa tus credenciales para acceder</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6  bg-white dark:bg-transparent">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-xl font-medium text-gray-700 dark:text-white">
              Usuario
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  sm:text-sm transition duration-150 ease-in-out"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xl font-medium text-gray-700 dark:text-white">
              Contraseña
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="pass"
                name="pass"
                value={pass}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500  sm:text-sm transition duration-150 ease-in-out"
                placeholder="Ingresa tu contraseña"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Ingresar
            </button>
          </div>
        </form>
        {/* <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
            ¿Olvidaste tu contraseña?
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;