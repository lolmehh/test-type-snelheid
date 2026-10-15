const barColors = ["#26597D", "#2C7C8E", "#319E9F", "#2F8EB2", "#2C7DC5"];
const aantal_personen = [4, 5, 10, 6, 3];
const ts = [1, 2, 3, 4, 5];
const avg_ts = document.getElementById('ts_chart');

new Chart(avg_ts, {
    type: "bar",
    data: {
        labels: ts,
        datasets: [{
            backgroundColor: barColors,
            data: aantal_personen
        }]
    },
});