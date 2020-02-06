import { Component, HostBinding, OnInit} from '@angular/core';
import Unsplash, {toJson} from 'unsplash-js';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import { Image } from './image/image';
import {observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  unsplash = new Unsplash({accessKey: '4ae61b3dedfb954680f2c13f5f43370d6bd3e6cc1adab125577ab3a9dc070f3e'});
  res: any;
  images: Image[];
  searchForm: FormGroup;
  loading = false;
  gridView = false;
  expiredNewLabelDate = moment().subtract(14, 'days').format();
  page;
  itemsPerPage;
  options;
  @HostBinding('class.dark-mode') darkMode = false;

  constructor(private formBuilder: FormBuilder) {
    this.page = 1;
    this.itemsPerPage = 5;
    this.options = [
      {name: 'portrait', value: 'portrait'},
      {name: 'landscape', value: 'landscape'},
      {name: 'squarish', value: 'squarish'},
    ];
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchText: '',
      orientation: 'portrait'
    });
    if (localStorage.getItem('searchTerms')) {
      const historyTerms = JSON.parse(localStorage.getItem('searchTerms'));
      this.getImages(historyTerms.searchText, historyTerms.orientation);

      this.searchForm = this.formBuilder.group({
        searchText: historyTerms.searchText,
        orientation: historyTerms.orientation
      });

    }
    this.onValueChanges();
  }

  onValueChanges(): void {
    this.searchForm.valueChanges.subscribe(val => {
      if (val.searchText) {
        localStorage.setItem('searchTerms', JSON.stringify(val));
        this.getImages(val.searchText, val.orientation);
      } else {
        localStorage.removeItem('searchTerms');
        this.res = null;
        this.images = [];
      }
    });
  }

  nightMode() {
    this.darkMode = !this.darkMode;
  }

  goToImageWebsite(websiteUrl) {
    window.location.href = websiteUrl;
  }

  getImages(searchText, orientation) {
    this.page = 1;
    this.images = [];
    this.loading = true;
    this.unsplash.search.photos(searchText, this.page, this.itemsPerPage, {orientation})
      .then(toJson)
      .then(json => {
          this.res = json;
          this.images = json.results;
          this.loading = false;
      });
  }

  gotToPage(page: number) {
    const historyTerms = JSON.parse(localStorage.getItem('searchTerms'));
    this.page = page;
    console.log(this.page);
    this.images = [];
    this.loading = true;
    this.unsplash.search.photos(historyTerms.searchText, this.page, this.itemsPerPage, {orientation: historyTerms.orientation})
      .then(toJson)
      .then(json => {
        this.res = json;
        this.images = json.results;
        this.loading = false;
      });
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }

}
