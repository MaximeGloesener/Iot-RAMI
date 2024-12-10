const components = {
  components: {
    schemas: {
      Sensor: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The sensor id",
          },
          name: {
            type: "string",
            description: "The sensor name",
          },
        },
      },
      SensorCreate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The sensor name",
          },
        },
      },
      SensorDelete: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },
      MeasurementType: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The sensor id",
          },
          name: {
            type: "string",
            description: "The sensor name",
          },
        },
      },
      MeasurementTypeCreate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The sensor name",
          },
        },
      },
      MeasurementTypeDelete: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },
      Measurement: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The measurement id",
          },
          date: {
            type: "string",
            description:
              "The measurement date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
          },
          value: {
            type: "number",
            description: "The measurement value",
          },
          sensor: {
            type: "string",
            description: "The sensor id of the measurement",
          },
          type: {
            type: "string",
            description: "The type of the measurement",
          },
        },
      },
      MeasurementCreate: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description:
              "The measurement date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
          },
          value: {
            type: "number",
            description: "The measurement value",
          },
          sensor: {
            type: "string",
            description: "The sensor id of the measurement",
          },
          type: {
            type: "string",
            description: "The type of the measurement",
          },
        },
      },
      MeasurementCreateByGroup: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description:
              "The measurement date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
          },
          value: {
            type: "number",
            description: "The measurement value",
          },
          sensor: {
            type: "string",
            description: "The sensor id of the measurement",
          },
          type: {
            type: "string",
            description: "The type id of the measurement",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "uuid",
            description: "The user ID",
          },
          email: {
            type: "string",
            description: "The user email",
          },
          password: {
            type: "string",
            description: "The user password",
          },
          role: {
            type: "string",
            enum: ["ADMIN", "PRIVILEGED", "REGULAR"],
            description: "The user role",
          },
        },
      },
      UserLogin: {
        type: "object",
        properties: {
          id: {
            type: "uuid",
            description: "The user ID",
          },
          role: {
            type: "string",
            enum: ["ADMIN", "PRIVILEGED", "REGULAR"],
            description: "The user role",
          },
          expiresAt: {
            type: "string",
            format: "date-time",
            description: "The token expiration date",
          },
          token: {
            type: "string",
            format: "jwt",
            description: "The JWT token",
          },
        },
      },

      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "The error message",
          },
          status: {
            type: "integer",
            description: "The error status code",
          },
          codeError: {
            type: "string",
            description: "The error code",
          },
        },
      },
    },
  },
};

export { components };
