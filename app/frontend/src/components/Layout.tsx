import { ReactNode } from "react"
import Navbar from "./Navbar"
import DarkMode from "./DarkMode"



interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white bg-[url('https://tailwindui.com/plus/img/beams-home@95.jpg')]  dark:bg-[url('https://tailwindcss.com/_next/static/media/hero-dark@90.dba36cdf.jpg')]  bg-fixed bg-cover bg-center">

  <Navbar />
        <span className='absolute right-24 top-4'>
           <DarkMode/>
        </span>
     
       
        <main className="flex-grow overflow-auto p-6 ">
        
            {children}
 
        </main>
 </div>
      
        

   
  )
}

export default Layout

