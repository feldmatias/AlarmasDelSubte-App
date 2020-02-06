import LegacyStorage from '@react-native-community/async-storage-backend-legacy';
import AsyncStorageFactory from '@react-native-community/async-storage';

const legacyStorage = new LegacyStorage();

const storageClient = AsyncStorageFactory.create(legacyStorage, {});

export const STORAGE_DI = 'STORAGE_DI';
export type StorageClient = typeof storageClient;
export const StorageInstance = storageClient;
