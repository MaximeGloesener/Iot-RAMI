const verifyAdminPanel = {
  get: {
    tags: ["User CRUD operations"],
    summary: "verifyAdminPanel",
    description:
      "Verify if the user has the rights to access to the admin panel",
    operationId: "verifyAdminPanel",
    parameters: [
      {
        name: "token",
        in: "header (Bearer)",
        description: "JWT token",
        required: true,
        type: "string",
      },
    ],
    responses: {
      "200": {
        description: "User has the rights to access to the admin panel",
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

export { verifyAdminPanel };
