import {GraphQLOperation} from './GraphQLClient';

export interface GraphQLQuery {

    getQuery(): GraphQLOperation;

    getName(): string;

    getVariables(): any;
}
