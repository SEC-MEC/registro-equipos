package validation

import (
	"errors"

	"github.com/SEC-MEC/registro-equipos.git/database"
)

func ValidateEquipo(nombre string) error {
	var count int
	query := "SELECT COUNT(*) FROM equipo WHERE nombre = ?"
	err := database.DB.QueryRow(query, nombre).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return errors.New("El nombre del equipo ya existe")
	}
	return nil
}

func ValidateEquipoNroSerie(nroSerie string) error {
	var count int
	query := "SELECT COUNT(*) FROM equipo WHERE nro_serie = ?"
	err := database.DB.QueryRow(query, nroSerie).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return errors.New("El número de serie del equipo ya existe")
	}
	return nil
}
