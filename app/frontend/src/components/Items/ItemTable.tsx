import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { deleteEquipo, getEquipos } from '@/api/equipos'
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom'
import { downloadPDF, generatePDF } from '@/utils/generatePDF'
import { useAuthStore } from '@/context/store'
import { Download } from 'lucide-react';
import UpdateDialog from '../dialog/UpdateDialog'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '../dialog/DeleteConfirmDialog'
import { BadgeCheck } from 'lucide-react';
import { Ban } from 'lucide-react';
import { Building } from 'lucide-react';




interface Item {
  id_equipo: number;
  nombre_pc: string;
  id_oficina: number | null;
  id_apps: number | null;
  Usuario: string | null;
  Tecnico: string | null;
  nro_serie: string;
  id_usuario: number | null;
  id_inventario: string;
  tipo: string;
  observaciones: string;
  dominio: boolean;
  oficina: string;
  UE: string;
  last_update: string;
  piso: number;
}

export default function Component () {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState<Item[]>([])


  const { data, isLoading, isError } = useQuery<Item[]>({
    queryKey: ['equipos'],
    queryFn: () => getEquipos()
  })

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEquipo(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] })
      toast("Equipo eliminado correctamente", {
        description: data.message,
      })
    },

    onError: (data: any) => {
      toast("Error al eliminar el equipo", {
        description: data.error
      })
    }
  })

  const handleDelete = async (id: number) => {
      deleteMutation.mutate(id)
  }

  const user = useAuthStore((state) => state.profile)
  const isAdmin = user?.data.es_admin 


  useEffect(() => {
    if (data) {
      const filtered = data.filter(item =>
        Object.values(item).some(value =>
          value && typeof value === 'object'
            ? Object.values(value).some(v => v && v.toString().toLowerCase().includes(searchTerm.toLowerCase()))
            : value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }, [data, searchTerm])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Cargando...</div>
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error al cargar los datos.</div>

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }


  const handleGeneratePDF = async (equipo: any) => {
    try {
      const equipoPDF = {
        ...equipo,
        last_update: equipo.last_update ? new Date(equipo.last_update).toISOString() : null,
        aplicaciones: equipo.aplicaciones || [],
      };
      const pdfBytes = await generatePDF(equipoPDF as any);
      downloadPDF(pdfBytes, `Equipo_${equipo.nombre_pc}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };


  return (

   
    <div className="p-4 md:p-8 min-h-screen">
  

    

   
      <div className="max-w-7xl mx-auto space-y-3 ">
    
        <div className="relative mt-16">
          <Input
            type="text"
            placeholder="Buscar en todos los campos..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 bg-white dark:bg-black border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
        </div>

        <div className="dark:bg-zinc-900 dark:bg-opacity-60  backdrop-blur-3xl shadow-lg shadow-zinc-800 dark:shadow-sky-800 dark:backdrop-blur-3xl rounded-xl  overflow-hidden">
          <div className="overflow-x-auto">
            <Table className=' '>
              
              <TableHeader>
                <TableRow className=''>
                  <TableHead className="  dark:text-white">Nombre PC</TableHead>
                  <TableHead className="  dark:text-white">Nro. Serie</TableHead>
                  <TableHead className="  dark:text-white">Tipo</TableHead>
                  <TableHead className="  dark:text-white">Piso</TableHead>
                  <TableHead className="  dark:text-white flex items-center p-1 gap-1">Oficina <Building/></TableHead>
                  <TableHead className="  dark:text-white">Unidad Ejecutora</TableHead>
                  <TableHead className="  dark:text-white">ID Inventario</TableHead>
                  <TableHead className="  dark:text-white">Comentarios</TableHead> 
                  <TableHead className="  dark:text-white">Fecha</TableHead>
                  <TableHead className=" dark:text-white">En dominio</TableHead>
                  <TableHead className="  dark:text-white">Tecnico asignado</TableHead> 
                  <TableHead className="  dark:text-white">Usuario</TableHead> 
                  <TableHead className="  dark:text-white">App instaladas</TableHead>
                  <TableHead className="  dark:text-white">Exportar PDF</TableHead>
                  { isAdmin && <TableHead className="  dark:text-white">Editar/Eliminar</TableHead >}
                </TableRow>
              </TableHeader>
              <TableBody>
               

               
                <AnimatePresence >
            
                 
                  
                  {currentData.map((item, index) => ( 
                   
                    <motion.tr
                      key={`${item.id_equipo}-${item.nro_serie}-${item.oficina}-${index}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-zinc-50  dark:hover:text-black transition-colors">
                      <TableCell className="font-medium">{item.nombre_pc}</TableCell>
                      <TableCell>{item.nro_serie}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.piso}</TableCell>
                      <TableCell> {item.oficina} </TableCell>
                      <TableCell>{item.UE}</TableCell>
                      <TableCell>{item.id_inventario}</TableCell>
                      <TableCell>{item.observaciones}</TableCell>
                      <TableCell>{item.last_update? format(new Date(item.last_update), 'dd/MM/yyyy', { locale: es }) : <p className='text-gray-400'>N/A</p>}</TableCell>
                      <TableCell>{item.dominio ? ( <div className=''><BadgeCheck className='text-green-600 '/></div> ) : (<Ban className='text-gray-600'/>)}</TableCell>
                      <TableCell>{item.Tecnico ? item.Tecnico : <p className='text-gray-400'>N/A</p> }</TableCell>
                      <TableCell>{item.Usuario ? item.Usuario : <p className='text-gray-400'>N/A</p> }</TableCell>
                      <TableCell>
                        <Link to={`/aplicaciones/${item.id_equipo}`} className="text-blue-500 hover:underline font-semibold">Ver Apps</Link>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleGeneratePDF(item)}><Download/></Button>
                        </TableCell>
                    <TableCell>
                      {
                        isAdmin &&
                        <div className='flex gap-2'>
                           <UpdateDialog id={item.id_equipo}/>
                          <DeleteConfirmDialog onConfirm={() => handleDelete(item.id_equipo)} />
                        </div>
                       
                      }
                    </TableCell>
                        
                    </motion.tr>
               ))}   
                </AnimatePresence>
                 
              </TableBody>
         
            </Table>
          </div>
          
        </div>
        {filteredData.length === 0 && (
          <div className="text-center text-zinc-600 dark:text-white">No se encontraron resultados.</div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => goToPage(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Página" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <SelectItem key={page} value={page.toString()}>
                    Página {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-zinc-600 dark:text-white">Elementos por página:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      
        </div>
      
      </div> 
    
    </div>
    
  )
}