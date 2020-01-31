import 'reflect-metadata';
import {Container} from 'inversify';
import {GraphQLService} from '../graphql/GraphQLService';
import {AuthRepository} from '../auth/AuthRepository';
import {GRAPHQL_DI, GraphQLClient, GraphQLClientInstance} from '../graphql/GraphQLClient';

const container = new Container();

container.bind<GraphQLClient>(GRAPHQL_DI).toConstantValue(GraphQLClientInstance);
container.bind<GraphQLService>(GraphQLService).to(GraphQLService);
container.bind<AuthRepository>(AuthRepository).to(AuthRepository);

export default container;
