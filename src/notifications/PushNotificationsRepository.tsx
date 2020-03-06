import {inject, injectable} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {MESSAGING_DI, MessagingClient} from "./Firebase";
import {FirebaseTokenMutation} from "./graphql/FirebaseTokenMutation";

@injectable()
export class PushNotificationsRepository {

    @inject(MESSAGING_DI) private messaging!: MessagingClient;

    @inject(GraphQLService) private graphql!: GraphQLService;


    public async sendNotificationsToken(): Promise<void> {
        const mutation = new FirebaseTokenMutation(await this.getNotificationsToken());
        await this.graphql.mutation(mutation, String);
    }

    private async getNotificationsToken(): Promise<string> {
        return await this.messaging.getToken();
    }
}
