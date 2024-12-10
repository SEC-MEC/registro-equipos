
import { updateEquipo } from "@/api/equipos";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Loader2, Pencil } from 'lucide-react';
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";


interface UpdateDialogProps {
    id: number;
    }

const UpdateDialog: React.FC<UpdateDialogProps> = ({id}) => {

    const { register, handleSubmit, reset } = useForm({
    })

    const queryClient = useQueryClient()


    const updateMutation = useMutation({
        mutationFn: (data: any) => updateEquipo(id, data),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({queryKey: ['equipos']})
            toast("Equipo actualizado correctamente", {
                description: data.message,
            }),
            reset()
           
        }, 
        onError: (data: any) => {
            toast("Error al actualizar el equipo", {
                description: data.error
            })
        }
    })

    const onSubmit =  (data: any) => {
     updateMutation.mutate({dataToUpdate: data})         
         
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="border bg-white text-black px-2 rounded-md py-1 shadow-xl hover:bg-gray-200"><Pencil className="w-4"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar datos de este equipo</DialogTitle>
          <DialogDescription>
            Haz cambios de este equipo. Haz click en guardar cambios cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre Pc
            </Label>
            <Input id="nombre"  className="col-span-3" {...register('nombre')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            
            <Label htmlFor="name" className="text-right">
              Nro Serie
            </Label>
            <Input id="nro_serie"  className="col-span-3" {...register('nro_serie')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            
            <Label htmlFor="observaciones" className="text-right">
              Observaciones
            </Label>
             <Textarea
                    id="observaciones"
                    placeholder="Observaciones.."
                    {...register('observaciones')}
                    className='resize-none'
                  />
          </div>
     
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Id inventario
            </Label>
            <Input id="id_inventario"  className="col-span-3" {...register('id_inventario')} />
          </div>
         
        </div>
        <DialogFooter>
          <Button type="submit" disabled={updateMutation.isPending}> { updateMutation.isPending ? <><Loader2  className="animate-spin w-4 h-4 mr-2"/> Guardando cambios</> : <>Guardar cambios</> } </Button>
        </DialogFooter>
         </form>
      </DialogContent>
    </Dialog>
  )
}


export default UpdateDialog