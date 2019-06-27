var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var lineWidth = 2
var color = '#000'
var colors = ['#FFC253', '#000', '#EB3412', '#2B81FB', '#6EDB6C', '#AA2BFB']

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
        ctx.fillStyle = '';
    }
}

//连接点与点的函数
function drawLine(originX, originY, finishX, finishY) {
    ctx.beginPath(); //开始画线
    ctx.strokeStyle = color
    ctx.moveTo(originX, originY); //起点
    ctx.lineWidth = lineWidth; //线的宽度
    ctx.lineTo(finishX, finishY); //终点

    ctx.stroke(); //描边
    ctx.closePath(); //结束画线
}

//画板大小
canvasSize()

//监听窗口改变
window.onresize = function () {
    canvasSize()
}

//添加标识默值为false表示默认关闭画画状态
var using = false

//橡皮擦开关
var eraserSwitch = false
document.getElementById('eraser').onclick = function () {
    eraserSwitch = !eraserSwitch
    if (eraserSwitch) {
        document.getElementById('rubberPack').style.width = '70px'
    } else {
        document.getElementById('rubberPack').style.width = ''
    }
}

//记录上一个点,和新的点
var lastX, lastY
var newX, newY

if (document.body.ontouchstart !== undefined) {
    //支持触屏

    //手指按下
    canvas.ontouchstart = function (coordinate) {
        lastX = coordinate.touches[0].clientX

        lastY = coordinate.touches[0].clientY
        using = true // 开启橡皮擦
        if (eraserSwitch) { //判断是否开启橡皮擦
            ctx.clearRect(lastX - 50, lastY - 50, 100, 100)
        } else { }
    }

    //开始触摸
    canvas.ontouchmove = function (coordinate) {
        //判断using的值是否为true，是否在画画状态
        newX = coordinate.touches[0].clientX
        newY = coordinate.touches[0].clientY
        if (!using) { return }
        if (eraserSwitch) {
            ctx.clearRect(newX - 50, newY - 50, 100, 100)
        } else {
            drawCircle(newX, newY, lineWidth)
            drawLine(lastX, lastY, newX, newY) //连接当前点与上一个点

            //实时更新上一个点，让当前点变为上一个点，等待下一个点与它连接
            lastX = newX;
            lastY = newY;
        }
    }

    //触摸结束
    canvas.ontouchend = function (coordinate) {
        //松开鼠标时using的值变为false，关闭画画状态
        using = false
    }
} else {
    //不支持触屏

    //按下鼠标
    canvas.onmousedown = function (coordinate) {
        lastX = coordinate.clientX
        lastY = coordinate.clientY
        using = true // 开启橡皮擦
        if (eraserSwitch) { //判断是否开启橡皮擦
            ctx.clearRect(lastX - 50, lastY - 50, 100, 100)
            var stepClear = 1;
        } else { }
    }

    //移动鼠标
    canvas.onmousemove = function (coordinate) {
        //判断using的值是否为true，是否在画画状态
        newX = coordinate.clientX
        newY = coordinate.clientY
        if (!using) { return }
        if (eraserSwitch) {
            ctx.clearRect(newX - 50, newY - 50, 100, 100)
            var stepClear = 1;

        } else {
            // drawCircle(newX, newY, lineWidth)
            drawLine(lastX, lastY, newX, newY) //连接当前点与上一个点

            //实时更新上一个点，让当前点变为上一个点，等待下一个点与它连接
            lastX = newX;
            lastY = newY;
        }
    }

    //松开鼠标
    canvas.onmouseup = function (coordinate) {
        //松开鼠标时using的值变为false，关闭画画状态
        using = false
    }
}

/**************************************************************/

/*   选择画笔   */

// 获取画笔并定义笔的粗细的函数
function penBodyWidth(penBody, width) {
    document.getElementById(penBody).style.width = width
}

//更换画笔粗细的函数
function replace(penBodyNew, penBodyLast1, penBodyLast2, penBodyLast3, width, num) {
    penBodyWidth(penBodyNew, width)
    penBodyWidth(penBodyLast1, '')
    penBodyWidth(penBodyLast2, '')
    penBodyWidth(penBodyLast3, '')
    lineWidth = num
    eraserSwitch = false
    document.getElementById('rubberPack').style.width = ''

}

//默认选择1号笔
penBodyWidth('penBody1', '163px')

document.getElementById('thickness1').onclick = function () {
    replace('penBody1', 'penBody2', 'penBody3', 'penBody4', '163px', 2)
}

document.getElementById('thickness2').onclick = function () {
    replace('penBody2', 'penBody1', 'penBody3', 'penBody4', '163px', 4)
}

document.getElementById('thickness3').onclick = function () {
    replace('penBody3', 'penBody2', 'penBody1', 'penBody4', '163px', 6)
}

document.getElementById('thickness4').onclick = function () {
    replace('penBody4', 'penBody2', 'penBody3', 'penBody1', '163px', 8)
}

/**************************************************************/

/*   选择颜色   */

//获取colors下面的所有子节点
var allNodeList = document.getElementById('colors').childNodes

//获取所有的li标签
var newList = []
for (var i = 0; i < allNodeList.length; i++) {
    var node = allNodeList[i];
    if (node.nodeType === 1) { //判断类型
        newList.push(node)
    }
}

//添加点击事件
var div = document.createElement('div')
console.log(newList)
for (var i = 0; i < newList.length; i++) {
    newList[i].index = i
    newList[i].onclick = function () {
        div.id = 'colorSelect'
        newList[this.index].appendChild(div)
        color = colors[this.index]
        console.log(color)
    }
}

/**************************************************************/

/*   删除   */

document.getElementById('delete').onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

/**************************************************************/

/*  下载   */

//填充背景色
ctx.fillStyle = '#fafafa';
ctx.fillRect(0, 0, canvas.width, canvas.height)

//下载为图片
document.getElementById('download').onclick = function () {
    var a = document.createElement('a')
    document.body.appendChild(a)
    var url = canvas.toDataURL("image/jpeg")
    a.href = url
    a.download = '我的画板'
    a.click()

}

/**************************************************************/