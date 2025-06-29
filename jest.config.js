module.exports = {
  preset: 'react-native',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@walletconnect|@wagmi|react-native-animatable|react-native-modal|react-native-safe-area-context|react-native-url-polyfill|wagmi)/)',
  ],
};
