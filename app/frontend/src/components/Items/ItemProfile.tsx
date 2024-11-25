'use client'

import { getAplicacionesById } from "@/api/equipos"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

import Layout from "../Layout"

interface Aplicacion {
  id_app: string
  aplicacion: {
    id: string;
    nombre: string
    version?: string
  }
  equipo: {
    id: string
    nombre: string
    nro_serie: string
  }
}

const ItemProfile = () => {
  const params = useParams()
  const id = params.id as string

  const { data: aplicaciones, isLoading: loadingAplicaciones } = useQuery({
    queryKey: ['aplicaciones', id],
    queryFn: () => id ? getAplicacionesById(id) : Promise.reject('ID is undefined')
  })

  if(aplicaciones?.length === 0){
    return (
      <Layout>

     
      <Card className="w-full max-w-4xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>Aplicaciones instaladas en este equipo</CardTitle>

        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">No hay aplicaciones instaladas en este equipo</div>
        </CardContent>
      </Card>
       </Layout>
    )
  }

  if(aplicaciones)
  return (
    <Layout>

   
    <Card className="w-full max-w-4xl mx-auto mt-12">
      <CardHeader>
      <CardTitle>Aplicaciones instaladas en este equipo</CardTitle>
      
      </CardHeader>
      <CardContent>
        {loadingAplicaciones ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Versión</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aplicaciones?.map((aplicacion: Aplicacion) => (
                <TableRow key={aplicacion.id_app}>
                  <TableCell className="font-medium">{aplicacion.aplicacion.nombre}</TableCell>
                  <TableCell>{aplicacion.aplicacion.version || 'N/A'}</TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
    </Layout>
  )
}

export default ItemProfile

