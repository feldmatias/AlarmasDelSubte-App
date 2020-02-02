import {inject, injectable} from 'inversify';
import {GRAPHQL_DI, GraphQLClient} from './GraphQLClient';
import {Result} from '../utils/Result';
import {plainToClass} from 'class-transformer';
import {GraphQLMutation} from './GraphQLMutation';

@injectable()
export class GraphQLService {

    @inject(GRAPHQL_DI) private client!: GraphQLClient;

    private static readonly DEFAULT_ERROR = 'Ocurrió un error. Intenta más tarde.';

    public async mutation<T>(mutation: GraphQLMutation, returnType: new() => T): Promise<Result<T>> {
        try {
            const result = await this.client.mutate({
                mutation: mutation.getMutation(),
                variables: mutation.getVariables(),
                errorPolicy: 'all',
            });

            if (result.errors && result.errors.length > 0) {
                return Result.Error(result.errors[0].message);
            }

            const data = plainToClass(returnType, result.data[mutation.getName()]);
            return Result.Success(data);

        } catch {
            return Result.Error(GraphQLService.DEFAULT_ERROR);
        }
    }
}
