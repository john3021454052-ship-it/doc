# 快速开始

## 安装

使用 pip 安装我们的 SDK：

```bash
pip install example-api-sdk
```

## 基本用法

### 初始化客户端

```python
from example_api import Client

client = Client(api_key='your_api_key')
```

### 发起请求

```python
# 获取用户信息
user = client.users.get(user_id=123)
print(user.name)

# 创建新记录
new_item = client.items.create({
    'name': '测试项目',
    'description': '这是一个测试'
})
```

## 配置选项

您可以自定义客户端配置：

```python
client = Client(
    api_key='your_api_key',
    timeout=30,
    retry=3,
    base_url='https://api.example.com'
)
```
