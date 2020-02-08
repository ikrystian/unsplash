import {Component, HostBinding, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Image} from './image/image';
import {ImageService} from './image/image.service';
import {ModalService} from './image/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  res: any;
  images: Image[];
  searchForm: FormGroup;
  page;
  options;
  iframeSrc: string;
  historyItems: string[] = [];
  detailsAction: any;
  itemsList;
  showIframe = false;
  settings = {
    advancedSettings: false,
    disableImages: true,
    croppedDescription: false,
    ieMode: false,
    showHistory: false,
    maxItemsInSearch: 5,
    loading: false,
    gridView: false,
    modalDetails: 0
  };
  radioSel:any;
  radioSelected: string;
  radioSelectedString:string;

  @HostBinding('class.dark-mode') darkMode = false;

  constructor(private formBuilder: FormBuilder, private imageService: ImageService, private modalService: ModalService) {
    this.page = 1;
    // revert to 12 after developing
    this.options = [
      {name: 'portrait', value: 'portrait'},
      {name: 'landscape', value: 'landscape'},
      {name: 'squarish', value: 'squarish'},
    ];
    this.detailsAction = [{value: 'value_1', name: "Show modal with details"}, {value: 'value_2', name: 'Open page in new tab'}, {value: 'value_3', name: 'Show iframe'}];

    this.getImages('kitty');

    this.isIE();
    console.log('%c do not open this site in IE, Greta will be angry then!!', 'background: green; color: white; display: block;');

    this.itemsList = this.detailsAction;
    this.radioSelected = "value_2";
    this.getSelecteditem();
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


   // Get row item from array  
   getSelecteditem(){
    this.radioSel = this.detailsAction.find(Item => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }
  // Radio Change Event
  onItemChange(item){
    this.getSelecteditem();
  }


  changeFormValue(name, e) {
    e.preventDefault();
    this.settings.showHistory = false;
    this.getImages(name);
    this.searchForm.controls['searchText'].setValue(name);
  }

  toggleHistory(event): void {
    event.preventDefault();
    this.settings.showHistory = !this.settings.showHistory;
  }

  focusOut(name): void {
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

  nightMode(): void {
    this.darkMode = !this.darkMode;
  }

  getImages(searchText, orientation?) {
    this.images = [];
    this.settings.loading = true;

    this.imageService.getImages(searchText, orientation).then((res) => {
      this.res = res;
      this.images = res.results;
      this.settings.loading = false;
    });
  }

  gotToPage(page: number) {
    const historyTerms = JSON.parse(localStorage.getItem('searchTerms'));
    this.page = page;
    this.images = [];
    this.settings.loading = true;

    this.imageService.getImagesForSpecificPage(historyTerms.searchText, historyTerms.orientation, page).then((res) => {
      this.res = res;
      this.images = res.results;
      this.settings.loading = false;
    });
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }

  goToImageWebsite(websiteUrl): void {
    window.location.href = websiteUrl;
  }

  toggleIframe(src?) {
    this.showIframe = !this.showIframe;
    this.iframeSrc = (src) ? src : '';
  }

  private isIE(): void {
    const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    this.settings.ieMode = (match !== -1);
  }

  openModal(arr): void {
    if(this.radioSelected == 'value_1'){
      this.modalService.open(arr[0])
    } else if (this.radioSelected == 'value_2') {
      window.open(arr[1], '_blank')
    } else {
      console.log(arr[2]);
      this.toggleIframe(arr[2]);
    }
  }
}
