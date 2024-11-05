import { useQuery } from "@tanstack/react-query";
import { getEquipos } from "../../api/equipos";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../ui/table";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertCircle, ChevronDown, X } from "lucide-react";

interface Item {
    id: number;
    nombre: string;
    nro_serie: string;
    tipo: string;
    id_oficina: number;
    id_inventario: number;
    observaciones: string;
    dominio: boolean;
    aplicacion:{
        nombre: string;
        version: string;
        id: number;
    }
    usuario:{
        nombre: string;
        apellido: string;
        id: number;
    }
    oficina:{
        id: number;
        nombre: string;
        pisos: number;
        nom: string;
    }
    ue:{
        id: number;
        nombre: string;
        nom: string;
    }
}

type FilterType = {
    column: keyof Item | null;
    value: string | number | null;
  }

const ItemTable = () => {

    const {data, isLoading, isError} = useQuery<Item[]>({
        queryKey: ['items'],
        queryFn: ()=> getEquipos()
    });

    const [sortColumn, setSortColumn] = useState<keyof Item>('nombre')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<FilterType>({ column: null, value: null })


    if(isError) return <p>Error al cargar los equipos</p>
    if(isLoading) return <p>Cargando...</p>

    if(data && data.length === 0) return <p>No hay equipos</p>

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    
      const sortedData = data
        ? [...data].sort((a: Item, b: Item) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
            return 0
          })
        : []
    
      const filteredData = sortedData.filter((item: Item) => {
        const matchesSearch = Object.values(item).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        const matchesFilter = filter.column && filter.value
          ? item[filter.column] === filter.value
          : true
        return matchesSearch && matchesFilter
      })
    
      const handleSort = (column: keyof Item) => {
        if (column === sortColumn) {
          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
          setSortColumn(column)
          setSortDirection('asc')
        }
      }
    
      const handleFilter = (column: keyof Item, value: string | number) => {
        setFilter({ column, value })
      }
    
      const clearFilter = () => {
        setFilter({ column: null, value: null })
      }

    if(data)
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4 bg-wh">
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm text-black bg-white"
        />
        {filter.column && filter.value && (
          <Badge variant="secondary" className="flex items-center gap-2">
            Filtrado por {filter.column}: {filter.value}
            <Button variant="ghost" size="sm" onClick={clearFilter}>
              <X className="h-4 w-4" />
            </Button>
          </Badge>
        )}
      </div>
      <div className="rounded-md border bg-white" >
        <Table >
          <TableHeader>
            <TableRow>
              {[ 'Nombre', 'Numero de serie', 'Tipo', 'Oficina', 'Piso', 'Dominio', 'Observaciones', 'Usuario', 'Fecha de Creación'].map((header, index) => (
                <TableHead key={index} className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(header.toLowerCase().replace(' de creación', 'createdAt') as keyof Item)}
                  >
                    {header}
                    {sortColumn === header.toLowerCase().replace(' de creación', 'createdAt') && (
                      sortDirection === 'asc' ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
      {filteredData.length === 0 ? (
        <TableRow>
          <TableCell colSpan={10} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <AlertCircle className="w-10 h-10 mb-2" />
              <p className="text-lg font-medium">No se encontraron resultados</p>
              <p className="text-sm">
                Intenta ajustar tus filtros o realiza una nueva búsqueda
              </p>
            </div>
          </TableCell>
        </TableRow>
      ) : (
        filteredData.map((item: Item) => (
          <TableRow key={item.id}>
            
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('nombre', item.nombre)}>{item.nombre}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('nro_serie', item.nro_serie)}>{item.nro_serie}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('tipo', item.oficina.nombre)}>{item.oficina.nombre}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('oficina', item.anterior)}>{item.anterior}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('piso', item.estado)}>{item.estado}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('observaciones', item.piso)}>{item.piso}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('fecha_creacion', item.area)}>{item.area}</Button>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="link" onClick={() => handleFilter('usuario', item.usuario)}>{item.usuario}</Button>
            </TableCell>
            <TableCell className="text-center">{formatDate(item.createdAt)}</TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
        </Table>
          
      </div>
    </div>
  )
}

export default ItemTable