
import DarkMode from "@/components/DarkMode";
import LoginForm from "../components/LoginForm"



const Home = () => {
  return (
        
      <div>

      
           <DarkMode/>
      
        
           <div className="relative z-10 w-full max-w-2xl mx-auto p-4 pt-32 flex flex-col items-center">
        <h1 className="text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-sky-500 via-sky-600 to-sky-900 text-center font-sans font-bold mb-6">
          Inventario MEC
        </h1>
     
        <LoginForm/>
      </div>
</div>
     
   

  )
}

export default Home

