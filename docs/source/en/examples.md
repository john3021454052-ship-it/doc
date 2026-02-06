# Examples

## Complete Examples

### User Authentication and Data Retrieval

```python
from example_api import Client
import json

# Initialize client
client = Client(api_key='your_api_key')

# Authenticate user
auth_result = client.auth.login(
    username='user@example.com',
    password='secure_password'
)

# Get access token
access_token = auth_result['access_token']

# Use token to fetch data
client.set_token(access_token)
data = client.data.list(limit=50)

print(f"Retrieved {len(data)} records")
```

### Batch Operations

```python
# Bulk create records
items = [
    {'name': 'Item 1', 'value': 100},
    {'name': 'Item 2', 'value': 200},
    {'name': 'Item 3', 'value': 300}
]

results = client.items.bulk_create(items)
print(f"Successfully created {len(results)} records")
```

### Error Handling

```python
from example_api import Client, APIError

client = Client(api_key='your_api_key')

try:
    user = client.users.get(user_id=999)
except APIError as e:
    print(f"Error: {e.message}")
    print(f"Status code: {e.status_code}")
```
