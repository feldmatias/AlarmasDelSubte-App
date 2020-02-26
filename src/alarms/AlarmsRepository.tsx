import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {Result} from '../utils/Result';
import {Alarm} from './model/Alarm';
import {AlarmsListQuery} from './graphql/AlarmsListQuery';
import {AlarmDeleteMutation} from './graphql/AlarmDeleteMutation';
import {AlarmInput} from './model/AlarmInput';
import {AlarmCreateMutation} from './graphql/AlarmCreateMutation';
import {AlarmEditMutation} from './graphql/AlarmEditMutation';

@injectable()
export class AlarmsRepository {

    @inject(GraphQLService) private graphql!: GraphQLService;

    public async getAlarms(): Promise<Result<Alarm[]>> {
        const query = new AlarmsListQuery();
        return await this.graphql.queryList(query, Alarm);
    }

    public async deleteAlarm(alarm: Alarm): Promise<Result<Number>> {
        const mutation = new AlarmDeleteMutation(alarm);
        return await this.graphql.mutation(mutation, Number);
    }

    public async createAlarm(alarmInput: AlarmInput): Promise<Result<Alarm>> {
        const mutation = new AlarmCreateMutation(alarmInput);
        return await this.graphql.mutation(mutation, Alarm);
    }

    public async editAlarm(alarmInput: AlarmInput, alarm: Alarm): Promise<Result<Alarm>> {
        const mutation = new AlarmEditMutation(alarmInput, alarm);
        return await this.graphql.mutation(mutation, Alarm);
    }
}

