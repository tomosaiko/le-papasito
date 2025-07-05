const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node', // Tests E2E utilisent Node.js
  testMatch: [
    '<rootDir>/**/__tests__/**/*.(e2e|integration).(test|spec).{js,jsx,ts,tsx}',
    '<rootDir>/**/*.(e2e|integration).(test|spec).{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/api/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  testTimeout: 30000, // 30 secondes pour les tests E2E
}

module.exports = createJestConfig(customJestConfig) 