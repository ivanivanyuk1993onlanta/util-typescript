import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {DynamicComponentInterface} from './dynamic-component-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-container',
  styleUrls: ['./dynamic-container.component.scss'],
  templateUrl: './dynamic-container.component.html',
})
export class DynamicContainerComponent<InputType, ComponentType extends DynamicComponentInterface<InputType>> implements OnChanges {
  @Input() componentType: Type<ComponentType>;
  @Input() input: InputType;

  @ViewChild('template', {
    read: ViewContainerRef,
    static: true,
  }) private _viewContainerRef: ViewContainerRef;

  private _componentInstance: ComponentType;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componentType) {
      this._viewContainerRef.clear();
      this._componentInstance = this._viewContainerRef.createComponent(
        this._componentFactoryResolver.resolveComponentFactory(this.componentType),
      ).instance;
    }
    // todo add ChangeDetector call
    this._componentInstance.input = this.input;
    this._componentInstance.ngOnChanges(changes);
  }
}
