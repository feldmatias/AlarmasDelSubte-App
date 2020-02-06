import {NavigationStackProp} from 'react-navigation-stack';
import {capture, instance, mock, verify} from 'ts-mockito';
import {NavigationResetAction} from 'react-navigation';

export class MockNavigation {

    private navigation: NavigationStackProp;

    public constructor() {
        this.navigation = mock<NavigationStackProp>();
    }

    public instance(): NavigationStackProp {
        return instance(this.navigation);
    }

    public assertNavigatedTo(route: string): void {
        verify(this.navigation.navigate(route)).called();
    }

    public assertNavigatedToMain(route: string): void {
        const [action] = capture(this.navigation.dispatch).last();
        const resetAction = action as NavigationResetAction;

        expect(resetAction.type.includes('RESET')).toBeTruthy();
        expect(resetAction.index).toBe(0);

        const navigateAction = resetAction.actions[0];
        expect(navigateAction.routeName).toBe(route);
    }
}
