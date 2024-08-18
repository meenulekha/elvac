import AsyncStorage from '@react-native-async-storage/async-storage';

const removeItemByKey = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Item with key ${key} removed successfully`);
  } catch (error) {
    console.error('Error removing item:', error);
  }
};
