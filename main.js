var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

//控制画板大小的函数
function canvasSize() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
}

//画圆的函数
function drawCircle(x, y, radius) {
    if (canvas.getContext) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true)
        ctx.fillStyle = "";
        ctx.fill()
    }
}

//连接点与点的函数
function drawLine(originX, originY, finishX, finishY) {
    ctx.beginPath(); //开始画线
    ctx.moveTo(originX, originY); //起点
    ctx.lineWidth = 4; //线的宽度
    ctx.lineTo(finishX, finishY); //终点
    ctx.stroke(); //描边
    ctx.closePath(); //结束画线
}

//画板大小
canvasSize()

//监听窗口改变
window.onresize = function() {
    canvasSize()
}

//添加标识默值为false表示默认关闭画画状态
var using = false

//橡皮擦开关
var eraserSwitch = false
document.getElementById('eraser').onclick = function() {
    eraserSwitch = !eraserSwitch
}

//记录上一个点,和新的点
var lastX, lastY
var newX, newY

if (document.body.ontouchstart !== undefined) {
    //支持触屏

    //手指按下
    canvas.ontouchstart = function(coordinate) {
        lastX = coordinate.touches[0].clientX

        lastY = coordinate.touches[0].clientY
        using = true // 开启橡皮擦
        if (eraserSwitch) { //判断是否开启橡皮擦
            ctx.clearRect(lastX - 10, lastY - 10, 20, 20)
        } else {}
    }

    //开始触摸
    canvas.ontouchmove = function(coordinate) {
        //判断using的值是否为true，是否在画画状态
        newX = coordinate.touches[0].clientX
        newY = coordinate.touches[0].clientY
        if (!using) { return }
        if (eraserSwitch) {
            ctx.clearRect(newX - 10, newY - 10, 20, 20)
        } else {
            drawCircle(newX, newY, 2)
            drawLine(lastX, lastY, newX, newY) //连接当前点与上一个点

            //实时更新上一个点，让当前点变为上一个点，等待下一个点与它连接
            lastX = newX;
            lastY = newY;
        }
    }

    //触摸结束
    canvas.ontouchend = function(coordinate) {
        //松开鼠标时using的值变为false，关闭画画状态
        using = false
    }
} else {
    //不支持触屏

    //按下鼠标
    canvas.onmousedown = function(coordinate) {
        lastX = coordinate.clientX
        lastY = coordinate.clientY
        using = true // 开启橡皮擦
        if (eraserSwitch) { //判断是否开启橡皮擦
            ctx.clearRect(lastX - 10, lastY - 10, 20, 20)
        } else {}
    }

    //移动鼠标
    canvas.onmousemove = function(coordinate) {
        //判断using的值是否为true，是否在画画状态
        newX = coordinate.clientX
        newY = coordinate.clientY
        if (!using) { return }
        if (eraserSwitch) {
            ctx.clearRect(newX - 10, newY - 10, 20, 20)
        } else {
            drawCircle(newX, newY, 2)
            drawLine(lastX, lastY, newX, newY) //连接当前点与上一个点

            //实时更新上一个点，让当前点变为上一个点，等待下一个点与它连接
            lastX = newX;
            lastY = newY;
        }
    }

    //松开鼠标
    canvas.onmouseup = function(coordinate) {
        //松开鼠标时using的值变为false，关闭画画状态
        using = false
    }
}