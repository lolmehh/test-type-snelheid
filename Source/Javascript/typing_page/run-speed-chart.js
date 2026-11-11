export function drawRunChart(runChart, points, timerLength) {
    if (!runChart) return;

    const context = runChart.getContext("2d");
    const width = runChart.clientWidth;
    const height = runChart.clientHeight;
    if (!context || !width || !height) return;

    const pixelRatio = window.devicePixelRatio || 1;
    runChart.width = width * pixelRatio;
    runChart.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    const maxWpm = Math.max(20, ...points.map(point => point[1]));
    const padding = { top: 16, right: 14, bottom: 52, left: 56 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    context.font = "12px system-ui, sans-serif";
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.strokeStyle = "rgba(255, 255, 255, 0.16)";
    context.fillStyle = "rgba(255, 255, 255, 0.72)";
    for (let tick = 0; tick <= 4; tick++) {
        const value = Math.ceil(maxWpm * tick / 4);
        const y = padding.top + graphHeight * (1 - tick / 4);
        context.beginPath();
        context.moveTo(padding.left, y);
        context.lineTo(width - padding.right, y);
        context.stroke();
        context.fillText(String(value), padding.left - 7, y);
    }

    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText("Time (seconds)", padding.left + graphWidth / 2, height - 18);
    [0, timerLength / 2, timerLength].forEach(second => {
        const x = padding.left + second / timerLength * graphWidth;
        context.fillText(String(second), x, padding.top + graphHeight + 4);
    });
    context.save();
    context.translate(12, padding.top + graphHeight / 2);
    context.rotate(-Math.PI / 2);
    context.fillText("WPM", 0, 0);
    context.restore();

    if (points.length) {
        const plotted = points.map(([seconds, wpm]) => ({
            x: padding.left + Math.min(seconds, timerLength) / timerLength * graphWidth,
            y: padding.top + (1 - wpm / maxWpm) * graphHeight
        }));

        context.beginPath();
        plotted.forEach((point, index) => {
            if (index === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
        });
        context.strokeStyle = "#85a7f7";
        context.lineWidth = 3;
        context.stroke();

        plotted.forEach(point => {
            context.beginPath();
            context.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
            context.fillStyle = "#ffffff";
            context.fill();
        });
    }
}
