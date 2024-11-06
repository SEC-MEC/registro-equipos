package models

type Equipo struct {
	Id_equipo     int     `json:"id_equipo"`
	Nombre        *string `json:"nombre_pc"`
	Nro_serie     *string `json:"nro_serie"`
	Oficina       *string `json:"oficina"`
	Id_oficina    *int    `json:"id_oficina"`
	Id_inventario *string `json:"id_inventario"`
	Tipo          string  `json:"tipo"`
	Observaciones *string `json:"observaciones"`
	Piso          *int    `json:"piso"`
	Dominio       bool    `json:"dominio"`
}
