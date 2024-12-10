import { useEffect, useState } from "react";
import { Sun, Moon } from 'lucide-react';

const DarkMode = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const guardarTheme = localStorage.getItem('theme');
            if (guardarTheme) {
                return guardarTheme;
            }
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        }
        return "light";
    })

    useEffect(() => {
        const htmlElement = document.querySelector('html');
        if (htmlElement) {
            if (theme === "dark") {
                htmlElement.classList.add('dark')
            } else {
                htmlElement.classList.remove('dark')
            }
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const handleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }

    return (
        <div className="flex justify-center items-center">
            <button 
                onClick={handleTheme} 
                className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300"
                aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
                <Sun className="hidden dark:block text-yellow-400" size={24} />
                <Moon className="dark:hidden text-gray-700" size={24} />
            </button>
        </div>
    )
}

export default DarkMode;

