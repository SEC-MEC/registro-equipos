import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/context/store'
import { ChangePasswordDialog } from './dialog/ChangePasswordDialog'
import { UserRoundPlus } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Inicio', href: '/auth' },


]

interface NavbarProps {
  className?: string
}

const Navbar = ({ className }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const logOut = useAuthStore((state) => state.logout)
  const profile = useAuthStore((state) => state.profile)
  const userRol = profile.data.es_admin


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-9/12 m-auto border mt-2 shadow-xl rounded-xl backdrop-blur-2xl  transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-2xl shadow-md" : "bg-white",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-b from-sky-500 via-sky-600 to-sky-900 text-center font-sans font-bold">
              Inventario MEC
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="text-zinc-800 hover:bg-zinc-200 hover:text-zinc-900"
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  <span>{item.label}</span>
                </Button>
              ))}
                 {
              userRol  && <Link to="/new/account" className='dark:hover:bg-black dark:hover:text-white dark:text-black px-3 py-2 rounded-md flex items-center gap-1 hover:bg-zinc-200 text-sm'><UserRoundPlus className='w-5 h-5'/> <p className='font-semibold'>Registrar usuario</p></Link> 
            }
              <ChangePasswordDialog />
              <Button
                variant="ghost"
                className="text-zinc-800 hover:bg-zinc-200 hover:text-zinc-900"
                onClick={logOut}
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border flex flex-col items-center">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text-left text-zinc-800 hover:bg-zinc-200 hover:text-zinc-900"
                onClick={() => {
                  navigate(item.href)
                  setIsMobileMenuOpen(false)
                }}
              >
                <item.icon className="w-5 h-5 mr-2" />
                <span>{item.label}</span>
              </Button>
            ))}
             {
              userRol  && <Link to="/new/account" className='px-3 py-2 rounded-md flex items-center gap-2 font-semibold text-sm'><UserRoundPlus className='w-5 h-5'/> Registrar usuario</Link> 
            }
            <ChangePasswordDialog />
            <Button
              variant="ghost"
              className="w-full text-left text-zinc-800 hover:bg-zinc-200 hover:text-zinc-900"
              onClick={() => {
                logOut()
                setIsMobileMenuOpen(false)
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Cerrar sesión</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

