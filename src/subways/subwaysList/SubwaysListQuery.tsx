import {GraphQLQuery} from '../../graphql/GraphQLQuery';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';

export class SubwaysListQuery implements GraphQLQuery {

    public getName(): string {
        return 'getSubways';
    }

    public getQuery(): GraphQLOperation {
        return gql`
            query {
                getSubways {
                    line
                    icon
                    status
                    statusType
                    updatedAt
                }
            }
        `;
    }

    public getVariables(): any {
        return {};
    }

}
