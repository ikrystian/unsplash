import {Component, HostBinding, OnInit, HostListener, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Image} from './image/image';
import {ImageService} from './image/image.service';
import {ModalService} from './image/modal.service';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'enterAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ opacity: 0, transform: 'translateX(-100%)' }),
            animate('0.3s ease-out', 
                    style({opacity: 1, transform: 'translateX(0%)' }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ opacity: 1, transform: 'translateX(0%)' }),
            animate('0.3s ease-out', 
                    style({opacity: 0, transform: 'translateX(-100%)' }))
          ]
        )
      ]
    )
  ]
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
    modalDetails: 0,
    languageMenu: false,
    showSidenav: false
  };
  radioSel: any;
  radioSelected: string;
  radioSelectedString: string;
  @HostBinding('class.dark-mode') darkMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private modalService: ModalService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document) {

    translate.setDefaultLang('pl');
    this.page = 1;
    this.options = [
      {name: 'PORTRAIT', value: 'portrait'},
      {name: 'LANDSCAPE', value: 'landscape'},
      {name: 'SQUARISH', value: 'squarish'},
    ];
    this.detailsAction = [
      {value: 'value_1', name: 'SHOW_MODAL_DETAILS'},
      {value: 'value_2', name: 'OPEN_IN_NEW_TAB'},
      {value: 'value_3', name: 'SHOW_IFRAME'}
    ];

    this.isIE();
    console.log('%c do not open this site in IE, Greta will be angry then!!', 'background: green; color: white; display: block;');

    this.itemsList = this.detailsAction;
    this.radioSelected = 'value_1';
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const stt = document.getElementById('scroll-to-top');
    (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80)
      ? stt.classList.add('scroll-to-top--on')
      : stt.classList.remove('scroll-to-top--on');
  }

  getSelecteditem() {
    this.radioSel = this.detailsAction.find(el => el.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }

  onItemChange() {
    this.getSelecteditem();
  }


  changeFormValue(name, e) {
    e.preventDefault();
    this.settings.showHistory = false;
    this.getImages(name);
    this.searchForm.controls['searchText'].setValue(name);
  }

  toggleHistory(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.settings.showHistory = !this.settings.showHistory;
  }

  useLanguage(language: string) {
    this.settings.languageMenu = false;
    this.translate.use(language);
  }

  focusOut(name): void {
    if (!this.historyItems.includes(name) && name !== '') {
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
    if (src) {
      this.iframeSrc = src;
      this.showIframe = true;
    } else {
      this.showIframe = !this.showIframe;
    }
  }

  private isIE(): void {
    const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    this.settings.ieMode = (match !== -1);
  }

  openModal(arr): void {
    if (this.radioSelected === 'value_1') {
      this.modalService.open(arr[0]);
    } else if (this.radioSelected === 'value_2') {
      window.open(arr[1], '_blank');
    } else {
      this.toggleIframe(arr[1]);
    }
  }
}
