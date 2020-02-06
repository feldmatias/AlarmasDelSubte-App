import {NavigationStackProp} from 'react-navigation-stack';
import { NavigationActions, StackActions } from 'react-navigation';

export class Navigation {

    public constructor(private navigation: NavigationStackProp) {

    }

    public navigate(screen: string): void {
        this.navigation.navigate(screen);
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
}
