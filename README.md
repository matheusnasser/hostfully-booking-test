# Hostfully Booking System

A property booking management application built with React and TypeScript. This application allows property managers to create, view, edit, and delete bookings while preventing scheduling conflicts.

## Features

- Full CRUD operations for property bookings
- Booking overlap detection to prevent double-bookings
- Responsive design for desktop and mobile devices
- Form validation with immediate feedback
- Loading states and error handling
- Comprehensive test coverage

## Tech Stack

- **React 19** with TypeScript for type safety
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **date-fns** for date manipulation
- **Vitest** and React Testing Library for testing
- **Vite** for build tooling
- **Framer Motion** for animations

## Getting Started

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Run tests:
```bash
npm run test
```

Build for production:
```bash
npm run build
```

## Project Structure

The project follows a **domain-driven, feature-first architecture** designed for scalability and maintainability.

*   **`src/components/`**: UI components are grouped by feature (e.g., `Booking`, `PropertyCard`) rather than purely technical types (like atoms/molecules). This keeps related styles and logic co-located.
*   **`src/store/`**: Centralized state management using Redux Toolkit.
    *   **Async Thunks**: Handle side effects (API calls, delays) to keep React components pure and focused on UI.
    *   **Slices**: Modularized reducers for `bookings` and `properties`.
*   **`src/utils/`**: Contains pure functions for core business logic, such as `bookingValidation.ts`. This ensures that critical domain rules (like overlap detection) are unit-testable in isolation from the UI.
*   **`src/hooks/`**: Custom hooks for shared behavior, such as accessing the Typed Redux Store.

## Key Implementation Details

### Booking Overlap Prevention

The application prevents double-bookings by checking date ranges before creating or updating bookings. The overlap detection handles several edge cases:

- Bookings that start or end within an existing booking
- Bookings that completely contain an existing booking
- Bookings that are completely within an existing booking
- Allows consecutive bookings where checkout equals the next check-in
- Excludes cancelled bookings from validation
- When editing, excludes the current booking from conflict checks

### Data Persistence

Bookings are persisted to localStorage, providing data persistence across page refreshes. The application:
- Initializes from mock data on first load
- Stores all booking operations (create, update, delete) in localStorage
- Simulates API latency for realistic loading states

### State Management

Redux Toolkit is used for centralized state management with two main slices:

- **Bookings slice**: Manages booking CRUD operations and validation
- **Properties slice**: Handles property data fetching

Async operations use `createAsyncThunk` to handle side effects cleanly.

### Form Validation

Forms use React Hook Form with Zod schemas for validation:
- Required fields are enforced
- Date ranges are validated
- Character limits are applied
- Submit buttons are disabled until forms are valid
- Real-time validation feedback

### Responsive Design

The layout adapts to different screen sizes:
- Desktop: Side-by-side property and booking lists
- Mobile: Stacked vertical layout with full-width cards
- Modals are constrained to viewport with scrolling
- Touch-friendly interactive elements

## Testing

The test suite covers critical business logic:
- Booking overlap detection algorithm (10 test cases)
- Redux booking operations (CRUD with validation)
- Form validation and user interactions

Run tests with:
```bash
npm run test
```

## Notes

The application uses mock data loaded from JSON files in the `public/mocks` directory. A small artificial delay is added to async operations to simulate network latency and demonstrate loading states.

