
export interface Equipo {
  id_equipo: number;
  nombre?: string | null;
  id_oficina?: number | null;
  id_apps?: number[] | null;
  id_tecnico?: number | null;
  nro_serie?: string | null;
  id_usuario?: number | null;
  id_inventario?: string | null;
  tipo: string;
  observaciones?: string | null;
  dominio: boolean;
  oficina?: Oficina | null;
  ue?: UE | null;
  usuarios?: Usuario[] | null;
  aplicaciones?: Aplicacion[] | null;
}

export interface Oficina {
  id: number;
  nombre: string;
  piso?: number;
}

export interface UE {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  usr: string;
}

export interface Aplicacion {
  id: number;
  nombre: string;
  version: string;
}


export interface ChangePasswordData {
  pass: string;
}

export interface UpdateEquipoData {
  dataToUpdate: string;
}