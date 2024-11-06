package controllers

import (
	"database/sql"
	"log"

	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/models"
	"github.com/gofiber/fiber/v2"
)

func CreateEquipo(c *fiber.Ctx) error {

	equipo := new(models.Equipo)

	if err := c.BodyParser(equipo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No se pudieron leer los datos"})
	}

	// Validar si ya existe el equipo con ese nombre
	validNombre := "SELECT * FROM equipo WHERE nombre = ?"
	_, err := database.DB.Query(validNombre, equipo.Nombre)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Ya existe un equipo con ese nombre"})
	}

	// Validar si ya existe el equipo con ese numero de serie
	validNserie := "SELECT * FROM equipo WHERE nro_serie = ?"
	_, err = database.DB.Query(validNserie, equipo.Nro_serie)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Ya existe un equipo con este numero de serie "})
	}

	//Insert en la base de datos
	query := "INSERT INTO Into (nombre, nro_serie, id_oficina, id_inventario, tipo, observaciones, dominio) VALUES (?, ?, ?, ?, ?, ?, ?)"
	result, err := database.DB.Exec(query, equipo.Nombre, equipo.Nro_serie, equipo.Id_oficina, equipo.Id_inventario, equipo.Tipo, equipo.Observaciones, equipo.Dominio)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al insertar el equipo"})

	}

	insertedID, err := result.LastInsertId()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener el ID del equipo insertado"})

	}

	return c.JSON(fiber.Map{
		"message":   "Equipo registrado con éxito",
		"equipo_id": insertedID,
	})

}

// campo sql null si esta vacio
func nilIfEmpty(s sql.NullString) *string {
	if s.Valid {
		return &s.String
	}
	return nil
}

func GetEquipos(c *fiber.Ctx) error {

	query := "SELECT * FROM vista;"
	rows, err := database.DB.Query(query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener los equipos"})
	}
	defer rows.Close()

	var equipos []models.Equipo

	for rows.Next() {
		equipo := models.Equipo{}
		var nombre_pc, nro_serie, idInventario, observaciones, oficina sql.NullString
		var piso sql.NullInt64

		err := rows.Scan(&equipo.Id_equipo, &nombre_pc, &nro_serie, &idInventario, &equipo.Tipo, &oficina, &piso, &observaciones, &equipo.Dominio)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al escanear los equipos"})
		}

		equipo.Nombre = nilIfEmpty(nombre_pc)
		equipo.Nro_serie = nilIfEmpty(nro_serie)
		equipo.Oficina = nilIfEmpty(oficina)
		if piso.Valid {
			p := int(piso.Int64)
			equipo.Piso = &p
		} else {
			equipo.Piso = nil
		}
		equipo.Id_inventario = nilIfEmpty(idInventario)
		equipo.Observaciones = nilIfEmpty(observaciones)

		equipos = append(equipos, equipo)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error en el cursor de filas: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener los equipos"})
	}

	return c.JSON(equipos)
}
