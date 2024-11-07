package controllers

import (
	"database/sql"
	"log"

	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/models"
	"github.com/gofiber/fiber/v2"
)

func GetOficinas(c *fiber.Ctx) error {
	query := `
		SELECT o.id, o.nombre, o.piso, o.nom, u.id, u.nombre, u.nom
		FROM oficina o
		INNER JOIN ue u ON o.id_ue = u.id
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al ejecutar la consulta"})
	}
	defer rows.Close()

	// Variable para almacenar los resultados
	var oficinas []models.Oficina

	// Iterar sobre los resultados
	for rows.Next() {
		var (
			oficinaID, ueID                            int
			oficinaNombre, oficinaNom, ueNombre, ueNom sql.NullString
			oficinaPiso                                sql.NullInt64
		)
		err := rows.Scan(
			&oficinaID, &oficinaNombre, &oficinaPiso, &oficinaNom,
			&ueID, &ueNombre, &ueNom,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al escanear los datos"})
		}

		oficina := models.Oficina{
			ID:     oficinaID,
			Nombre: ifValidString(oficinaNombre),
			Piso:   int(ifValidInt64(oficinaPiso)),
			Nom:    ifValidString(oficinaNom),
			UE: &models.UE{
				ID:     ueID,
				Nombre: ifValidString(ueNombre),
				Nom:    ifValidString(ueNom),
			},
		}

		oficinas = append(oficinas, oficina)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

	// Mostrar resultados
	return c.JSON(oficinas)
}

func ifValidString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func ifValidInt64(ni sql.NullInt64) int64 {
	if ni.Valid {
		return ni.Int64
	}
	return 0
}
