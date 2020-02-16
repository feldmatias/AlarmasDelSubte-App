import {inject, injectable} from 'inversify';
import {GRAPHQL_DI, GraphQLClient} from './GraphQLClient';
import {Result} from '../utils/Result';
import {plainToClass} from 'class-transformer';
import {GraphQLMutation} from './GraphQLMutation';
import {GraphQLQuery} from './GraphQLQuery';
import {ClassType} from 'class-transformer/ClassTransformer';
import {ExecutionResult} from 'graphql';
import {AuthStorage} from '../auth/AuthStorage';

@injectable()
export class GraphQLService {

    @inject(GRAPHQL_DI) private client!: GraphQLClient;

    @inject(AuthStorage) private authStorage!: AuthStorage;

    public static readonly DEFAULT_ERROR = 'Ocurrió un error. Intenta más tarde.';

    public async mutation<T>(mutation: GraphQLMutation, returnType: ClassType<T>): Promise<Result<T>> {
        try {
            const result = await this.client.mutate({
                mutation: mutation.getMutation(),
                variables: mutation.getVariables(),
                errorPolicy: 'all',
            });

            if (this.hasError(result)) {
                return this.getError(result);
            }

            const data = plainToClass(returnType, result.data[mutation.getName()]);
            return Result.Success(data);

        } catch {
            return this.getDefaultError();
        }
    }

    public async queryList<T>(query: GraphQLQuery, returnType: ClassType<T>): Promise<Result<T[]>> {
        try {
            const result = await this.client.query({
                query: query.getQuery(),
                variables: query.getVariables(),
                errorPolicy: 'all',
                fetchPolicy: 'network-only',
                context: {headers: await this.getHeaders()},
            });

            if (this.hasError(result)) {
                return this.getError(result);
            }

            const data = plainToClass(returnType, result.data[query.getName()] as Object[]);
            return Result.Success(data);

        } catch {
            return this.getDefaultError();
        }
    }

    private hasError<T>(result: ExecutionResult<T>): boolean {
        return !!(result.errors && result.errors.length > 0);
    }

    private getError<T>(result: ExecutionResult<T>): Result<T> {
        if (!result.errors) {
            return this.getDefaultError();
        }
        return Result.Error(result.errors[0].message);
    }

    private getDefaultError<T>(): Result<T> {
        return Result.Error(GraphQLService.DEFAULT_ERROR);
    }

    private async getHeaders(): Promise<any> {
        const authToken = await this.authStorage.getToken();
        if (!authToken) {
            return {};
        }

        return {
            Authorization: authToken.token,
        };
    }
}
