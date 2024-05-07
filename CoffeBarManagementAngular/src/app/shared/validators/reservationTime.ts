import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const ReservationTimeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (control:any) => {
        const value  = control.value;
        if(value){
            const hours = value.getHours();
            if(hours >= 8 && hours <= 22){
                return null;
            }else{
                return {invalidTime : true};
            }
        }
        return null;
    }
}