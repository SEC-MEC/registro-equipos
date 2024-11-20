import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { getEquipos, getInfoPc, getOficinas } from '@/api/equipos'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '@/context/store'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog'


interface Ue {
  id: number;
  nombre: string;
}

interface Oficina {
  id: number;
  nombre: string;
  piso: number;
  ue: Ue;
}

interface Modificado {
  fecha: string;
}

interface Item {
  id_equipo: number;
  nombre: string;
  id_oficina: number | null;
  id_apps: number | null;
  id_tecnico: number | null;
  nro_serie: string;
  id_usuario: number | null;
  id_inventario: string;
  tipo: string;
  observaciones: string;
  dominio: boolean;
  oficina: Oficina;
  modificado: Modificado;
}

export default function Component () {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState<Item[]>([])
  const [idOficina, setIdOficina] = useState('')

  const { data, isLoading, isError } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: () => getEquipos()
  })

  const profile = useAuthStore((state) => state.profile)
  const userId = profile?.data.id

  const mutation = useMutation({
    mutationFn: getInfoPc,
    onSuccess: (success: any) => {
      toast(success.success || success.message)
    },
    onError: (error: any) => {
      toast(error.info || error.message)
  }})

  const handlePcInfo = async () => {
   if(!userId) return <div><p>El tecnico no se encuentra</p></div>
   const pcInfoJson = {
      id_oficina: idOficina,
      id_tecnico: userId,
   }
   console.log("la ofi",idOficina)
   mutation.mutate(pcInfoJson)
  }

  const { data: oficinas, isLoading: isLoadingOficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: () => getOficinas(),
  })

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

  return (
    <div className="p-4 md:p-8 bg-zinc-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 ">
        <aside className='flex justify-between items-center'>
           <h1 className="text-3xl font-bold text-zinc-800">Inventario de Equipos</h1>
           <div className='flex items-center gap-2'>
              <Link to='/registro' className='px-3 py-1 rounded-sm w-64 text-center bg-zinc-800 text-white font-semibold hover:bg-zinc-700'>Registrar nuevo equipo</Link>
              <Dialog>
                <DialogTrigger>
                  <Button>Registrar este equipo</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className='font-semibold text-xl'>Registrar equipo</DialogHeader>
                  <DialogDescription>
                 
                    <form>
                      <select 
                        className='px-3 py-1 border shadow-xl rounded-md text-black'
                        onChange={(e) => setIdOficina(e.target.value)}
                        value={idOficina}
                        required
                      >
                        <option value="" disabled>Selecciona una oficina</option>
                        {isLoadingOficinas && <option value="" disabled>Cargando oficinas...</option>}
                        {oficinas?.map((oficina: Oficina) => (
                        <option key={oficina.id} value={oficina.id}>{oficina.nombre}</option>
                        ))}
                      </select>
                      <DialogFooter>
                        <Button type="submit" onClick={handlePcInfo} className=''>Registrar</Button>
                      </DialogFooter>
                    </form>
             
    
                  </DialogDescription>
               
                </DialogContent>
              </Dialog>
           </div>
         
        </aside>
       
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar en todos los campos..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 bg-white border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-zinc-50 text-zinc-600">Nombre PC</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Nro. Serie</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Tipo</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Piso</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Oficina</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">UE</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">ID Inventario</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Usuarios del PC</TableHead> 
                  <TableHead className="bg-zinc-50 text-zinc-600">Fecha</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Dominio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {currentData.map((item) => (
                    <motion.tr
                      key={`${item.id_equipo}-${item.nro_serie}-${item.oficina?.nombre}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-zinc-50 transition-colors"
                    >
                      <TableCell className="font-medium">{item.nombre}</TableCell>
                      <TableCell>{item.nro_serie}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.oficina?.piso}</TableCell>
                      <TableCell>{item.oficina?.nombre}</TableCell>
                      <TableCell>{item.oficina?.ue?.nombre}</TableCell>
                      <TableCell>{item.id_inventario}</TableCell>
                      <TableCell>{item.observaciones}</TableCell>
                      <TableCell>{item.modificado?.fecha ? format(new Date(item.modificado?.fecha), 'dd/MM/yyyy', { locale: es }) : ''}</TableCell>
                      <TableCell>{item.dominio ? 'Sí' : 'No'}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
        {filteredData.length === 0 && (
          <div className="text-center text-zinc-600">No se encontraron resultados.</div>
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
            <span className="text-sm text-zinc-600">Elementos por página:</span>
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