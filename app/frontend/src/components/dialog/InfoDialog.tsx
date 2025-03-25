import { useState } from "react"
import { Info, X } from "lucide-react"

const InfoDialog= () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center justify-center ">
      <div className="relative">
  
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          aria-label="Mostrar información"
        >
          <Info className="w-6 h-6" />
        </button>

       
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
         
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-500 p-1.5 rounded-full">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-lg text-black">Que significa conectado a telefono?</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

    
              <div className="p-4 flex flex-col text-gray-600">
                <p className="">
                    Los equipos que se encuentran conectado a un telefono, no se le puede asignar un piso.
                </p>
                <p> Ya que aparecen en la subred 10 y 11, por lo tanto no se puede detectar el piso al que pertenecen.</p>
              </div>

              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoDialog