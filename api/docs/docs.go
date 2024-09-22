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
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/types.Admin"
                            }
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
                            "$ref": "#/definitions/types.AuthToken"
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
                            "$ref": "#/definitions/types.Message"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/types.Message"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
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
        "types.AuthToken": {
            "type": "object",
            "properties": {
                "token": {
                    "type": "string"
                }
            }
        },
        "types.CreateSockRequest": {
            "type": "object",
            "required": [
                "variants"
            ],
            "properties": {
                "sock": {
                    "$ref": "#/definitions/types.Sock"
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/types.SockVariant"
                    }
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
            "required": [
                "name",
                "previewImageUrl"
            ],
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
                }
            }
        },
        "types.SockVariant": {
            "type": "object",
            "required": [
                "price",
                "quantity",
                "size"
            ],
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
                },
                "sockId": {
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
