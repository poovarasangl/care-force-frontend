import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
​
export function multiCheckboxValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;
​
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
​
      if (control.value === true) {
        checked++;
      }
    });
​
    if (checked < minRequired) {
      return {
        requireOneCheckboxToBeChecked: true,
      };
    }
​
    return null;
  };
}
​
export function emailsMatch(password: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.parent && control.parent.controls) {
      if (control.parent.controls[password].value !== control.value) {
        return { match: true };
      }
    }
    return null;
  };
}
​
​
export function timeRequired(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return  { required: true };
    }
    return null;
  };
}
​
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
​
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }
      // set error on matchingControl if validation fails
      if ( control.value !='' && control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}