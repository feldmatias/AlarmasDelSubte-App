import {Inject, Service} from 'typedi';
import {GRAPHQL_DI, GraphQLClient, GraphQLQuery} from './GraphQLClient';

@Service()
export class GraphQLService {

    public constructor(@Inject(GRAPHQL_DI) private client: GraphQLClient) {
    }

    public async query(query: GraphQLQuery, variables: any): Promise<void> {
        try {
            const result = await this.client.mutate({mutation: query, variables: variables, errorPolicy: 'all'});
            console.log('success');
            console.log(result);
            console.log(result.data.login);
            // {"data": {"login": {"__typename": "User", "token": "EdAVhGZFqwCvWDX29pYT2h"}}}
            // {"data": {"login": null}, "errors": [{"message": "El usuario o la contraseña son incorrectos"}]}
        } catch (error) {
            console.log('error');
            console.log(error.message);
        }
    }
}
