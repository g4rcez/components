# Calendar Component

A full-featured calendar component with date selection, range selection, keyboard navigation, and smooth animations. Supports both single date and date range selection modes with internationalization and custom styling.

## Import

```tsx
import { Calendar } from "@g4rcez/components/calendar";
```

## Basic Usage

### Single Date Selection

```tsx
import { useState } from "react";

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Calendar
      date={selectedDate}
      onChange={setSelectedDate}
      markToday
    />
  );
}
```

### Date Range Selection

```tsx
import { useState } from "react";
import { Calendar, type Range } from "@g4rcez/components/calendar";

function DateRangePicker() {
  const [range, setRange] = useState<Range>({ from: undefined, to: undefined });

  return (
    <Calendar
      range={range}
      rangeMode
      markRange
      onChange={setRange}
      labelRange={{ from: "Start Date", to: "End Date" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date` | - | Selected date (for single date mode) |
| `range` | `Range` | - | Selected date range `{from?: Date, to?: Date}` |
| `rangeMode` | `boolean` | `false` | Enable range selection mode |
| `markRange` | `boolean` | `false` | Visually highlight the selected range |
| `markToday` | `boolean` | `false` | Highlight today's date |
| `onChange` | `OnChangeRange \| OnChangeDate` | - | Date/range change handler |
| `changeOnlyOnClick` | `boolean` | `false` | Only trigger onChange on click (not keyboard) |
| `onChangeYear` | `(date: Date) => void` | - | Year change callback |
| `onChangeMonth` | `(date: Date) => void` | - | Month change callback |
| `disabledDate` | `(date: Date) => boolean` | - | Function to disable specific dates |
| `RenderOnDay` | `React.FC<{date: Date}>` | - | Custom day cell renderer |
| `locale` | `Locales` | - | Date formatting locale |
| `labelRange` | `{to: string, from: string}` | - | Range selection labels |
| `styles` | `CalendarStyles` | - | Custom styling functions/classes |

## Features

### Keyboard Navigation

The calendar supports comprehensive keyboard navigation:

- **Arrow Keys**: Navigate between dates
- **Shift + Arrows**: Navigate by month/year
- **Enter/Space**: Select date
- **Escape**: Close calendar (in dropdown mode)
- **Home**: Go to first day of month
- **End**: Go to last day of month

```tsx
<Calendar
  date={selectedDate}
  onChange={setSelectedDate}
  // Keyboard navigation is enabled by default
/>
```

### Custom Date Rendering

```tsx
function CustomDateRenderer({ date }: { date: Date }) {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  return (
    <div className={`
      p-2 text-center
      ${isWeekend ? 'text-red-500 font-bold' : 'text-gray-700'}
    `}>
      {date.getDate()}
      {isWeekend && <div className="text-xs">Weekend</div>}
    </div>
  );
}

<Calendar
  date={selectedDate}
  onChange={setSelectedDate}
  RenderOnDay={CustomDateRenderer}
/>
```

### Disabled Dates

```tsx
function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

<Calendar
  date={selectedDate}
  onChange={setSelectedDate}
  disabledDate={(date) => isWeekend(date) || isPastDate(date)}
/>
```

### Mobile Support with Swipe Gestures

```tsx
<Calendar
  date={selectedDate}
  onChange={setSelectedDate}
  // Swipe gestures are automatically enabled on touch devices
  className="touch-pan-x" // Enable horizontal panning
/>
```

## Advanced Examples

### Event Calendar with Custom Styling

```tsx
interface EventCalendarProps {
  events: { date: Date; title: string; type: 'meeting' | 'deadline' | 'holiday' }[];
}

function EventCalendar({ events }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const CustomDayRenderer = ({ date }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);
    
    return (
      <div className="relative p-1">
        <span className="text-sm">{date.getDate()}</span>
        {dayEvents.length > 0 && (
          <div className="flex gap-1 mt-1">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  event.type === 'meeting' ? 'bg-blue-500' :
                  event.type === 'deadline' ? 'bg-red-500' :
                  'bg-green-500'
                }`}
              />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-xs text-gray-500">+{dayEvents.length - 3}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Calendar
        date={selectedDate}
        onChange={setSelectedDate}
        RenderOnDay={CustomDayRenderer}
        markToday
      />
      
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">
          Events for {selectedDate.toLocaleDateString()}
        </h3>
        {getEventsForDate(selectedDate).map((event, i) => (
          <div key={i} className="py-1">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              event.type === 'meeting' ? 'bg-blue-500' :
              event.type === 'deadline' ? 'bg-red-500' :
              'bg-green-500'
            }`} />
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Booking Calendar with Range Restrictions

```tsx
function BookingCalendar() {
  const [bookingRange, setBookingRange] = useState<Range>({});
  
  // Only allow bookings 2+ days in advance, max 14 days
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 90); // 3 months out
    
    return date < twoDaysFromNow || date > maxDate;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Select Booking Dates</h2>
      
      <Calendar
        range={bookingRange}
        rangeMode
        markRange
        markToday
        onChange={setBookingRange}
        disabledDate={isDateDisabled}
        labelRange={{ 
          from: "Check-in Date", 
          to: "Check-out Date" 
        }}
        className="border rounded-lg shadow-sm"
      />
      
      {bookingRange.from && bookingRange.to && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <div className="text-sm text-green-800">
            <strong>Selected Dates:</strong>
            <br />
            Check-in: {bookingRange.from.toLocaleDateString()}
            <br />
            Check-out: {bookingRange.to.toLocaleDateString()}
            <br />
            Duration: {Math.ceil((bookingRange.to.getTime() - bookingRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights
          </div>
        </div>
      )}
    </div>
  );
}
```

### Internationalized Calendar

```tsx
import { Calendar, type Locales } from "@g4rcez/components/calendar";

function InternationalCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [locale, setLocale] = useState<Locales>("en");
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setLocale("en")}
          className={`px-3 py-1 rounded ${locale === "en" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          English
        </button>
        <button 
          onClick={() => setLocale("pt")}
          className={`px-3 py-1 rounded ${locale === "pt" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Português
        </button>
        <button 
          onClick={() => setLocale("es")}
          className={`px-3 py-1 rounded ${locale === "es" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Español
        </button>
      </div>
      
      <Calendar
        date={selectedDate}
        onChange={setSelectedDate}
        locale={locale}
        markToday
      />
    </div>
  );
}
```

## Styling

### Custom Styles Function

```tsx
const customStyles = {
  day: (date: Date, isSelected: boolean) => {
    return `
      ${isSelected ? 'bg-purple-500 text-white' : 'hover:bg-purple-100'}
      ${date.getDay() === 0 ? 'text-red-500' : ''}
      transition-colors duration-200
    `;
  },
  month: () => 'text-purple-700 font-semibold',
  today: () => 'ring-2 ring-purple-300'
};

<Calendar
  date={selectedDate}
  onChange={setSelectedDate}
  styles={customStyles}
/>
```

## Accessibility

The Calendar component includes comprehensive accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Date Announcements**: Screen reader announces selected dates
- **Role Attributes**: Proper ARIA roles for calendar structure

```tsx
<Calendar
  date={selectedDate}
  onChange={setSelectedDate}
  // Accessibility features are built-in and automatic
  aria-label="Date picker calendar"
/>
```

## Performance Notes

- Uses `date-fns` for efficient date calculations
- Smooth animations with Framer Motion
- Optimized re-renders with React.memo
- Efficient event handling with useCallback

## Related Components

- **DatePicker**: Form input with calendar popup
- **Input**: Text input with date masking
- **Dropdown**: For calendar dropdown mode