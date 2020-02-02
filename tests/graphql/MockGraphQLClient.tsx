import {GRAPHQL_DI, GraphQLClient} from '../../src/graphql/GraphQLClient';
import {instance, mock, reset} from 'ts-mockito';
import DiContainer from '../../src/di/Container';

class MockGraphQLClient {

    private apolloMock: GraphQLClient = mock<GraphQLClient>();
    private realApollo?: GraphQLClient;

    public mock(): void {
        this.realApollo = DiContainer.get<GraphQLClient>(GRAPHQL_DI);
        DiContainer.rebind<GraphQLClient>(GRAPHQL_DI).toConstantValue(instance(this.apolloMock));
    }

    public reset(): void {
        reset(this.apolloMock);
        if (this.realApollo) {
            DiContainer.rebind<GraphQLClient>(GRAPHQL_DI).toConstantValue(this.realApollo);
        }
    }
}

export default new MockGraphQLClient();
