package main

import (
	"log"
	"os"

	"github.com/SEC-MEC/registro-equipos.git/controllers"
	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	urlOrigin := os.Getenv("URL_FRONTEND")

	corsOptions := cors.New(cors.Config{
		AllowOrigins:     urlOrigin,
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type, Authorization",
		AllowCredentials: true,
	})

	app.Use(corsOptions)

	database.ConnectDB()

	// Endpoint para llamar a la funcion capturePCInfo
	app.Post("/pcinfo", utils.CapturePCInfo)

	// User endpoints
	app.Post("/user", controllers.CreateUser)
	app.Post("/login", controllers.LoginHandler)
	app.Get("/auth", controllers.ProtectedHandler)

	//Equipo endpoints
	app.Post("/equipo", controllers.CreateEquipo)
	app.Get("/equipos", controllers.GetEquipos)

	//Oficina endpoints
	app.Get("/oficinas", controllers.GetOficinas)

	defer database.CloseDB()

	port := os.Getenv("PORT")

	app.Listen(":" + port)

}
