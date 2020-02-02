import {GraphQLOperation} from './GraphQLClient';

export interface GraphQLMutation {

    getMutation(): GraphQLOperation;

    getName(): string;

    getVariables(): any;
}
