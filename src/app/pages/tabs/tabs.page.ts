import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabBar, IonTabs, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albums, albumsOutline, albumsSharp, call, callOutline, chatbox, chatboxOutline, chatbubble, chatbubbles, settings, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTabButton, IonTabs, IonTabBar, IonToolbar, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {

  selectedTab = signal<string>('chats');

  constructor() {
    addIcons({
      albumsOutline,
      callOutline,
      chatboxOutline,
      settingsOutline,
      chatbubble,
      albumsSharp,
      call,
      chatbubbles,
      settings,
      albums
    })
  }

  ngOnInit() {
  }

  getSelectedTab(event: any){
    console.log(event);
    this.selectedTab.set(event?.tab);
  }

}
