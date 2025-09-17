# Survey Backend API Documentation

## Overview
This API provides endpoints for managing survey data including participant information, survey submissions, and responses. Built with Express.js and Supabase.

## Base URL
- Development: `http://localhost:3001`
- Production: `https://your-api-domain.com`

## Authentication
Currently using Supabase service role key for backend operations. Future versions may implement user authentication.

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Returns 429 status code when limit exceeded

## Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": [] // Optional validation details
}
```

## Endpoints

### Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Survey API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Submit Survey
**POST** `/api/survey/submit`

Submit a complete survey with participant information and responses.

**Request Body:**
```json
{
  "participant": {
    "age": 25,
    "field_of_study": "Biology"
  },
  "responses": [
    {
      "role_title": "Conceptualization",
      "assigned_icon": "Lightbulb",
      "response_order": 0
    },
    {
      "role_title": "Data Curation",
      "assigned_icon": "Database",
      "response_order": 1
    }
  ],
  "survey_version": "1.0"
}
```

**Validation Rules:**
- `age`: Integer between 18-100, required
- `field_of_study`: 2-100 characters, required
- `responses`: Array of 1-20 response objects, required
- `role_title`: 2-100 characters, required
- `assigned_icon`: 2-100 characters, required
- `response_order`: Non-negative integer, required

**Success Response (201):**
```json
{
  "success": true,
  "message": "Survey submitted successfully",
  "data": {
    "participant_id": "123e4567-e89b-12d3-a456-426614174000",
    "submission_id": "987fcdeb-51a2-43d1-b789-123456789abc",
    "responses_count": 14
  }
}
```

**Error Responses:**
- `400`: Validation failed
- `500`: Internal server error

### Get Survey Results
**GET** `/api/survey/results/:participantId`

Retrieve survey results for a specific participant.

**Parameters:**
- `participantId`: UUID of the participant

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "age": 25,
    "field_of_study": "Biology",
    "created_at": "2024-01-15T10:30:00.000Z",
    "survey_submissions": [
      {
        "id": "987fcdeb-51a2-43d1-b789-123456789abc",
        "survey_version": "1.0",
        "completion_status": "completed",
        "submitted_at": "2024-01-15T10:35:00.000Z",
        "survey_responses": [
          {
            "id": "456e7890-e12b-34d5-a678-901234567def",
            "role_title": "Conceptualization",
            "assigned_icon": "Lightbulb",
            "response_order": 0,
            "created_at": "2024-01-15T10:35:00.000Z"
          }
        ]
      }
    ]
  }
}
```

**Error Responses:**
- `400`: Invalid participant ID format
- `404`: Participant not found
- `500`: Internal server error

### Update Survey
**PUT** `/api/survey/update/:submissionId`

Update an incomplete survey submission.

**Parameters:**
- `submissionId`: UUID of the submission

**Request Body:**
```json
{
  "responses": [
    {
      "role_title": "Conceptualization",
      "assigned_icon": "Lightbulb",
      "response_order": 0
    }
  ],
  "completion_status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Survey updated successfully",
  "data": {
    "submission_id": "987fcdeb-51a2-43d1-b789-123456789abc",
    "completion_status": "completed",
    "responses_count": 14
  }
}
```

**Error Responses:**
- `400`: Invalid submission ID or validation failed
- `404`: Submission not found
- `500`: Internal server error

### Get Statistics
**GET** `/api/survey/stats`

Get overall survey statistics (admin endpoint).

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total_participants": 150,
    "total_submissions": 145,
    "completed_submissions": 132,
    "completion_rate": "91.03"
  }
}
```

## Database Schema

### survey_participants
- `id`: UUID (Primary Key)
- `age`: Integer (18-100, Required)
- `field_of_study`: Text (Required)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### survey_submissions
- `id`: UUID (Primary Key)
- `participant_id`: UUID (Foreign Key)
- `survey_version`: Text (Default: "1.0")
- `completion_status`: Text (incomplete/completed)
- `submitted_at`: Timestamp
- `created_at`: Timestamp
- `updated_at`: Timestamp

### survey_responses
- `id`: UUID (Primary Key)
- `submission_id`: UUID (Foreign Key)
- `role_title`: Text (Required)
- `assigned_icon`: Text (Required)
- `response_order`: Integer (Required)
- `created_at`: Timestamp

## Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- SQL injection prevention
- Row Level Security (RLS) in Supabase

## Development Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run the development server:
```bash
npm run dev
```

4. The API will be available at `http://localhost:3001`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Error Codes
- `INVALID_REFERENCE`: Foreign key constraint violation
- `INTERNAL_ERROR`: General server error
- `NOT_FOUND`: Endpoint not found
- `UNHANDLED_ERROR`: Unexpected error occurred