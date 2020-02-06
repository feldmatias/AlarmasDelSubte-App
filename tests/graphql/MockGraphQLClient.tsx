import {GRAPHQL_DI, GraphQLClient, GraphQLOperation} from '../../src/graphql/GraphQLClient';
import DiContainer from '../../src/di/Container';
import {createMockClient} from 'mock-apollo-client';
import {MockApolloClient, RequestHandler} from 'mock-apollo-client/dist/mockClient';

class MockGraphQLClient {

    private apolloMock!: MockApolloClient;
    private realApollo!: GraphQLClient;
    private requestHandler!: RequestHandler;

    public mock(): void {
        this.apolloMock = createMockClient();
        this.realApollo = DiContainer.get<GraphQLClient>(GRAPHQL_DI);
        DiContainer.rebind<GraphQLClient>(GRAPHQL_DI).toConstantValue(this.apolloMock);
    }

    public reset(): void {
        DiContainer.rebind<GraphQLClient>(GRAPHQL_DI).toConstantValue(this.realApollo);
    }

    public mockSuccess<T>(request: GraphQLOperation, data: T) {
        this.requestHandler = jest.fn().mockResolvedValue({data: data});
        this.apolloMock.setRequestHandler(request, this.requestHandler);
    }

    public mockLoading(request: GraphQLOperation): void {
        this.requestHandler = jest.fn();
        this.apolloMock.setRequestHandler(request, this.requestHandler);
    }

    public mockError(request: GraphQLOperation, error = 'error'): void {
        this.requestHandler = jest.fn().mockResolvedValue({errors: [{message: error}]});
        this.apolloMock.setRequestHandler(request, this.requestHandler);
    }

    public mockNetworkError(request: GraphQLOperation): void {
        this.apolloMock.setRequestHandler(
            request,
            () => Promise.reject(new Error('GraphQL Network Error')));
    }

    public assertCalled(times: number): void {
        expect(this.requestHandler).toBeCalledTimes(times);
    }

    public assertCalledWith<T>(params: T): void {
        expect(this.requestHandler).toBeCalledWith(params);
    }
}

export default new MockGraphQLClient();
