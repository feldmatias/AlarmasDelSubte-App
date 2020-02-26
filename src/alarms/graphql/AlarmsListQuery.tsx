import {GraphQLQuery} from '../../graphql/GraphQLQuery';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';
import {alarmResponseData} from './AlarmResponseFragment';

export class AlarmsListQuery implements GraphQLQuery {

    public getName(): string {
        return 'getAlarms';
    }

    public getQuery(): GraphQLOperation {
        return gql`
            query {
                getAlarms {
                    ...AlarmResponseData
                }
            }
            ${alarmResponseData}
        `;
    }

    public getVariables(): any {
        return {};
    }

}
