import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../context/store";
import { loginRequest, auth } from "../api/auth";

const LoginForm = () => {
  const [usuario, setUsuario] = useState("");
  const [pass, setPassword] = useState("");
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
    <div className="w-full m-auto flex justify-center">
      <div className="max-w-sm space-y-3 rounded-md p-8">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            name="pass"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;