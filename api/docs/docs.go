// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "license": {
            "name": "MIT",
            "url": "https://github.com/sockify/sockify/blob/main/LICENSE"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/admins": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Retrieves a list of all admins.",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Admins"
                ],
                "summary": "Get all admins.",
                "parameters": [
                    {
                        "type": "integer",
                        "default": 50,
                        "description": "Results per page",
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 0,
                        "description": "Page number",
                        "name": "offset",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.AdminsPaginatedResponse"
                        }
                    }
                }
            }
        },
        "/admins/login": {
            "post": {
                "description": "Logs in an admin using username and password credentials.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Admins"
                ],
                "summary": "Logs in an admin.",
                "parameters": [
                    {
                        "description": "Login credentials",
                        "name": "Body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.LoginAdminRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.LoginAdminResponse"
                        }
                    }
                }
            }
        },
        "/admins/register": {
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Creates a new set of admin credentials.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Admins"
                ],
                "summary": "Registers new admin credentials.",
                "parameters": [
                    {
                        "description": "Register credentials",
                        "name": "Body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.RegisterAdminRequest"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            }
        },
        "/orders": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Retrieves all orders from the database with optional filters.",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Retrieve all orders",
                "parameters": [
                    {
                        "type": "integer",
                        "default": 50,
                        "description": "Limit the number of results",
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 0,
                        "description": "Offset for pagination",
                        "name": "offset",
                        "in": "query"
                    },
                    {
                        "type": "string",
                        "description": "Status of the order",
                        "name": "status",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.OrdersPaginatedResponse"
                        }
                    }
                }
            }
        },
        "/orders/invoice/{invoice_number}": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Retrieves order details and item list by invoice number.",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Retrieve order details by invoice number",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Invoice Number",
                        "name": "invoice_number",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Order"
                        }
                    }
                }
            }
        },
        "/orders/{order_id}": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Retrieves all the details for a particular order.",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Retrieve details for an order",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "order_id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Order"
                        }
                    }
                }
            }
        },
        "/orders/{order_id}/address": {
            "patch": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Updates the address for a specific order by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Update the address of an existing order",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "order_id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "New Address Data",
                        "name": "address",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.UpdateAddressRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            }
        },
        "/orders/{order_id}/contact": {
            "patch": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Updates the contact information (name, email, phone) for a specific order by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Update the contact information of an existing order",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "order_id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "New Contact Information",
                        "name": "contact",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.UpdateContactRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            }
        },
        "/orders/{order_id}/status": {
            "patch": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Updates the status for a specific order by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Update the status of an existing order",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "order_id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "New order status",
                        "name": "statusUpdate",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.UpdateOrderStatusRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            }
        },
        "/orders/{order_id}/updates": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Retrieves all order updates for a particular order. Results are sorted descending by createdAt.",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Retrieve updates for an order",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "order_id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/types.OrderUpdate"
                            }
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Creates a new update for an existing order.",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Orders"
                ],
                "summary": "Creates an update for an order",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Order ID",
                        "name": "order_id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "New order update",
                        "name": "address",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.CreateOrderUpdateRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            }
        },
        "/socks": {
            "get": {
                "description": "Returns a list of paginated socks sorted in descending order by created date",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Inventory"
                ],
                "summary": "Get all socks",
                "parameters": [
                    {
                        "type": "integer",
                        "default": 50,
                        "description": "Limit the number of results",
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 0,
                        "description": "Offset for pagination",
                        "name": "offset",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.SocksPaginatedResponse"
                        }
                    }
                }
            },
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Adds a new sock to the store with its variants",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Inventory"
                ],
                "summary": "Create a new sock",
                "parameters": [
                    {
                        "description": "Sock Data",
                        "name": "sock",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.CreateSockRequest"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "$ref": "#/definitions/types.CreateSockResponse"
                        }
                    }
                }
            }
        },
        "/socks/{sock_id}": {
            "get": {
                "description": "Retrieve the details of a sock by its ID",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Inventory"
                ],
                "summary": "Get details of a specific sock",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Sock ID",
                        "name": "sock_id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Sock"
                        }
                    }
                }
            },
            "delete": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Deletes a sock from the store by its ID",
                "tags": [
                    "Inventory"
                ],
                "summary": "Delete a sock",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Sock ID",
                        "name": "sock_id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            },
            "patch": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Updates all of the details for a sock given a sock ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Inventory"
                ],
                "summary": "Updates the details of a sock",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Sock ID",
                        "name": "sock_id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Updated sock details",
                        "name": "details",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/types.UpdateSockRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "types.Address": {
            "type": "object",
            "properties": {
                "aptUnit": {
                    "type": "string"
                },
                "state": {
                    "type": "string"
                },
                "street": {
                    "type": "string"
                },
                "zipcode": {
                    "type": "string"
                }
            }
        },
        "types.Admin": {
            "type": "object",
            "properties": {
                "createdAt": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "firstname": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "lastname": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "types.AdminsPaginatedResponse": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.Admin"
                    }
                },
                "limit": {
                    "type": "integer"
                },
                "offset": {
                    "type": "integer"
                },
                "total": {
                    "type": "integer"
                }
            }
        },
        "types.Contact": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "firstname": {
                    "type": "string"
                },
                "lastname": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                }
            }
        },
        "types.CreateOrderUpdateRequest": {
            "type": "object",
            "required": [
                "message"
            ],
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "types.CreateSockRequest": {
            "type": "object",
            "required": [
                "sock",
                "variants"
            ],
            "properties": {
                "sock": {
                    "$ref": "#/definitions/types.SockDTO"
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.SockVariantDTO"
                    }
                }
            }
        },
        "types.CreateSockResponse": {
            "type": "object",
            "properties": {
                "sockId": {
                    "type": "integer"
                }
            }
        },
        "types.LoginAdminRequest": {
            "type": "object",
            "required": [
                "password",
                "username"
            ],
            "properties": {
                "password": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "types.LoginAdminResponse": {
            "type": "object",
            "properties": {
                "token": {
                    "type": "string"
                }
            }
        },
        "types.Message": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "types.Order": {
            "type": "object",
            "properties": {
                "address": {
                    "$ref": "#/definitions/types.Address"
                },
                "contact": {
                    "$ref": "#/definitions/types.Contact"
                },
                "createdAt": {
                    "type": "string"
                },
                "invoiceNumber": {
                    "type": "string"
                },
                "items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.OrderItem"
                    }
                },
                "orderId": {
                    "type": "integer"
                },
                "status": {
                    "type": "string"
                },
                "total": {
                    "type": "number"
                }
            }
        },
        "types.OrderItem": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                },
                "quantity": {
                    "type": "integer"
                },
                "size": {
                    "type": "string"
                }
            }
        },
        "types.OrderUpdate": {
            "type": "object",
            "properties": {
                "createdAt": {
                    "type": "string"
                },
                "createdBy": {
                    "$ref": "#/definitions/types.OrderUpdateCreator"
                },
                "id": {
                    "type": "integer"
                },
                "message": {
                    "type": "string"
                }
            }
        },
        "types.OrderUpdateCreator": {
            "type": "object",
            "properties": {
                "firstname": {
                    "type": "string"
                },
                "lastname": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "types.OrdersPaginatedResponse": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.Order"
                    }
                },
                "limit": {
                    "type": "integer"
                },
                "offset": {
                    "type": "integer"
                },
                "total": {
                    "type": "integer"
                }
            }
        },
        "types.RegisterAdminRequest": {
            "type": "object",
            "required": [
                "email",
                "firstname",
                "lastname",
                "password",
                "username"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "firstname": {
                    "type": "string",
                    "maxLength": 16,
                    "minLength": 2
                },
                "lastname": {
                    "type": "string",
                    "maxLength": 16,
                    "minLength": 1
                },
                "password": {
                    "type": "string",
                    "maxLength": 16,
                    "minLength": 8
                },
                "username": {
                    "type": "string",
                    "maxLength": 16,
                    "minLength": 3
                }
            }
        },
        "types.Sock": {
            "type": "object",
            "properties": {
                "createdAt": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "previewImageUrl": {
                    "type": "string"
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.SockVariant"
                    }
                }
            }
        },
        "types.SockDTO": {
            "type": "object",
            "required": [
                "description",
                "name",
                "previewImageUrl"
            ],
            "properties": {
                "description": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "previewImageUrl": {
                    "type": "string"
                }
            }
        },
        "types.SockVariant": {
            "type": "object",
            "properties": {
                "createdAt": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "price": {
                    "type": "number"
                },
                "quantity": {
                    "type": "integer"
                },
                "size": {
                    "type": "string"
                }
            }
        },
        "types.SockVariantDTO": {
            "type": "object",
            "required": [
                "price",
                "quantity",
                "size"
            ],
            "properties": {
                "price": {
                    "type": "number"
                },
                "quantity": {
                    "description": "Quantity must be a pointer for the \"required\" validator to work with 0 as an input.",
                    "type": "integer",
                    "minimum": 0
                },
                "size": {
                    "type": "string",
                    "enum": [
                        "S",
                        "M",
                        "LG",
                        "XL"
                    ]
                }
            }
        },
        "types.SocksPaginatedResponse": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.Sock"
                    }
                },
                "limit": {
                    "type": "integer"
                },
                "offset": {
                    "type": "integer"
                },
                "total": {
                    "type": "integer"
                }
            }
        },
        "types.UpdateAddressRequest": {
            "type": "object",
            "required": [
                "state",
                "street",
                "zipcode"
            ],
            "properties": {
                "aptUnit": {
                    "type": "string"
                },
                "state": {
                    "type": "string",
                    "enum": [
                        "AL",
                        "AK",
                        "AZ",
                        "AR",
                        "CA",
                        "CO",
                        "CT",
                        "DE",
                        "FL",
                        "GA",
                        "HI",
                        "ID",
                        "IL",
                        "IN",
                        "IA",
                        "KS",
                        "KY",
                        "LA",
                        "ME",
                        "MD",
                        "MA",
                        "MI",
                        "MN",
                        "MS",
                        "MO",
                        "MT",
                        "NE",
                        "NV",
                        "NH",
                        "NJ",
                        "NM",
                        "NY",
                        "NC",
                        "ND",
                        "OH",
                        "OK",
                        "OR",
                        "PA",
                        "RI",
                        "SC",
                        "SD",
                        "TN",
                        "TX",
                        "UT",
                        "VT",
                        "VA",
                        "WA",
                        "WV",
                        "WI",
                        "WY"
                    ]
                },
                "street": {
                    "type": "string",
                    "maxLength": 100
                },
                "zipcode": {
                    "type": "string",
                    "maxLength": 10
                }
            }
        },
        "types.UpdateContactRequest": {
            "type": "object",
            "required": [
                "email",
                "firstName",
                "lastName",
                "phone"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                }
            }
        },
        "types.UpdateOrderStatusRequest": {
            "type": "object",
            "required": [
                "message",
                "newStatus"
            ],
            "properties": {
                "message": {
                    "type": "string"
                },
                "newStatus": {
                    "type": "string",
                    "enum": [
                        "received",
                        "shipped",
                        "delivered",
                        "canceled",
                        "returned"
                    ]
                }
            }
        },
        "types.UpdateSockRequest": {
            "type": "object",
            "required": [
                "sock",
                "variants"
            ],
            "properties": {
                "sock": {
                    "$ref": "#/definitions/types.SockDTO"
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.SockVariantDTO"
                    }
                }
            }
        }
    },
    "securityDefinitions": {
        "Bearer": {
            "description": "Type \"Bearer\" followed by a space and JWT token. Example: \"Bearer XXX\"",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/api/v1",
	Schemes:          []string{},
	Title:            "Sockify API",
	Description:      "API for the Sockify e-commerce store.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
