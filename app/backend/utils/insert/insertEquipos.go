package insert

import (
	"database/sql"
)

func InsertEquipoUsuario(tx *sql.Tx, idEquipo int, idUsuario int) error {
	query := "INSERT INTO equipo_usuario (id_equipo, id_usuario) VALUES (?, ?)"
	_, err := tx.Exec(query, idEquipo, idUsuario)
	if err != nil {
		return err
	}
	return nil
}

func InsertEquipoApp(tx *sql.Tx, idEquipo int, idApp int) error {
	query := "INSERT INTO equipo_app (id_equipo, id_app) VALUES (?, ?)"
	_, err := tx.Exec(query, idEquipo, idApp)
	if err != nil {
		return err
	}
	return nil
}

func InsertModificado(tx *sql.Tx, idEquipo int, idTecnico int) error {
	query := "INSERT INTO modificado (id_equipo, id_tecnico, fecha) VALUES (?, ?, CURRENT_DATE)"
	_, err := tx.Exec(query, idEquipo, idTecnico)
	if err != nil {
		return err
	}
	return nil
}
