import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password:string = control.get('password')?.value;
    const repassword:string = control.get('repassword')?.value;

    if(password != repassword){
        return {
            passwordMatchError : true
        }
    }
    return null;
}