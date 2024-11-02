
import { LayoutHome } from "@/components/layout/LayoutHome"
import LoginForm from "@/components/Login"
import {motion} from 'framer-motion'

const Home = () => {

  return (
    <LayoutHome>
      <div className="z-10 w-full">
       <motion.div
          initial={{opacity:0, y: -100}}
          animate={{opacity:1, y:0}}
          transition={{duration:1}}
          className="relative z-20"
       >
         <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-gray-300 dark:text-white font-sans tracking-tight mb-4">
        Equipo de redes{" "}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">MEC.</span>
          </div>
        </div>
        </h2>
       </motion.div>
      <motion.div
      initial={{opacity:0, y: 100}}
      animate={{opacity:1, y:0}}
      transition={{duration:1}}
      className="relative z-20"
      >
<LoginForm/>

      </motion.div>
      
      </div>

    </LayoutHome>
  )
}

export default Home