
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
