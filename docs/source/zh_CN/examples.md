# 示例

## 完整示例

### 用户认证与数据获取

```python
from example_api import Client
import json

# 初始化客户端
client = Client(api_key='your_api_key')

# 认证用户
auth_result = client.auth.login(
    username='user@example.com',
    password='secure_password'
)

# 获取访问令牌
access_token = auth_result['access_token']

# 使用令牌获取数据
client.set_token(access_token)
data = client.data.list(limit=50)

print(f"获取到 {len(data)} 条记录")
```

### 批量操作

```python
# 批量创建记录
items = [
    {'name': '项目1', 'value': 100},
    {'name': '项目2', 'value': 200},
    {'name': '项目3', 'value': 300}
]

results = client.items.bulk_create(items)
print(f"成功创建 {len(results)} 条记录")
```

### 错误处理

```python
from example_api import Client, APIError

client = Client(api_key='your_api_key')

try:
    user = client.users.get(user_id=999)
except APIError as e:
    print(f"错误: {e.message}")
    print(f"状态码: {e.status_code}")
```
