build:
	@go build -o bin/golang-store-api cmd/main.go

test:
	@go test -v ./...

coverage:
	@go test -cover fmt

run: build
	@./bin/golang-store-api

migration:
	@migrate create -ext sql -dir cmd/migrate/migrations $(filter-out $@,$(MAKECMDGOALS))

migrate-up:
	@go run cmd/migrate/main.go up

migrate-down:
	@go run cmd/migrate/main.go down
