package main

import (
	"log"
	"os"

	"github.com/SEC-MEC/registro-equipos.git/controllers"
	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {

	app := fiber.New()

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error cargando el archivo .env: %v", err)
	} else {
		log.Println("=>Variables de entorno cargadas correctamente")
	}
	database.ConnectDB()

	// Endpoint para llamar a la funcion capturePCInfo
	app.Get("/pcinfo", utils.CapturePCInfo)
	app.Post("/users", controllers.CreateUser)

	defer database.CloseDB()

	port := os.Getenv("PORT")

	app.Listen(":" + port)

}
