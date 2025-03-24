"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { getAllScanRequest } from "../../api/scan"

interface ScanItem {
  nombre: string
  piso: number | string
}

const ItemScan = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const { data, isLoading, error } = useQuery({
    queryKey: ["scan"],
    queryFn: getAllScanRequest,
  })


  const filteredData = data?.filter((item: ScanItem) => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    )

  return (
    <div className="space-y-4  w-full px-2 sm:px-0 mt-24">
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          className="pl-8 w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] px-3 py-2 md:px-6 md:py-3">#</TableHead>
                  <TableHead className="px-3 py-2 md:px-6 md:py-3">Nombre de PC</TableHead>
                  <TableHead className="px-3 py-2 md:px-6 md:py-3">Número de Piso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData?.map((item: ScanItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium px-3 py-2 md:px-6 md:py-3">{index + 1}</TableCell>
                      <TableCell className="px-3 py-2 md:px-6 md:py-3">{item.nombre}</TableCell>
                      <TableCell className="px-3 py-2 md:px-6 md:py-3">{item.piso}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemScan

