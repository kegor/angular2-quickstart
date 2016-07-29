import { Component } from '@angular/core';
import { DatePickerBase } from '../common/bs-date-picker-base.class';
import { DatePickerState } from '../common/bs-date-picker-state.provider';
import { DatePickerOptions } from '../common/bs-date-picker-options.provider';

import * as moment from 'moment';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'bs-custom-range-picker',
  exportAs: 'bs-custom-range-picker',
  directives: [NgIf, NgFor],
  moduleId: module.id,
  templateUrl: './bs-custom-range-picker.html'
})
export class CustomRangePickerComponent extends DatePickerBase {
  public isShown:boolean = false;
  public isCustomRangeShown:boolean = true;
  public ranges:{key:string, value:moment.Moment[]}[];

  private _showCalendars: boolean = false;
  private _prevSelected:moment.Moment[];

  public constructor(datePickerService:DatePickerState, options:DatePickerOptions) {
    super(datePickerService, options);
    options.onUpdate.subscribe(() => this.refresh());
  }

  public active(start:any, end:any):void {
    const startDate = moment().subtract(start, 'days');
    const endDate = moment().subtract(end, 'days');

    this.selectDate(startDate);
    this.selectDate(endDate);
  }

  public refresh():void {
    if (!this.options.ranges) {
      this.isShown = false;
      return;
    }

    const keys = Object.keys(this.options.ranges);
    if (!keys || !keys.length) {
      this.isShown = false;
      return;
    }

    this.isCustomRangeShown = this.options.ui.showCustomRangeLabel;
    this.isShown = true;

    this.ranges = keys.map((key:string) => {
      const value = (this.options.ranges[key] as string[]).map((date:any)=> moment(date));
      return {key,value};
    });

    this.datePickerState.showCalendars = this._showCalendars || this.options.ui.alwaysShowCalendars;
  }

  public selectRange(range:moment.Moment[]):void {
    this._showCalendars = false;
    this._prevSelected = void 0;
    this.resetSelection();
    this.selectDate(range[0]);
    this.selectDate(range[1]);
  }

  public previewRange(range:moment.Moment[]):void {
    if (!this._prevSelected) {
      this._prevSelected = [this.datePickerState.selectedDate, this.datePickerState.selectedEndDate];
    }
    this.resetSelection();
    this.selectDate(range[0]);
    this.selectDate(range[1]);
  }

  public finishPreviewRange():void {
    if (!this._prevSelected) {
      return;
    }

    this.datePickerState.selectedDate = this._prevSelected[0];
    this.datePickerState.selectedEndDate = this._prevSelected[1];
    this._prevSelected = void 0;
  }

  public showCalendars():void {
    this._showCalendars = true;
    this.datePickerState.showCalendars = true;
  }
}
