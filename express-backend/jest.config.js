/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@application/(.*)$": "<rootDir>/src/application/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1"
  }
};