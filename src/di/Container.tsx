import 'reflect-metadata';
import {Container} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {AuthRepository} from '../auth/AuthRepository';
import {GRAPHQL_DI, GraphQLClient, GraphQLClientInstance} from '../graphql/GraphQLClient';

const DiContainer = new Container();

DiContainer.bind<GraphQLClient>(GRAPHQL_DI).toConstantValue(GraphQLClientInstance);
DiContainer.bind<GraphQLService>(GraphQLService).to(GraphQLService);
DiContainer.bind<AuthRepository>(AuthRepository).to(AuthRepository);

export default DiContainer;
