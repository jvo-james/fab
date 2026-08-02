# Faustina's Sparkly Services website

A responsive static website backed by Firebase Authentication and Firestore. The production flow collects **booking requests only**: no card details or payment are taken on the website.

## Customer flow
1. Customer chooses a service, property details, region, available date and time.
2. A private `bookingRequests` record is created.
3. The public slot record changes from `available` to `requested` without storing customer information.
4. The team confirms capacity, travel feasibility, final price and payment instructions within one working day.

## Security model
- `slotLocks`: public scheduling fields only; no email, phone, address or reference.
- `bookingRequests`, `enquiries`, `applications`, `feedbackSubmissions`: private to admins after creation.
- `publicFeedback`: display-safe review fields only.
- Customer feedback cannot be edited or deleted through an unauthenticated browser identity.
- Reviews require admin moderation before publication.
- Booking email is sent from a Firestore creation trigger, not a public email endpoint.

## Setup
1. Create a Firebase web app and copy its public web configuration into `config.js`.
2. Enable Email/Password Authentication and create the admin user.
3. Add `admins/{uid}` with `{ "active": true }` in Firestore.
4. Deploy rules and indexes: `firebase deploy --only firestore`.
5. Optional email confirmations: in `functions/`, run `npm install`, set `SMTP_USER` and `SMTP_PASS` secrets, then deploy functions.
6. Deploy hosting: `firebase deploy --only hosting`.

## Before launch
- Replace all placeholder imagery.
- Confirm every price and business claim, especially insurance, vetting, response time and oven-cleaning wording.
- Add Firebase App Check for the production domain.
- Test Firestore rules with the Emulator Suite.
- Test keyboard navigation, reduced motion, phone layouts and screen-reader announcements.
- Replace the Firebase project configuration if this repository will be public.

## Collections
`admins`, `settings`, `slotLocks`, `bookingRequests`, `enquiries`, `applications`, `feedbackSubmissions`, `publicFeedback`.
