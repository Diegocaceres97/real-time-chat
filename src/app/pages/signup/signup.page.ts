import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput,IonHeader,IonInputPasswordToggle, IonTitle, IonToolbar, IonButton, IonSpinner, IonText, IonFooter, IonIcon, IonCard, IonButtons, IonBackButton, IonAlert } from '@ionic/angular/standalone';

import { lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonAlert, IonBackButton, IonButtons, IonCard, IonInput,IonIcon,IonInputPasswordToggle, IonFooter, IonText, IonSpinner, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class SignupPage implements OnInit {

  private auth = inject(AuthService);
  private router = inject(Router);

  form!: FormGroup;
  isSignup = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personOutline
    })
   }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
  });
  }

  onSubmit() {
    console.log('entra en onsubmit')
    console.log(this.form)
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
    this.signup(this.form.value);
  }

  async signup(formValue: {name:string,email:string,password:string}) {
    console.log('entra por aca')
    try {

      this.setIsSignup(true);

      const {id} = await this.auth.register(formValue);
      this.setIsSignup(false);

      //navigate to tabs screen
      this.router.navigateByUrl('/tabs', {replaceUrl: true});

      this.form.reset();
    } catch (error: any) {
      this.setIsSignup(false);

      console.log(error.code)
      let msg = 'could not sign you up, please try again';
      if(error.code === 'auth/email-already-in-use') {
        msg = 'email already in use';
      }

      console.error(msg);
      this.setErrorMessage(msg);
    }
  }

  setIsSignup(value: boolean){
    this.isSignup.set(value);
  }

  setErrorMessage(value: string | null){
    this.errorMessage.set(value);
  }
}
