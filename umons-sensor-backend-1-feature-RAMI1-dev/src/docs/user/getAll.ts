const getAll = {
  get: {
    tags: ["User CRUD operations"],
    summary: "getAll",
    description: "Get all users with worse role than the user who is logged in",
    operationId: "getAll",
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
        description:
          "User has the rights to access to all users with worse role than him",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
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

export { getAll };
