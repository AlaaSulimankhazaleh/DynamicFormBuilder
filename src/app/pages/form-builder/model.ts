export interface FormModel {
  id?: number;
  name: string;
  key: string;
  createdDate: Date;
  createdBy: string;
  userId: number;
  controls: ControlBase<string>[];
}



export class ControlBase<T> {
  id?: number;
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: {key: string; value: string}[];
  constructor(
    options: {
      id?: number;
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: {key: string; value: string}[];
    } = {},
  ) {
    this.id = options.id || 0;
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}
export enum ControlType{
  Numeric="Numeric",
  Date="Date"
}

