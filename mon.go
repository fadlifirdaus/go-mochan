package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func test_main() {
	db, err := sql.Open("mysql", "root:W7tK#AzSD&h@@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	for {
		test_checkStatus(db)
		time.Sleep(10 * time.Second)
	}
}

func test_checkStatus(db *sql.DB) {
	url := "https://www.example.com"
	name := "example"
	status := 0

	_, err := http.Get(url)
	if err == nil {
		status = 1
	}

	stmt, err := db.Prepare("INSERT INTO monitoring (service_name, status) VALUES (?, ?)")
	if err != nil {
		panic(err.Error())
	}
	defer stmt.Close()

	_, err = stmt.Exec(name, status)
	if err != nil {
		panic(err.Error())
	}

	fmt.Printf("Service %s is %s\n", name, map[int]string{0: "down", 1: "up"}[status])
}
