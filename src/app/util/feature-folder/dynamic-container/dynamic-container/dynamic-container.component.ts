import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  ViewChild
} from '@angular/core';
import {ViewContainerRefDirective} from '../../view-container-ref/view-container-ref.directive';
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

  @ViewChild(ViewContainerRefDirective, {static: true}) private _viewContainerRef: ViewContainerRefDirective;

  private _componentInstance: ComponentType;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componentType) {
      this._viewContainerRef.viewContainerRef.clear();
      this._componentInstance = (this._viewContainerRef.viewContainerRef.createComponent(
        this._componentFactoryResolver.resolveComponentFactory(this.componentType),
      ).instance as ComponentType);

      this._componentInstance.input = this.input;
      this._componentInstance.ngOnChanges(this.input as unknown as SimpleChanges);
    } else if (changes.input) {
      this._componentInstance.input = this.input;
      this._componentInstance.ngOnChanges(changes);
    }
  }
}
