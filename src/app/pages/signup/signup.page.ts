import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInput,IonHeader,IonInputPasswordToggle, IonTitle, IonToolbar, IonButton, IonSpinner, IonText, IonFooter, IonIcon, IonCard, IonButtons, IonBackButton } from '@ionic/angular/standalone';

import { lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonCard, IonInput,IonIcon,IonInputPasswordToggle, IonFooter, IonText, IonSpinner, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class SignupPage implements OnInit {

  form!: FormGroup;
  isSignup = signal<boolean>(false);

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
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  }
}
