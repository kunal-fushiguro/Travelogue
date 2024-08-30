# Travelogue API Documentation

**Travelogue** is a platform where users can create and share their travel experiences. The app allows users to document their trips, add photos, and write about their adventures. Each user has a personalized travel journal that can be shared with others or kept private.

## Table of Contents

- [User Routes](#user-routes)
- [Posts Routes](#posts-routes)
- [Days Routes](#days-routes)

## User Routes

### `POST /users/register`

- **Description**: Registers a new user on the platform.
- **Request Body**: `{ username, email, password }`
- **Response**: `{ success, message, user }`

### `POST /users/login`

- **Description**: Logs in an existing user and returns a JWT token.
- **Request Body**: `{ email, password }`
- **Response**: `{ success, message, token }`

### `GET /users/logout`

- **Description**: Logs out the authenticated user.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `GET /users/getuser`

- **Description**: Retrieves details of the authenticated user.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, user }`

### `GET /users/sendotp`

- **Description**: Sends an OTP to the authenticated user's email for verification.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `PATCH /users/verify`

- **Description**: Verifies the user using the OTP.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ otp }`
- **Response**: `{ success, message }`

### `PATCH /users/reset`

- **Description**: Resets the user's password.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ oldPassword, newPassword }`
- **Response**: `{ success, message }`

### `PATCH /users/update`

- **Description**: Updates the user's profile information.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ username, email, bio }`
- **Response**: `{ success, message, updatedUser }`

### `DELETE /users/delete`

- **Description**: Deletes the authenticated user's account.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `PUT /users/follow/:id`

- **Description**: Allows the authenticated user to follow another user by their ID.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `DELETE /users/unfollow/:id`

- **Description**: Allows the authenticated user to unfollow another user by their ID.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `GET /users/profile/:id`

- **Description**: Retrieves the public profile of a user by their ID.
- **Response**: `{ success, userProfile }`

## Posts Routes

### `POST /posts/create`

- **Description**: Creates a new travel post for the authenticated user.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ title, description, photos }`
- **Response**: `{ success, message, post }`

### `PATCH /posts/update`

- **Description**: Updates an existing post by the authenticated user.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ postId, title, description, photos }`
- **Response**: `{ success, message, updatedPost }`

### `DELETE /posts/delete`

- **Description**: Deletes an existing post by the authenticated user.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ postId }`
- **Response**: `{ success, message }`

### `GET /posts`

- **Description**: Retrieves all posts with pagination support.
- **Query Parameters**: `?limit=10&skip=0`
- **Response**: `{ success, posts, totalPosts }`

### `GET /posts/:id`

- **Description**: Retrieves a specific post by its ID.
- **Response**: `{ success, post }`

## Days Routes

### `POST /posts/:postid/days/create`

- **Description**: Adds a new day entry to an existing post.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ date, content, photos }`
- **Response**: `{ success, message, dayEntry }`

### `PATCH /posts/:postid/:daysid/update`

- **Description**: Updates an existing day entry in a post.
- **Middleware**: `authMiddleware`
- **Request Body**: `{ date, content, photos }`
- **Response**: `{ success, message, updatedDay }`

### `DELETE /posts/:postid/:daysid/delete`

- **Description**: Deletes an existing day entry from a post.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `DELETE /posts/:postid/:daysid/like`

- **Description**: Likes a specific day entry in a post.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

### `DELETE /posts/:postid/:daysid/unlike`

- **Description**: Unlikes a specific day entry in a post.
- **Middleware**: `authMiddleware`
- **Response**: `{ success, message }`

---

This API documentation provides an overview of the available routes in the Travelogue platform. Each route is carefully crafted to handle user authentication, post management, and day entry creation, ensuring a smooth and secure user experience.
