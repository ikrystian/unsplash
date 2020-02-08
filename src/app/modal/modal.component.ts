import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import {ModalService} from '../image/modal.service';
import {ImageService} from '../image/image.service';
import {Item} from '../image/image';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})

export class ModalComponent implements  OnInit, OnDestroy  {

  @Input() id: string;
  readonly element: any;
  image: Item;
  constructor(private modalService: ModalService, private el: ElementRef, private imageService: ImageService) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    document.body.appendChild(this.element);
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove();
    this.element.remove();
  }

  open(id): void {
    this.element.style.display = 'flex';
    this.imageService.getImage(id).then(res => this.image = res);
    document.body.classList.add('modal-open');
  }

  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
