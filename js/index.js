/* =========================
LOCAL STORAGE
========================= */

const senhaGrupo = "grupo";

const grupo = [
    "Marina",
    "Paloma",
    "Nicole",
    "Raphaela",
    "Yasmin"
];

localStorage.setItem("grupo", JSON.stringify(grupo));


/* =========================
CONFIGURAÇÃO MQTT
========================= */

const MQTT_HOST = "10.136.42.63";
const MQTT_PORT = 9001;

const CLIENT_ID =
    "Dashboard_" + Math.random().toString(16).substring(2, 10);


/* =========================
TÓPICOS MQTT
========================= */


const TOPICO_TEMPERATURA =
    "aulas/grupo4Yasmin/temperatura";

const TOPICO_UMIDADE =
    "aulas/grupo4Yasmin/umidade";

const TOPICO_AR =
    "aulas/grupo4Yasmin/qualidade_ar";


/* =========================
ELEMENTOS
========================= */

const temperaturaElemento =
    document.getElementById("temperatura");

const umidadeElemento =
    document.getElementById("umidade");

const qualidadeArElemento =
    document.getElementById("qualidadeAr");

const alertaTemperatura =
    document.getElementById("alertaTemperatura");

const alertaUmidade =
    document.getElementById("alertaUmidade");

const alertaAr =
    document.getElementById("alertaAr");

const statusElemento =
    document.getElementById("status");


/* =========================
CLIENTE MQTT
========================= */

const client = new Paho.MQTT.Client(
    MQTT_HOST,
    Number(MQTT_PORT),
    CLIENT_ID
);


/* =========================
CONEXÃO PERDIDA
========================= */

client.onConnectionLost = function () {

    statusElemento.textContent =
        "🔴 MQTT: Desconectado";

    statusElemento.classList.remove("conectado");
    statusElemento.classList.add("desconectado");

};


/* =========================
RECEBER MENSAGENS
========================= */

client.onMessageArrived = function (message) {

    const valor = Number(message.payloadString);


    if (message.destinationName === TOPICO_TEMPERATURA) {

        temperaturaElemento.textContent =
            valor.toFixed(1) + " °C";

        if (valor > 28) {

            alertaTemperatura.textContent =
                "⚠️ ALERTA: Temperatura alta";

        } else {

            alertaTemperatura.textContent =
                "✅ Temperatura normal";

        }
    }


    if (message.destinationName === TOPICO_UMIDADE) {

        umidadeElemento.textContent =
            valor.toFixed(0) + " %";

        if (valor > 56) {

            alertaUmidade.textContent =
                "⚠️ ALERTA: Umidade alta";

        } else {

            alertaUmidade.textContent =
                "✅ Umidade normal";

        }
    }


    if (message.destinationName === TOPICO_AR) {

        qualidadeArElemento.textContent =
            valor.toFixed(0);

        if (valor > 400) {

            alertaAr.textContent =
                "⚠️ ALERTA: Qualidade do ar";

        } else {

            alertaAr.textContent =
                "✅ Qualidade do ar normal";

        }
    }

};


/* =========================
CONECTAR MQTT
========================= */

function conectarMQTT() {

    statusElemento.textContent =
        "🟡 MQTT: Conectando...";


    client.connect({

        useSSL: false,

        timeout: 5,

        onSuccess: function () {

            statusElemento.textContent =
                "🟢 MQTT: Conectado";

            statusElemento.classList.remove(
                "desconectado"
            );

            statusElemento.classList.add(
                "conectado"
            );


            client.subscribe(
                TOPICO_TEMPERATURA
            );

            client.subscribe(
                TOPICO_UMIDADE
            );

            client.subscribe(
                TOPICO_AR
            );

            console.log("MQTT conectado!");

        },


        onFailure: function (error) {

            console.error(
                "Erro MQTT:",
                error
            );

            statusElemento.textContent =
                "🔴 MQTT: Erro na conexão";

            statusElemento.classList.remove(
                "conectado"
            );

            statusElemento.classList.add(
                "desconectado"
            );

        }

    });

}


/* =========================
INICIAR
========================= */

conectarMQTT();