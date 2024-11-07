package models

type Equipo struct {
	Id_equipo     int           `json:"id_equipo"`
	Nombre        *string       `json:"nombre"`
	Id_oficina    *int          `json:"id_oficina"`
	Id_apps       *[]int        `json:"id_apps"`
	Id_tecnico    *int          `json:"id_tecnico"`
	Nro_serie     *string       `json:"nro_serie"`
	Id_usuario    *int          `json:"id_usuario"`
	Id_inventario *string       `json:"id_inventario"`
	Tipo          string        `json:"tipo"`
	Observaciones *string       `json:"observaciones"`
	Dominio       bool          `json:"dominio"`
	Oficina       *Oficina      `json:"oficina,omitempty"`
	UE            *UE           `json:"ue,omitempty"`
	Usuarios      []*Usuario    `json:"usuarios,omitempty"`
	Aplicaciones  []*Aplicacion `json:"aplicaciones,omitempty"`
}

type Oficina struct {
	ID     int    `json:"id"`
	Nombre string `json:"nombre"`
	Piso   int    `json:"piso"`
	UE     *UE    `json:"ue,omitempty"`
}

// UE representa la unidad ejecutora.
type UE struct {
	ID     int    `json:"id"`
	Nombre string `json:"nombre"`
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
