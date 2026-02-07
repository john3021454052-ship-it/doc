#!/bin/bash

echo "================================================"
echo "代码块边框移除验证 / Code Block Border Removal Verification"
echo "================================================"
echo ""

echo "1. 检查源CSS文件中的.code-block-wrapper样式:"
echo "1. Checking .code-block-wrapper styles in source CSS:"
echo ""
grep -A 8 "\.code-block-wrapper {" /home/engine/project/docs/source/_static/custom.css
echo ""

echo "================================================"
echo ""

echo "2. 检查构建CSS文件中的.code-block-wrapper样式:"
echo "2. Checking .code-block-wrapper styles in built CSS:"
echo ""
grep -A 8 "\.code-block-wrapper {" /home/engine/project/docs/build/html-zh/_static/custom.css
echo ""

echo "================================================"
echo ""

echo "3. 检查是否移除了边框和阴影:"
echo "3. Checking if border and shadow were removed:"
echo ""
if grep -q "border: none" /home/engine/project/docs/build/html-zh/_static/custom.css; then
    echo "✅ 边框已移除 / Border removed: YES"
else
    echo "❌ 边框未移除 / Border removed: NO"
fi

if ! grep -q "box-shadow:" /home/engine/project/docs/build/html-zh/_static/custom.css | grep -A 5 "\.code-block-wrapper"; then
    echo "✅ 阴影已移除 / Shadow removed: YES"
else
    echo "⚠️  阴影可能仍存在 / Shadow might still exist"
fi

if grep -q "\.mac-dots" /home/engine/project/docs/build/html-zh/_static/custom.css; then
    echo "✅ Mac圆点样式保留 / Mac dots preserved: YES"
else
    echo "❌ Mac圆点样式丢失 / Mac dots lost: NO"
fi

echo ""
echo "================================================"
echo "验证完成！服务器运行在:"
echo "Verification complete! Server running at:"
echo "  - http://localhost:8080/test_border_removed.html (测试页面 / Test page)"
echo "  - http://localhost:8080/docs/build/html-zh/index.html (中文文档 / Chinese docs)"
echo "================================================"
