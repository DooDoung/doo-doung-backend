module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/review/*.spec.ts"],
  collectCoverageFrom: ["src/modules/review/review.service.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  verbose: true,
}
