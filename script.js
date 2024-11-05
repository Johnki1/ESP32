// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAbOfZlaYVg2HoUXg7XQADzO-UytM9hoXg",
    authDomain: "monitor-de-calidad-de-aire.firebaseapp.com",
    databaseURL: "https://monitor-de-calidad-de-aire-default-rtdb.firebaseio.com",
    projectId: "monitor-de-calidad-de-aire",
    storageBucket: "monitor-de-calidad-de-aire.firebasestorage.app",
    messagingSenderId: "179504951046",
    appId: "1:179504951046:web:a4167082141a2783593887",
    measurementId: "G-JJKB0Y1Q89"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref("datos_aire/lectura_actual");

// Elementos de la interfaz
const aqiValue = document.getElementById("aqi-value");
const co2Value = document.getElementById("co2-value");
const no2Value = document.getElementById("no2-value");
const estadoValue = document.getElementById("estado-value");

// Configura el gráfico
let chart;
function createChart() {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: "AQI",
                    borderColor: "#0073e6",
                    backgroundColor: "rgba(0, 115, 230, 0.1)",
                    fill: true,
                    data: []
                },
                {
                    label: "CO₂ (%)",
                    borderColor: "#fcba03",
                    backgroundColor: "rgba(252, 186, 3, 0.1)",
                    fill: true,
                    data: []
                },
                {
                    label: "NO₂ (%)",
                    borderColor: "#e63946",
                    backgroundColor: "rgba(230, 57, 70, 0.1)",
                    fill: true,
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: "Tiempo" }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Valores" }
                }
            }
        }
    });
}

// Actualiza la UI y el gráfico en tiempo real
dbRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const { AQI, CO2, NO2, Estado } = data;

        // Actualizar valores en la interfaz
        aqiValue.textContent = AQI || "-";
        co2Value.textContent = `${CO2 || "-"}%`;
        no2Value.textContent = `${NO2 || "-"}%`;
        estadoValue.textContent = Estado || "-";

        // Agregar datos al gráfico
        const timestamp = new Date().toLocaleTimeString();
        if (chart.data.labels.length >= 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
            chart.data.datasets[2].data.shift();
        }
        chart.data.labels.push(timestamp);
        chart.data.datasets[0].data.push(AQI);
        chart.data.datasets[1].data.push(CO2);
        chart.data.datasets[2].data.push(NO2);
        chart.update();
    }
});

// Inicializa el gráfico
createChart();
