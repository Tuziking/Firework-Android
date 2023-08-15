window.onload = function () {
    // 元素获取
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d");
    // 设定画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        clearCanvas();
    }
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

        // 填充字体样式
        let font = 120
        ctx.font = font + "px '微软雅黑'"
        ctx.fillStyle = "#000001"
        // 内容
        let text = '小丞同学'
        // 获取字体的宽度
        let textWidth = ctx.measureText(text).width
        // 在左上角填充字体
        ctx.fillText(text, 0, font)
        // 当成图片来获取
        let imgData = ctx.getImageData(0, 0, textWidth, font * 1.2)
        console.log(imgData);
        clearCanvas()
        // ctx.fillStyle = "#000"
        // // 清画布
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 重新渲染
        // 爆炸扩散的半径
        // 定制颜色，这是通过色域方式定义的
        let hue = Math.random() * 360;
        let hueVariance = 60;

        function setColors(firework) {
            firework.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
            firework.brightness = Math.floor(Math.random() * 21) + 50;
            firework.alpha = (Math.floor(Math.random() * 60) + 40) / 100;
        }
        for (let h = 0; h < font * 1.2; h += 6) {
            for (let w = 0; w < textWidth; w += 6) {
                let position = (textWidth * h + w) * 4;
                // 返回的数组是rgba的方式存储
                let r = imgData.data[position],
                    g = imgData.data[position + 1],
                    b = imgData.data[position + 2],
                    a = imgData.data[position + 3];
                if (r + g + b == 0) {
                    continue
                }
//                 let fx = x+ w-textWidth/2;
//                 let fy = y +h -font/2
// ctx.fillStyle ='#ffffff'
// ctx.fillRect(fx,fy,1,1)

                let firework = {};
                firework.x = x;
                firework.y = y;
                firework.fx = x + w - textWidth / 2;
                firework.fy = y + h - font / 2;
                firework.size = Math.floor(Math.random() * 2) + 1;
                firework.speed = 1;
                setColors(firework);
                fireworks.push(firework);
            }
        }
    }











    function drawFires() {
        // 清屏
        clearCanvas();
        for (let i = 0; i < fireworks.length; i++) {
            // 渲染出当前数据
            let firework = fireworks[i];
            // 下面是点数学题
            firework.x += (firework.fx - firework.x) / 10;
            firework.y += (firework.fy - firework.y) / 10 - (firework.alpha - 1) * firework.speed;
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