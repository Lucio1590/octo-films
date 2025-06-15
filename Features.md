# Octo Films – Features & Reference

Octo Films is a web app that allows users to discover, review, and manage films, with differentiated features for regular users and admins.

### 📄 Pages

#### **Unauthenticated** 

- **Root/Main Landing Page:** Introduction, features overview, and call to action
- **Login/Register:** Access to user accounts, with options for login and registration
 - **About:** Information about the app, its purpose, and how to use it

#### **Authenticated**
- **Homepage:** Welcome, introduction, featured films
- **Movie Catalog:** List with genre filter, rating filter, pagination
- **Movie Details:** Dynamic page (`/film/:id`) with details, trailer, reviews
- **Login/Register:** Access/registration form (can be fake)
- **User Dashboard:** List of own reviews, edits, favorites
- **Admin Dashboard:** Catalog management: add, edit, delete films and reviews


## 👤 Users & Roles
- **Regular User:** Can view films, add/edit/delete their own reviews
- **Admin:** Can add/edit/remove films, moderate reviews

## 🔄 Routing
- Uses React Router for navigation
- Dynamic routing for `/film/:id`, `/admin/edit/:id`, etc.

## 🌐 API
- Uses TMDB API for real movies (or JSON Server for mock data and reviews)
- Handles asynchronous API calls

## ✍️ Forms
- Login / Registration
- Add review
- Edit review
- Admin: Add/Edit film
- With field validation, error messages, required fields, etc.


