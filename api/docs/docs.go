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
            }
        }
    },
    "definitions": {
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
