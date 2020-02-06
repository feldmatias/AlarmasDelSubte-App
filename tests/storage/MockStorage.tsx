import {instance, mock, verify, anyString} from 'ts-mockito';
import {STORAGE_DI, StorageClient} from '../../src/storage/StorageClient';
import DiContainer from '../../src/di/Container';

class MockStorage {

    private storageMock!: StorageClient;
    private realStorage!: StorageClient;

    public mock(): void {
        this.storageMock = mock<StorageClient>();
        this.realStorage = DiContainer.get<StorageClient>(STORAGE_DI);
        DiContainer.rebind<StorageClient>(STORAGE_DI).toConstantValue(instance(this.storageMock));
    }

    public reset(): void {
        DiContainer.rebind<StorageClient>(STORAGE_DI).toConstantValue(this.realStorage);
    }

    public assertSaved<T>(key: string, value: T): void {
        const jsonValue = JSON.stringify(value);
        verify(this.storageMock.set(key, jsonValue)).called();
    }

    public assertNotSaved(key: string): void {
        verify(this.storageMock.set(key, anyString())).never();
    }
}

export default new MockStorage();
