import ApolloClient, {DocumentNode} from 'apollo-boost';
import fetch from 'isomorphic-fetch';
import {Container} from 'typedi';

const GRAPHQL_URL = 'http://192.168.0.11:3000/graphql';

const client = new ApolloClient({
    uri: GRAPHQL_URL,
    fetch: fetch,
});

export const GRAPHQL_DI = 'GRAPHQL_DI';
export type GraphQLClient = typeof client;
export type GraphQLQuery = DocumentNode;

Container.set(GRAPHQL_DI, client);
