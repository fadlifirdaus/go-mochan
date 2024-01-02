package main

import (
    "fmt"
    "image"
    "image/png"
    "os"
	"bytes"

    "golang.design/x/clipboard"
)

func main() {
    err := clipboard.Init()
    if err != nil {
        panic(err)
    }

    data:= clipboard.Read(clipboard.FmtImage)

    img, _, err := image.Decode(bytes.NewReader(data))

    if err != nil {
        panic(err)
    }

    f, err := os.Create("clipboard.png")
    if err != nil {
        panic(err)
    }
    defer f.Close()

    err = png.Encode(f, img)
    if err != nil {
        panic(err)
    }

    fmt.Println("Image data from clipboard has been saved to clipboard.png")
}
