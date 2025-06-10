import { inject, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'friendlyDate',
  standalone: true,
  pure: true,
})
export class FriendlyDatePipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    let date = null;
    if (typeof value == 'string' && value.includes('T')) {
      date = new Date(value);
    } else {
      date = new Date(`${value}T00:00:00`);
    }

    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';

    return this.datePipe.transform(value, 'EEEE, MMM d, y') || '';
  }
}
