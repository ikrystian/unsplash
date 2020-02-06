import {Component, OnInit} from '@angular/core';
import Unsplash, {toJson} from 'unsplash-js';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  unsplash = new Unsplash({accessKey: '4ae61b3dedfb954680f2c13f5f43370d6bd3e6cc1adab125577ab3a9dc070f3e'});
  res: any;
  images: [];
  searchForm: FormGroup;
  loading = false;
  gridView = false;
  expiredNewLabelDate = moment().subtract(14, 'days').format();

  constructor(private formBuilder: FormBuilder) {
    this.getImages('office', 'portrait');
    console.log(this.expiredNewLabelDate);
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchText: '',
      orientation: 'portrait'
    });
    this.onValueChanges();
  }

  onValueChanges(): void {
    this.searchForm.valueChanges.subscribe(val => {
      if (val.searchText) {
        this.getImages(val.searchText, val.orientation);
      } else {
        this.res = null;
        this.images = [];
      }
    });
  }

  nightMode() {

  }

  goToImageWebsite(websiteUrl) {
    window.location.href = websiteUrl;
  }

  getImages(searchText, orientation) {
    this.images = [];
    this.loading = true;
    this.unsplash.search.photos(searchText, 1, 12, {orientation})
      .then(toJson)
      .then(json => {
          console.log(json.results);
          this.res = json;
          this.images = json.results;
          this.loading = false;
      });
  }

}
