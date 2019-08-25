import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appViewContainerRef]'
})
export class ViewContainerRefDirective {
  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }
}
