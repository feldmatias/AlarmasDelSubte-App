import {GraphQLMutation} from '../../graphql/GraphQLMutation';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';
import {AlarmInput} from '../model/AlarmInput';

export class AlarmCreateMutation implements GraphQLMutation {

    private variables = {
        input: new AlarmInput(),
    };

    public constructor(alarmInput: AlarmInput) {
        this.variables.input = alarmInput;
    }

    public getMutation(): GraphQLOperation {
        return gql`
            mutation ($input: AlarmInput!) {
                createAlarm(alarmInput: $input) {
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

    public getName(): string {
        return 'createAlarm';
    }

    public getVariables(): any {
        return this.variables;
    }

}
