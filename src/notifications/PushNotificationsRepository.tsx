import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {FirebaseTokenMutation} from './graphql/FirebaseTokenMutation';
import {PUSH_NOTIFICATIONS_DI, PushNotifications} from './Firebase';

@injectable()
export class PushNotificationsRepository {

    @inject(PUSH_NOTIFICATIONS_DI) private pushNotifications!: PushNotifications;

    @inject(GraphQLService) private graphql!: GraphQLService;


    public async sendNotificationsToken(): Promise<void> {
        const mutation = new FirebaseTokenMutation(await this.getNotificationsToken());
        await this.graphql.mutation(mutation, String);
    }

    private async getNotificationsToken(): Promise<string> {
        return await this.pushNotifications.messaging().getToken();
    }
}
