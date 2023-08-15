window.onload = function () {
    // 元素获取
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d");
    // 设定画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    resizeCanvas();
    // 页面缩放改变画布大小
    window.addEventListener("resize", resizeCanvas)
    // 清屏
    function clearCanvas() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // 烟花
    let fireworks = [];
    setInterval(() => {
        // 可以多调用几次用来增加烟花的数量
        addFires(Math.random() * canvas.width, Math.random() * canvas.height)
        addFires(Math.random() * canvas.width, Math.random() * canvas.height)
    }, 500)
    // 获取鼠标点击位置
    function clickSite(e) {
        // 获取当前鼠标的坐标
        let x = e.clientX;
        let y = e.clientY;
        // 绘制
        addFires(x, y);
    }
    document.addEventListener('click', clickSite);
    // 将单个烟花保存到烟花数组中
    function addFires(x, y) {
        // 烟花爆开的粒子数量
        let count = 100;
        // 爆炸扩散的半径
        // 定制颜色，这是通过色域方式定义的
        let hue = Math.random() * 360;
        let hueVariance = 60;
        function setColors(firework) {
            firework.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
            firework.brightness = Math.floor(Math.random() * 21) + 50;
            firework.alpha = (Math.floor(Math.random() * 60) + 40) / 100;
        }
        for (let i = 0; i < count; i++) {
            // 使粒子均匀分开一个角度，例如第一个粒子就占一份的均分角
            let angle = 360 / count * i;
            // 通过角度计算弧度
            let radians = angle * Math.PI / 180;
            // 将单个烟花信息保存到数组
            let firework = {};
            firework.x = x;
            firework.y = y;
            firework.radians = radians;
            firework.size = 2;
            // 各个粒子随机速度
            firework.speed = Math.random() * 5 + .4;
            firework.radius = firework.speed;
            // 设置颜色
            setColors(firework)
            // 加入数组
            fireworks.push(firework)
        }
    }
    // 绘制烟花
    function drawFires() {
        // 清屏
        clearCanvas();
        for (let i = 0; i < fireworks.length; i++) {
            // 渲染出当前数据
            let firework = fireworks[i];
            // 下面是点数学题
            // moveX，moveY是粒子开始的坐标，画个三角形，角度半径知道很容易就得出方程
            let moveX = Math.cos(firework.radians) * firework.radius;
            let moveY = Math.sin(firework.radians) * firework.radius + 1;
            firework.x += moveX;
            firework.y += moveY;
            // 更新数据,让圆扩散开来
            firework.radius *= 1 - firework.speed / 120
            firework.alpha -= 0.01;
            // 如果透明度小于0就删除这个粒子
            if (firework.alpha <= 0) {
                fireworks.splice(i, 1);
                // 跳过这次循环，不进行绘制
                continue;
            }
            // 开始路径
            ctx.beginPath();
            ctx.arc(firework.x, firework.y, firework.size, Math.PI * 2, false);
            // 结束
            ctx.closePath();
            ctx.fillStyle = 'hsla(' + firework.hue + ',100%,' + firework.brightness + '%,' + firework.alpha + ')';
            ctx.fill();
        }
    }
    // 渲染,更新粒子的信息
    function tick() {
        // 设置拖影
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        // 更新画布
        drawFires();
        requestAnimationFrame(tick);
    }
    tick()
}