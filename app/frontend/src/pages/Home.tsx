'use client'
import { BackgroundBeams } from "@/components/ui/background-beams"
import LoginForm from "../components/LoginForm"



const Home = () => {
  return (
          <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center">
      <div className="absolute top-0 w-full h-96">
        <BackgroundBeams />
      </div>
      <div className="relative z-10 w-full max-w-2xl mx-auto p-4 pt-32 flex flex-col items-center">
        <h1 className="text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold mb-6">
          Inventario MEC
        </h1>
        <p className="text-white max-w-lg mx-auto my-2 text-sm text-center">
          Inicia sesión para acceder al inventario de todos los equipos.
        </p>
        <LoginForm/>
      </div>
    </div>

  )
}

export default Home

