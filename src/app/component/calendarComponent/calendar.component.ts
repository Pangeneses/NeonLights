// calendar.component.ts
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-component-calendar',
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  ngOnInit() {

    this.generateYearOptions();

    const today = new Date();

    this.selectedYear = today.getFullYear();

    this.selectedMonth = today.getMonth();

    this.generateCalendar();

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

  selectedMonth = new Date().getMonth();

  trackYearFN(index: number, item: number) {
    return item;
  }

  yearOptions: number[] = [];

  selectedYear = new Date().getFullYear();

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

    
    console.log(this.calendarDays.length + ' ' + (+this.selectedMonth + 1) + ' ' + startDay + ' ' + daysInMonth);

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

  selectedFromDate = new Date();

  selectedToDate = new Date();

}
