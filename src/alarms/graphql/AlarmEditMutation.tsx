import {GraphQLMutation} from '../../graphql/GraphQLMutation';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';
import {AlarmInput} from '../model/AlarmInput';
import {Alarm} from '../model/Alarm';
import {alarmResponseData} from './AlarmResponseFragment';

export class AlarmEditMutation implements GraphQLMutation {

    private variables = {
        input: new AlarmInput(),
        id: 0,
    };

    public constructor(alarmInput: AlarmInput, alarm: Alarm) {
        this.variables.input = alarmInput;
        this.variables.id = alarm.id;
    }

    public getMutation(): GraphQLOperation {
        return gql`
            mutation ($input: AlarmPartialInput!, $id: ID!) {
                editAlarm(alarmInput: $input, id: $id) {
                    ...AlarmResponseData
                }
            }
            ${alarmResponseData}
        `;
    }

    public getName(): string {
        return 'editAlarm';
    }

    public getVariables(): any {
        return this.variables;
    }

}
