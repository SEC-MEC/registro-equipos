import LoginForm from "../components/LoginForm"
import {motion} from 'framer-motion'
import { AuroraBackground } from "@/components/ui/aurora-background"

const Home = () => {

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        >
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </motion.div>
      </AuroraBackground>
    </div>

   

     


  )
}

export default Home