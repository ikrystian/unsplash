import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id = 'modal') {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(image) {
    this.modals.filter(x => x.id === 'modal')[0].open(image);
  }

  close() {
     this.modals.filter(x => x.id === 'modal')[0].close();
  }
}
