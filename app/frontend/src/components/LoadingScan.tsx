
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wifi, Server, Laptop, Smartphone, Router } from "lucide-react"
import logo from '../assets/logo.png'

const LoadingScan = () => {
  const [progress, setProgress] = useState(0)

  const [statusText, setStatusText] = useState("Iniciando escaneo...")


  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }

        if (prev < 20) {
          setStatusText("Iniciando escaneo de red...")
        } else if (prev < 40) {
          setStatusText("Buscando dispositivos...")
        } else if (prev < 60) {
          setStatusText("Identificando equipos...")
        } else if (prev < 80) {
          setStatusText("Analizando puertos...")
        } else {
          setStatusText("Finalizando escaneo...")
        }

        return prev + 10
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])


  const devices = [
    { icon: Server, delay: 0 },
    { icon: Laptop, delay: 0.5 },
    { icon: Router, delay: 1 },
    { icon: Smartphone, delay: 1.5 },
    { icon: Server, delay: 2 },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
       
      <div className="mb-8 relative">
        <div className="bg-white rounded-full p-4 shadow-lg shadow-blue-500/20">
          <img src={logo} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
        </div>
        <motion.div
          className="absolute -inset-1 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0)",
              "0 0 0 10px rgba(59, 130, 246, 0.3)",
              "0 0 0 20px rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        />
      </div>

    
      <h1 className="text-2xl font-bold mb-8 text-center">Escáner de Red</h1>

    
      <div className="relative w-64 h-64 mb-8">
 
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          <Wifi size={48} strokeWidth={1.5} />
        </motion.div>

 
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-500/30"
          initial={{ width: 0, height: 0 }}
          animate={{
            width: [0, 240],
            height: [0, 240],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        />

      
        {devices.map((Device, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              opacity: 0,
            }}
            animate={{
              top: `${25 + Math.sin((index * Math.PI) / 2.5) * 40}%`,
              left: `${25 + Math.cos((index * Math.PI) / 2.5) * 40}%`,
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.8],
            }}
            transition={{
              duration: 4,
              delay: Device.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <Device.icon className="text-blue-400" size={24} />
            <motion.div
              className="absolute top-1/2 left-1/2 w-1 h-8 bg-blue-400/30"
              style={{
                transformOrigin: "top",
                rotate: `${index * 72 + 90}deg`,
                translateX: "-50%",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{
                duration: 2,
                delay: Device.delay + 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </motion.div>
        ))}
      </div>


      <div className="w-full max-w-md mb-4 bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

     
      <div className="text-center mb-2">
        <p className="text-blue-300">{statusText}</p>
       
      </div>

      <div className="text-2xl font-bold text-blue-400">{Math.round(progress)}%</div>
    </div>
  )
}

export default LoadingScan