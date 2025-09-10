// 现代动画涂鸦工作室
// 基于原始功能，采用现代化UI设计

let canvas;
let ctx;
let animationSystem;
let drawHandler;
let currentTool = 'pencil';
let isDrawing = false;
let currentPath = [];
let paths = [];

// 动画系统类
class AnimationSystem {
    constructor() {
        this.frames = [];
        this.currentFrame = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.fps = 12;
        this.onionSkinEnabled = false;
        this.maxFrames = 24;
        
        // 初始化一些帧
        this.addFrame();
        this.updateUI();
    }
    
    addFrame() {
        if (this.frames.length >= this.maxFrames) {
            this.showNotification('已达到最大帧数限制', 'warning');
            return;
        }
        
        const frameData = {
            id: Date.now(),
            paths: [],
            thumbnail: null
        };
        
        this.frames.push(frameData);
        this.currentFrame = this.frames.length - 1;
        this.updateTimeline();
        this.updateUI();
        this.showNotification('添加新帧', 'success');
    }
    
    deleteFrame(index) {
        if (this.frames.length <= 1) {
            this.showNotification('至少需要保留一帧', 'warning');
            return;
        }
        
        this.frames.splice(index, 1);
        if (this.currentFrame >= this.frames.length) {
            this.currentFrame = this.frames.length - 1;
        }
        this.updateTimeline();
        this.updateUI();
        this.redrawCanvas();
    }
    
    setFrame(index) {
        if (index >= 0 && index < this.frames.length) {
            // 保存当前帧的数据
            this.frames[this.currentFrame].paths = [...paths];
            
            // 切换到新帧
            this.currentFrame = index;
            paths = [...this.frames[index].paths];
            
            this.updateTimeline();
            this.updateUI();
            this.redrawCanvas();
        }
    }
    
    play() {
        if (this.frames.length <= 1) return;
        
        this.isPlaying = true;
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        playBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        
        this.playInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.setFrame(this.currentFrame);
        }, 1000 / this.fps);
    }
    
    stop() {
        this.isPlaying = false;
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        playBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }
    
    updateTimeline() {
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';
        
        this.frames.forEach((frame, index) => {
            const frameEl = document.createElement('div');
            frameEl.className = `frame ${index === this.currentFrame ? 'active' : ''}`;
            frameEl.textContent = index + 1;
            frameEl.addEventListener('click', () => this.setFrame(index));
            
            // 双击删除帧
            frameEl.addEventListener('dblclick', (e) => {
                e.preventDefault();
                if (confirm(`确定要删除第${index + 1}帧吗？`)) {
                    this.deleteFrame(index);
                }
            });
            
            timeline.appendChild(frameEl);
        });
    }
    
    updateUI() {
        document.getElementById('frameCount').textContent = this.frames.length;
        document.getElementById('currentFrame').textContent = this.currentFrame + 1;
        document.getElementById('fps').textContent = this.fps;
    }
    
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制洋葱皮
        if (this.onionSkinEnabled && this.currentFrame > 0) {
            const prevFrame = this.frames[this.currentFrame - 1];
            ctx.globalAlpha = 0.3;
            this.drawPaths(prevFrame.paths);
            ctx.globalAlpha = 1.0;
        }
        
        // 绘制当前帧
        this.drawPaths(paths);
    }
    
    drawPaths(pathArray) {
        pathArray.forEach(path => {
            if (path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                
                ctx.strokeStyle = path[0].color || '#000';
                ctx.lineWidth = path[0].width || 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
        });
    }
}

// 绘图处理器类
class DrawHandler {
    constructor() {
        this.brushSize = 4;
        this.brushColor = '#000000';
        this.eraserSize = 20;
    }
    
    startDrawing(x, y) {
        if (currentTool === 'pencil') {
            isDrawing = true;
            currentPath = [{
                x: x,
                y: y,
                color: this.brushColor,
                width: this.brushSize,
                tool: 'pencil'
            }];
        } else if (currentTool === 'eraser') {
            this.eraseAt(x, y);
        }
    }
    
    draw(x, y) {
        if (!isDrawing || currentTool !== 'pencil') return;
        
        currentPath.push({
            x: x,
            y: y,
            color: this.brushColor,
            width: this.brushSize,
            tool: 'pencil'
        });
        
        // 实时绘制
        ctx.beginPath();
        ctx.moveTo(currentPath[currentPath.length - 2].x, currentPath[currentPath.length - 2].y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = this.brushColor;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    
    stopDrawing() {
        if (isDrawing && currentPath.length > 0) {
            paths.push(currentPath);
            currentPath = [];
        }
        isDrawing = false;
        
        // 保存当前帧数据
        if (animationSystem) {
            animationSystem.frames[animationSystem.currentFrame].paths = [...paths];
        }
    }
    
    eraseAt(x, y) {
        // 擦除逻辑：移除点击位置附近的路径点
        const eraseRadius = this.eraserSize;
        
        for (let i = paths.length - 1; i >= 0; i--) {
            const path = paths[i];
            for (let j = path.length - 1; j >= 0; j--) {
                const point = path[j];
                const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
                
                if (distance < eraseRadius) {
                    path.splice(j, 1);
                    if (path.length === 0) {
                        paths.splice(i, 1);
                    }
                    animationSystem.redrawCanvas();
                    return;
                }
            }
        }
    }
    
    clearCanvas() {
        if (confirm('确定要清空当前画布吗？')) {
            paths = [];
            animationSystem.redrawCanvas();
            animationSystem.showNotification('画布已清空', 'success');
        }
    }
    
    undo() {
        if (paths.length > 0) {
            paths.pop();
            animationSystem.redrawCanvas();
            animationSystem.showNotification('已撤销', 'info');
        }
    }
}

// 初始化函数
function setup() {
    canvas = createCanvas(512, 512);
    canvas.id('canvas');
    canvas.parent('canvas-ctn');
    ctx = canvas.getContext('2d');
    
    // 设置画布背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 初始化系统
    animationSystem = new AnimationSystem();
    drawHandler = new DrawHandler();
    
    // 鼠标事件
    canvas.mousePressed((e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        drawHandler.startDrawing(x, y);
    });
    
    canvas.mouseDragged((e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        drawHandler.draw(x, y);
    });
    
    canvas.mouseReleased(() => {
        drawHandler.stopDrawing();
    });
    
    // 触摸事件支持
    canvas.touchStarted((e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        drawHandler.startDrawing(x, y);
        return false;
    });
    
    canvas.touchMoved((e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        drawHandler.draw(x, y);
        return false;
    });
    
    canvas.touchEnded(() => {
        drawHandler.stopDrawing();
        return false;
    });
    
    // 设置按钮事件
    setupButtonEvents();
    
    // 添加键盘快捷键
    setupKeyboardShortcuts();
}

// 设置按钮事件
function setupButtonEvents() {
    // 工具按钮
    document.getElementById('pencilTool').addEventListener('click', () => {
        currentTool = 'pencil';
        updateToolButtons();
    });
    
    document.getElementById('eraserTool').addEventListener('click', () => {
        currentTool = 'eraser';
        updateToolButtons();
    });
    
    document.getElementById('clearCanvas').addEventListener('click', () => {
        drawHandler.clearCanvas();
    });
    
    document.getElementById('undoBtn').addEventListener('click', () => {
        drawHandler.undo();
    });
    
    // 动画控制按钮
    document.getElementById('playBtn').addEventListener('click', () => {
        animationSystem.play();
    });
    
    document.getElementById('stopBtn').addEventListener('click', () => {
        animationSystem.stop();
    });
    
    document.getElementById('addFrameBtn').addEventListener('click', () => {
        animationSystem.addFrame();
    });
    
    document.getElementById('onionSkinBtn').addEventListener('click', () => {
        animationSystem.onionSkinEnabled = !animationSystem.onionSkinEnabled;
        const btn = document.getElementById('onionSkinBtn');
        if (animationSystem.onionSkinEnabled) {
            btn.classList.add('active');
            animationSystem.showNotification('洋葱皮已开启', 'info');
        } else {
            btn.classList.remove('active');
            animationSystem.showNotification('洋葱皮已关闭', 'info');
        }
        animationSystem.redrawCanvas();
    });
    
    document.getElementById('exportBtn').addEventListener('click', () => {
        exportAnimation();
    });
    
    // 时间轴控制
    document.getElementById('prevFrame').addEventListener('click', () => {
        if (animationSystem.currentFrame > 0) {
            animationSystem.setFrame(animationSystem.currentFrame - 1);
        }
    });
    
    document.getElementById('nextFrame').addEventListener('click', () => {
        if (animationSystem.currentFrame < animationSystem.frames.length - 1) {
            animationSystem.setFrame(animationSystem.currentFrame + 1);
        }
    });
}

// 更新工具按钮状态
function updateToolButtons() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentTool === 'pencil') {
        document.getElementById('pencilTool').classList.add('active');
    } else if (currentTool === 'eraser') {
        document.getElementById('eraserTool').classList.add('active');
    }
}

// 键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'p':
            case 'P':
                currentTool = 'pencil';
                updateToolButtons();
                break;
            case 'e':
            case 'E':
                currentTool = 'eraser';
                updateToolButtons();
                break;
            case 'z':
            case 'Z':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    drawHandler.undo();
                }
                break;
            case ' ':
                e.preventDefault();
                if (animationSystem.isPlaying) {
                    animationSystem.stop();
                } else {
                    animationSystem.play();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (animationSystem.currentFrame > 0) {
                    animationSystem.setFrame(animationSystem.currentFrame - 1);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (animationSystem.currentFrame < animationSystem.frames.length - 1) {
                    animationSystem.setFrame(animationSystem.currentFrame + 1);
                }
                break;
        }
    });
}

// 导出动画
function exportAnimation() {
    const link = document.createElement('a');
    link.download = `animation-${new Date().getTime()}.json`;
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        frames: animationSystem.frames,
        fps: animationSystem.fps,
        canvasSize: { width: canvas.width, height: canvas.height }
    }));
    link.click();
    animationSystem.showNotification('动画已导出', 'success');
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// p5.js draw函数
function draw() {
    // 不需要在这里绘制，因为我们使用自定义的绘制逻辑
}