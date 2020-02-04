import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {Result} from '../utils/Result';
import {AuthToken} from './AuthToken';
import {LoginMutation} from './login/LoginMutation';
import {SignUpMutation} from './signup/SignUpMutation';

@injectable()
export class AuthRepository {

    @inject(GraphQLService) private graphql!: GraphQLService;

    public async login(username: string, password: string): Promise<Result<AuthToken>> {
        const mutation = new LoginMutation(username, password);
        return await this.graphql.mutation(mutation, AuthToken);
    }

    public async signUp(username: string, password: string): Promise<Result<AuthToken>> {
        const mutation = new SignUpMutation(username, password);
        return await this.graphql.mutation(mutation, AuthToken);
    }
}

