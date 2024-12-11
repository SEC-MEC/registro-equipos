import { Card, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { registerRequest } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const userMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data: any) => {
      toast("Usuario registrado correctamente", {
        description: data.message,
      });
      navigate('/auth');
      console.log(data);
    },
    onError: (error: any) => {
      toast("Error al registrar el usuario", {
        description: error.error,
      });
    },
  });

  const onSubmit = (data: any) => {
    const dataJson = {
      nombre: data.nombre,
      apellido: data.apellido,
      usuario: data.usuario,
      pass: data.pass,
      es_admin: data.es_admin === 'true' ? true : false,
    };
    userMutation.mutate(dataJson);
  };

  const password = watch('pass');

  return (
    <div className='flex justify-center items-center mt-24 p-4'>
      <Card className='px-6 py-6 w-3/12'>
        <form onSubmit={handleSubmit(onSubmit)} className=''>
          <CardContent>
            <div>
              <Label>Nombre</Label>
              <Input placeholder="Nombre" {...register('nombre', { required: true })} />
              {errors.nombre && <span className="text-red-500">Este campo es obligatorio</span>}
            </div>
          </CardContent>
          <CardContent>
            <div>
              <Label>Apellido</Label>
              <Input placeholder="Apellido" {...register('apellido', { required: true })} />
              {errors.apellido && <span className="text-red-500">Este campo es obligatorio</span>}
            </div>
          </CardContent>
          <CardContent>
            <div>
              <Label>Usuario</Label>
              <Input placeholder="Usuario" {...register('usuario', { required: true })} />
              {errors.usuario && <span className="text-red-500">Este campo es obligatorio</span>}
            </div>
          </CardContent>
          <CardContent>
            <div>
              <Label>Contraseña</Label>
              <Input type="password" placeholder="Contraseña" {...register('pass', { required: true })} />
              {errors.pass && <span className="text-red-500">Este campo es obligatorio</span>}
            </div>
          </CardContent>
          <CardContent>
            <div>
              <Label>Repetir Contraseña</Label>
              <Input
                type="password"
                placeholder='Repetir Contraseña'
                {...register('repeatPass', {
                  required: true,
                  validate: value => value === password || 'Las contraseñas no coinciden',
                })}
              />
              {errors.repeatPass && <span className="text-red-500">{typeof errors.repeatPass.message === 'string' ? errors.repeatPass.message : ''}</span>}
            </div>
          </CardContent>
          <CardContent>
            <div className='flex space-y-2 flex-col'>
              <Label>Rol</Label>
              <select className='w-full rounded-md border px-2 py-1' {...register('es_admin', { required: true })}>
                <option value="true">Administrador</option>
                <option value="false">Usuario</option>
              </select>
              {errors.es_admin && <span className="text-red-500">Este campo es obligatorio</span>}
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full mt-5' disabled={userMutation.isPending} type='submit'>
              {userMutation.isPending ? (<><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Registrando... </>) : 'Registrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;