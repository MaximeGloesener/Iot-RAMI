const updateRole = {
  put: {
    tags: ["User CRUD operations"],
    summary: "updateRole",
    description: "Update a user role",
    operationId: "updateRole",
    parameters: [
      {
        name: "token",
        in: "header (Bearer)",
        description: "JWT token",
        required: true,
        type: "string",
      },
      {
        name: "email",
        in: "body",
        description: "Email",
        required: true,
        type: "string",
      },
      {
        name: "role",
        in: "body",
        description: "New role",
        required: true,
        type: "string",
        enum: ["ADMIN", "PRIVILEGED", "REGULAR"],
      },
    ],
    responses: {
      "200": {
        description: "User role updated",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserLogin",
            },
          },
        },
      },
      "400": {
        description: "Invalid token",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "401": {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "500": {
        description: "Server error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
};

export { updateRole };
