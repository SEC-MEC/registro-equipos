
import LoginForm from "../components/LoginForm"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { motion } from "framer-motion";


const Home = () => {
  return (
             <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center  justify-center px-4"
      >
           <div className="relative z-10 w-full max-w-2xl mx-auto p-4 pt-32 flex flex-col items-center">
        <h1 className="text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-sky-500 via-sky-600 to-sky-900 text-center font-sans font-bold mb-6">
          Inventario MEC
        </h1>
     
        <LoginForm/>
      </div>

      </motion.div>
    </AuroraBackground>

  )
}

export default Home

