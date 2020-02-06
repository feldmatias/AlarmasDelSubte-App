import {inject, injectable} from 'inversify';
import {STORAGE_DI, StorageClient} from './StorageClient';
import {plainToClass} from 'class-transformer';

@injectable()
export class Storage {

    @inject(STORAGE_DI) private storage!: StorageClient;

    public async save<T>(key: string, value: T): Promise<void> {
        const jsonValue = JSON.stringify(value);
        await this.storage.set(key, jsonValue);
    }

    public async get<T>(key: string, returnType: new() => T): Promise<T | null> {
        const value = await this.storage.get(key);
        if (!value) {
            return null;
        }

        return plainToClass(returnType, value);
    }
}
