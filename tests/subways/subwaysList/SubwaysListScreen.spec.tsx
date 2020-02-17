import 'react-native';
import MockGraphQLClient from '../../graphql/MockGraphQLClient';
import {fireEvent, RenderAPI} from 'react-native-testing-library';
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
import {SubwayStatus} from '../../../src/subways/model/SubwayStatus';
import {Colors} from '../../../src/styles/Colors';
import moment, {Moment} from 'moment';

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

    async function refreshSubways(): Promise<void> {
        await fireEvent(renderApi.getByTestId('subwaysList'), 'onRefresh');
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

        describe('Subway status color', () => {

            function assertStatusColor(color: string): void {
                const subwayStatus = renderApi.getByTestId('subwayStatus');
                expect(subwayStatus.props.style[0].color).toEqual(color);
            }

            it('should show subway status in green if it is normal', async () => {
                const subway = new SubwayFixture().withStatusType(SubwayStatus.Normal).get();

                MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
                await renderScreen();

                assertStatusColor(Colors.green);
            });

            it('should show subway status in orange if it is limited', async () => {
                const subway = new SubwayFixture().withStatusType(SubwayStatus.Limited).get();

                MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
                await renderScreen();

                assertStatusColor(Colors.orange);
            });

            it('should show subway status in red if it is closed', async () => {
                const subway = new SubwayFixture().withStatusType(SubwayStatus.Closed).get();

                MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
                await renderScreen();

                assertStatusColor(Colors.red);
            });
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

    describe('Last update', () => {

        function assertLastUpdateDate(date: Moment): void {
            const expectedDate = date.format('DD/MM HH:mm');
            expect(renderApi.getByText('Actualizado: ' + expectedDate)).toBeDefined();
        }

        it('should not show last update when 0 subways', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));

            await renderScreen();

            expect(renderApi.queryByTestId('subwayLastUpdate')).toBeNull();
        });

        it('should show last update when 1 subway', async () => {
            const lastUpdate = moment();
            const subway = new SubwayFixture().withUpdatedAt(lastUpdate).get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await renderScreen();

            assertLastUpdateDate(lastUpdate);
        });

        it('should show minimum last update when n subways', async () => {
            const lastUpdate = moment();
            const minimumUpdate = moment().subtract({hour: 1});

            const subway1 = new SubwayFixture().withLine('1').withUpdatedAt(lastUpdate).get();
            const minimumSubway = new SubwayFixture().withUpdatedAt(minimumUpdate).get();
            const subway3 = new SubwayFixture().withLine('3').withUpdatedAt(lastUpdate).get();

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway1, minimumSubway, subway3]));

            await renderScreen();

            assertLastUpdateDate(minimumUpdate);
        });

        it('should update last update if changed after refresh', async () => {
            const oldUpdate = moment().subtract({hours: 5});
            const newUpdate = moment();

            const subway = new SubwayFixture().withUpdatedAt(oldUpdate).get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await renderScreen();

            subway.updatedAt = newUpdate.toDate();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await refreshSubways();

            assertLastUpdateDate(newUpdate);
        });

    });

    describe('Pull to refresh', () => {

        it('should show refreshing when refresh', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));
            await renderScreen();

            MockGraphQLClient.mockLoading(subwaysQuery);

            refreshSubways();

            const list = renderApi.getByTestId('subwaysList');
            expect(list.props.refreshing).toBeTruthy();
        });

        it('should hide refreshing when refresh finishes', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));
            await renderScreen();

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));

            await refreshSubways();

            const list = renderApi.getByTestId('subwaysList');
            expect(list.props.refreshing).toBeFalsy();
        });

        it('should show subway if 0 subways and 1 after refresh', async () => {
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([]));
            await renderScreen();

            const subway = new SubwayFixture().get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await refreshSubways();

            const items = renderApi.getAllByTestId('subwayItem');
            expect(items.length).toBe(1);
        });

        it('should add subway if is new after refresh', async () => {
            const subway = new SubwayFixture().get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));
            await renderScreen();

            const newLine = 'new';
            const newSubway = new SubwayFixture().withLine(newLine).get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway, newSubway]));

            await refreshSubways();

            const item = renderApi.getByText(`Subte ${newLine}`);
            expect(item).toBeDefined();
        });

        it('should remove subway if is removed after refresh', async () => {
            const subway = new SubwayFixture().get();
            const oldLine = 'old';
            const oldSubway = new SubwayFixture().withLine(oldLine).get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([oldSubway, subway]));

            await renderScreen();

            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await refreshSubways();

            const item = renderApi.queryByText(`Subte ${oldLine}`);
            expect(item).toBeNull();
        });

        it('should update subway status if changed after refresh', async () => {
            const oldStatus = 'old status for subway';
            const newStatus = 'new status for subway';

            const subway = new SubwayFixture().withStatus(oldStatus).get();
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await renderScreen();

            subway.status = newStatus;
            MockGraphQLClient.mockSuccess(subwaysQuery, subwaysResponse([subway]));

            await refreshSubways();

            expect(renderApi.getByText(newStatus)).toBeDefined();
            expect(renderApi.queryByText(oldStatus)).toBeNull();
        });

    });

});
