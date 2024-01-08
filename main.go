package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type IPAddress struct {
	Name     string `json:"name"`
	Addrress string `json:"addrress"`
}
type MonitoringData struct {
	Status string `json:"status"`
	Time   string `json:"time"`
}

type Monitoring struct {
	Name      string           `json:"name"`
	URL       string           `json:"url"`
	Data      []MonitoringData `json:"data"`
	UpdatedAt string           `json:"updated_at"`
}

func main() {
	http.HandleFunc("/mon", handlerMon)
	http.HandleFunc("/getmonip", handlerGetMonIP)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func dbConnect() *sql.DB {
	db, err := sql.Open("mysql", "root:W7tK#AzSD&h@@tcp(127.0.0.1:3306)/test?parseTime=true")
	if err != nil {
		panic(err.Error())
	}
	db.SetMaxIdleConns(10)
	db.SetMaxOpenConns(100)
	db.SetConnMaxIdleTime(5 * time.Minute)
	db.SetConnMaxLifetime(30 * time.Minute)
	return db
}
func handlerGetMonIP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	db := dbConnect()
	defer db.Close()

	// perhour / 15 detik
	qry, err := db.Prepare("SELECT name, address from ip_address")
	if err != nil {
		panic(err.Error())
	}
	defer qry.Close()
	rows, err := qry.Query()
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	IPAddr := []IPAddress{}

	for rows.Next() {
		var name string
		var address string
		err := rows.Scan(&name, &address)
		if err != nil {
			log.Fatal(err)
		}
		IPAddr = append(IPAddr, IPAddress{Name: name, Addrress: address})
	}
	json.NewEncoder(w).Encode(IPAddr)
}

func handlerMon(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	name := r.URL.Query().Get("name")
	if name == "" {
		http.Error(w, "Missing query parameter 'name'", http.StatusBadRequest)
		return
	}
	db := dbConnect()
	defer db.Close()

	// perhour / 15 detik
	qry, err := db.Prepare("SELECT * FROM (SELECT * FROM monitoring WHERE name = ? ORDER BY id DESC LIMIT 240) AS t ORDER BY t.id ASC")
	if err != nil {
		panic(err.Error())
	}
	defer qry.Close()
	rows, err := qry.Query(name)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	var monitorings Monitoring
	var monitoringData MonitoringData
	for rows.Next() {
		var id int
		var name string
		var url string
		var status string
		var createdAt time.Time
		err := rows.Scan(&id, &name, &url, &status, &createdAt)
		if err != nil {
			log.Fatal(err)
		}
		monitoringData = MonitoringData{
			Status: status,
			Time:   createdAt.Format("15:04"),
		}
		monitorings.Name = name
		monitorings.Data = append(monitorings.Data, monitoringData)
		monitorings.URL = url
		monitorings.UpdatedAt = createdAt.Format("2006-01-02 15:04:05")
	}
	json.NewEncoder(w).Encode(monitorings)
}
