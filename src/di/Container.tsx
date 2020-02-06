import 'reflect-metadata';
import {Container} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {AuthRepository} from '../auth/AuthRepository';
import {GRAPHQL_DI, GraphQLClient, GraphQLClientInstance} from '../graphql/GraphQLClient';
import {STORAGE_DI, StorageClient, StorageInstance} from '../storage/StorageClient';
import {Storage} from '../storage/Storage';
import {AuthStorage} from '../auth/AuthStorage';

const DiContainer = new Container();

DiContainer.bind<StorageClient>(STORAGE_DI).toConstantValue(StorageInstance);
DiContainer.bind<Storage>(Storage).to(Storage);

DiContainer.bind<GraphQLClient>(GRAPHQL_DI).toConstantValue(GraphQLClientInstance);
DiContainer.bind<GraphQLService>(GraphQLService).to(GraphQLService);

DiContainer.bind<AuthStorage>(AuthStorage).to(AuthStorage);
DiContainer.bind<AuthRepository>(AuthRepository).to(AuthRepository);

export default DiContainer;
