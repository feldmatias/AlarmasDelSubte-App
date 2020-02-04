import {ValidationResult} from '../../utils/ValidationResult';

export class PasswordValidator {

    private static readonly PASSWORD_MIN_LENGTH = 6;

    public static readonly ERROR = 'La contraseña debe tener al menos 6 caracteres';

    public static validate(password: string): ValidationResult {
        if (password.length < this.PASSWORD_MIN_LENGTH) {
            return ValidationResult.Error(this.ERROR);
        }

        return ValidationResult.Success();
    }
}
