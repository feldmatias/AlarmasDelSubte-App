import ApolloClient, {DocumentNode} from 'apollo-boost';
import fetch from 'isomorphic-fetch';
// @ts-ignore
import {API_URL} from 'react-native-dotenv';

const GRAPHQL_URL = `${API_URL}/graphql`;

const client = new ApolloClient({
    uri: GRAPHQL_URL,
    fetch: fetch,
});

export const GRAPHQL_DI = 'GRAPHQL_DI';
export type GraphQLClient = typeof client;
export type GraphQLOperation = DocumentNode;
export const GraphQLClientInstance = client;
