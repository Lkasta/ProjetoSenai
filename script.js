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
  preencheDados();
});


const formulario = document.getElementById("formulario");
const maquina = document.getElementById("maquina");
const temperatura = document.getElementById("temperatura");
const oleo = document.getElementById("oleo");

function preencheDados(){
  var iniciou = false;
  const btnStart = document.getElementById("startButton");
  btnStart.addEventListener("click", function(){
    if(iniciou == false){
      iniciou = true;
    } else {
      iniciou = false;
    }
  });

  while(iniciou){

    var formData = new FormData();
    formData.append("entry.1280111744", exemplo);
    formData.append("entry.257084622", machineTemp);
    formData.append("entry.279965325", oilAmount);

    document.querySelector("form").addEventListener("submit", function(event) {
      event.preventDefault(); // Impede a recarga da página
      fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSeq7RGlbX4XCjcbfhAa3AK2vSxHAUWsbpKVKWYqrZ6xsGoEMg/formResponse?", {
        method: "POST",
        body: formData
      })
      .then(function(response) {
        if (response.status === 200) {
          // A solicitação foi bem-sucedida
          console.log("Solicitação bem-sucedida.");
          // Faça o que precisar aqui após o sucesso da solicitação
        } else {
          // A solicitação não foi bem-sucedida
          console.log("Erro na solicitação.");
        }
      })
      .catch(function(error) {
        console.error("Erro ao enviar a solicitação:", error);
      });
    });

    if(oilAmount == 0){
      iniciou = false;
    }

  }
}