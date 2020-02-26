import {NavigationStackProp} from 'react-navigation-stack';
import {NavigationActions, NavigationRoute, StackActions} from 'react-navigation';
import {NavigationParams} from './BaseScreen';

export class Navigation<Params extends NavigationParams> {

    public constructor(private navigation: NavigationStackProp<NavigationRoute, Params>) {

    }

    public navigate(screen: string): void {
        this.navigation.navigate(screen);
    }

    public navigateWithParams<T>(screen: string, params: T): void {
        this.navigation.navigate(screen, params);
    }

    public navigateToMainScreen(screen: string): void {
        const navigateAction = NavigationActions.navigate({routeName: screen});

        this.navigation
            .dispatch(StackActions.reset(
                {
                    index: 0,
                    actions: [
                        navigateAction,
                    ],
                }));
    }

    public back(): void {
        this.navigation.pop();
    }

    public getParam<T>(paramName: string): T | undefined {
        if (this.navigation.state.params) {
            return this.navigation.state.params[paramName];
        }
        return undefined;
    }
}
