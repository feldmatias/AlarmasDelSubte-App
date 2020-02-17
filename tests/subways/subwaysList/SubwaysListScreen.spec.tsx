import 'react-native';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import {RenderAPI} from 'react-native-testing-library';
import React from 'react';
import {GraphQLOperation} from '../../../src/graphql/GraphQLClient';
import {MockNavigation} from '../../screens/MockNavigation';
import MockStorage from '../../storage/MockStorage';
import {ScreenTestUtils} from '../../screens/ScreenTestUtils';
import {SubwaysListScreen} from '../../../src/subways/subwaysList/SubwaysListScreen';
import {SubwaysListQuery} from '../../../src/subways/subwaysList/SubwaysListQuery';
import {SubwayFixture} from '../SubwayFixture';
import {Subway} from '../../../src/subways/model/Subway';
import {GraphQLService} from '../../../src/graphql/GraphQLService';

describe('Subways List Screen', () => {

    let renderApi: RenderAPI;
    let subwaysQuery: GraphQLOperation;
    let navigation: MockNavigation;

    async function renderScreen(): Promise<void> {
        navigation = new MockNavigation();
        renderApi = await ScreenTestUtils.render(<SubwaysListScreen navigation={navigation.instance()}/>);
    }

    beforeEach(async () => {
        MockGraphQLClient.mock();
        MockStorage.mockWithAuthorizationToken();
        subwaysQuery = new SubwaysListQuery().getQuery();
    });

    afterEach(() => {
        MockGraphQLClient.reset();
        MockStorage.reset();
    });

    function subwaysResponse(subways: Subway[]) {
        return {
            getSubways: subways,
        };
    }

    describe('Subways list', () => {

        it('should show subway if query returns 1 subway', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([new SubwayFixture().get()]));
            await renderScreen();

            const items = renderApi.getAllByTestId('subwayItem');
            expect(items.length).toBe(1);
        });

        it('should show all subways if query returns n subway', async () => {
            const subwaysCount = 10;
            const subways = [];
            for (let i = 0; i < subwaysCount; i++) {
                const subway = new SubwayFixture().withLine(i.toString()).get();
                subways.push(subway);
            }

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse(subways));
            await renderScreen();

            const items = renderApi.getAllByTestId('subwayItem');
            expect(items.length).toBe(subwaysCount);
        });

        it('should not show subway if query returns 0 subways', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));
            await renderScreen();

            const items = renderApi.queryByTestId('subwayItem');
            expect(items).toBeNull();
        });

    });

    describe('Subway item', () => {

        it('should show subway line in title', async () => {
            const subwayLine = 'P';
            const subway = new SubwayFixture().withLine(subwayLine).get();

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
            await renderScreen();

            const subwayTitle = renderApi.getByText(`Subte ${subwayLine}`);
            expect(subwayTitle).toBeDefined();
        });

        it('should show correct subway icon', async () => {
            const subwayIcon = 'subway.icon.com';
            const subway = new SubwayFixture().withIcon(subwayIcon).get();

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
            await renderScreen();

            const subwayImage = renderApi.getByTestId('subwayIcon');
            expect(subwayImage.props.source.uri).toBe(subwayIcon);
        });

        it('should show subway status', async () => {
            const subwayStatus = 'subway status';
            const subway = new SubwayFixture().withStatus(subwayStatus).get();

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
            await renderScreen();

            const subwayTitle = renderApi.getByText(subwayStatus);
            expect(subwayTitle).toBeDefined();
        });

    });

    describe('Loading', () => {

        it('should show loading when loading subways', async () => {
            MockGraphQLClient.mockLoading(subwaysQuery);
            await renderScreen();
            expect(renderApi.getByTestId('loading')).toBeDefined();
        });

        it('should hide loading when subways arrive', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([new SubwayFixture().get()]));
            await renderScreen();
            expect(renderApi.queryByTestId('loading')).toBeNull();
        });

    });

    describe('Empty List', () => {

        it('should show empty message when 0 subways', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));

            await renderScreen();

            const message = 'No hay datos del subte en este momento';
            expect(renderApi.getByText(message)).toBeDefined();
        });

        it('should show error when api fails', async () => {
            const error = 'some api error';
            MockGraphQLClient.mockError(subwaysQuery, error);

            await renderScreen();

            expect(renderApi.getByText(error)).toBeDefined();
        });

        it('should show error when network errpr', async () => {
            MockGraphQLClient.mockNetworkError(subwaysQuery);

            await renderScreen();

            expect(renderApi.getByText(GraphQLService.DEFAULT_ERROR)).toBeDefined();
        });

    });

});
