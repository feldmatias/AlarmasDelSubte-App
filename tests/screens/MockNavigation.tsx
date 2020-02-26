import {NavigationStackProp} from 'react-navigation-stack';
import {capture, deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {NavigationParams, NavigationResetAction, NavigationRoute} from 'react-navigation';

export class MockNavigation {

    private navigation: NavigationStackProp;

    public constructor() {
        this.navigation = mock<NavigationStackProp>();
    }

    public instance(): NavigationStackProp {
        return instance(this.navigation);
    }

    public setParam<T>(paramName: string, param: T): void {
        const state = mock<NavigationRoute>();
        const params = mock<NavigationParams>();

        when(params[paramName]).thenReturn(param);
        when(state.params).thenReturn(instance(params));
        when(this.navigation.state).thenReturn(instance(state));
    }

    public assertNavigatedTo(route: string): void {
        verify(this.navigation.navigate(route)).called();
    }

    public assertNavigatedWithParams<T>(route: string, params: T): void {
        verify(this.navigation.navigate(route, deepEqual(params))).called();
    }

    public assertNavigatedToMain(route: string): void {
        const [action] = capture(this.navigation.dispatch).last();
        const resetAction = action as NavigationResetAction;

        expect(resetAction.type.includes('RESET')).toBeTruthy();
        expect(resetAction.index).toBe(0);

        const navigateAction = resetAction.actions[0];
        expect(navigateAction.routeName).toBe(route);
    }

    public assertNavigatedToBack(): void {
        verify(this.navigation.pop()).called();
    }
}
