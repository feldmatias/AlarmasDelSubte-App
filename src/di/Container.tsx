import 'reflect-metadata';
import {Container} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {AuthRepository} from '../auth/AuthRepository';
import {GRAPHQL_DI, GraphQLClient, GraphQLClientInstance} from '../graphql/GraphQLClient';
import {STORAGE_DI, StorageClient, StorageInstance} from '../storage/StorageClient';
import {Storage} from '../storage/Storage';
import {AuthStorage} from '../auth/AuthStorage';
import {SubwaysRepository} from '../subways/SubwaysRepository';
import {AlarmsRepository} from '../alarms/AlarmsRepository';
import {SubwaysStorage} from '../subways/SubwaysStorage';
import {
    MESSAGING_DI,
    MessagingClient,
    MessagingInstance, NOTIFICATIONS_ANDROID_DI,
    NOTIFICATIONS_DI, NotificationsAndroidInstance, NotificationsAndroidModule, NotificationsClient,
    NotificationsInstance,
} from '../notifications/Firebase';
import {PushNotificationsRepository} from '../notifications/PushNotificationsRepository';
import {PushNotificationsService} from '../notifications/PushNotificationsService';

const DiContainer = new Container();

// Storages

DiContainer.bind<StorageClient>(STORAGE_DI).toConstantValue(StorageInstance);
DiContainer.bind<Storage>(Storage).to(Storage);

DiContainer.bind<AuthStorage>(AuthStorage).to(AuthStorage);

DiContainer.bind<SubwaysStorage>(SubwaysStorage).to(SubwaysStorage);


// GraphQL

DiContainer.bind<GraphQLClient>(GRAPHQL_DI).toConstantValue(GraphQLClientInstance);
DiContainer.bind<GraphQLService>(GraphQLService).to(GraphQLService);


// Notifications

DiContainer.bind<MessagingClient>(MESSAGING_DI).toConstantValue(MessagingInstance);
DiContainer.bind<NotificationsClient>(NOTIFICATIONS_DI).toConstantValue(NotificationsInstance);
DiContainer.bind<NotificationsAndroidModule>(NOTIFICATIONS_ANDROID_DI).toConstantValue(NotificationsAndroidInstance);

DiContainer.bind<PushNotificationsRepository>(PushNotificationsRepository).to(PushNotificationsRepository);
DiContainer.bind<PushNotificationsService>(PushNotificationsService).to(PushNotificationsService);


// Repositories

DiContainer.bind<AuthRepository>(AuthRepository).to(AuthRepository);

DiContainer.bind<SubwaysRepository>(SubwaysRepository).to(SubwaysRepository);

DiContainer.bind<AlarmsRepository>(AlarmsRepository).to(AlarmsRepository);


export default DiContainer;
