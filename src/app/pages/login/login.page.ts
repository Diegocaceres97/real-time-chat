import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInputPasswordToggle, IonHeader, IonTitle, IonToolbar, IonInput, IonIcon, IonList, IonTabButton, IonButton, IonSkeletonText, IonText, IonSpinner, IonFooter, IonItem, IonCard, IonAlert, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonModal, IonAlert, IonCard,  IonItem, IonFooter, IonSpinner, RouterLink, IonText, IonSkeletonText, IonButton, IonTabButton, IonList, IonIcon, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  fpForm!: FormGroup;
  isLogin = signal<boolean>(false);
  isForgot = signal<boolean>(false);
  isFPmodal = signal<boolean>(false);
  //private router = inject(Router);
  private auth = inject(AuthService);
  errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline
    })
   }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
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
    this.Login(this.form.value);
  }

  async Login(formValue: {name:string,email:string,password:string}) {
    console.log('entra por aca')
    try {

      this.setIsLogin(true);

      await this.auth.login(formValue.email, formValue.password);
      this.setIsLogin(false);
      //navigate to tabs screen
      this.auth.navigateByUrl('/tabs');


      this.form.reset();
    } catch (error: any) {
      this.setIsLogin(false);

      console.log(error.code)
      let msg = 'could not sign you up, please try again';
      if(error.code === 'auth/user-not-found') {
        msg = 'email could not be found';
      } else if(error.code === 'auth/wrong-password') {
        msg = 'wrong password';
      }

      console.error(msg);
      this.setErrorMessage(msg);
    }
  }

  setIsLogin(value: boolean){
    this.isLogin.set(value);
  }

  setErrorMessage(value: string | null){
    this.errorMessage.set(value);
  }

  setFP(value: boolean){
    if(value){
      this.fpForm = new FormGroup({
        email: new FormControl(null, {validators: [Validators.required, Validators.email]})
      });
    }
    this.isFPmodal.set(value);
  }

  setIsForgot(value: boolean){
    this.isForgot.set(value);
  }

  onFpSubmit() {
    if(this.fpForm.invalid) {
      this.fpForm.markAllAsTouched();
      return;
    }

    console.log(this.fpForm.value);
    const {email} = this.fpForm.value;
    this.resetPassword(email);
  }

  async resetPassword(email: string){
    try {
      this.setIsForgot(true);

      console.log(email)
      await this.auth.resetPassword(email);
      this.setIsForgot(false);
      this.setFP(false);

      this.setErrorMessage('Reset password link sent to your emaul successfully');
    } catch (error) {
      console.error(error);
      this.setErrorMessage('Could not send reset password link, please try again');
    }

  }

}
