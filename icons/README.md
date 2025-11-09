# Mr.π Capture Extension - 图标说明

## 🎨 图标文件

本项目需要以下三个尺寸的图标：

- `icon16.png` - 16x16 像素（用于浏览器工具栏）
- `icon48.png` - 48x48 像素（用于扩展管理页面）
- `icon128.png` - 128x128 像素（用于 Chrome Web Store）

## 📝 临时解决方案

目前 `icons/` 文件夹中包含了一个 `icon.svg` 源文件，设计为紫色渐变背景 + 白色 π 符号。

**开发调试时的两种方式：**

### 方式一：使用在线工具转换（推荐）

1. 访问 https://cloudconvert.com/svg-to-png
2. 上传 `icons/icon.svg`
3. 分别导出为 128x128、48x48、16x16 三个尺寸
4. 重命名为 `icon128.png`、`icon48.png`、`icon16.png`
5. 替换到 `icons/` 文件夹

### 方式二：使用本地工具

如果你的 Mac 已安装 ImageMagick 或 librsvg：

```bash
# 使用 ImageMagick
convert -background none icon.svg -resize 128x128 icon128.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 16x16 icon16.png

# 或使用 rsvg-convert
rsvg-convert -w 128 -h 128 icon.svg > icon128.png
rsvg-convert -w 48 -h 48 icon.svg > icon48.png
rsvg-convert -w 16 -h 16 icon.svg > icon16.png
```

### 方式三：暂时使用临时图标

在 Chrome 扩展开发模式下，即使图标文件缺失，扩展依然可以加载和使用。Chrome 会显示默认的拼图图标。待正式发布前再补充完整图标即可。

## 🎯 推荐设计

最终版本建议由设计师提供：
- 品牌色渐变背景
- 简洁的 π 符号或其他识别性图形
- 确保在小尺寸（16x16）下依然清晰可辨
