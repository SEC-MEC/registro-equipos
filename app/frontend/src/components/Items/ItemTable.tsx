'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { getEquipos } from '@/api/equipos'
import { useQuery } from '@tanstack/react-query'

interface Item {
    id_equipo: number;
    nombre_pc: string;
    nro_serie: string;
    tipo: string;
    piso: string;
    id_oficina: number;
    oficina: string;
    id_inventario: number;
    observaciones: string;
    dominio: boolean;
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data, isLoading, isError } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: () => getEquipos()
  })

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Cargando...</div>
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error al cargar los datos.</div>

  const filteredData = data?.filter(item =>
    Object.values(item).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="p-4 md:p-8 bg-zinc-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-zinc-800">Inventario de Equipos</h1>
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
                  <TableHead className="bg-zinc-50 text-zinc-600">ID Inventario</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Observaciones</TableHead>
                  <TableHead className="bg-zinc-50 text-zinc-600">Dominio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {currentData.map((item) => (
                    <motion.tr
                      key={item.id_equipo}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-zinc-50 transition-colors"
                    >
                      <TableCell className="font-medium">{item.nombre_pc}</TableCell>
                      <TableCell>{item.nro_serie}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.piso}</TableCell>
                      <TableCell>{item.oficina}</TableCell>
                      <TableCell>{item.id_inventario}</TableCell>
                      <TableCell>{item.observaciones}</TableCell>
                      <TableCell>{item.dominio ? 'Sí' : 'No'}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
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
              onValueChange={(value: any) => goToPage(parseInt(value))}
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
              onValueChange={(value:any) => {
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