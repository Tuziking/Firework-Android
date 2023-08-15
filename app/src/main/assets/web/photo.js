window.onload = function () {
    // 元素获取
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d");
    // 放图片的那层画布
    const canvasIn = document.createElement('canvas');
    canvasIn.width = window.innerWidth
    canvasIn.height = window.innerHeight
    const inCtx = canvasIn.getContext("2d")
    // 设定画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        clearCanvas();
    }
    // 初始化
    resizeCanvas();
    // 页面缩放改变画布大小
    window.addEventListener("resize", resizeCanvas)
    // 清屏
    function clearCanvas() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // 定制颜色，这是通过色域方式定义的
    // 获取鼠标点击位置
    function clickSite(e) {
        // 获取当前鼠标的坐标
        let x = e.clientX;
        let y = e.clientY;
        // 绘制  
        addFires(x, y);
    }
    document.addEventListener('click', clickSite);
    let fireworks = [];

    function addFires(x, y) {
        let img1 = new Image();
        img1.src = Math.floor(Math.random() * 9 + 1) + '.jpg'
        // 一定要在图片加载完后再获取
        img1.onload = function () {
            let imgWidth = 400
            let imgHeight = 400
            inCtx.drawImage(img1, 0, 0, imgWidth, imgHeight)
            let imgData = inCtx.getImageData(0, 0, imgWidth, imgHeight)
            clearCanvas()
            for (let h = 0; h < imgHeight; h += 8) {
                for (let w = 0; w < imgWidth; w += 8) {
                    let position = (imgWidth * h + w) * 4;
                    // 返回的数组是rgba的方式存储
                    let r = imgData.data[position],
                        g = imgData.data[position + 1],
                        b = imgData.data[position + 2],
                        a = imgData.data[position + 3];
                    if (r + g + b == 0) {
                        continue
                    }
                    let firework = {};
                    firework.x = x;
                    firework.y = y;
                    firework.fx = x + w - imgWidth / 2;
                    firework.fy = y + h - imgHeight / 2;
                    firework.size = 1; // Math.floor(Math.random() * 2) + 1
                    firework.speed = 5;
                    firework.alpha = 1;
                    firework.r = r
                    firework.g = g
                    firework.b = b
                    firework.color = "rgba(" + r + "," + g + "," + b + "," + a + ")"
                    fireworks.push(firework)
                }
            }
        }
        // 当成图片来获取
    }
    // 绘制烟花粒子
    function drawFires() {
        // 清屏
        clearCanvas();
        for (let i = 0; i < fireworks.length; i++) {
            // 渲染出当前数据
            let firework = fireworks[i];
            // 下面是点数学题
            firework.x += (firework.fx - firework.x) / 10;
            firework.y += (firework.fy - firework.y) / 10 - (firework.alpha - 1.8) * firework.speed;
            firework.alpha -= 0.02;
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
            ctx.fillStyle = "rgba(" + firework.r + "," + firework.g + "," + firework.b + "," + firework.alpha + ")"
            ctx.fill();
        }
    }
    // 更新实现动态拖尾
    // 渲染,更新粒子的信息
    function tick() {
        // // 设置拖影
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