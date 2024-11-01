package main

import (
	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/utils"
	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	database.ConnectDB("root:1234@tcp(172.24.3.229:3308/inventario")

	// Endpoint para llamar a la funcion capturePCInfo
	app.Get("/pcinfo", utils.CapturePCInfo)

	defer database.CloseDB()

	port := "8080"

	app.Listen(":" + port)

}
