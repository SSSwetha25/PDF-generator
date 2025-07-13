package pdfservice

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
)

type PDFRequest struct {
	HTML string `json:"html"`
}

type PDFResponse struct {
	Data string `json:"data"` // base64-encoded PDF
}

// encore:api public method=POST path=/generate
func GeneratePDF(ctx context.Context, req *PDFRequest) (*PDFResponse, error) {
	pdfServerURL := "http://localhost:4001/generate"

	payload, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(pdfServerURL, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		errorBody, _ := io.ReadAll(resp.Body)
		return nil, &PDFError{Message: string(errorBody)}
	}

	// Read and decode JSON response from Puppeteer
	pdfData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var jsonResp struct {
		Data string `json:"data"`
	}
	err = json.Unmarshal(pdfData, &jsonResp)
	if err != nil {
		return nil, err
	}

	return &PDFResponse{Data: jsonResp.Data}, nil
}

type PDFError struct {
	Message string
}

func (e *PDFError) Error() string {
	return e.Message
}
