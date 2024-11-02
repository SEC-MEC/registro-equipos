package models

type Equipo struct {
	Id            int     `json:"id"`
	Nombre        *string `json:"nombre"`
	Nro_serie     string  `json:"nro_serie"`
	Id_oficina    *int    `json:"id_oficina"`
	Id_inventario *string `json:"id_inventario"`
	Tipo          string  `json:"tipo"`
	Observaciones *string `json:"observaciones"`
	Dominio       bool    `json:"dominio"`
}
