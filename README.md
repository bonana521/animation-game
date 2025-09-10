# 🎨 动画涂鸦工作室 (Animation Doodle Studio)

一个现代化的网页动画创作工具，让你轻松创建有趣的动画作品！

![Animation Doodle Studio](https://img.shields.io/badge/Animation-Doodle%20Studio-blue?style=for-the-badge&logo=palette&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)

## ✨ 功能特色

### 🎨 绘画工具
- **智能画笔** - 流畅的绘画体验
- **橡皮擦** - 精确擦除功能
- **撤销操作** - 支持Ctrl+Z快捷键
- **清空画布** - 一键清除当前帧

### 🎬 动画功能
- **多帧支持** - 支持最多24帧动画创作
- **实时预览** - 可调节帧率的动画播放
- **洋葱皮** - 查看上一帧轮廓，对齐更精确
- **时间轴** - 直观的帧管理界面

### 🎯 用户体验
- **现代化UI** - 采用游戏中心风格的渐变设计
- **响应式布局** - 完美适配桌面和移动设备
- **触摸支持** - 支持平板和手机触摸绘画
- **快捷键** - 提升操作效率

### 📱 兼容性
- **纯前端** - 无需服务器，打开即用
- **跨平台** - 支持所有现代浏览器
- **轻量级** - 无外部依赖，加载快速

## 🚀 快速开始

### 在线体验
直接在浏览器中打开 `index-pure.html` 即可开始创作！

### 本地使用
```bash
# 克隆项目
git clone https://github.com/bonana521/animation-game.git

# 进入项目目录
cd animation-game

# 启动本地服务器（可选）
python -m http.server 8000

# 在浏览器中访问
# http://localhost:8000/index-pure.html
```

## 🎮 使用指南

### 基本操作
1. **选择工具** - 点击左侧工具箱选择画笔或橡皮擦
2. **开始绘画** - 在画布上拖拽鼠标进行绘画
3. **添加帧** - 点击右侧"添加帧"按钮创建新帧
4. **播放动画** - 点击播放按钮预览动画效果

### 快捷键
| 按键 | 功能 |
|------|------|
| `P` | 切换到画笔工具 |
| `E` | 切换到橡皮擦工具 |
| `Ctrl+Z` | 撤销上一步操作 |
| `空格` | 播放/暂停动画 |
| `←` | 切换到上一帧 |
| `→` | 切换到下一帧 |

### 高级功能
- **双击删除帧** - 在时间轴上双击帧号可删除该帧
- **洋葱皮模式** - 开启后可看到上一帧的半透明轮廓
- **导出动画** - 可导出动画数据为JSON格式

## 📁 项目结构

```
animation-game/
├── index-pure.html          # 主应用文件（推荐使用）
├── index-modern.html        # 现代化版本
├── index.html              # 原始版本
├── simple-demo.html        # 简化演示版本
├── sketch.js              # 原始绘图逻辑
├── modern-sketch.js       # 现代化版本逻辑
├── AnimSys.js            # 动画系统
├── DrawHandler.js        # 绘图处理器
├── OrientedCursor.js     # 定向光标
├── brushpoint.js         # 画笔点
├── style.css             # 样式文件
├── server.js             # Node.js服务器
├── start_server.bat      # 服务器启动脚本
└── README.md             # 项目文档
```

## 🎨 设计理念

本项目采用现代化的游戏中心风格设计，具有以下特点：

### 视觉设计
- **渐变背景** - 紫蓝色系渐变，营造创意氛围
- **毛玻璃效果** - 半透明面板，增强视觉层次
- **动画效果** - 流畅的过渡和微交互
- **响应式布局** - 适配各种屏幕尺寸

### 用户体验
- **直观操作** - 简洁明了的界面设计
- **即时反馈** - 实时的操作响应和通知
- **功能完整** - 涵盖动画创作的核心需求
- **性能优化** - 轻量级实现，流畅运行

## 🛠️ 技术栈

### 前端技术
- **HTML5 Canvas** - 绘图和动画渲染
- **Vanilla JavaScript** - 纯JavaScript实现，无框架依赖
- **CSS3** - 现代化样式和动画效果
- **Font Awesome** - 图标库

### 开发工具
- **Git** - 版本控制
- **VS Code** - 代码编辑器
- **Chrome DevTools** - 调试和测试

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 如何贡献
1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 开发规范
- 使用语义化的提交信息
- 保持代码风格一致
- 添加必要的注释
- 确保功能完整可用

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🎯 未来计划

- [ ] 添加更多画笔样式
- [ ] 支持音频同步
- [ ] 增加图层功能
- [ ] 云端保存功能
- [ ] 社区分享平台
- [ ] 移动端APP版本

## 🙏 致谢

- 原始项目灵感来自 [simple-animation-doodle](https://huggingface.co/spaces/fffiloni/simple-animation-doodle)
- UI设计参考现代游戏中心风格
- 感谢所有贡献者和用户的支持

## 📞 联系方式

- **GitHub**: [bonana521](https://github.com/bonana521)
- **Email**: bonana521@example.com
- **项目地址**: https://github.com/bonana521/animation-game

---

<div align="center">
  
**⭐ 如果这个项目对你有帮助，请给个Star！**
  
![Star History](https://img.shields.io/github/stars/bonana521/animation-game?style=social)
  
Made with ❤️ by bonana521
  
</div>
