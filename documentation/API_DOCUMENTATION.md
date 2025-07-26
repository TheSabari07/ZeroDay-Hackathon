# API Documentation

## Overview
The ZeroDay Campus App API is a RESTful service built with Node.js and Express. It provides endpoints for authentication, user management, announcements, complaints, skills marketplace, lost and found, polls, and more.

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-render-backend-url.onrender.com/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Description**: Register a new user account
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student"
      },
      "token": "jwt_token"
    },
    "message": "User registered successfully"
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Description**: Authenticate user and get JWT token
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student"
      },
      "token": "jwt_token"
    },
    "message": "Login successful"
  }
  ```

#### Get Current User
- **GET** `/auth/me`
- **Description**: Get current authenticated user information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student"
      }
    }
  }
  ```

### Announcements

#### Get All Announcements
- **GET** `/announcements`
- **Description**: Get all announcements with optional filtering
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `search` (optional): Search in title and description
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "announcement_id",
        "title": "Campus Event",
        "description": "Event description",
        "category": "Events",
        "createdBy": {
          "_id": "user_id",
          "name": "Admin User"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Get Single Announcement
- **GET** `/announcements/:id`
- **Description**: Get a specific announcement by ID
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same as above but single object

#### Create Announcement (Admin Only)
- **POST** `/announcements`
- **Description**: Create a new announcement
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "New Announcement",
    "description": "Announcement content",
    "category": "Academic"
  }
  ```

#### Update Announcement (Admin Only)
- **PUT** `/announcements/:id`
- **Description**: Update an existing announcement
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as create

#### Delete Announcement (Admin Only)
- **DELETE** `/announcements/:id`
- **Description**: Delete an announcement
- **Headers**: `Authorization: Bearer <token>`

### Complaints

#### Get All Complaints
- **GET** `/complaints`
- **Description**: Get all complaints (filtered by user role)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status` (optional): Filter by status
  - `priority` (optional): Filter by priority
  - `category` (optional): Filter by category
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "complaint_id",
        "title": "Complaint Title",
        "description": "Complaint description",
        "category": "Infrastructure",
        "priority": "High",
        "status": "Pending",
        "createdBy": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Get User Complaints
- **GET** `/complaints/my-complaints`
- **Description**: Get complaints created by current user
- **Headers**: `Authorization: Bearer <token>`

#### Create Complaint
- **POST** `/complaints`
- **Description**: Submit a new complaint
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Complaint Title",
    "description": "Complaint description",
    "category": "Infrastructure",
    "priority": "High"
  }
  ```

#### Update Complaint Status (Admin Only)
- **PUT** `/complaints/:id/status`
- **Description**: Update complaint status
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "status": "In Progress"
  }
  ```

### Skills Marketplace

#### Get All Skills
- **GET** `/skills`
- **Description**: Get all available skills
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `search` (optional): Search in title and description
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "skill_id",
        "title": "Web Development",
        "description": "Full-stack web development",
        "category": "Programming",
        "hourlyRate": 25,
        "createdBy": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Get User Skills
- **GET** `/skills/my-skills`
- **Description**: Get skills created by current user
- **Headers**: `Authorization: Bearer <token>`

#### Create Skill
- **POST** `/skills`
- **Description**: List a new skill
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Skill Title",
    "description": "Skill description",
    "category": "Programming",
    "hourlyRate": 25
  }
  ```

#### Book Skill
- **POST** `/bookings`
- **Description**: Book a skill session
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "skillId": "skill_id",
    "date": "2024-01-15",
    "time": "14:00",
    "duration": 2,
    "message": "Booking message"
  }
  ```

#### Get User Bookings
- **GET** `/bookings/my-bookings`
- **Description**: Get bookings by current user
- **Headers**: `Authorization: Bearer <token>`

### Lost and Found

#### Get All Items
- **GET** `/lostfound`
- **Description**: Get all lost and found items
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `type` (optional): Filter by type (lost/found)
  - `category` (optional): Filter by category
  - `search` (optional): Search in title and description
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "item_id",
        "title": "Lost Phone",
        "description": "iPhone 12, black case",
        "type": "lost",
        "category": "Electronics",
        "location": "Library",
        "contactInfo": "john@example.com",
        "createdBy": {
          "_id": "user_id",
          "name": "John Doe"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Create Item
- **POST** `/lostfound`
- **Description**: Report a lost or found item
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Item Title",
    "description": "Item description",
    "type": "lost",
    "category": "Electronics",
    "location": "Library",
    "contactInfo": "john@example.com"
  }
  ```

### Polls and Voting

#### Get All Polls
- **GET** `/polls`
- **Description**: Get all polls with results and voting status
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "poll_id",
        "question": "Do you prefer online classes?",
        "options": ["Yes", "No", "Maybe"],
        "results": {
          "Yes": 15,
          "No": 8,
          "Maybe": 3
        },
        "hasVoted": false,
        "isActive": true,
        "createdBy": {
          "_id": "user_id",
          "name": "Admin User"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Create Poll (Admin Only)
- **POST** `/polls`
- **Description**: Create a new poll
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "question": "Poll question?",
    "options": ["Option 1", "Option 2", "Option 3"],
    "isActive": true
  }
  ```

#### Submit Vote
- **POST** `/votes/:pollId`
- **Description**: Submit a vote on a poll
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "selectedOption": "Option 1"
  }
  ```

#### Check User Vote
- **GET** `/votes/check/:pollId`
- **Description**: Check if user has voted on a specific poll
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "hasVoted": true,
      "selectedOption": "Option 1"
    }
  }
  ```

### Tech Feed

#### Get All Feed Items
- **GET** `/feed`
- **Description**: Get all tech feed items
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `search` (optional): Search in title and description
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "feed_id",
        "title": "Tech News Title",
        "description": "News description",
        "category": "News",
        "link": "https://example.com",
        "createdBy": {
          "_id": "user_id",
          "name": "Admin User"
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

#### Create Feed Item (Admin Only)
- **POST** `/feed`
- **Description**: Create a new feed item
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Feed Title",
    "description": "Feed description",
    "category": "News",
    "link": "https://example.com"
  }
  ```

### Health Check

#### API Health
- **GET** `/health`
- **Description**: Check API health status
- **Response**:
  ```json
  {
    "status": "OK",
    "message": "Server is running"
  }
  ```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting
- **Requests per minute**: 100
- **Burst limit**: 200 requests

## File Upload
For file uploads (complaints, lost and found items):
- **Max file size**: 5MB
- **Supported formats**: JPG, PNG, PDF, DOC, DOCX
- **Upload endpoint**: `/uploads`

## Pagination
For endpoints that return lists, pagination is supported:
- **Query parameters**: `page` (default: 1), `limit` (default: 10)
- **Response includes**: `totalPages`, `currentPage`, `totalItems`

## WebSocket Events (Future)
Real-time features planned:
- **New announcements**: `announcement:created`
- **Complaint updates**: `complaint:updated`
- **New polls**: `poll:created`
- **Vote updates**: `vote:submitted` 