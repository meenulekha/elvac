import AsyncStorage from '@react-native-async-storage/async-storage';

const logAsyncStorageContents = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log('AsyncStorage Contents:', items);
  } catch (error) {
    console.error('Error retrieving AsyncStorage contents:', error);
  }
};

// Call this function somewhere in your code to log the data
logAsyncStorageContents();
