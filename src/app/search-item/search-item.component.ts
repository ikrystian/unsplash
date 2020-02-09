import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent implements OnInit {
  @Input() image;
  @Input() settings;

  expiredNewLabelDate = moment().subtract(14, 'days').format();

  constructor() {
  }

  ngOnInit() {
  }

}
 