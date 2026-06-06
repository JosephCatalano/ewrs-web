# Change Log

This page tracks notable updates and new features shipped to the Employee Workspace Reservation System (EWRS).

## Release 2026.2

Watch the [Release 2026.2 demo video](https://ontariogov.sharepoint.com/:v:/r/sites/GSIC/BSOB/ewrs/Shared%20Documents/Production%20Implementations/2026.2/EWRS%20Release%202%20Video.mp4?csf=1&web=1&e=aQzCyr&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D) - A walkthrough of the new features & enhancements in this release.

### New Features

- **3-Click Booking**: Autofills search parameters such as location, floor, and time period so users can make reservations in as few as three clicks.
- **Favourite Desks**: Users can save favourite desks and see them at the top of search results, making repeat bookings faster and more efficient.

### Enhancements

- **Single Confirmation Emails**: Booking confirmation details have been consolidated into one email, including the calendar invite and building procedure information, to reduce email volume and avoid overwhelming users.
- **Calendar Invite Update on Cancellation**: Calendar events are updated automatically when a desk booking is cancelled, reducing confusion and keeping the user's calendar aligned with EWRS.
- **New Help Guide**: Users now have a dedicated Help Guide section where they can quickly access EWRS support content, including release change logs, short release videos, and step-by-step tutorials shown as GIFs.
- **Standardized Geo-Fenced Check-In Rules**: Geo-fenced check-in rules have been flattened across all locations and divisions using the same check-in deadlines: 10:00 AM for full-day/morning bookings and 1:00 PM for afternoon bookings.

## Release 2026.1

### New Features

- **ITS Geo-Location & Check-In Time Restrictions**: Check-in enforcement has been extended to ITS buildings, combining geo-location validation with updated check-in deadlines (10:00 AM for full-day/AM bookings, 1:00 PM for PM bookings). Bookings not checked in by the deadline are automatically released.
- **Dark Mode Auto-Selection**: The application now automatically matches the user's system theme preference on load.
- **Conflict Warning Before Reserve**: Users are shown an alert when a potential booking conflict is detected before they confirm a reservation.
- **System Access Error with Guided Next Steps**: Displays an access error banner when a user who is not yet added to the EWRS system attempts to log in and provides clear next steps and the EWRS feedback email.
- **Critical Authorization Error Message**: Shows troubleshooting steps when authorization system fails and provides reference code for support escalation.

### Enhancements

- **Booking Release Time Change**: Desk bookings are now released at 3:00 PM (previously 7:00 PM), making desks available to other users earlier in the day.
- **Booking Opening Window Adjustment**: The advance booking window has been updated from 30 days to 28 days.
- **Auto-Scroll After Search**: The page now automatically scrolls to search results after a user submits a booking search, reducing manual navigation.
- **Search Input Validation**: The booking search form now validates that all required fields are filled before sending a request, preventing unnecessary backend calls and improving error feedback.
- **Update Check-In Requirement Notice**: The check-in requirement notice has been rewritten to focus on important information and moved to "My Reservations" page for better context.
- **Align Search Filter Sizes**: The search filters on the "Home" page have been aligned and resized to the same widths for consistency.
