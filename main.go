package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type MonitoringData struct {
	Status string `json:"status"`
	Time   string `json:"time"`
}

type Monitoring struct {
	Name      string           `json:"name"`
	Data      []MonitoringData `json:"data"`
	UpdatedAt string           `json:"updated_at"`
}

func main() {
	http.HandleFunc("/mon", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		name := r.URL.Query().Get("name")
		if name == "" {
			http.Error(w, "Missing query parameter 'name'", http.StatusBadRequest)
			return
		}

		db, err := sql.Open("mysql", "root:W7tK#AzSD&h@@tcp(127.0.0.1:3306)/test?parseTime=true")
		if err != nil {
			log.Fatal(err)
		}
		defer db.Close()

		rows, err := db.Query(fmt.Sprintf("SELECT * FROM (SELECT * FROM monitoring WHERE service_name = '%s' ORDER BY id DESC LIMIT 50) AS t ORDER BY t.id ASC", name))
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var monitorings Monitoring
		var monitoringData MonitoringData
		for rows.Next() {
			var id int
			var serviceName string
			var status string
			var createdAt time.Time
			err := rows.Scan(&id, &serviceName, &status, &createdAt)
			if err != nil {
				log.Fatal(err)
			}
			monitoringData = MonitoringData{
				Status: status,
				Time:   createdAt.Format("15:04"),
			}
			monitorings.Name = serviceName
			monitorings.Data = append(monitorings.Data, monitoringData)
			monitorings.UpdatedAt = createdAt.Format("2006-01-02 15:04:05")
		}

		json.NewEncoder(w).Encode(monitorings)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
