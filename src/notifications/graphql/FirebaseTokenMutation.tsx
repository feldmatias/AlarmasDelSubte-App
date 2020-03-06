import {GraphQLMutation} from '../../graphql/GraphQLMutation';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';

export class FirebaseTokenMutation implements GraphQLMutation {

    private variables = {
        token: '',
    };

    public constructor(token: string) {
        this.variables.token = token;
    }

    public getMutation(): GraphQLOperation {
        return gql`
            mutation ($token: String!) {
                setFirebaseToken(token: $token)
            }
        `;
    }

    public getName(): string {
        return 'setFirebaseToken';
    }

    public getVariables(): any {
        return this.variables;
    }

}
