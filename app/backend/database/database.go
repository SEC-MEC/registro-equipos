package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error al conectar la base de datos: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Error al hacer ping a la base de datos: ", err)
	}

	log.Println("=>DB conectada")
}

func CloseDB() {
	if err := DB.Close(); err != nil {
		log.Fatal("Error al cerrar la conexion a la base de datos: ", err)
	}

}
