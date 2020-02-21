import {GraphQLMutation} from '../../graphql/GraphQLMutation';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';
import {Alarm} from '../model/Alarm';

export class AlarmDeleteMutation implements GraphQLMutation {

    private variables = {
        id: 0,
    };

    public constructor(alarm: Alarm) {
        this.variables.id = alarm.id;
    }

    public getMutation(): GraphQLOperation {
        return gql`
            mutation ($id: ID!) {
                deleteAlarm(id: $id)
            }
        `;
    }

    public getName(): string {
        return 'deleteAlarm';
    }

    public getVariables(): any {
        return this.variables;
    }

}
