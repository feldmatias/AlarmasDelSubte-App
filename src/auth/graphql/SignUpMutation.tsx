import {GraphQLMutation} from '../../graphql/GraphQLMutation';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';

export class SignUpMutation implements GraphQLMutation {

    private variables = {
        username: '',
        password: '',
    };

    public constructor(username: string, password: string) {
        this.variables.username = username;
        this.variables.password = password;
    }

    public getMutation(): GraphQLOperation {
        return gql`
            mutation ($username: String!, $password: String!) {
                registerUser(userInput: {username: $username, password: $password}) {
                    token
                }
            }
        `;
    }

    public getName(): string {
        return 'registerUser';
    }

    public getVariables(): any {
        return this.variables;
    }

}
