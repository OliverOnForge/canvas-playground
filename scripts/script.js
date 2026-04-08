/** @type {HTMLCanvasElement} */

const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');

let centerX1, centerY1, step1;
const numLines = 20;

function updateSize() {
    canvas1.width = canvas1.clientWidth;
    canvas1.height = canvas1.clientHeight;
    centerX1 = canvas1.width / 2;
    centerY1 = canvas1.height / 2;
    step1 = centerX1 / numLines;
}

window.addEventListener('resize', updateSize);
updateSize();

canvas1.addEventListener('mousemove', (event) => {
    // get canvas1 position
    const rect = canvas1.getBoundingClientRect();
    
    // Mouse position
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Clean canvas1
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    // Draw
    drawGrid();
    dropLines(mouseX,mouseY);
    drawVector(centerX1,centerY1,mouseX,mouseY);
    writeValues(mouseX,mouseY);
});


function writeValues(mouseX, mouseY) {
    ctx1.font = 'bold 14px Arial';
    const padding = 15;
    const topMargin = 20;
    const innerGap = 20; // Espacio entre grupos de texto

    // 1. Cálculos (Y invertida para lógica matemática)
    const rawX = (mouseX - centerX1) / step1;
    const rawY = (centerY1 - mouseY) / step1;
    const rawLen = Math.hypot(rawX, rawY);
    let deg = Math.atan2(rawY, rawX) * (180 / Math.PI);
    if (deg < 0) deg += 360;

    // 2. Definir segmentos de texto
    const txtX = `X: ${rawX.toFixed(2)}`;
    const txtY = `Y: ${rawY.toFixed(2)}`;
    const txtL = `L: ${rawLen.toFixed(2)}`;
    const txtA = `A: ${deg.toFixed(1)}°`;

    // 3. Medir anchos para calcular el centrado total
    const wX = ctx1.measureText(txtX).width;
    const wY = ctx1.measureText(txtY).width;
    const wL = ctx1.measureText(txtL).width;
    const wA = ctx1.measureText(txtA).width;

    const totalWidth = wX + wY + wL + wA + (innerGap * 3);
    const bgWidth = totalWidth + (padding * 2);
    const bgHeight = 40;

    // 4. Dibujar fondo blanco centrado en la parte superior
    const startX = centerX1 - (totalWidth / 2);
    const bgX = centerX1 - (bgWidth / 2);

    ctx1.fillStyle = 'white';
    ctx1.shadowColor = 'rgba(0,0,0,0.1)';
    ctx1.shadowBlur = 10;
    ctx1.fillRect(bgX, topMargin, bgWidth, bgHeight);
    ctx1.shadowBlur = 0; // Reset sombra

    // 5. Dibujar cada etiqueta con su color
    ctx1.textBaseline = 'middle';
    ctx1.textAlign = 'left';
    let currentX = startX;

    // Etiqueta X (Rojo del eje Vertical/X)
    ctx1.fillStyle = '#de1818';
    ctx1.fillText(txtX, currentX, topMargin + (bgHeight / 2));
    currentX += wX + innerGap;

    // Etiqueta Y (Azul del eje Horizontal/Y)
    ctx1.fillStyle = '#0055ff';
    ctx1.fillText(txtY, currentX, topMargin + (bgHeight / 2));
    currentX += wY + innerGap;

    // Longitud y Ángulo (Negro/Gris)
    ctx1.fillStyle = '#333';
    ctx1.fillText(txtL, currentX, topMargin + (bgHeight / 2));
    currentX += wL + innerGap;
    ctx1.fillText(txtA, currentX, topMargin + (bgHeight / 2));
}

function drawSdwLine(startX, startY, endX, endY, width, color, offset){
     // Draw shadow
    ctx1.beginPath();
    ctx1.lineWidth = width;
    ctx1.strokeStyle = '#737373';
    ctx1.moveTo(startX+offset, startY+offset);
    ctx1.lineTo(endX+offset, endY+offset);
    ctx1.stroke();

    // Draw vector
    ctx1.beginPath();
    ctx1.lineWidth = width;
    ctx1.strokeStyle = color;
    ctx1.moveTo(startX, startY);
    ctx1.lineTo(endX, endY);
    ctx1.stroke();
}

function drawSdwLineDash(startX, startY, endX, endY, width, color, offset) {

    // Draw shadow
    ctx1.setLineDash([8, 5]);
    ctx1.beginPath();
    ctx1.lineWidth = width;
    ctx1.strokeStyle = '#737373';
    ctx1.moveTo(startX+offset, startY+offset);
    ctx1.lineTo(endX+offset, endY+offset);
    ctx1.stroke();

    // Draw vector
    ctx1.beginPath();
    ctx1.lineWidth = width;
    ctx1.strokeStyle = color;
    ctx1.moveTo(startX, startY);
    ctx1.lineTo(endX, endY);
    ctx1.stroke();
    ctx1.setLineDash([]);
}

function drawSdwElipse(centerX1, centerY1, radius, color, offset){

// Draw sadow
ctx1.beginPath();
ctx1.arc(centerX1+offset, centerY1+offset, radius, 0, 2 * Math.PI);
ctx1.fillStyle = '#737373';
ctx1.fill();

ctx1.beginPath();
ctx1.arc(centerX1, centerY1, radius, 0, 2 * Math.PI);
ctx1.fillStyle = color;
ctx1.fill();
}

function drawGrid() {
    ctx1.strokeStyle = '#101010';
    ctx1.lineWidth = 1;

    // Vertical Lines
    for (let i = 0; i <= numLines; i++) {
        let xOffset = i * step1;
        ctx1.beginPath();
        ctx1.moveTo(centerX1 + xOffset, 0); ctx1.lineTo(centerX1 + xOffset, canvas1.height);
        ctx1.stroke();
        ctx1.beginPath();
        ctx1.moveTo(centerX1 - xOffset, 0); ctx1.lineTo(centerX1 - xOffset, canvas1.height);
        ctx1.stroke();
    }

    // Horizontal Lines
    const numLinesV = Math.ceil(centerY1 / step1); 
    for (let i = 0; i <= numLinesV; i++) {
        let yOffset = i * step1;
        ctx1.beginPath();
        ctx1.moveTo(0, centerY1 + yOffset); ctx1.lineTo(canvas1.width, centerY1 + yOffset);
        ctx1.stroke();
        ctx1.beginPath();
        ctx1.moveTo(0, centerY1 - yOffset); ctx1.lineTo(canvas1.width, centerY1 - yOffset);
        ctx1.stroke();
    }

    // Axis
    drawSdwLine(centerX1, 0, centerX1, canvas1.height, 4, '#de1818', 5);
    drawSdwLine(0, centerY1, canvas1.width, centerY1, 4, '#0055ff', 5);
}

function dropLines(mouseX, mouseY){
    // Vertical
    drawSdwLineDash(mouseX,mouseY, centerX1, mouseY,3,'#e80e0e',5);
    // Horizontal
    drawSdwLineDash(mouseX,mouseY, mouseX, centerY1,3,'#1344e5',5);
}

function drawVector(startX,startY, endX, endY){

    const vectorColor = '#000000'
    const pointerRad = 6;
    // draw hipotenusse
    drawSdwLine(startX,startY,endX,endY,4,vectorColor,5)
    // draw pointer
    drawSdwElipse(endX,endY,pointerRad,vectorColor,5)
}