package utils

import (
	"os"
	"os/exec"
	"runtime"

	"github.com/gofiber/fiber/v2"
)

type PCInfo struct {
	PCName       string `json:"pc_name"`
	UserName     string `json:"user_name"`
	SerialNumber string `json:"serial_number"`
}

// Función para obtener el nombre de la PC
func getPCName() (string, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return "", err
	}
	return hostname, nil
}

// Obtener el nombre de usuario de la pc actual
func getUserName() (string, error) {
	user := os.Getenv("USER")
	if user == "" {
		user = os.Getenv("USERNAME") // Para windows
	}
	return user, nil
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

	output, err := cmd.Output()
	if err != nil {
		return "", err
	}

	return string(output), nil
}

// Funcion para capturar la info de la PC
func CapturePCInfo(c *fiber.Ctx) error {
	pcInfo := PCInfo{}

	pcName, err := getPCName()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el nombre de la PC")
	}
	pcInfo.PCName = pcName

	userName, err := getUserName()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el nombre del usuario")
	}
	pcInfo.UserName = userName

	serialNumber, err := getSerialNumber()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Error al obtener el numero de serie")
	}
	pcInfo.SerialNumber = serialNumber

	return c.JSON(pcInfo)
}
