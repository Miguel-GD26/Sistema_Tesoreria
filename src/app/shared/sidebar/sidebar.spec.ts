import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  
  menuState: { [key: string]: boolean } = {};
  submenuState: { [key: string]: boolean } = {};

  constructor() { }

  toggleMenu(menu: string) {
    this.menuState[menu] = !this.menuState[menu];
  }

  toggleSubmenu(submenu: string) {
    Object.keys(this.submenuState).forEach(key => {
      if (key !== submenu) this.submenuState[key] = false;
    });
    this.submenuState[submenu] = !this.submenuState[submenu];
  }
}