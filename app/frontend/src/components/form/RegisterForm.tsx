
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createEquipo, generateEquipoName, getAplicaciones, getOficinas } from '@/api/equipos'
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '../ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { toast } from "sonner"
import { useAuthStore } from '@/context/store'

import { HardDrive, Loader2, MonitorCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Building } from 'lucide-react';
import { ScrollShadow } from '@nextui-org/react'


interface CreateEquipoInput {
  nombre: string;
  [key: string]: any; 
}

const RegisterForm = () => {
  const [step, setStep] = useState(1)
  const [generatedName, setGeneratedName] = useState('');
  const [selectedAplicaciones ,setSelectedAplicaciones] = useState<{id: string}[]>([]);
  const [data, setData] = useState(null);

 const profile = useAuthStore(state => state.profile)
  const userId = profile.data.id

  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      nombre: '',
      nro_serie: '',
      tipo: 'PC',
      id_inventario: '',
      dominio: false,
      observaciones: '',
      nombre_usuario: '',
      oficina: '',
      unidad: '',
      equipo_usuario: ''
    }
  })

  const { data: oficinas, isLoading } = useQuery({
    queryKey: ['oficinas'],
    queryFn: () => getOficinas(),
  })

  const {data: aplicaciones} = useQuery({
    queryKey: ['aplicaciones'],
    queryFn: () => getAplicaciones()
  })



  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const generateNameMutation = useMutation({
    mutationFn: generateEquipoName, 
    onSuccess: (generatedName: any) => {
      setGeneratedName(generatedName);
      setValue('nombre', generatedName);
    },
    onError: (error: any) => {
      toast("Error al generar el nombre del equipo", {
        description: error?.error || error.message,
      });
    }
  });

  const createEquipoMutation = useMutation({
    mutationFn: createEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] })
      navigate('/auth')
      toast("Equipo registrado correctamente", {
        description: "El equipo se ha registrado correctamente",
        action: {
          label: "Ver equipos",
          onClick: () => navigate('/dashboard'),
        },
      })
    },
    onError: (error: any) => {
      toast("Error al registrar el equipo", {
          description: error?.error || error.message,
      });
  }
  })


  const onSubmit = (data: any) => {
    try {
      const oficinaData = JSON.parse(data.oficina);
      const oficinaNomenclatura = oficinaData.nom.trim();
      const idOficina = oficinaData.id;
      const generarNombre = `${data.unidad}-${data.tipo}-${oficinaNomenclatura}`;

      const dataJson = {
        nombre: getValues('nombre') || generarNombre,
        id_oficina: idOficina,
        observaciones: data.observaciones,
        nro_serie: data.nro_serie,
        tipo: data.tipo,
        id_inventario:  data.id_inventario,
        dominio: data.dominio,
        equipo_usuario: data.equipo_usuario,
        id_tecnico: userId, 
        aplicaciones: selectedAplicaciones.map(app => app.id),
      };
      console.log(dataJson)
      handleGenerateName(dataJson)
    } catch (error) {
      console.log(error)
    }
  }

  const handleGenerateName = (data: any) => {
    generateNameMutation.mutate(data.nombre);
    setData(data);
  };
  
  function isCreateEquipoInput(data: any): data is CreateEquipoInput {
    return typeof data === 'object' && !Array.isArray(data) && 'nombre' in data;
  }

  const handleCreateEquipo = () => {
    if (isCreateEquipoInput(data)) {
      const currentNombre = getValues('nombre');
      createEquipoMutation.mutate({ ...(data as CreateEquipoInput), nombre: currentNombre });
    } else {
      toast("Error al registrar el equipo", {
        description: "Datos inválidos",
      });
    }
  };

  const handleCheckboxChange = (aplicacionId: string) => {
    setSelectedAplicaciones(prev => {
      if (prev.some(app => app.id === aplicacionId)) {
        return prev.filter(app => app.id !== aplicacionId);
      }
      return [...prev, { id: aplicacionId }];
    });
  };
  
  

  const nextStep = () => setStep(2)
  const prevStep = () => setStep(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>Registro de Equipo <HardDrive/></CardTitle>
        {   generatedName && (
            <Alert className='grid grid-cols-1 p-3 py-4 space-y-2'>
            <AlertTitle className='text-start font-semibold'>
            {
                <CardContent className=' flex flex-col  space-y-5  p-4 items-center'>
                  <AlertDescription className='text-center text-xl '>Nombre del equipo</AlertDescription>
                        <Input
                          type="text"
                          id='nombre'
                          defaultValue={generatedName}
                          className='' 
                          {...register('nombre')}
                          />
                     </CardContent>
             
            }
            </AlertTitle>
            <div className='flex items-center  justify-center'>

            <Button onClick={handleCreateEquipo} disabled={createEquipoMutation.isPending} 
            >
              {
                createEquipoMutation.isPending ? <><Loader2 className='mr-2 h-4 w-4 animate-spin'/> Registrando...</> : "Confirmar nombre"
              }
              </Button>
                        </div>
                      </Alert>
                    )
                  }
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
             
              <CardContent>
                <div>
                  <Label> Numero de serie   </Label>
                  <Input
                    type="text"
                    id='nro_serie'
                    placeholder="Nro Serie"
                    {...register('nro_serie')}
                  />
                </div>
              </CardContent>
              <CardContent>
                <div>
                  <Label> Tipo </Label>
                  <select
                    id="tipo"
                    {...register('tipo')}
                    className="w-full p-2 border rounded"
                    defaultValue="PC"
                  >
                    <option value="PC">PC</option>
                    <option value="NOT">Notebook</option>
                  </select>
                </div>
              </CardContent>

             <CardContent>
              <Label>Dominio</Label>
              <select  {...register('dominio')} className="w-full  p-2 border rounded" required>
                <option value="true">En dominio</option> 
                <option value="false">Sin dominio</option>
              </select>
             </CardContent>
              <CardContent>
                <div>
                  <Label> Id de Inventario </Label>
                  <Input
                    id="id_inventario"
                    placeholder='Id de Inventario'
                    {...register('id_inventario')}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="button" onClick={nextStep} className="w-full">Siguiente</Button>
              </CardFooter>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
             <CardContent>
  <div className="space-y-2">
    <Label htmlFor="oficina" className='flex items-center gap-1'> Oficina <Building/></Label>
  <select
  id="oficina"
  {...register('oficina')}
  className="w-[400px] p-2 border rounded" required
>
  <option value="" disabled>Seleccione una oficina</option>
  {isLoading ? (
    <option>Cargando...</option>
  ) : (
    oficinas?.map((oficina: any) => (
      <option
        key={`${oficina.id_ue}-${oficina.id}`}
        value={JSON.stringify(oficina)}
      >
        {oficina.nombre}
      </option>
    ))
  )}
</select>
  </div>
</CardContent>

             

<CardContent>
  <div className="space-y-2">
    <Label htmlFor="unidad" className='flex gap-2 items-center'>Unidad <Building/></Label>
    <select
      id="unidad"
      {...register('unidad')}
      className="w-[400px] p-2 border rounded" required
    >
      <option value="" disabled> Seleccione una unidad</option>
        <option value="DGS" >Direccion General de Secretaria </option>
      <option value="EDU">Educacion</option>
            <option value="DNC">Direccion Nacional de Cultura</option>
     <option value="PECA">PECA</option>
     <option value="DNREC">Direccion Nacional de Registro Civil</option>
    </select>

  </div>
</CardContent>

              <CardContent>
                <div>
                  <Label> Observaciones    </Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Observaciones.."
                    {...register('observaciones')}
                    className='resize-none'
                  />
                </div>
              </CardContent>
              <CardContent>
                <div>
                  <Label> Nombre del usuario para esta PC</Label>
                  <Input
                    id="equipo_usuario"
                    placeholder="Nombre del usuario.."
                    {...register('equipo_usuario')}
                  />
                </div>
              </CardContent>
            
              {
              !aplicaciones || aplicaciones.length === 0 ? <div className='flex items-center justify-center text-xl'>No hay aplicaciones disponibles</div> : null
            }            
            <Label className=' flex  justify-center items-center text-md gap-2'>Aplicaciones instaladas <MonitorCheck/> </Label>
            <ScrollShadow offset={100} orientation="horizontal" className="w-full h-[300px] overflow-y-auto rounded-md border">
            {
              aplicaciones?.map((app: {id: number, nombre: string}) => (
                <div key={app.id} className="flex gap-1 items-center  px-4">
                <input
        type="checkbox"
        id={`app-${app.id}`}
        className=" p-4 rounded-md"
        onChange={() => handleCheckboxChange(app.id.toString())}
      />
              <label htmlFor={`app-${app.id}`} className="flex-grow cursor-pointer">{app.nombre}</label>
                </div>
              ))
            } 
            </ScrollShadow>

              <CardFooter className='py-2'>
                <Button type="button" onClick={prevStep} className="w-full mr-2">Volver</Button>
                <Button type="submit" className="w-full">Registrar</Button>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Card>
  )
}

export default RegisterForm