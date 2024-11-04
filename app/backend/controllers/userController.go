package controllers

import (
	"log"

	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/middlewares"
	"github.com/SEC-MEC/registro-equipos.git/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// Controlador para manejar la solicitud POST
func CreateUser(c *fiber.Ctx) error {
	user := new(models.User)

	// Parsear el JSON de la estructura user
	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No se pudieron leer los datos"})
	}

	// Validacion de campos respuesta en json de error
	if user.Nombre == "" || user.Password == "" || user.Apellido == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Todos los campos son obligatorios"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		log.Printf("Error al hashear la contraseña: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al procesar la contraseña"})
	}

	user.Password = string(hashedPassword)

	//Insert en la base de datos
	query := "INSERT INTO tecnico (usuario, pass, nombre, apellido, es_admin) VALUES (?, ?, ?, ?, ?)"
	result, err := database.DB.Exec(query, user.UserName, user.Password, user.Nombre, user.Apellido, user.Es_admin)
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
		"message": "Usuario registrado con éxito",
		"user_id": insertedID,
	})
}

type LoginCredentials struct {
	Username string `json:"usuario"`
	Password string `json:"pass"`
}

func LoginHandler(c *fiber.Ctx) error {
	credentials := new(LoginCredentials)

	// Parsear el JSON de las credenciales
	if err := c.BodyParser(credentials); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No se pudieron leer los datos"})
	}

	// Buscar el usuario en la base de datos
	var user models.User
	query := "SELECT id, usuario, pass, nombre, apellido FROM tecnico WHERE usuario = ?"
	err := database.DB.QueryRow(query, credentials.Username).Scan(&user.Id, &user.UserName, &user.Password, &user.Nombre, &user.Apellido)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Credenciales inválidas"})
	}

	// Comparar password hasheada
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Credenciales inválidas"})
	}

	// Generar el token JWT
	tokenString, err := middlewares.CreateToken(uint(user.Id), user.UserName, user.Nombre, user.Apellido, user.Es_admin)
	if err != nil {
		log.Printf("Error generando el token: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error generando el token"})
	}

	// Responder con el token
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": tokenString,
	})
}

func ProtectedHandler(c *fiber.Ctx) error {
	// Obtener el token del encabezado Authorization
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Error de Authorization"})
	}

	// Remover el "Bearer " del token
	tokenString = tokenString[len("Bearer "):]

	// Verificar y decodificar el token JWT
	claims, err := middlewares.VerifyToken(tokenString)
	if err != nil {
		log.Printf("Error al verificar el token: %v", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Token inválido"})
	}

	// Extraer los datos del token
	usuario, ok1 := claims["usuario"].(string)
	nombre, ok2 := claims["nombre"].(string)
	apellido, ok3 := claims["apellido"].(string)
	es_admin, ok4 := claims["es_admin"].(bool)
	userID, ok5 := claims["id"].(float64)

	if !(ok1 && ok2 && ok3 && ok4 && ok5) {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener datos del token"})
	}

	// Crear el mapa de respuesta con los datos obtenidos
	responseData := fiber.Map{
		"id":       userID,
		"usuario":  usuario,
		"nombre":   nombre,
		"apellido": apellido,
		"es_admin": es_admin,
	}

	// Enviar la respuesta en formato JSON
	return c.JSON(responseData)
}
