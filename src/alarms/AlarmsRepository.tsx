import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {Result} from '../utils/Result';
import {Alarm} from './model/Alarm';
import {AlarmsListQuery} from './alarmsList/AlarmsListQuery';
import {AlarmDeleteMutation} from './alarmsList/AlarmDeleteMutation';

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
}

