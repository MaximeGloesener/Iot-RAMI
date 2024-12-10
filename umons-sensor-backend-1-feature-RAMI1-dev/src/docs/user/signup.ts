const signup = {
  post: {
    tags: ["User CRUD operations"],
    summary: "Signup",
    description: "Signup",
    operationId: "signup",
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
        description: "Password",
        type: "string",
      },
    ],
    responses: {
      "201": {
        description:
          "User created with role REGULAR by default (must be changed by an admin after the first login)",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/User",
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

export { signup };
