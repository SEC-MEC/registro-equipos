import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw, Laptop } from 'lucide-react'
import { getAllScanRequest } from "../../api/scan"
import LoadingScan from "../LoadingScan"
import InfoDialog from "../dialog/InfoDialog"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select"



interface ScanItem {
  nombre: string
  piso: number | string
}

const ItemScan = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [floorFilter, setFloorFilter] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["scan"],
    queryFn: getAllScanRequest,
  })


  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
     
    } catch (error) {
      console.error(error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const floorOptions = useMemo(() => {
    if (!data) return []
    
    const floors = new Set<string | number>()
    
    data.forEach((item: ScanItem) => {
      if (item.piso === 10 || item.piso === 11) {
        floors.add("Conectado a telefono")
      } else {
        floors.add(item.piso)
      }
    })
    
    return Array.from(floors).sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b
      }
      if (a === "Conectado a telefono") return 1
      if (b === "Conectado a telefono") return -1
      return String(a).localeCompare(String(b))
    })
  }, [data])

  const filteredData = useMemo(() => {
    if (!data) return []
    
    return data.filter((item: ScanItem) => {

      const nameMatch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      
  
      if (!floorFilter || floorFilter === "all") return nameMatch
      

      if (floorFilter === "Conectado a telefono") {
        return nameMatch && (item.piso === 10 || item.piso === 11)
      }
      
      return nameMatch && String(item.piso) === floorFilter
    })
  }, [data, searchTerm, floorFilter])

  if (isLoading) return 
  <div className="flex justify-center items-center text-black">
 <div className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin mb-4">
              <Laptop size={48} className="text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">Cargando inventario...</h2>
            <p className="text-muted-foreground">Por favor espere mientras obtenemos los datos</p>
          </div>
  </div>
  </div>

  if (error)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    )

  return (

    <div className="space-y-4 pt-24 w-full sm:px-0 dark:bg-slate-900 dark:text-white sticky top-0 bg-white dark:bg-slate-900 z-10 p-4 shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 mx-4 sm:ml-24 items-end">

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        

        <div className="w-full sm:w-auto sm:min-w-[200px]">
          <Select value={floorFilter} onValueChange={setFloorFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por piso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pisos</SelectItem>
              {floorOptions.map((floor) => (
                <SelectItem key={String(floor)} value={String(floor)}>
                  {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

     
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={isRefreshing || isLoading}
          className="h-10 w-10 shrink-0"
          title="Actualizar escaneo"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Actualizar escaneo</span>
        </Button>
      </div>

      <div className="rounded-md m-auto border w-11/12 overflow-x-auto">
        <Table className="min-h-[400px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Piso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="min-h-[300px]">
            {filteredData?.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={3} 
                  className="h-[300px] text-center"
                >
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-12 h-12 text-gray-400 mb-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No se encontraron resultados</p>
                    <p className="text-gray-400 text-sm mt-1">Intenta con otros criterios de búsqueda</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((item: ScanItem, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium px-3 py-2 md:px-6 md:py-3">{index + 1}</TableCell>
                  <TableCell className="px-3 py-2 md:px-6 md:py-3">{item.nombre}</TableCell>
                  <TableCell className="px-3 py-2 md:px-6 md:py-3">
                    {item.piso === 10 || item.piso === 11 ? (
                      <div className="flex gap-2 items-center">
                        <p>Conectado a telefono</p> 
                        <InfoDialog/> 
                      </div>
                    ) : item.piso}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                {filteredData?.length} resultados
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>

  )
}

export default ItemScan