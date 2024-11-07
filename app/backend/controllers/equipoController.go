package controllers

import (
	"database/sql"

	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/SEC-MEC/registro-equipos.git/models"
	"github.com/SEC-MEC/registro-equipos.git/utils/insert"
	"github.com/SEC-MEC/registro-equipos.git/utils/validation"
	"github.com/gofiber/fiber/v2"
)

func CreateEquipo(c *fiber.Ctx) error {

	equipo := new(models.Equipo)

	if err := c.BodyParser(equipo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No se pudieron leer los datos"})
	}

	tx, err := database.DB.Begin()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al iniciar la transacción"})
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	existNombrePc := validation.ValidateEquipo(*equipo.Nombre)
	if existNombrePc != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Ya existe un equipo con ese nombre"})
	}

	// Validar si ya existe el equipo con ese numero de serie
	existNroSerie := validation.ValidateEquipoNroSerie(*equipo.Nro_serie)
	if existNroSerie != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Ya existe un equipo con este numero de serie"})
	}

	//Insert en la base de datos
	query := "INSERT INTO equipo (nombre, nro_serie, id_oficina, id_inventario, tipo, observaciones, dominio) VALUES (?, ?, ?, ?, ?, ?, ?)"
	result, err := tx.Exec(query, equipo.Nombre, equipo.Nro_serie, equipo.Id_oficina, equipo.Id_inventario, equipo.Tipo, equipo.Observaciones, equipo.Dominio)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al insertar el equipo"})
	}

	insertedID, err := result.LastInsertId()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener el ID del equipo insertado"})
	}

	//Insertar en las tablas relacionadas

	//Insertar en la tabla equipo_usuario
	if equipo.Id_usuario != nil {
		err = insert.InsertEquipoUsuario(tx, int(insertedID), *equipo.Id_usuario)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al insertar el equipo_usuario"})
		}
	}

	//Insertar en la tabla modificado
	if equipo.Id_tecnico != nil {
		err = insert.InsertModificado(tx, int(insertedID), *equipo.Id_tecnico)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al insertar el modificado"})
		}
	}

	//Insertar en la tabla equipo_app
	if equipo.Id_apps != nil {
		for _, idApp := range *equipo.Id_apps {
			err = insert.InsertEquipoApp(tx, int(insertedID), idApp)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al insertar el equipo_app"})
			}
		}
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
	query := `
    SELECT 
        eq.id, eq.nombre, eq.nro_serie, eq.id_inventario, eq.tipo, eq.observaciones, eq.dominio,
        ofi.id AS oficina_id, ofi.nombre AS oficina_nombre, ofi.piso AS oficina_piso,
        ue.id AS ue_id, ue.nombre AS ue_nombre,
        u.id AS usuario_id, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.usr AS usuario_usr,
        app.id AS app_id, app.nombre AS app_nombre, app.version AS app_version
    FROM equipo eq
    LEFT JOIN oficina ofi ON eq.id_oficina = ofi.id
    LEFT JOIN ue ON ofi.id_ue = ue.id
    LEFT JOIN equipo_usuario eu ON eq.id = eu.id_equipo
    LEFT JOIN usuario u ON eu.id_usuario = u.id
    LEFT JOIN equipo_app ea ON eq.id = ea.id_equipo
    LEFT JOIN aplicacion app ON ea.id_app = app.id
`

	rows, err := database.DB.Query(query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al obtener los equipos", "details": err.Error()})
	}
	defer rows.Close()

	equipos := make(map[int]*models.Equipo)

	for rows.Next() {
		var (
			equipoID, oficinaID, ueID, usuarioID, appID         sql.NullInt64
			nombre, nroSerie, idInventario, tipo, observaciones sql.NullString
			dominio                                             sql.NullBool

			oficinaNombre, ueNombre, usuarioNombre, usuarioApellido, usuarioUsr, appNombre, appVersion sql.NullString
			oficinaPiso                                                                                sql.NullInt64
		)

		err := rows.Scan(
			&equipoID, &nombre, &nroSerie, &idInventario, &tipo, &observaciones, &dominio,
			&oficinaID, &oficinaNombre, &oficinaPiso,
			&ueID, &ueNombre,
			&usuarioID, &usuarioNombre, &usuarioApellido, &usuarioUsr,
			&appID, &appNombre, &appVersion,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al escanear los datos", "details": err.Error()})
		}

		id := int(equipoID.Int64)
		equipo, exists := equipos[id]
		if !exists {
			equipo = &models.Equipo{
				Id_equipo:     id,
				Nombre:        nilIfEmpty(nombre),
				Nro_serie:     nilIfEmpty(nroSerie),
				Id_inventario: nilIfEmpty(idInventario),
				Tipo:          tipo.String,
				Observaciones: nilIfEmpty(observaciones),
				Dominio:       dominio.Bool,
				Usuarios:      []*models.Usuario{},
				Aplicaciones:  []*models.Aplicacion{},
			}
			if oficinaID.Valid {
				equipo.Oficina = &models.Oficina{
					ID:     int(oficinaID.Int64),
					Nombre: oficinaNombre.String,
					Piso:   int(oficinaPiso.Int64),
					UE:     &models.UE{ID: int(ueID.Int64), Nombre: ueNombre.String},
				}
			}
			equipos[id] = equipo
		}

		if usuarioID.Valid {
			usuario := &models.Usuario{
				ID:       int(usuarioID.Int64),
				Nombre:   usuarioNombre.String,
				Apellido: usuarioApellido.String,
				Usr:      usuarioUsr.String,
			}
			equipo.Usuarios = append(equipo.Usuarios, usuario)
		}

		if appID.Valid {
			aplicacion := &models.Aplicacion{
				ID:      int(appID.Int64),
				Nombre:  appNombre.String,
				Version: appVersion.String,
			}
			equipo.Aplicaciones = append(equipo.Aplicaciones, aplicacion)
		}
	}

	if err := rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error al leer los datos", "details": err.Error()})
	}

	var resultado []models.Equipo
	for _, equipo := range equipos {
		resultado = append(resultado, *equipo)
	}

	return c.JSON(resultado)
}
