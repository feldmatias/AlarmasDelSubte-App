import {inject, injectable} from 'inversify';
import {Storage} from '../storage/Storage';
import {Subway} from './model/Subway';

@injectable()
export class SubwaysStorage {

    @inject(Storage) private storage!: Storage;

    public static readonly SUBWAYS_KEY = 'SUBWAYS';

    public async saveSubways(subways: Subway[]): Promise<void> {
        await this.storage.save(SubwaysStorage.SUBWAYS_KEY, subways);
    }

    public async getSubways(): Promise<Subway[]> {
        return await this.storage.getList(SubwaysStorage.SUBWAYS_KEY, Subway);
    }
}
