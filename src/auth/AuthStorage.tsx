import {inject, injectable} from 'inversify';
import {Storage} from '../storage/Storage';
import {AuthToken} from './AuthToken';

@injectable()
export class AuthStorage {

    @inject(Storage) private storage!: Storage;

    public static readonly AUTH_TOKEN_KEY = 'AUTH_TOKEN';

    public async saveToken(token: AuthToken): Promise<void> {
        await this.storage.save(AuthStorage.AUTH_TOKEN_KEY, token);
    }

    public async getToken(): Promise<AuthToken | null> {
        return await this.storage.get(AuthStorage.AUTH_TOKEN_KEY, AuthToken);
    }

    public async hasToken(): Promise<boolean> {
        return await this.getToken() !== null;
    }
}
