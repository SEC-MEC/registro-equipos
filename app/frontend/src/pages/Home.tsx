
import LoginForm from "../components/LoginForm"
import {motion} from 'framer-motion'

const Home = () => {

  return (

      <div className="z-10 w-full bg-zinc-800 min-h-screen">
       <motion.div
          initial={{opacity:0, y: -100}}
          animate={{opacity:1, y:0}}
          transition={{duration:1}}
          className="relative z-20"
       >
        
       </motion.div>
      <motion.div
      initial={{opacity:0, y: 100}}
      animate={{opacity:1, y:0}}
      transition={{duration:1}}
      className="relative z-20"
      >
        <div className="py-24">
          <LoginForm/>
        </div>


      </motion.div>
      
      </div>


  )
}

export default Home