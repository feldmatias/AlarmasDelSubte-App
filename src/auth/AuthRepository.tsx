import {inject, injectable} from 'inversify';
import {gql} from 'apollo-boost';
import {GraphQLService} from '../graphql/GraphQLService';

@injectable()
export class AuthRepository {

    @inject(GraphQLService) private graphql!: GraphQLService;

    private readonly LOGIN = 'login';

    private readonly LOGIN_QUERY = gql`
        mutation ($username: String!, $password: String!) {
            login(userInput: {username: $username, password: $password}) {
                token
            }
        }
    `;

    public async login(username: string, password: string) {
        await this.graphql.query(this.LOGIN_QUERY, {username, password});
    }

}

