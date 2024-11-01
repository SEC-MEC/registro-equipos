package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB(dataSourceName string) {
	var err error
	DB, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatal(err)
	}

	if err := DB.Ping(); err != nil {
		log.Fatal("No se pudo conectar a la base de datos: ", err)
	}

	log.Println("Conectado a la base de datos")
}

func CloseDB() {
	if err := DB.Close(); err != nil {
		log.Fatal("Error al cerrar la conexion a la base de datos: ", err)
	}

}
