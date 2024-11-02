package controllers

import (
	"log"

	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/models"
	"github.com/gofiber/fiber/v2"
)

// Controlador para manejar la solicitud POST
func CreateUser(c *fiber.Ctx) error {
	user := new(models.User)

	// Parsear el JSON de la estructura user
	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No se pudieron leer los datos"})
	}

	// Validacion de campos respuesta en json de error
	if user.UserName == "" || user.Password == "" || user.Age == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Todos los campos son obligatorios"})
	}

	//Insert en la base de datos
	query := ""
	result, err := database.DB.Exec(query, user.UserName, user.Password, user.Age)
	if err != nil {
		log.Printf("Error al insertar el usuario: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al insertar el usuario"})
	}

	// obtener el id del ultimo registro insertado
	insertedID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error al obtener el ID del usuario insertado: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener el ID del usuario insertado"})
	}

	// Respuesta en json con message y user_id
	return c.JSON(fiber.Map{
		"message": "Usuario insertado con éxito",
		"user_id": insertedID,
	})
}
