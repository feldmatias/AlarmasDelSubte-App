import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {Result} from '../utils/Result';
import {Subway} from "./model/Subway";
import {SubwaysListQuery} from "./subwaysList/SubwaysListQuery";

@injectable()
export class SubwaysRepository {

    @inject(GraphQLService) private graphql!: GraphQLService;

    public async getSubways(): Promise<Result<Subway[]>> {
        const query = new SubwaysListQuery();
        return await this.graphql.queryList(query, Subway);
    }
}

