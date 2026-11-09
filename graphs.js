
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
                            "% haalt minstens " +
                            context.label + " woorden per minuut";
                    }
                }
            }
        },

        scales: {
            x: {
                type: "linear",

                title: {
                    display: true,
                    text: "Typesnelheid (woorden per minuut)",
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
                    text: "Percentage van de bevolking (%)",
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
const historyCanvas = document.getElementById("run-history-chart");
const historyMessage = document.getElementById("run-history-message");
const historyRows = document.getElementById("run-history-rows");
const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

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

function showRunHistory() {
    let runs;
    try {
        runs = JSON.parse(localStorage.getItem(RUN_HISTORY_KEY) || "[]");
        if (!Array.isArray(runs)) throw new Error("Run history must be an array.");
    } catch (error) {
        console.error("Could not read typing run history:", error);
        historyMessage.textContent = "Saved run history could not be read from this browser.";
        return;
    }

    if (runs.length === 0) {
        historyMessage.textContent = "Complete a typing test to start tracking your progress.";
        return;
    }

    historyMessage.textContent = runs.length + " completed " + (runs.length === 1 ? "run" : "runs");
    const orderedRuns = runs
        .filter(run => run && Number.isFinite(run.wpm) && Number.isFinite(Date.parse(run.date)))
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    if (orderedRuns.length === 0) {
        historyMessage.textContent = "No valid saved runs were found.";
        return;
    }

    new Chart(historyCanvas, {
        type: "line",
        data: {
            labels: orderedRuns.map((run, index) => "Run " + (index + 1)),
            datasets: [{
                label: "Words per minute",
                data: orderedRuns.map(run => run.wpm),
                borderColor: "#85a7f7",
                backgroundColor: "rgba(133, 167, 247, 0.18)",
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: "#ffffff",
                fill: true,
                tension: 0.25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    title: { display: true, text: "Completed run", color: "#D3D3D3" },
                    ticks: { color: "#D3D3D3" },
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

    orderedRuns.slice(-10).reverse().forEach((run, index) => {
        const row = document.createElement("tr");
        const runDate = new Date(run.date);
        const values = [
            "Run " + (orderedRuns.length - index),
            formatRelativeTime(runDate),
            run.wpm,
            run.words,
            run.chars,
            run.language,
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

showRunHistory();
