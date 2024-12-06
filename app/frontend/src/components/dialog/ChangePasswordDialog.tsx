import { useState } from "react"
import { Eye, EyeOff, Lock } from 'lucide-react'
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
import { KeyRound } from 'lucide-react';
import { useMutation } from "@tanstack/react-query"
import { changePassword } from "@/api/auth"
import { useAuthStore } from "@/context/store"
import { toast } from "sonner"

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const profile = useAuthStore((state) => state.profile)
  const userId = profile.data.id


  const mutation = useMutation({
    mutationFn: (data: any) => changePassword(userId, data),
    onSuccess: (data: any) => {
      toast("Se cambio la contraseña correctamente", {
        description: data.success,
      })
    },
    onError: (data: any) => {
      toast("Error en el cambio de la contraseña", {
        description: data.error
      })
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }
  
    mutation.mutate(newPassword)
    setOpen(false)
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full hover:bg-gray-100 flex rounded-md gap-2 py-1 px-3  font-semibold"><span><KeyRound className="w-4"/></span> <p className="ml-3 text-sm">Cambiar contraseña</p></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-xl text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Cambiar contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

