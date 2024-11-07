import  Navbar  from "./Navbar"
import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
     <div className="flex min-h-screen bg-zinc-50">
      <Navbar />
      <main className="flex-grow overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout