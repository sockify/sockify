FROM golang:1.23-alpine AS builder

ARG CGO_ENABLED=0
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .

RUN go build -o /app/main ./cmd/main.go

FROM scratch

COPY --from=builder /app/main /main

CMD ["/main"]
