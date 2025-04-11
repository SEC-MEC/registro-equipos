import { getAplicaciones, getAplicacionesById } from "@/api/equipos"
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Layout from "../Layout"
import { deleteApp, updateApp } from "@/api/aplicaciones"
import { Button } from "../ui/button"
import { useState } from "react"
import { ScrollShadow } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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
  const navigate = useNavigate()
  
  const [selectedAplicaciones, setSelectedAplicaciones] = useState<{ id: string }[]>([])
  const [showAddApps, setShowAddApps] = useState(false)

  const { data: aplicaciones, isLoading: loadingAplicaciones } = useQuery({
    queryKey: ['aplicaciones', id],
    queryFn: () => id ? getAplicacionesById(id) : Promise.reject('ID is undefined')
  })

  const {data: allApps, isLoading: loadingAllApps} = useQuery({
    queryKey: ['aplicaciones'],
    queryFn: () => getAplicaciones()
  })

  const queryClient = useQueryClient()
  const {  handleSubmit } = useForm()

  const appMutation = useMutation({
    mutationFn: (data: any) => updateApp(data, id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['aplicaciones', id]})
      toast("Aplicaciones registradas correctamente", {
        description: data.message,
        action: {
          label: "Ir al inicio",
          onClick: () => navigate('/auth'),
        },
      })
      setShowAddApps(false) 
    },
    onError: (error: any) => {
      toast("Error al registrar los equipos", {
        description: error.error,
        action: {
          label: "Ir al inicio",
          onClick: () => navigate('/auth'),
        },
      })
  }})

  const deleteMutation = useMutation({
    mutationFn: (data: any) => deleteApp(id, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({queryKey: ['aplicaciones', id]})
      toast("Aplicación eliminada correctamente", {
        description: data.message,
        action: {
          label: "Ir al inicio",
          onClick: () => navigate('/auth'),
        },
      })
    },
    onError: (error: any) => {
      toast("Error al eliminar la aplicación", {
        description: error.error,
        action: {
          label: "Ir al inicio",
          onClick: () => navigate('/auth'),
        },
      })
    }

  })

  const handleDelete = (aplicacionId: string) => {

      deleteMutation.mutate(aplicacionId)

    }



    const handleUpdateApp = () => {

      const aplicacionesIds = selectedAplicaciones.map(app => parseInt(app.id));
      const dataJson = {
        id_app: aplicacionesIds
      };

      appMutation.mutate(dataJson);
    };

  const handleCheckboxChange = (aplicacionId: string) => {
    setSelectedAplicaciones(prev => {
      if (prev.some(app => app.id === aplicacionId)) {
        return prev.filter(app => app.id !== aplicacionId);
      }
      return [...prev, { id: aplicacionId }];
    });
  };

  const toggleAddApps = () => {
    setShowAddApps(!showAddApps)
  }

  return (
    <Layout>
      <Card className="w-full max-w-4xl mx-auto mt-24">
        <CardHeader>
  
          <Button onClick={toggleAddApps} >
            {showAddApps ? "Cancelar" : "Agregar aplicaciones"}
          </Button>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence>
            {showAddApps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit(handleUpdateApp)}>
                  <ScrollShadow className="w-full h-[300px] overflow-y-auto rounded-md border mb-4">
                    {loadingAllApps ? (
                      <div className="p-4">Cargando aplicaciones...</div>
                    ) : (
                      allApps?.map((app: {id: number, nombre: string}) => (
                        <div key={app.id} className="flex gap-1 items-center text-xl px-4 py-2">
                          <input
                            type="checkbox"
                            id={`app-${app.id}`}
                            className="text-2xl p-4 rounded-md"
                            onChange={() => handleCheckboxChange(app.id.toString())}
                          />
                          <label htmlFor={`app-${app.id}`} className="flex-grow cursor-pointer">{app.nombre}</label>
                        </div>
                      ))
                    )}
                  </ScrollShadow>
                  <Button type="submit" disabled={appMutation.isPending}> { appMutation.isPending ?<> <Loader2 className="h-4 w-4 animate-spin "/> </> : <>Agregar nuevas aplicaciones</> } </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          <CardTitle className="text-center text-2xl mb-4">Aplicaciones instaladas en este equipo</CardTitle>
          {loadingAplicaciones ? (
            <>
          
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div> </>
          ) : aplicaciones && aplicaciones.length > 0 ? (
            <Table>
              
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Eliminar aplicacion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aplicaciones.map((aplicacion: Aplicacion) => (
                  <TableRow key={aplicacion.id_app} >
                    <TableCell className="font-medium">{aplicacion.aplicacion.nombre}</TableCell>
                    <TableCell>{aplicacion.aplicacion.version || 'N/A'}</TableCell>
                    <TableCell className="ml-auto"> <Button onClick={() => handleDelete(aplicacion.id_app)} disabled={deleteMutation.isPending}>  { deleteMutation.isPending ? <><Loader2  className="h-4 w-4 m-auto animate-spin "/></> : <>Eliminar</>} </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
          ) : (
            <div className="text-center text-gray-500">No hay aplicaciones instaladas en este equipo</div>
          )}
        </CardContent>
    
      </Card>
    </Layout>
  )
}

export default ItemProfile

