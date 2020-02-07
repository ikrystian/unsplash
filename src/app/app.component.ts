import {Component, HostBinding, OnInit} from '@angular/core';
import Unsplash, {toJson} from 'unsplash-js';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {Image} from './image/image';
import {observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  unsplash = new Unsplash({accessKey: '0cd8dc520afcebddb302df021b34acf9779014e145516044b8a64ff67a58fe64'});
  res: any;
  images: Image[];
  searchForm: FormGroup;
  settingsForm: FormGroup;
  loading = false;
  gridView = false;
  expiredNewLabelDate = moment().subtract(14, 'days').format();
  page;
  itemsPerPage;
  options;
  croppedDescription = false;
  ieMode = false;
  historyItems: string[] = [];
  maxItemsInSearch = 5;
  showHistory = false;
  settings = {
    advancedSettings: false,
    disableImages: false
  };
  @HostBinding('class.dark-mode') darkMode = false;

  constructor(private formBuilder: FormBuilder) {
    this.page = 1;
    // revert to 12 after developing
    this.itemsPerPage = 12;
    this.options = [
      {name: 'portrait', value: 'portrait'},
      {name: 'landscape', value: 'landscape'},
      {name: 'squarish', value: 'squarish'},
    ];
    this.isIE();
    console.log('%c do not open this site in IE, Greta will be angry then!!', 'background: green; color: white; display: block;');

  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      searchText: '',
      orientation: 'portrait'
    });

    if (localStorage.getItem('historyItems')) {
      this.historyItems = JSON.parse(localStorage.getItem('historyItems'));
    } else {
      this.historyItems = [];
    }

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

  changeFormValue(name, e) {
    e.preventDefault();
    this.showHistory = false;
    this.getImages(name);
    this.searchForm.controls['searchText'].setValue(name);

  }

  toggleHistory(event) {
    event.preventDefault();
    this.showHistory = !this.showHistory;
  }

  focusOut(name) {
    if (!this.historyItems.includes(name)) {
      this.historyItems.push(name);
      localStorage.setItem('historyItems', JSON.stringify(this.historyItems));
    }
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

  getImages(searchText, orientation = 'portrait') {
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
      .catch(error => console.log(error))
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

  private isIE(): void {
    const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    this.ieMode = (match !== -1);
  }

}
