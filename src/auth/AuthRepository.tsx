import {Container, Service} from 'typedi';
import {gql} from 'apollo-boost';
import {GraphQLService} from '../graphql/GraphQLService';
import {GRAPHQL_DI} from '../graphql/GraphQLClient';

@Service()
export class AuthRepository {

    public constructor(private graphql: GraphQLService) {
    }

    private readonly LOGIN = 'login';

    private readonly LOGIN_QUERY = gql`
        mutation ($username: String!, $password: String!) {
            login(userInput: {username: $username, password: $password}) {
                token
            }
        }
    `;

    public async login(username: string, password: string) {
        await new GraphQLService(Container.get(GRAPHQL_DI)).query(this.LOGIN_QUERY, {username, password});
    }

}
