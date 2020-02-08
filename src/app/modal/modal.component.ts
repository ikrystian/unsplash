import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import {ModalService} from '../image/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})

export class ModalComponent implements  OnInit, OnDestroy  {

  @Input() id: string;
  readonly element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
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

  open(el): void {
    this.element.style.display = 'flex';
    console.log(el);
    document.body.classList.add('modal-open');
  }

  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
