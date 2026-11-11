
const typingSpeeds = [20, 30, 40, 50, 60, 70, 80];

const populationPercentages = [90, 75, 55, 35, 20, 10, 5];

const ctx = document.getElementById("ts_chart");

new Chart(ctx, {
    type: "line",

    data: {
        labels: typingSpeeds,

        datasets: [{
            label: "Percentage van de bevolking",
            data: populationPercentages,

            borderColor: "#319E9F",
            backgroundColor: "rgba(49, 158, 159, 0.18)",

            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,

            pointBackgroundColor: "#2C7DC5",
            pointBorderColor: "#FFFFFF",

            fill: true,
            tension: 0.3
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.parsed.y +
                            "% achieve at least " +
                            context.label + " words per minute";
                    }
                }
            }
        },

        scales: {
            x: {
                type: "linear",

                title: {
                    display: true,
                    text: "Typing speed (words per minute)",
                    color: "#D3D3D3",
                    font: {
                        size: 14
                    }
                },

                min: 20,
                max: 80,

                ticks: {
                    stepSize: 10,
                    color: "#D3D3D3"
                },

                grid: {
                    color: "rgba(255, 255, 255, 0.12)"
                }
            },

            y: {
                min: 0,
                max: 100,

                title: {
                    display: true,
                    text: "Percentage of the population (%)",
                    color: "#D3D3D3",
                    font: {
                        size: 14
                    }
                },

                ticks: {
                    stepSize: 10,
                    color: "#D3D3D3",
                    callback: function(value) {
                        return value + "%";
                    }
                },

                grid: {
                    color: "rgba(255, 255, 255, 0.12)"
                }
            }
        }
    }
});

const RUN_HISTORY_KEY = "typingTestRuns";
const historyMessage = document.getElementById("run-history-message");
const historySorts = {
    nl: document.getElementById("run-history-sort-nl"),
    en: document.getElementById("run-history-sort-en")
};
const clearHistoryButton = document.getElementById("clear-run-history");
const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const difficultyColors = ["#55c1a7", "#5b9bd5", "#f2c14e", "#ed8b5a", "#d66ba0"];
const verificationRunDates = new Set([
    "2026-11-09T23:25:11.359Z",
    "2026-11-09T23:25:52.762Z"
]);
let orderedRuns = [];

function colorWithOpacity(hexColor, opacity) {
    const color = hexColor.slice(1);
    const red = parseInt(color.slice(0, 2), 16);
    const green = parseInt(color.slice(2, 4), 16);
    const blue = parseInt(color.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

const overlappingDifficultyPoints = {
    id: "overlappingDifficultyPoints",
    afterDatasetsDraw(chart) {
        const pointsByPosition = new Map();
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (meta.hidden || !chart.isDatasetVisible(datasetIndex)) return;

            meta.data.forEach(element => {
                const { x, y } = element.getProps(["x", "y"], true);
                const position = `${Math.round(x)},${Math.round(y)}`;
                const points = pointsByPosition.get(position) || [];
                points.push({
                    x,
                    y,
                    color: dataset.difficultyColor,
                    opacity: chart.$highlightedDatasetIndex === null ||
                        chart.$highlightedDatasetIndex === undefined ||
                        chart.$highlightedDatasetIndex === datasetIndex ? 1 : 0.3
                });
                pointsByPosition.set(position, points);
            });
        });

        const context = chart.ctx;
        pointsByPosition.forEach(points => {
            if (points.length < 2) return;
            const { x, y } = points[0];
            const radius = 8;
            context.save();
            points.forEach((point, index) => {
                const startAngle = -Math.PI / 2 + index * Math.PI * 2 / points.length;
                const endAngle = -Math.PI / 2 + (index + 1) * Math.PI * 2 / points.length;
                context.beginPath();
                context.moveTo(x, y);
                context.arc(x, y, radius, startAngle, endAngle);
                context.closePath();
                context.fillStyle = colorWithOpacity(point.color, point.opacity);
                context.fill();
                context.strokeStyle = "rgba(255, 255, 255, 0.9)";
                context.lineWidth = 1;
                context.stroke();
            });
            context.restore();
        });
    }
};

function formatRelativeTime(date) {
    const secondsAgo = (Date.now() - date.getTime()) / 1000;
    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1]
    ];
    const [unit, unitSeconds] = units.find(([, seconds]) => Math.abs(secondsAgo) >= seconds) || units[units.length - 1];
    return relativeTimeFormatter.format(-Math.round(secondsAgo / unitSeconds), unit);
}

function renderLanguageChart(language, canvasId) {
    const languageRuns = orderedRuns.filter(run => run.language === language);
    const chartCanvas = document.getElementById(canvasId);
    const datasets = difficultyColors
        .map((color, difficulty) => ({
            label: "Difficulty " + difficulty,
            runs: languageRuns.filter(run => Number(run.difficulty) === difficulty),
            color
        }))
        .filter(dataset => dataset.runs.length > 0)
        .map(dataset => ({
            label: dataset.label,
            data: dataset.runs.map((run, index) => ({ x: index + 1, y: run.wpm })),
            difficultyColor: dataset.color,
            borderColor: dataset.color,
            backgroundColor: dataset.color,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: dataset.color,
            fill: false,
            tension: 0.25
        }));

    new Chart(chartCanvas, {
        type: "line",
        data: {
            datasets
        },
        plugins: [overlappingDifficultyPoints],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: "#D3D3D3" },
                    onClick(event, item, legend) {
                        const chart = legend.chart;
                        chart.$highlightedDatasetIndex =
                            chart.$highlightedDatasetIndex === item.datasetIndex ? null : item.datasetIndex;
                        updateHighlightedCurve(chart);
                    }
                },
                tooltip: {
                    callbacks: {
                        title(items) {
                            return items.length ? `${items[0].dataset.label}, run ${items[0].parsed.x}` : "";
                        },
                        label(item) {
                            return `${item.parsed.y} WPM`;
                        }
                    }
                }
            },
            onClick(event, _elements, chart) {
                const points = chart.getElementsAtEventForMode(
                    event,
                    "nearest",
                    { intersect: false },
                    false
                );
                if (!points.length) return;

                const datasetIndex = points[0].datasetIndex;
                chart.$highlightedDatasetIndex =
                    chart.$highlightedDatasetIndex === datasetIndex ? null : datasetIndex;
                updateHighlightedCurve(chart);
            },
            scales: {
                x: {
                    type: "linear",
                    title: { display: true, text: "Run number within difficulty", color: "#D3D3D3" },
                    ticks: { color: "#D3D3D3", precision: 0 },
                    grid: { color: "rgba(255, 255, 255, 0.12)" }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Words per minute", color: "#D3D3D3" },
                    ticks: { color: "#D3D3D3" },
                    grid: { color: "rgba(255, 255, 255, 0.12)" }
                }
            }
        }
    });
}

function updateHighlightedCurve(chart) {
    chart.data.datasets.forEach((dataset, datasetIndex) => {
        const opacity = chart.$highlightedDatasetIndex === null ||
            chart.$highlightedDatasetIndex === undefined ||
            chart.$highlightedDatasetIndex === datasetIndex ? 1 : 0.3;
        dataset.borderColor = colorWithOpacity(dataset.difficultyColor, opacity);
        dataset.backgroundColor = colorWithOpacity(dataset.difficultyColor, opacity);
        dataset.pointBackgroundColor = colorWithOpacity(dataset.difficultyColor, opacity);
    });
    chart.update();
}

function renderRunHistoryTable(language) {
    const sortMode = historySorts[language].value;
    const historyRows = document.getElementById("run-history-rows-" + language);
    const sortedRuns = orderedRuns.filter(run => run.language === language);
    const completedRunsLabel = document.getElementById("completed-runs-" + language);
    completedRunsLabel.textContent = `${sortedRuns.length} completed ${sortedRuns.length === 1 ? "run" : "runs"}`;
    sortedRuns.sort((a, b) => {
        const byDate = Date.parse(a.date) - Date.parse(b.date);
        const byDifficulty = Number(a.difficulty) - Number(b.difficulty);
        if (sortMode === "recent-asc") return byDate;
        if (sortMode === "difficulty-asc") return byDifficulty || -byDate;
        if (sortMode === "difficulty-desc") return byDifficulty * -1 || -byDate;
        return -byDate;
    });

    historyRows.replaceChildren();
    sortedRuns.forEach(run => {
        const row = document.createElement("tr");
        const runDate = new Date(run.date);
        const values = [
            "Run " + run.runNumber,
            formatRelativeTime(runDate),
            run.wpm,
            run.words,
            run.chars,
            run.difficulty
        ];
        values.forEach((value, valueIndex) => {
            const cell = document.createElement("td");
            if (valueIndex === 1) {
                const time = document.createElement("time");
                time.dateTime = runDate.toISOString();
                time.title = runDate.toLocaleString();
                time.textContent = String(value);
                cell.append(time);
            } else {
                cell.textContent = String(value ?? "--");
            }
            row.append(cell);
        });
        historyRows.append(row);
    });
}

function showRunHistory() {
    let runs;
    try {
        runs = JSON.parse(localStorage.getItem(RUN_HISTORY_KEY) || "[]");
        if (!Array.isArray(runs)) throw new Error("Run history must be an array.");
        const cleanedRuns = runs.filter(run =>
            !run || !verificationRunDates.has(run.date)
        );
        if (cleanedRuns.length !== runs.length) {
            localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(cleanedRuns));
            runs = cleanedRuns;
        }
    } catch (error) {
        console.error("Could not load or clean typing run history:", error);
        historyMessage.textContent = "Saved run history could not be loaded from this browser.";
        return;
    }

    orderedRuns = runs
        .filter(run => run && Number.isFinite(run.wpm) && Number.isFinite(Date.parse(run.date)))
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        .map((run, index) => ({ ...run, runNumber: index + 1 }));

    historyMessage.hidden = orderedRuns.length > 0;
    historyMessage.textContent = orderedRuns.length
        ? ""
        : "Complete a typing test to start tracking your progress.";

    renderLanguageChart("nl", "run-history-chart-nl");
    renderLanguageChart("en", "run-history-chart-en");
    renderRunHistoryTable("nl");
    renderRunHistoryTable("en");
}

clearHistoryButton.addEventListener("click", () => {
    if (!window.confirm("Clear all saved typing runs? This cannot be undone.")) return;

    try {
        localStorage.removeItem(RUN_HISTORY_KEY);
    } catch (error) {
        console.error("Could not clear typing run history:", error);
        historyMessage.hidden = false;
        historyMessage.textContent = "Saved run history could not be cleared.";
        return;
    }

    orderedRuns = [];
    document.querySelectorAll("#run-history-chart-nl, #run-history-chart-en").forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) chart.destroy();
    });
    historyMessage.hidden = false;
    historyMessage.textContent = "Run history cleared.";
    renderLanguageChart("nl", "run-history-chart-nl");
    renderLanguageChart("en", "run-history-chart-en");
    renderRunHistoryTable("nl");
    renderRunHistoryTable("en");
});

Object.entries(historySorts).forEach(([language, sortSelect]) => {
    sortSelect.addEventListener("change", () => renderRunHistoryTable(language));
});
showRunHistory();
