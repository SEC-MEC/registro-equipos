import { useForm } from 'react-hook-form'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createEquipo, getAplicaciones, getOficinas } from '@/api/equipos'
import { Card, CardTitle, CardHeader, CardContent } from '../ui/card'

import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { toast } from "sonner"
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'




const RegisterForm = () => {


  const [selectedAplicaciones, setSelectedAplicaciones] = useState<any[]>([])
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
 
  const { data: oficinas, isLoading } = useQuery({
    queryKey: ['oficinas'],
    queryFn: () => getOficinas(),
  })

  const {data: aplicaciones, isLoadingAplicaciones} = useQuery({
    queryKey: ['aplicaciones'],
    queryFn: () => getAplicaciones(),
  })

  

  const queryClient = useQueryClient()
  const navigate = useNavigate()

const mutation = useMutation({
  mutationFn: createEquipo,
  onSuccess: (data) => {
    if (data.error) {
      toast("Ya existe un equipo con este nombre");
    } else {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast("Equipo registrado exitosamente", {
        description: data.message || "El equipo se ha registrado correctamente",
        action: {
          label: "Ver equipos",
          onClick: () => navigate('/auth'),
        },
      });
      navigate('/auth');
    }
  },
  onError: (error) => {
    toast("Error al registrar el equipo", {
      description: error.message || "Ocurrió un error inesperado.",
    });
    console.error("Error inesperado:", error);
  },
});


 

const onSubmit = (data: any) => {
  try {
   const unidad = data.unidad || 'Desconocida';  
    const oficina = data.oficina.trim() || 'SinOficina'; 
    // const unidadNombre = data.unidad || 'Desconocida';

    const tipo = data.tipo === 'PC' ? 'PC' : 'NOT';

    // const nombreCompleto = `${unidadNombre}-${tipo}-${oficina}`;
    // data.nombre = nombreCompleto;


    const dataJson = {
      nombre: data.nombre,
      unidad:data.unidad,
      id_oficina: data.oficina,
      observaciones: data.observaciones,
      nro_serie: data.nro_serie,
      tipo: tipo,
      dominio: data.dominio ? true : false,
      aplicaciones: selectedAplicaciones.map(app => ({
        id_equipo: app.id_equipo,
        id_app: app.id_app,
      })),
    };


    console.log("Datos a enviar:", dataJson);

    // mutation.mutate(dataJson);
  } catch (error) {
    console.log("Error:", error);
  }
};





  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Equipo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>

      <CardContent>
                <div>
                  <Label htmlFor="nombre">Nombre PC</Label>
                  <Input
                    type="text"
                    id='nombre'
                    placeholder="Nombre PC"
                    {...register('nombre')}
                  />
                </div>
              </CardContent>

              <CardContent>
                <div>
                  <Label htmlFor="nro_serie">Numero de serie</Label>
                  <Input
                    type="text"
                    id='nro_serie'
                    placeholder="Nro Serie"
                    {...register('nro_serie')}
                  />
                  {errors.nro_serie && <p className="text-red-500">{String(errors.nro_serie.message)}</p>}
                </div>
              </CardContent>
              <CardContent>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <select
                    id="tipo"
                    {...register('tipo')}
                    className="w-full p-2 border rounded"
                    defaultValue="PC"
                  >
                    <option disabled>Seleccione el tipo</option>
                    <option value="PC">PC</option>
                    <option value="NOT">Notebook</option>
                  </select>
                  {errors.tipo && <p className="text-red-500">{String(errors.tipo.message)}</p>}
                </div>
              </CardContent>
       
         <CardContent>
                <div>
                  <Label htmlFor="id_inventario">Id de Inventario</Label>
                  <Input
                    id="id_inventario"
                    placeholder='Id de Inventario'
                    {...register('id_inventario')}
                  />
                  {errors.id_inventario && <p className="text-red-500">{String(errors.id_inventario.message)}</p>}
                </div>
              </CardContent>

<CardContent>
  <div className="space-y-2">
    <Label htmlFor="oficina">Oficina</Label>
  <select
  id="oficina"
  {...register('oficina')}
  className="w-[400px] p-2 border rounded"
>
  <option value="">Seleccione una oficina</option>
  {isLoading ? (
    <option>Cargando...</option>
  ) : (
    oficinas?.map((oficina: any) => (
      <option
        key={`${oficina.id_ue}-${oficina.id}`}
        value={oficina.id}
      >
        {oficina.nombre}
      </option>
    ))
  )}
</select>
    {errors.unidad && <p className="text-red-500">{String(errors.unidad.message)}</p>}
  </div>
</CardContent>


<CardContent>
  <div className="space-y-2">
    <Label htmlFor="unidad">Unidad</Label>
    <select
      id="unidad"
      {...register('unidad')}
      className="w-[400px] p-2 border rounded"
    >
      <option value="" disabled>Seleccione una unidad</option>
        <option value="DGS" >Direccion General de Secretaria </option>
      <option value="EDU">Educacion</option>
            <option value="DNC">Direccin Nacional de Cultura</option>
     <option value="PECA">PECA</option>
    </select>
    {errors.unidad && <p className="text-red-500">{String(errors.unidad.message)}</p>}
  </div>
</CardContent>


              <CardContent>
                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Observaciones.."
                    {...register('observaciones')}
                    className='resize-none'
                  />
                  {errors.observaciones && <p className="text-red-500">{String(errors.observaciones.message)}</p>}
                </div>
              </CardContent>


               <CardContent>
               <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="dominio"
                    {...register('dominio')}
                    onCheckedChange={(checked) => {
                      setValue('dominio', checked)
                    }}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="dominio">En Dominio</Label>
                    <div>Marque si el equipo está en el dominio.</div>
                  </div>
                </div>
              </CardContent>

              <CardContent>
                <div>
                  {
                    aplicaciones.map((item: any) => (
                      <div>
                        <Checkbox
                          id={item.id}
                          key={item.id}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAplicaciones([...selectedAplicaciones, item])
                            } else {
                              setSelectedAplicaciones(selectedAplicaciones.filter(app => app.id !== item.id))
                            }
                          }}
                        />
                        <Label htmlFor={item.id}>{item.nomre}</Label>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            
              <Button
    type="submit"
    className='w-full'
  >
    Registrar
  </Button>

      </form>
    </Card>
  )
}

export default RegisterForm