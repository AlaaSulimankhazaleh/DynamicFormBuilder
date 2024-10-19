import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ControlBase, FormModel } from './model';
import { FormService } from './form.service';
import { AuthService } from '../../shared/services/auth.service';
import { ResultStatus } from '../../shared/model';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform:scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
`]
})
export class FormBuilderComponent implements OnInit  {
  formGroup!: FormGroup;
  model:FormModel|null=null;
  loading =this.formService.loading;
  dynamicControls: ControlBase<any>[] = [];
  newControl = { key: '', label: '', type: '', required: false };
  controlTypes = [
    { label: 'Text', value: 'Text' },
    { label: 'Date', value: 'Date' },
    { label: 'Numeric', value: 'Numeric' }
  ];
  draggedControlIndex: number | null = null;

  constructor(private fb: FormBuilder, private formService: FormService, public auth: AuthService,public messageService:MessageService ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.formGroup = this.fb.group({
      header: ['', Validators.required],
      key: [{ value: uuidv4(), disabled: true }],
    });
  }

  addCustomControl(): void {
    const { key, label, type, required } = this.newControl;
    if (!key || !label || !type) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill out all required fields (key, label, and type) before adding a control.'
      });
      return;
    }
    if (this.formGroup.contains(key)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Duplicate Key',
        detail: `A control with the key "${key}" already exists.`
      });
      return;
    }
    const control = required ? new FormControl('', Validators.required) : new FormControl('');
    this.formGroup.addControl(key, control);
    this.dynamicControls.push({
      key: key,
      label: label,
      type: type,
      required: required,
      value: '',
      order: this.dynamicControls.length + 1,
      controlType: type,
      options: []
    });
    this.newControl = { key: '', label: '', type: '', required: false };
    this.messageService.add({
      severity: 'success',
      summary: 'Control Added',
      detail: `Control with key "${key}" has been added successfully.`
    });
  }

  onSave(): void {
    debugger;
    const formValue = this.formGroup.getRawValue();
    const mappedControls = this.dynamicControls.map(control => ({
      id: control.id || 0,
      value: this.formGroup.controls[control.key].value,
      key: control.key,
      label: control.label,
      required: control.required,
      order: control.order,
      controlType: control.controlType,
      type: control.type,
      options: control.options,

    }));
    const form: FormModel = {
      name: formValue.header,
      key: formValue.key,
      userId: this.auth.getUserInfo()?.id || 0,
      controls: mappedControls,
      createdDate: new Date(),
      createdBy: this.auth.getUserInfo()?.createdBy || ""
    };
    if (this.model && this.model?.id) {
      form.id = this.model.id;
      this.formService.Update(form).subscribe(x => {
        if (x.status == ResultStatus.Success) {
          this.model = x.data;
          this.dynamicControls=this.model.controls;
        }
      });
    } else {
      this.formService.Add(form).subscribe(x => {
        if (x.status == ResultStatus.Success) {
          this.model = x.data;
          this.dynamicControls=this.model.controls;
        }
      });
    }
  }
  onDragStart(index: number): void {
    this.draggedControlIndex = index;
  }

  onDragEnd(): void {
    this.draggedControlIndex = null;
  }

  onDrop(event: any): void {
    if (this.draggedControlIndex !== null) {
      const droppedIndex = this.getDropTargetIndex(event);
      if (this.draggedControlIndex !== droppedIndex) {
        const movedControl = this.dynamicControls.splice(this.draggedControlIndex, 1)[0];
        this.dynamicControls.splice(droppedIndex, 0, movedControl);
      }
      this.draggedControlIndex = null;
    }
  }

  onDragOver(event: any): void {
    event.preventDefault();
  }
  getDropTargetIndex(event: any): number {
    const targetElement = event.target.closest('.flex-item');
    return Array.from(targetElement.parentNode.children).indexOf(targetElement);
  }
  removeControl(index: number): void {
    const controlKey = this.dynamicControls[index].key;
    if (this.formGroup.contains(controlKey)) {
      this.formGroup.removeControl(controlKey);
    }
    this.dynamicControls.splice(index, 1);
  }
}

