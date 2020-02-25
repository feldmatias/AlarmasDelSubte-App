import {ValidationResult} from '../../utils/ValidationResult';
import {authStrings} from '../../strings/AuthStrings';

export class PasswordValidator {

    private static readonly PASSWORD_MIN_LENGTH = 6;

    private static readonly ERROR = authStrings.signUpScreen.invalidPasswordError;

    public static validate(password: string): ValidationResult {
        if (password.length < this.PASSWORD_MIN_LENGTH) {
            return ValidationResult.Error(this.ERROR);
        }

        return ValidationResult.Success();
    }
}
