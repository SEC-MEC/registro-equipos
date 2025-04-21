import { getOficinas } from "@/api/equipos"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Building2, ChevronRight, Loader2, MapPin, Phone, Mail, Search } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "../ui/tabs"

const ItemOficinaDetallado = () => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOffice, setSelectedOffice] = useState<any>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["oficinas"],
    queryFn: getOficinas,
  })

  const filteredData = data?.filter(
    (item: any) =>
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectOffice = (office: any) => {
    setSelectedOffice(office)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Ver oficinas</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Listado de Oficinas
          </DialogTitle>
          <DialogDescription>Consulta la información detallada de todas las oficinas disponibles.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-destructive">
            <p>Error al cargar las oficinas</p>
          </div>
        ) : data && data.length > 0 ? (
          <Tabs defaultValue="lista" className="w-full">
           

            <TabsContent value="lista" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar oficinas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {filteredData?.map((item: any, index: number) => (
                    <Card
                      key={item.id || index}
                      className={`overflow-hidden cursor-pointer transition-all hover:border-primary ${selectedOffice?.id === item.id ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => handleSelectOffice(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.nombre || "Sin nombre"}</h3>
                            {item.nom && <p className="text-sm text-muted-foreground">{item.nom}</p>}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {item.ciudad && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {item.ciudad}
                              {item.estado ? `, ${item.estado}` : ""}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {filteredData?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No se encontraron oficinas con ese término</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="detalle">
              {selectedOffice && (
                <Card>
                  <CardHeader className="bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedOffice.nombre}</h2>
                        {selectedOffice.nom && <p className="text-muted-foreground">{selectedOffice.nom}</p>}
                      </div>
                      <Badge variant="outline">{selectedOffice.id || "ID no disponible"}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-6">
                        {(selectedOffice.direccion || selectedOffice.ciudad || selectedOffice.estado) && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Ubicación
                            </h3>
                            <div className="pl-6 space-y-1">
                              {selectedOffice.direccion && <p>{selectedOffice.direccion}</p>}
                              {(selectedOffice.ciudad || selectedOffice.estado) && (
                                <p>
                                  {selectedOffice.ciudad}
                                  {selectedOffice.estado ? `, ${selectedOffice.estado}` : ""}
                                </p>
                              )}
                              {selectedOffice.codigo_postal && <p>CP: {selectedOffice.codigo_postal}</p>}
                            </div>
                          </div>
                        )}

                        {(selectedOffice.telefono || selectedOffice.email) && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Contacto</h3>
                            <div className="pl-6 space-y-2">
                              {selectedOffice.telefono && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedOffice.telefono}</span>
                                </div>
                              )}
                              {selectedOffice.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedOffice.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {Object.entries(selectedOffice).filter(
                          ([key, value]) =>
                            ![
                              "id",
                              "nombre",
                              "nom",
                              "direccion",
                              "ciudad",
                              "estado",
                              "telefono",
                              "email",
                              "codigo_postal",
                            ].includes(key) && value,
                        ).length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Información adicional</h3>
                            <div className="pl-6 grid grid-cols-2 gap-x-4 gap-y-2">
                              {Object.entries(selectedOffice).map(([key, value]) => {
                                if (
                                  ![
                                    "id",
                                    "nombre",
                                    "nom",
                                    "direccion",
                                    "ciudad",
                                    "estado",
                                    "telefono",
                                    "email",
                                    "codigo_postal",
                                  ].includes(key) &&
                                  value
                                ) {
                                  return (
                                    <div key={key}>
                                      <span className="text-muted-foreground text-sm">{key}:</span>
                                      <p>{String(value)}</p>
                                    </div>
                                  )
                                }
                                return null
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay oficinas disponibles</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ItemOficinaDetallado
