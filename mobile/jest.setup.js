jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(async () => ({ data: 'token' })),
  scheduleNotificationAsync: jest.fn(async () => 'notification-id'),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async () => null),
  getItem: jest.fn(async () => null),
}));
