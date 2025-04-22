import { ReactNode } from "react"
import Navbar from "./Navbar"
import DarkMode from "./DarkMode"

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }
  .content {
    position: relative;
    z-index: 2;
  }`

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
   
    <main
    className="min-h-screen flex items-center justify-center"
    style={{
      background: "radial-gradient(circle at center, #1E40AF, #000000)",
    }}
  >
    <style>
      {backgroundStyle}
    </style>

  <Navbar />
        <span className='absolute right-24 top-4'>
           <DarkMode/>
        </span>
     
       
        <main className="flex-grow overflow-auto  ">
        
            {children}
 
        </main>
   </main>
      
        

   
  )
}

export default Layout

