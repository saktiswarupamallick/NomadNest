# NomadNest — Full-Stack Travel & Experience Booking Platform

NomadNest is a full-stack travel marketplace that supports **accommodation bookings and experience-based tourism**.  
The platform enables users to browse listings, book stays or experiences, make secure payments, leave multi-criteria ratings, and interact with an AI-assisted chatbot.

---

## Core Features

### Authentication & User Management
- User registration and login with JWT authentication (stored in cookies)
- Secure profile access and logout
- Protected routes for authenticated users

**API**
- POST `/api/register`
- POST `/api/login`
- GET `/api/profile`
- POST `/api/logout`

**Model**
- User (name, email, password)

---

### Places (Accommodation) Management
- Create, update, and manage accommodation listings
- View all places or user-specific listings
- Support for pricing, availability, perks, and guest limits

**API**
- POST `/api/places`
- PUT `/api/places`
- GET `/api/places`
- GET `/api/places/:id`
- GET `/api/user-places`

**Model**
- Place (owner, title, address, photos, perks, check-in/check-out, maxGuests, price)

---

### Bookings
- Users can book accommodations with date validation
- View booking history and booking details
- Price calculation handled on backend

**API**
- POST `/api/bookings`
- GET `/api/bookings`

**Model**
- Booking (place ref, user ref, dates, contact, price)

---

### Experiences & Experience Bookings
- Create and manage travel experiences
- Slot-based availability and duration support
- Experience-specific booking flow with payment status

**API**
- GET `/api/experiences`
- GET `/api/experiences/:id`
- POST `/api/experiences`
- PUT `/api/experiences/:id`
- POST `/api/experiences/:id/book`
- GET `/api/experience-bookings`

**Models**
- Experience
- ExperienceBooking (status, paymentStatus)

---

### Ratings & Reviews
- Multi-category rating system with overall score
- Users can rate places only once
- Aggregated ratings displayed on listing pages

**API**
- POST `/api/ratings`
- GET `/api/places/:id/ratings`
- GET `/api/places/:id/has-rated`

**Model**
- Rating (category scores + overall)

---

### AI-Powered Chatbot
- Keyword-based chatbot with predefined help categories
- Stores recent user messages
- Provides contextual assistance during booking

**API**
- POST `/api/chat`
- GET `/api/chat`

**Model**
- Chat

---

### Payments (Stripe Integration)
- Secure payment flow using Stripe Payment Intents
- Client confirms payment after backend intent creation
- Payment status tracked for bookings

**API**
- POST `/api/create-payment-intent`
- POST `/api/update-payment-intent`

---

### File Uploads & Media Management
- Upload photos via direct link or file upload
- Multer-based file handling
- Static file serving for uploaded assets

**API**
- POST `/api/upload-by-link`
- POST `/api/upload`

---

## Backend Architecture

### Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Stripe Payments
- Environment-driven configuration

### Infrastructure
- MongoDB via Mongoose
- AWS S3 client imported (reserved for future media storage)
- `.env`-based secrets and configuration

---

## Frontend Architecture (client/src)

### Routing & State
- React Router for client-side routing
- UserContext for profile fetching and auth state
- Axios configured with base URL and credentials

### Authentication UI
- RegisterPage
- LoginPage
- ProfilePage

---

### Listings & Pages
- IndexPage (places grid)
- PlacePage (gallery, ratings, booking widget)
- ExperiencesPage
- ExperiencePage

---

### Create & Edit Flows
- PlacesFormPage (create/edit places)
- ExperiencesFormPage (create/edit experiences)
- Photo uploads, tags, availability slots
- Google Maps Geocoding integration

---

### User Dashboards
- PlacesPage (my listings)
- BookingsPage & BookingPage
- ExperienceBookingsPage
- UserExperiencesPage

---

### Booking Widgets
- BookingWidget (accommodations)
- ExperienceBookingWidget (experiences)
- Date and slot validation
- Client-side availability checks

---

### Payments UI
- CheckoutForm using Stripe PaymentElement
- Payment intent created on backend
- Secure client confirmation flow

---

### Media & UI Components
- PhotosUploader (link + file upload)
- Image helper for resolving upload URLs
- PlaceGallery & PlaceImg
- Perks selection component

---

### Ratings & Reviews UI
- RatingModal for submitting ratings
- Aggregated rating display on listings

---

### Chat UI
- Chatbot component with predefined help categories
- Displays recent chat history

---

## UX & Validation
- Date validation (future dates, check-in < check-out)
- Experience slot availability checks
- Required-field validation before payment
- Image preview and main-photo selection
- Filters for experiences (type, location, price, date)

---

## Integrations & Configuration
- Stripe (client + server payment flow)
- Google Maps Geocoding API
- Environment-driven API base (`VITE_API_BASE_URL`)
- Secrets managed via `.env`

---

## Key Engineering Highlights
- Full-stack marketplace architecture
- Secure JWT authentication with cookies
- Stripe-based payment processing
- AI-assisted user interaction
- Scalable REST API design
- Clean separation of frontend and backend concerns
