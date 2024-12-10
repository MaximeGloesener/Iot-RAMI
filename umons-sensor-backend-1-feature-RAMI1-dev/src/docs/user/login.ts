const login = {
  post: {
    tags: ["User CRUD operations"],
    summary: "Login",
    description: "Login",
    operationId: "login",
    parameters: [
      {
        name: "email",
        in: "body",
        description: "Email address",
        type: "string",
      },
      {
        name: "password",
        in: "body",
        description: "Password ",
        type: "string",
      },
    ],
    responses: {
      "200": {
        description: "User logged in",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserLogin",
            },
          },
        },
      },
      "400": {
        description: "Invalid credentials",
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

export { login };
