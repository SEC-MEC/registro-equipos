import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { registerRequest } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      es_admin: data.es_admin === 'true',
    };
    userMutation.mutate(dataJson);
  };

  const password = watch('pass');

  return (
    <div className='flex justify-center items-center mt-24 p-4'>
      <Card className='w-full max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 p-6'>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Nombre"
              {...register('nombre', { required: 'Este campo es obligatorio' })}
              required
            />
            {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              placeholder="Apellido"
              {...register('apellido', { required: 'Este campo es obligatorio' })}
              required
            />
            {errors.apellido && <span className="text-red-500 text-sm">{errors.apellido.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usuario">Usuario</Label>
            <Input
              id="usuario"
              placeholder="Usuario"
              {...register('usuario', { required: 'Este campo es obligatorio' })}required
            />
            {errors.usuario && <span className="text-red-500 text-sm">{errors.usuario.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pass">Contraseña</Label>
            <div className="relative">
              <Input
                id="pass"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                {...register('pass', { required: 'Este campo es obligatorio' })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            {errors.pass && <span className="text-red-500 text-sm">{errors.pass.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatPass">Repetir contraseña</Label>
            <div className="relative">
              <Input
                id="repeatPass"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                {...register('repeatPass', {
                  required: 'Este campo es obligatorio',
                  validate: value => value === password || 'Las contraseñas no coinciden',
                })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            {errors.repeatPass && <span className="text-red-500 text-sm">{errors.repeatPass.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="es_admin">Rol</Label>
            <Select {...register('es_admin')} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Administrador</SelectItem>
                <SelectItem value="false">Usuario</SelectItem>
              </SelectContent>
            </Select>
            {errors.es_admin && <span className="text-red-500 text-sm">{errors.es_admin.message as string}</span>}
          </div>

          <Button className='w-full mt-6' disabled={userMutation.isPending} type='submit'>
            {userMutation.isPending ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Registrando...
              </>
            ) : 'Registrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;

