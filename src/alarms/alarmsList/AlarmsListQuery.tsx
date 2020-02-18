import {GraphQLQuery} from '../../graphql/GraphQLQuery';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';

export class AlarmsListQuery implements GraphQLQuery {

    public getName(): string {
        return 'getAlarms';
    }

    public getQuery(): GraphQLOperation {
        return gql`
            query {
                getAlarms {
                    id
                    name
                    days
                    start
                    end
                    subways {
                        line
                        icon
                    }
                }
            }
        `;
    }

    public getVariables(): any {
        return {};
    }

}
