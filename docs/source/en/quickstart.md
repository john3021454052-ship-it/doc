# Quick Start

## Installation

Install our SDK using pip:

```bash
pip install example-api-sdk
```

## Basic Usage

### Initialize Client

```python
from example_api import Client

client = Client(api_key='your_api_key')
```

### Make Requests

```python
# Get user information
user = client.users.get(user_id=123)
print(user.name)

# Create new record
new_item = client.items.create({
    'name': 'Test Item',
    'description': 'This is a test'
})
```

## Configuration Options

You can customize client configuration:

```python
client = Client(
    api_key='your_api_key',
    timeout=30,
    retry=3,
    base_url='https://api.example.com'
)
```
