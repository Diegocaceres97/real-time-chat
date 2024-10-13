import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonInputPasswordToggle, IonHeader, IonTitle, IonToolbar, IonInput, IonIcon, IonList, IonTabButton, IonButton, IonSkeletonText, IonText, IonSpinner, IonFooter, IonItem, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonCard,  IonItem, IonFooter, IonSpinner, RouterLink, IonText, IonSkeletonText, IonButton, IonTabButton, IonList, IonIcon, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule, IonInputPasswordToggle]
})
export class LoginPage implements OnInit {

  form!: FormGroup;
  isLogin = signal<boolean>(false);

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

}
