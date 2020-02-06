import {Component, OnInit} from '@angular/core';
import Unsplash, {toJson} from 'unsplash-js';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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
  constructor(private formBuilder: FormBuilder) {


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
      (val.searchText.length > 2) ? this.getImages(val.searchText, val.orientation) : false;
    });
  }

  getImages(searchText, orientation) {
    this.images = [];
    this.loading = true;
    this.unsplash.search.photos(searchText, 1, 12, {orientation})
      .then(toJson)
      .then(json => {
        console.log(json);
        this.res = json;
        this.images = json.results;
        this.loading = false;
      });
  }
}
