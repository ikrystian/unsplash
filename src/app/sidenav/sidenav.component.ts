import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() settings: any;
  @Output() newItemEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    console.log(this.settings);
  }

  clearSearchHistory(): void {
    this.settings.historyItems = [];
    localStorage.removeItem('historyItems');
  }

  chooseActionType() {
    this.newItemEvent.emit('asd');
  }

}
