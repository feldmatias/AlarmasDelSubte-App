import {GraphQLMutation} from '../../graphql/GraphQLMutation';
import {GraphQLOperation} from '../../graphql/GraphQLClient';
import {gql} from 'apollo-boost';
import {AlarmInput} from '../model/AlarmInput';
import {alarmResponseData} from './AlarmResponseFragment';

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
                    ...AlarmResponseData
                }
            }
            ${alarmResponseData}
        `;
    }

    public getName(): string {
        return 'createAlarm';
    }

    public getVariables(): any {
        return this.variables;
    }

}
