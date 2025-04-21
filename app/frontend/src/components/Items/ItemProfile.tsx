import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Save, Plus, X, Check, Package, Download, ArrowLeft, Search } from "lucide-react"
import { getAplicacionesById } from "@/api/equipos"
import { getAplicaciones, updateApp } from "@/api/aplicaciones"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const AplicacionesEquipo = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { handleSubmit } = useForm()

  const { data: instaladas, isLoading: loadingInstaladas } = useQuery({
    queryKey: ["aplicaciones", id],
    queryFn: () => getAplicacionesById(id!),
  })

  const { data: disponibles, isLoading: loadingDisponibles } = useQuery({
    queryKey: ["aplicaciones"],
    queryFn: getAplicaciones,
  })

  const mutation = useMutation({
    mutationFn: (data: any) => updateApp(data, id!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aplicaciones", id] })
      toast.success(data.message || "Aplicaciones actualizadas correctamente")
      setShowForm(false)
      setSelected([])
    },
    onError: (err: any) => {
      toast.error("Error al agregar aplicaciones", { description: err.message })
    },
  })

  const onSubmit = () => {
    if (selected.length === 0) {
      toast.warning("Selecciona al menos una aplicación")
      return
    }
    mutation.mutate({ id_app: selected.map(Number) })
  }

  const toggleApp = (appId: string) => {
    setSelected((prev) => (prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]))
  }

  const isAppInstalled = (appId: string) => {
    return instaladas?.some((app: any) => app.id_app !== undefined && app.id_app.toString() === appId)
  }

  const filteredApps = disponibles?.filter((app: any) => app.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  return (

      <div className="max-w-4xl mx-auto mt-8 pb-16">

        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 py-4 border-b mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="rounded-full" to='/auth'>
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-semibold">Aplicaciones del equipo</h1>
            </div>

            {showForm && (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={mutation.isPending || selected.length === 0}
                className="gap-2"
              >
                {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                Guardar aplicaciones
              </Button>
            )}
          </div>
        </div>


        <div className="space-y-6">

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Package className="h-5 w-5" />
                Aplicaciones instaladas
              </h2>
              <Button
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? "outline" : "default"}
                size="sm"
                className="gap-2"
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Agregar aplicaciones
                  </>
                )}
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                {loadingInstaladas ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : instaladas && instaladas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {instaladas.map((app: any) => (
                      <div key={app.id_app} className="flex items-center p-3 border rounded-lg bg-muted/30">
                        <div className="flex-1">
                          <div className="font-medium">{app.nombre}</div>
                          {app.version && (
                            <Badge variant="outline" className="mt-1">
                              v{app.version}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          Instalada
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No hay aplicaciones instaladas</p>
                    <p className="text-sm">Agrega aplicaciones para este equipo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

  
          <AnimatePresence>
            {showForm && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Download className="h-5 w-5" />
                    Agregar aplicaciones
                  </h2>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar aplicaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    {loadingDisponibles ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredApps && filteredApps.length > 0 ? (
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
                          {filteredApps?.map((app: any) => {
             
                            const appId = app.id !== undefined ? app.id.toString() : ""
                            const isSelected = selected.includes(appId)
                            const isInstalled = isAppInstalled(appId)

                            return (
                              <div
                                key={app.id || `app-${Math.random()}`}
                                onClick={() => !isInstalled && appId && toggleApp(appId)}
                                className={`
                                  flex items-center p-4 border rounded-lg transition-all
                                  ${isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground/20"}
                                  ${isInstalled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                                `}
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{app.nombre || "Sin nombre"}</div>
                                  {app.version && (
                                    <Badge variant="outline" className="mt-1">
                                      v{app.version}
                                    </Badge>
                                  )}
                                </div>

                                <div className="ml-2">
                                  {isInstalled ? (
                                    <Badge>Instalada</Badge>
                                  ) : isSelected ? (
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No se encontraron aplicaciones</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="mt-4 flex justify-end">
                  <div className="text-sm text-muted-foreground mr-4 self-center">
                    {selected.length} aplicaciones seleccionadas
                  </div>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={mutation.isPending || selected.length === 0}
                    className="gap-2"
                  >
                    {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    Guardar aplicaciones
                  </Button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

  )
}

export default AplicacionesEquipo
