// used to get typeof ngClass in generic
import {NgClass} from '@angular/common';

const typeOfNgClass = new NgClass((null));

export type TypeOfNgClass = typeof typeOfNgClass.ngClass;
