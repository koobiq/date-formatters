module.exports = {
    preset: '../../jest.preset.js',
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js'],
    coverageDirectory: '../../coverage/moment-date-adapter'
};
