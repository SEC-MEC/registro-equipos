package main

import (
	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/utils"
	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	database.ConnectDB("")

	// Endpoint para llamar a la funcion capturePCInfo
	app.Get("/pcinfo", utils.CapturePCInfo)

	defer database.CloseDB()

	port := "8080"

	app.Listen(":" + port)

}
