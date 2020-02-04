import {NavigationStackProp} from 'react-navigation-stack';
import {instance, mock, verify} from 'ts-mockito';

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
}
