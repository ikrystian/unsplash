import {Component, OnInit} from '@angular/core';
import Unsplash, {toJson} from 'unsplash-js';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import { Image } from './image/image';
import {ImageService} from './image/image.service';
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
  constructor(private formBuilder: FormBuilder, private imageService: ImageService ) {
    this.getImages('kitty', 'portrait');
    this.page = 1;
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

  getImages(searchText, orientation, page = this.page) {
    this.images = [];
    this.loading = true;
    this.unsplash.search.photos(searchText, page, 12, {orientation})
      .then(toJson)
      .then(json => {
          this.res = json;
          this.images = json.results;
          this.loading = false;
      });
  }

  gotToPage(page) {
    this.page = page;
    console.log(this.page);
    this.images = [];
    this.loading = true;
    this.unsplash.search.photos('kitty', this.page, 12, {orientation: 'landscape'})
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
