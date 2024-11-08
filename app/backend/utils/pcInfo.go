package utils

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"runtime"
	"strings"

	"github.com/SEC-MEC/registro-equipos.git/database"
	"github.com/gofiber/fiber/v2"
)

type PCInfo struct {
	PCName       string `json:"pc_name"`
	UserName     string `json:"user_name"`
	SerialNumber string `json:"serial_number"`
	Ip           string `json:"ip"`
}

func getPCNameParts(pcName string) (string, string, string, error) {

	parts := strings.Split(pcName, "-")

	if len(parts) < 2 {
		return "", "", "", fmt.Errorf("el nombre de la PC no tiene suficientes partes separadas por '-'")
	}

	// Primer parte antes del primer guion
	firstPart := parts[0]

	// Penúltima parte antes del último guion
	penultimatePart := parts[len(parts)-2]

	return pcName, firstPart, penultimatePart, nil
}

// Función para obtener el nombre de la PC
func getPCName() (string, string, string, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return "", "", "", err
	}

	fullName, firstPart, penultimatePart, err := getPCNameParts(hostname)
	if err != nil {
		return "", "", "", err
	}

	return fullName, firstPart, penultimatePart, nil
}

// Obtener el nombre de usuario de la pc actual
func getUserName() (string, error) {
	user := os.Getenv("USER")
	if user == "" {
		user = os.Getenv("USERNAME") // Para windows
	}
	return user, nil
}

func getPenultimateIPPart() (string, error) {

	interfaces, err := net.Interfaces()
	if err != nil {
		return "", err
	}

	//recorre todas las interfaces y obtiene la ip
	for _, iface := range interfaces {
		// Se salta interfaces "loopback" o interfaces desactivadas
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback != 0 {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		// Recorre todas las direcciones asociadas a la interfaz
		for _, addr := range addrs {
			// Si la dirección es de tipo IPv4, la procesamos
			if ipnet, ok := addr.(*net.IPNet); ok && ipnet.IP.To4() != nil {

				ip := ipnet.IP.String()

				parts := strings.Split(ip, ".")

				if len(parts) >= 2 {
					// Devuelve el penultimo nuemero de la ip
					return parts[len(parts)-2], nil
				}
			}
		}
	}

	return "", fmt.Errorf("No se pudo encontrar una dirección IP válida")
}

// Obtener numero de serie de la pc actual
func getSerialNumber() (string, error) {
	var cmd *exec.Cmd

	if runtime.GOOS == "windows" {
		cmd = exec.Command("wmic", "bios", "get", "serialnumber")
	} else if runtime.GOOS == "linux" {
		cmd = exec.Command("cat", "/sys/class/dmi/id/product_serial")
	} else {
		return "", nil
	}

	// Obtener la salida del comando
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}

	lines := strings.Split(strings.TrimSpace(string(output)), "\n")

	var serialNumber string
	if runtime.GOOS == "windows" && len(lines) > 1 {
		serialNumber = strings.TrimSpace(lines[1]) //Windows
	} else if runtime.GOOS == "linux" && len(lines) > 0 {
		serialNumber = strings.TrimSpace(lines[0]) //Linux
	}

	return serialNumber, nil
}

// Funcion para capturar la info de la PC
func CapturePCInfo(c *fiber.Ctx) error {
	pcInfo := PCInfo{}

	ip, err := getPenultimateIPPart()
	pcInfo.Ip = ip

	fullName, firstPart, penultimoName, err := getPCName()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el nombre de la PC")
	}
	pcInfo.PCName = fullName

	userName, err := getUserName()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el nombre del usuario")
	}
	pcInfo.UserName = userName

	serialNumber, err := getSerialNumber()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el numero de serie")
	}
	// pcInfo.SerialNumber = serialNumber

	tx, err := database.DB.Begin()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al iniciar la transacción")
	}

	var existPcName string
	err = database.DB.QueryRow("SELECT COUNT(*) FROM equipo WHERE nombre = ?", pcInfo.PCName).Scan(&existPcName)
	if err != nil && err.Error() != "sql: no rows in result set" {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "El nombre del equipo ya está en uso",
		})
	}

	userQuery := "INSERT INTO usuario (nombre, apellido, usr) VALUES (?, ?, ?)"
	_, err = tx.Exec(userQuery, pcInfo.UserName, pcInfo.UserName, pcInfo.UserName)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al insertar el usuario")
	}

	var idOficina string
	nombreOficinaQuery := "SELECT id FROM oficina WHERE TRIM(nom) = (?) LIMIT 1"
	err = database.DB.QueryRow(nombreOficinaQuery, penultimoName).Scan(&idOficina)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el ID de la oficina")
	}

	if firstPart == "" || idOficina == "" || pcInfo.Ip == "" {
		tx.Rollback()
		return c.Status(fiber.StatusBadRequest).SendString("Faltan datos necesarios para insertar la oficina")
	}

	var userID int
	err = tx.QueryRow("SELECT id FROM usuario WHERE nombre = ?", pcInfo.UserName).Scan(&userID)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el ID del usuario")
	}

	equipoQuery := "INSERT INTO equipo (nombre, nro_serie, id_oficina) VALUES (?, ?, ?)"
	_, err = tx.Exec(equipoQuery, pcInfo.PCName, serialNumber, idOficina)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al insertar el equipo")
	}

	var equipoID int
	err = tx.QueryRow("SELECT id FROM equipo WHERE nro_serie = ?", pcInfo.SerialNumber).Scan(&equipoID)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el ID del equipo")
	}

	// Insertar la relación equipo_usuario
	relacionQuery := "INSERT INTO equipo_usuario (id_equipo, id_usuario) VALUES (?, ?)"
	_, err = tx.Exec(relacionQuery, equipoID, userID)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al insertar la relación equipo_usuario")
	}

	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString("Error al confirmar la transacción")
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "PC info captured successfully",
		"data":    pcInfo,
	})

}
