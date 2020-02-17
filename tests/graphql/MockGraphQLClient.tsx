import {GRAPHQL_DI, GraphQLClient, GraphQLOperation} from '../../src/graphql/GraphQLClient';
import DiContainer from '../../src/di/Container';
import ApolloClient, {NetworkStatus} from 'apollo-client';
import {NormalizedCacheObject} from 'apollo-cache-inmemory';
import {capture, instance, mock, objectContaining, reset, verify, when} from 'ts-mockito';
import {ApolloQueryResult} from 'apollo-boost';
import {GraphQLError} from 'graphql';
import {ScreenTestUtils} from '../screens/ScreenTestUtils';

class MockGraphQLClient {

    private apolloMock = mock<ApolloClient<NormalizedCacheObject>>();
    private realApollo!: GraphQLClient;

    public mock(): void {
        this.realApollo = DiContainer.get<GraphQLClient>(GRAPHQL_DI);
        DiContainer.rebind<GraphQLClient>(GRAPHQL_DI).toConstantValue(instance(this.apolloMock));
    }

    public reset(): void {
        DiContainer.rebind<GraphQLClient>(GRAPHQL_DI).toConstantValue(this.realApollo);
        reset(this.apolloMock);
    }

    public mockSuccess<T>(request: GraphQLOperation, data: T) {
        const response = new ApolloClientResponse(data);

        when(this.apolloMock.query(objectContaining({query: request}))).thenResolve(response);
        when(this.apolloMock.mutate(objectContaining({mutation: request}))).thenResolve(response);
    }

    public mockError(request: GraphQLOperation, error = 'error'): void {
        const response = new ApolloClientResponse({}, error);

        when(this.apolloMock.query(objectContaining({query: request}))).thenResolve(response);
        when(this.apolloMock.mutate(objectContaining({mutation: request}))).thenResolve(response);
    }

    public mockNetworkError(request: GraphQLOperation): void {
        when(this.apolloMock.query(objectContaining({query: request}))).thenReject(new Error('GraphQL Network Error'));
        when(this.apolloMock.mutate(objectContaining({mutation: request}))).thenReject(new Error('GraphQL Network Error'));
    }

    public async assertMutationCalled(request: GraphQLOperation, times: number): Promise<void> {
        await ScreenTestUtils.flushPromises();
        verify(this.apolloMock.mutate(objectContaining({mutation: request}))).times(times);
    }

    public async assertMutationCalledWith<T>(request: GraphQLOperation, params: T): Promise<void> {
        await ScreenTestUtils.flushPromises();
        const [options] = capture<any>(this.apolloMock.mutate).last();
        expect(options.mutation).toBe(request);
        expect(options.variables).toEqual(params);
    }
}

export default new MockGraphQLClient();

class ApolloClientResponse implements ApolloQueryResult<any> {
    public data: any;
    public errors?: ReadonlyArray<GraphQLError>;
    public loading = false;
    public networkStatus = NetworkStatus.ready;
    public stale = false;

    public constructor(data: any, error = '') {
        this.data = data;
        if (error) {
            const errorResponse = mock<GraphQLError>();
            when(errorResponse.message).thenReturn(error);
            this.errors = [instance(errorResponse)];
        }
    }
}
