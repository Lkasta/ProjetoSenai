document.addEventListener("DOMContentLoaded", function () {
  const machineTempDisplay = document.getElementById("machineTemp");
  const startButton = document.getElementById("startButton");
  const fillOilButton = document.getElementById("fillOilButton");
  const oilProgress = document.getElementById("oilProgress");
  const temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperatura (°C)',
        data: [],
        borderColor: 'red',
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          display: false
        },
        y: {
          beginAtZero: true,
          max: 130
        }
      }
    }
  });

  let machineTemp = 25;
  let oilAmount = 100;
  let isProducing = false;
  let productionInterval;

  function updateDisplays() {
    machineTempDisplay.textContent = machineTemp + "°C";
    oilProgress.style.width = oilAmount + "%";

    if (oilAmount <= 20) {
      oilProgress.style.backgroundColor = "red";
    } else if (oilAmount > 20 && oilAmount <= 50) {
      oilProgress.style.backgroundColor = "yellow";
    } else {
      oilProgress.style.backgroundColor = "green";
    }

     temperatureChart.data.labels.push('');
  temperatureChart.data.datasets[0].data.push(machineTemp);

  // Limita o gráfico a mostrar apenas os últimos 13 valores
  if (temperatureChart.data.labels.length > 13) {
    temperatureChart.data.labels.shift();
    temperatureChart.data.datasets[0].data.shift();
  }

  // Atualiza o gráfico
  temperatureChart.update();
  }

  function startProduction() {
    if (!isProducing) {
      isProducing = true;
      startButton.textContent = "Parar";
      startButton.style.backgroundColor = "red";
      productionInterval = setInterval(() => {
        if (machineTemp > 30) {
          machineTemp -= 2;
        }

        if (oilAmount <= 0) {
          stopProduction();
          alert("Máquina sem óleo. Produção interrompida.");
        }

        machineTemp += 5;
        oilAmount -= 5;
        updateDisplays();

        if (machineTemp >= 120) {
          stopProduction();
          alert("Máquina atingiu 120°C. Produção interrompida.");
        }
      }, 1000);
    } else {
      stopProduction();
    }
  }

  function stopProduction() {
    isProducing = false;
    clearInterval(productionInterval);
    startButton.textContent = "Iniciar";
    startButton.style.backgroundColor = "";
  }

  fillOilButton.addEventListener("click", function () {
    if (!isProducing && oilAmount < 100) {
      const fillInterval = setInterval(() => {
        oilAmount += 10;
        if (oilAmount >= 100) {
          clearInterval(fillInterval);
        }
        updateDisplays();
      }, 1000);
    }
  });

  function decreaseTemperature() {
    if (!isProducing && machineTemp > 30) {
      machineTemp -= 5;
      updateDisplays();
    }
  }

  // Chama a função para diminuir a temperatura a cada 4 segundos
  setInterval(decreaseTemperature, 4000);

  startButton.addEventListener("click", startProduction);
  updateDisplays();
});