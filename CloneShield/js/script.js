// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('SafeSpeech Demo Page Loaded');
    
    // 初始化功能
    initSmoothScrolling();
    initAudioPlayers();
    initWorkflowAnimation();
    initResponsiveFeatures();
});

// 平滑滚动功能
function initSmoothScrolling() {
    // 获取所有内部链接
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 计算目标位置，考虑一些偏移量
                const offsetTop = targetElement.offsetTop - 20;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 添加高亮效果
                // highlightSection(targetElement);
            }
        });
    });
}

// 高亮目标部分
function highlightSection(element) {
    // 移除之前的高亮
    const previousHighlight = document.querySelector('.section-highlight');
    if (previousHighlight) {
        previousHighlight.classList.remove('section-highlight');
    }
    
    // 添加高亮样式
    element.classList.add('section-highlight');
    
    // 3秒后移除高亮
    setTimeout(() => {
        element.classList.remove('section-highlight');
    }, 1200);
}

// 音频播放器功能
function initAudioPlayers() {
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        // 添加加载事件监听
        player.addEventListener('loadstart', function() {
            console.log('Audio loading started:', this.src);
        });
        
        // 添加播放事件监听
        player.addEventListener('play', function() {
            console.log('Audio playing:', this.src);
            
            // 暂停其他正在播放的音频
            pauseOtherAudios(this);
            
            // 添加播放状态样式
            this.closest('.audio-sample').classList.add('playing');
        });
        
        // 添加暂停事件监听
        player.addEventListener('pause', function() {
            console.log('Audio paused:', this.src);
            this.closest('.audio-sample').classList.remove('playing');
        });
        
        // 添加结束事件监听
        player.addEventListener('ended', function() {
            console.log('Audio ended:', this.src);
            this.closest('.audio-sample').classList.remove('playing');
        });
        
        // 添加错误处理
        player.addEventListener('error', function() {
            console.error('Audio error:', this.src);
            this.closest('.audio-sample').classList.add('audio-error');
            
            // 显示错误信息
            const errorMsg = document.createElement('div');
            errorMsg.className = 'audio-error-message';
            errorMsg.textContent = 'Audio file not found or cannot be played';
            this.parentNode.appendChild(errorMsg);
        });
    });
}

// 暂停其他音频
function pauseOtherAudios(currentPlayer) {
    const allPlayers = document.querySelectorAll('.audio-player');
    allPlayers.forEach(player => {
        if (player !== currentPlayer && !player.paused) {
            player.pause();
        }
    });
}

// 工作流程动画
function initWorkflowAnimation() {
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const workflowArrows = document.querySelectorAll('.workflow-arrow');
    
    // 创建观察者来触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateWorkflow();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    const workflowContainer = document.querySelector('.workflow-diagram');
    if (workflowContainer) {
        observer.observe(workflowContainer);
    }
    
    function animateWorkflow() {
        // 重置所有步骤的透明度
        workflowSteps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
        });
        
        workflowArrows.forEach(arrow => {
            arrow.style.opacity = '0';
        });
        
        // 逐步显示每个步骤
        workflowSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.transition = 'all 0.5s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
                
                // 显示箭头
                if (index < workflowArrows.length) {
                    setTimeout(() => {
                        workflowArrows[index].style.transition = 'opacity 0.3s ease';
                        workflowArrows[index].style.opacity = '1';
                    }, 250);
                }
            }, index * 300);
        });
    }
}

// 响应式功能
function initResponsiveFeatures() {
    // 检测屏幕尺寸变化
    window.addEventListener('resize', handleResize);
    
    // 初始检查
    handleResize();
    
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // 调整工作流程图布局
        const workflowDiagram = document.querySelector('.workflow-diagram');
        if (workflowDiagram) {
            if (isMobile) {
                workflowDiagram.classList.add('mobile-layout');
            } else {
                workflowDiagram.classList.remove('mobile-layout');
            }
        }
        
        // 调整音频播放器
        const audioPlayers = document.querySelectorAll('.audio-player');
        audioPlayers.forEach(player => {
            if (isMobile) {
                player.style.height = '35px';
            } else {
                player.style.height = '40px';
            }
        });
    }
}

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    // 空格键暂停/播放当前焦点的音频
    if (e.code === 'Space' && e.target.tagName === 'AUDIO') {
        e.preventDefault();
        if (e.target.paused) {
            e.target.play();
        } else {
            e.target.pause();
        }
    }
});

// 添加一些实用的CSS类
const style = document.createElement('style');
style.textContent = `
    .section-highlight {
        background-color: #ffffd7 !important;
        transition: background-color 0.3s ease;
    }
    
    .playing {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
    
    .audio-error {
        border-color: #ef4444 !important;
        background-color: #fef2f2 !important;
    }
    
    .audio-error-message {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.5rem;
        font-style: italic;
    }
    
    .mobile-layout {
        flex-direction: column !important;
    }
    
    .mobile-layout .workflow-arrow {
        transform: rotate(90deg);
        margin: 0.5rem 0 !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// 导出一些有用的函数供外部使用
window.SafeSpeechDemo = {
    pauseAllAudio: function() {
        const audioPlayers = document.querySelectorAll('.audio-player');
        audioPlayers.forEach(player => player.pause());
    },
    
    scrollToSection: function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 20;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            highlightSection(element);
        }
    },
    
    playAudio: function(audioSrc) {
        const audio = document.querySelector(`audio[src="${audioSrc}"]`);
        if (audio) {
            audio.play();
        }
    }
};