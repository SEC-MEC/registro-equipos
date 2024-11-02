package models

type User struct {
	Id       int    `json:"id"`
	UserName string `json:"usuario"`
	Password string `json:"pass"`
	Nombre   string `json:"nombre"`
	Apellido string `json:"apellido"`
	Es_admin bool   `json:"es_admin"`
}
