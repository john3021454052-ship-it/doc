# API 参考

## 用户 API

### 获取用户信息

```http
GET /api/v1/users/{user_id}
```

**参数:**

- `user_id` (string): 用户唯一标识符

**响应:**

```json
{
    "id": "123",
    "name": "张三",
    "email": "zhangsan@example.com",
    "created_at": "2024-01-01T00:00:00Z"
}
```

### 创建用户

```http
POST /api/v1/users
```

**请求体:**

```json
{
    "name": "李四",
    "email": "lisi@example.com",
    "password": "secure_password"
}
```

## 数据 API

### 查询数据

```http
GET /api/v1/data
```

**查询参数:**

- `limit` (integer): 返回结果数量限制
- `offset` (integer): 分页偏移量
- `sort` (string): 排序字段

**示例:**

```python
import requests

response = requests.get('https://api.example.com/api/v1/data', 
                       params={'limit': 10, 'offset': 0})
data = response.json()
```
