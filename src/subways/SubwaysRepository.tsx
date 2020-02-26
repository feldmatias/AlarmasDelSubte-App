import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {Result} from '../utils/Result';
import {Subway} from './model/Subway';
import {SubwaysListQuery} from './graphql/SubwaysListQuery';
import {SubwaysStorage} from './SubwaysStorage';

@injectable()
export class SubwaysRepository {

    @inject(GraphQLService) private graphql!: GraphQLService;

    @inject(SubwaysStorage) private storage!: SubwaysStorage;

    public async getSubways(): Promise<Result<Subway[]>> {
        const query = new SubwaysListQuery();
        const result = await this.graphql.queryList(query, Subway);
        await this.storeSubways(result);
        return result;
    }

    private async storeSubways(result: Result<Subway[]>): Promise<void> {
        const subways = result.isSuccessful() ? result.getData() : [];
        await this.storage.saveSubways(subways);
    }

    public async getStoredSubways(): Promise<Subway[]> {
        return await this.storage.getSubways();
    }
}

