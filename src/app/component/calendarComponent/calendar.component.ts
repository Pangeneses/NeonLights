// calendar.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-component-calendar',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Output() blurDateRange = new EventEmitter<{
    FromDate: Date;
    ToDate: Date;
  }>();

  constructor(){

    this.selectedMonth = new Date().getMonth();

    this.selectedYear = new Date().getFullYear();

  }

  ngOnInit() {

    this.generateYearOptions();

    this.generateCalendar();

    this.blurDateRange.emit({
      FromDate: this.selectedFromDate, 
      ToDate: this.selectedToDate
    });

  }

  trackMonthFN(index: number, item: { label: string; value: number }) {
    return item.value;
  }

  trackDayFN(index: number, day: string): string {
    return day;
  }

  calendarDays: Date[] = [];

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  monthOptions = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  selectedMonth: number;

  trackYearFN(index: number, item: number) {
    return item;
  }

  yearOptions: number[] = [];

  selectedYear: number;

  generateYearOptions() {

    for (let year = 1800; year <= 3000; year++) {

      this.yearOptions.push(year);

    }

  }

  trackDateFN(index: number, date: Date): number {
    return date.getTime();
  }

  generateCalendar() {

    this.calendarDays = [];

    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);

    const startDay = firstDay.getDay();

    const daysInMonth = new Date(this.selectedYear, +this.selectedMonth + 1, 0).getDate();

    const prevMonth = this.selectedMonth === 0 ? 11 : +this.selectedMonth - 1;

    const prevYear = this.selectedMonth === 0 ? +this.selectedYear - 1 : this.selectedYear;

    const daysInPrevMonth = new Date(prevYear, this.selectedMonth, 0).getDate();

    for (let i = +startDay - 1; i >= 0; i--) {

      this.calendarDays.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));

    }

    for (let i = 1; i <= daysInMonth; i++) {

      this.calendarDays.push(new Date(this.selectedYear, this.selectedMonth, i));

    }

    const nextMonth = this.selectedMonth === 11 ? 0 : +this.selectedMonth + 1;

    const nextYear = this.selectedMonth === 11 ? +this.selectedYear + 1 : this.selectedYear;

    const remainingCells = +42 - this.calendarDays.length;

    for (let i = 1; i <= remainingCells; i++) {

      this.calendarDays.push(new Date(nextYear, nextMonth, i));

    }

  }

  selectedEdge: 'from' | 'to' = 'from';

  selectedFromDate = new Date();

  selectedToDate = new Date();

  stripTime(date: Date): number {

    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  }

  onCalendarCellClick(date: Date): void {

    if (this.selectedEdge === 'from') {

      this.selectedFromDate = new Date(date);

      this.selectedToDate = new Date(date);

    } else if (this.selectedEdge === 'to') {

      this.selectedToDate = new Date(date);

      if (this.selectedFromDate && this.stripTime(this.selectedToDate) < this.stripTime(this.selectedFromDate)) {

        this.selectedToDate = this.selectedFromDate;

        this.selectedFromDate = new Date(date);

      }

    }

    this.blurDateRange.emit({
      FromDate: this.selectedFromDate, 
      ToDate: this.selectedToDate
    });

  }

}
