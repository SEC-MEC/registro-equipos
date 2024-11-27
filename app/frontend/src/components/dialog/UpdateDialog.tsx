// import { update } from "@/api/aplicaciones";
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// interface UpdateDialogProps {
//     id: number;
//     }

// const UpdateDialog: React.FC<UpdateDialogProps> = ({id}) => {

//     const { register, handleSubmit, } = useForm({
//     })

//     const queryClient = useQueryClient()
//     const navigate = useNavigate()

//     const updateMutation = useMutation({
//         mutationFn: (data: any) => update(id, data),
//         onSuccess: (data: any) => {
//             queryClient.invalidateQueries({queryKey: ['items']})
//             toast("Equipo actualizado correctamente", {
//                 description: data.message,
//                 action: {
//                     label: "Ir al inicio",
//                     onClick: () => navigate('/auth'),
//                 },
//             })
//         } 
//     })

//     const handleSubmit =  (data: any) => {
//          updateMutation.mutate(data)
//     }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Edit Profile {id}</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit profile</DialogTitle>
//           <DialogDescription>
//             Make changes to your profile here. Click save when you're done.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Nro Serie
//             </Label>
//             <Input id="nro_serie" value="nro_serie" className="col-span-3" {...register('nro_serie')} />
//           </div>
          
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Id inventario
//             </Label>
//             <Input id="nro_serie" value="nro_serie" className="col-span-3" {...register('nro_serie')} />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="username" className="text-right">
//               Username
//             </Label>
//             <Input id="nro_serie" value="nro_serie" className="col-span-3" {...register('nombre')} />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


// export default UpdateDialog