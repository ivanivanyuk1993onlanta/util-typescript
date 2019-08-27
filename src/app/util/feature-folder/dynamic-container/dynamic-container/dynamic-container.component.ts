import {ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, OnChanges, Type, ViewChild} from '@angular/core';
import {ViewContainerRefDirective} from '../../view-container-ref/view-container-ref.directive';
import {DynamicComponentInterface} from './dynamic-component-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-container',
  styleUrls: ['./dynamic-container.component.scss'],
  templateUrl: './dynamic-container.component.html',
})
export class DynamicContainerComponent<ComponentType, InputType> implements OnChanges {
  @Input() componentType: Type<ComponentType>;
  @Input() input: InputType;

  @ViewChild(ViewContainerRefDirective, {static: true}) private _viewContainerRef: ViewContainerRefDirective;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  public ngOnChanges(): void {
    const componentInstance = (this._viewContainerRef.viewContainerRef.createComponent(
      this._componentFactoryResolver.resolveComponentFactory(this.componentType),
    ).instance as unknown as DynamicComponentInterface<InputType>);
    componentInstance.input = this.input;
    componentInstance.ngOnChanges(null);
  }
}
