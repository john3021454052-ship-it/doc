# API Reference

## User API

### Get User Information

```http
GET /api/v1/users/{user_id}
```

**Parameters:**

- `user_id` (string): Unique user identifier

**Response:**

```json
{
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z"
}
```

### Create User

```http
POST /api/v1/users
```

**Request Body:**

```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secure_password"
}
```

## Data API

### Query Data

```http
GET /api/v1/data
```

**Query Parameters:**

- `limit` (integer): Maximum number of results
- `offset` (integer): Pagination offset
- `sort` (string): Sort field

**Example:**

```python
import requests

response = requests.get('https://api.example.com/api/v1/data', 
                       params={'limit': 10, 'offset': 0})
data = response.json()
```

## Error Response

When an error occurs, the API returns a standard error response:

Error code: 404

Message: File not found.

Error code explanation: 404 - Nothing matches the given URI
