'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createEquipo, getAplicaciones, getOficinas } from '@/api/equipos'
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from '../ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { toast } from "sonner"

import { Checkbox } from '../ui/checkbox'
import { useAuthStore } from '@/context/store'

const RegisterForm = () => {
  const [step, setStep] = useState(1)

 const profile = useAuthStore(state => state.profile)
  const userId = profile.data.id

  const { register, handleSubmit, } = useForm({
  })

  const { data: oficinas, isLoading } = useQuery({
    queryKey: ['oficinas'],
    queryFn: () => getOficinas(),
  })

  const { data: aplicaciones } = useQuery({
    queryKey: ['aplicaciones'],
    queryFn: () => getAplicaciones(),
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos'] })
      navigate('/dashboard')
      toast("Equipo registrado correctamente", {
        description: "El equipo se ha registrado correctamente",
        action: {
          label: "Ver equipos",
          onClick: () => navigate('/dashboard'),
        },
      })
    },
    onError: (error) => {
      toast("Error al registrar el equipo", {
        description: error.message,
      })
    }
  })

  const onSubmit = (data: any) => {
    try {

      // const nextNumber = getNextNumber();

      // const nombreCompleto = `${data.unidad}-${tipo}-${oficinaNombre}-${nextNumber}`;
      // data.nombre = nombreCompleto;

      const dataJson = {
        nombre: data.nombre,
        unidad:data.unidad,
        id_oficina: data.oficina,
        observaciones: data.observaciones,
        nro_serie: data.nro_serie,
        tipo: data.tipo,
        id_inventario:  data.id_inventario,
        dominio: data.dominio ? true : false,
        id_tecnico: userId
      };

      mutation.mutate(dataJson)
    } catch (error) {
      console.log(error)
    }
  }

  // let lastNumber = 0;
  // const getNextNumber = () => {
  //   lastNumber += 1;
  //   return lastNumber.toString().padStart(3, '0');
  // };

  const nextStep = () => setStep(2)
  const prevStep = () => setStep(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Equipo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Label> Nombre de PC   </Label>
                  <Input
                    type="text"
                    id='nombre'
                    placeholder="Nombre"
                    {...register('nombre')}
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
                

                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <div>
                    <Checkbox
                      id="dominio"
                      {...register('dominio')}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="dominio">En Dominio</Label>
                    <div>Marque si el equipo está en el dominio.</div>
                  </div>
                </div>
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
    <Label htmlFor="oficina">Oficina</Label>
  <select
  id="oficina"
  {...register('oficina')}
  className="w-[400px] p-2 border rounded"
>
  <option value="" disabled>Seleccione una oficina</option>
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
                  <Label>Aplicaciones</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {aplicaciones.map((app: any) => (
                      <div key={app} className="flex items-center space-x-2">
                        <Checkbox
                          id={app}
                          {...register('aplicaciones')}
                          value={app.nombre}
                        />
                        <Label htmlFor={app}>{app.nombre}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
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