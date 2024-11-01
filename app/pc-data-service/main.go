package main

import (
	"encoding/json"
	"net/http"
	"os"
	"os/exec"
	"runtime"
)

// Modelo para representar la información de la PC
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
func capturePCInfo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Metodo no permitido", http.StatusMethodNotAllowed)
		return
	}

	pcInfo := PCInfo{}

	pcName, err := getPCName()
	if err != nil {
		http.Error(w, "Error al obtener el nombre de la PC", http.StatusInternalServerError)
		return
	}
	pcInfo.PCName = pcName

	userName, err := getUserName()
	if err != nil {
		http.Error(w, "Error al obtener el nombre del usuario", http.StatusInternalServerError)
		return
	}
	pcInfo.UserName = userName

	serialNumber, err := getSerialNumber()
	if err != nil {
		http.Error(w, "Error al obtener le numero de serie", http.StatusInternalServerError)
		return
	}

	pcInfo.SerialNumber = serialNumber

	//Enviar respuesta en JSON de pcInfo
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pcInfo)

}

func main() {

	// Endpoint para llamar a la funcion capturePCInfo
	http.HandleFunc("/pc/info", capturePCInfo)

	port := "8080"
	println("Servidor escuchando en el puerto", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		println("Error al iniciar el servidor:", err)
		os.Exit(1)
	}
}
