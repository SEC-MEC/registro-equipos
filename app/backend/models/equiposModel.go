package models

type Equipo struct {
	Id_equipo     int           `json:"id_equipo"`
	Nombre        *string       `json:"nombre"`
	Id_oficina    *int          `json:"id_oficina,omitempty"`
	Id_apps       *[]int        `json:"id_apps,omitempty"`
	Id_tecnico    *int          `json:"id_tecnico,omitempty"`
	Nro_serie     *string       `json:"nro_serie,omitempty"`
	Id_usuario    *int          `json:"id_usuario,omitempty"`
	Id_inventario *string       `json:"id_inventario,omitempty"`
	Tipo          string        `json:"tipo"`
	Observaciones *string       `json:"observaciones,omitempty"`
	Dominio       bool          `json:"dominio"`
	Oficina       *Oficina      `json:"oficina,omitempty"`
	UE            *UE           `json:"ue,omitempty"`
	Usuarios      []*Usuario    `json:"usuarios,omitempty"`
	Aplicaciones  []*Aplicacion `json:"aplicaciones,omitempty"`
	Modificado    *Modificado   `json:"modificado"`
}

type Oficina struct {
	ID     int    `json:"id"`
	Nombre string `json:"nombre"`
	Nom    string `json:"nom"`
	Piso   int    `json:"piso"`
	UE     *UE    `json:"ue,omitempty"`
}

// UE representa la unidad ejecutora.
type UE struct {
	ID     int    `json:"id"`
	Nombre string `json:"nombre"`
	Nom    string `json:"nom"`
}

// Usuario representa la estructura de un usuario.
type Usuario struct {
	ID       int    `json:"id"`
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
	Usr      string `json:"usr"`
}

// Aplicacion representa la estructura de una aplicación.
type Aplicacion struct {
	ID      int    `json:"id"`
	Nombre  string `json:"nombre"`
	Version string `json:"version"`
}

type Modificado struct {
	ID         int    `json:"id_equipo"`
	Id_tecnico string `json:"id_tecnico"`
	Fecha      string `json:"fecha"`
}
