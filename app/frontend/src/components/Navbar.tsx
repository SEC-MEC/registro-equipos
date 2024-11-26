
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  Home, 
  LogOut,
  Menu,
  X,
  PcCase
} from 'lucide-react'

import { useAuthStore } from '@/context/store'



const navItems = [
  { icon: Home, label: 'Inicio', href: '/auth' },
  { icon: PcCase, label: 'Registrar equipo', href: '/registro' },
  // { icon: Users, label: 'Usuarios', href: '/auth' },
  // { icon: Settings, label: 'Configuración', href: '/auth' },
  // { icon: HelpCircle, label: 'Ayuda', href: '/auth' },
]

interface NavbarProps {
  className?: string
}


const  Navbar = ({className}: NavbarProps)  => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()

    const logOut = useAuthStore((state) => state.logout)


  return (
      <nav className={cn("bg-zinc-100 ", className)}>
    <div className={cn(
      "flex flex-col h-screen bg-zinc-50 border-r border-zinc-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        <h1 className={cn("font-bold text-xl text-zinc-800", isCollapsed && "hidden")}>
          Inventario MEC
        </h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "justify-start gap-2 px-2", 
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          ))}
          {

          }
          
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-zinc-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 px-2",
            isCollapsed && "justify-center px-0"
          )}
          onClick={logOut}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Cerrar sesión</span>}
        </Button>
      </div>
    </div>
    </nav>
  )
}

export default Navbar;