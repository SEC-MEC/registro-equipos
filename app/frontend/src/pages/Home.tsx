
import LoginForm from "../components/LoginForm"
import {motion} from 'framer-motion'

const Home = () => {

  return (

      <div className="z-10 w-full">
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
<LoginForm/>

      </motion.div>
      
      </div>


  )
}

export default Home