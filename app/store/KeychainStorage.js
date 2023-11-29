import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
} from 'react-native-keychain';

const KeychainStorage = {
  async getAllKeys(cb) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (cb) {
        cb(undefined, keys);
      }
      return keys;
    } catch (err) {
      cb(err);
      throw err;
    }
  },
  async getItem(key, cb) {
    try {
      const sharedWebCredentials = await getGenericPassword({service: key});
      // Check getGenericPassword documentation https://git.io/JffKK
      if (typeof sharedWebCredentials === 'boolean') {
        throw new Error('entry does not exist');
      }

      const {password} = sharedWebCredentials;
      if (cb) {
        cb(undefined, password);
      }
      return password;
    } catch (err) {
      if (cb) {
        cb(err);
      }
      throw err;
    }
  },
  async setItem(key, value, cb) {
    try {
      await Promise.all([
        AsyncStorage.setItem(key, key),
        setGenericPassword('user', value, {service: key}),
      ]);
      await setGenericPassword('user', value, {service: key});
      if (cb) {
        cb(undefined);
      }
    } catch (err) {
      if (cb) {
        cb(err);
      }
      throw err;
    }
  },
  async removeItem(key, cb) {
    try {
      await Promise.all([
        AsyncStorage.removeItem(key),
        resetGenericPassword({service: key}),
      ]);
      if (cb) {
        cb(undefined);
      }
    } catch (err) {
      if (cb) {
        cb(err);
      }
      throw err;
    }
  },
};

export default KeychainStorage;
