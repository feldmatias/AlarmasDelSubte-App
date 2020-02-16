import {anyString, instance, mock, reset, verify, when} from 'ts-mockito';
import {STORAGE_DI, StorageClient} from '../../src/storage/StorageClient';
import DiContainer from '../../src/di/Container';
import {AuthToken} from '../../src/auth/AuthToken';
import {AuthStorage} from '../../src/auth/AuthStorage';

class MockStorage {

    private storageMock = mock<StorageClient>();
    private realStorage!: StorageClient;

    public mock(): void {
        this.realStorage = DiContainer.get<StorageClient>(STORAGE_DI);
        DiContainer.rebind<StorageClient>(STORAGE_DI).toConstantValue(instance(this.storageMock));
    }

    public mockWithAuthorizationToken(): void {
        this.mock();
        const token = new AuthToken();
        token.token = 'authorization token';
        this.mockSavedValue(AuthStorage.AUTH_TOKEN_KEY, token);
    }

    public reset(): void {
        reset(this.storageMock);
        DiContainer.rebind<StorageClient>(STORAGE_DI).toConstantValue(this.realStorage);
    }

    public mockSavedValue<T>(key: string, value: T): void {
        when(this.storageMock.get(key)).thenResolve(JSON.stringify(value));
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
