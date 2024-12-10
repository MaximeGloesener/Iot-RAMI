/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coveragePathIgnorePatterns: [
    "src/server.ts",
    "src/db/",
    "src/docs",
    "src/utils",
    "src/dotenv.ts",
    "src/app.ts",
    "src/types",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@db/(.*)$": "<rootDir>/src/db/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@docs/(.*)$": "<rootDir>/src/docs/$1",
    "^@models/(.*)$": "<rootDir>/src/db/models/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@service/(.*)$": "<rootDir>/src/service/$1",
    "^#/(.*)$": "<rootDir>/src/types/$1",
  },
  moduleDirectories: ["node_modules", "src"],
};
