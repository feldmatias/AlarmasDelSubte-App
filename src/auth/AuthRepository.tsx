import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {Result} from '../utils/Result';
import {AuthToken} from './AuthToken';
import {LoginMutation} from './login/LoginMutation';
import {SignUpMutation} from './signup/SignUpMutation';
import {AuthStorage} from './AuthStorage';
import {GraphQLMutation} from '../graphql/GraphQLMutation';

@injectable()
export class AuthRepository {

    @inject(GraphQLService) private graphql!: GraphQLService;

    @inject(AuthStorage) private storage!: AuthStorage;

    public async login(username: string, password: string): Promise<Result<AuthToken>> {
        const mutation = new LoginMutation(username, password);
        return await this.authMutation(mutation);
    }

    public async signUp(username: string, password: string): Promise<Result<AuthToken>> {
        const mutation = new SignUpMutation(username, password);
        return await this.authMutation(mutation);
    }

    private async authMutation(mutation: GraphQLMutation): Promise<Result<AuthToken>> {
        const result = await this.graphql.mutation(mutation, AuthToken);
        if (result.isSuccessful()) {
            await this.storage.saveToken(result.getData());
        }
        return result;
    }
}

