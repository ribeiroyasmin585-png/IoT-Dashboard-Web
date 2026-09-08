/* =====================================================
NAVEGAÇÃO ENTRE AS PÁGINAS
===================================================== */

const btnSobre = document.getElementById("btnSobre");
const btnDashboard = document.getElementById("btnDashboard");

const paginaSobre = document.getElementById("sobre");
const paginaDashboard = document.getElementById("dashboard");

btnSobre.addEventListener("click", function () {

    paginaSobre.classList.add("ativa");
    paginaDashboard.classList.remove("ativa");

    btnSobre.classList.add("ativo");
    btnDashboard.classList.remove("ativo");

});

btnDashboard.addEventListener("click", function () {

    paginaDashboard.classList.add("ativa");
    paginaSobre.classList.remove("ativa");

    btnDashboard.classList.add("ativo");
    btnSobre.classList.remove("ativo");

});


/* =====================================================
LOCAL STORAGE
===================================================== */

// Senha fornecida pelo professor para o Grupo 4
const senhaGrupo = "grupo";

// Salva a senha no LocalStorage
localStorage.setItem("senhaGrupo", senhaGrupo);


/* =====================================================
CONFIGURAÇÃO MQTT
===================================================== */

// IP do computador onde o Mosquitto está instalado
const MQTT_HOST = "192.168.0.100";

// Porta WebSocket do Mosquitto
const MQTT_PORT = 9001;

// Client ID aleatório para evitar conflitos
const CLIENT_ID =
    "Dashboard_" + Math.random().toString(16).substring(2, 10);


/* =====================================================
TÓPICOS MQTT
===================================================== */

const TOPICO_TEMPERATURA =
    "aulas/professortupi/temperatura";

const TOPICO_UMIDADE =
    "aulas/professortupi/umidade";

const TOPICO_AR =
    "aulas/professortupi/qualidade_ar";


/* =====================================================
ELEMENTOS DO HTML
===================================================== */

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


/* =====================================================
CRIAÇÃO DO CLIENTE MQTT
===================================================== */

const client = new Paho.MQTT.Client(
    MQTT_HOST,
    Number(MQTT_PORT),
    CLIENT_ID
);


/* =====================================================
QUANDO A CONEXÃO FOR PERDIDA
===================================================== */

client.onConnectionLost = function (responseObject) {

    statusElemento.textContent =
        "🔴 MQTT: Desconectado";

    statusElemento.classList.remove("conectado");
    statusElemento.classList.add("desconectado");

    console.log("Conexão MQTT perdida.");

};


/* =====================================================
RECEBER MENSAGENS MQTT
===================================================== */

client.onMessageArrived = function (message) {

    console.log(
        "Mensagem recebida:",
        message.destinationName,
        message.payloadString
    );

    const valor = Number(message.payloadString);


    /* ================= TEMPERATURA ================= */

    if (
        message.destinationName ===
        TOPICO_TEMPERATURA
    ) {

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


    /* ================= UMIDADE ================= */

    if (
        message.destinationName ===
        TOPICO_UMIDADE
    ) {

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


    /* ================= QUALIDADE DO AR ================= */

    if (
        message.destinationName ===
        TOPICO_AR
    ) {

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


/* =====================================================
CONECTAR AO MOSQUITTO
===================================================== */

function conectarMQTT() {

    statusElemento.textContent =
        "🟡 MQTT: Conectando...";


    client.connect({

        useSSL: false,

        timeout: 5,

        onSuccess: function () {

            console.log("MQTT conectado!");

            statusElemento.textContent =
                "🟢 MQTT: Conectado";

            statusElemento.classList.remove(
                "desconectado"
            );

            statusElemento.classList.add(
                "conectado"
            );


            /* ================================
               ASSINAR OS TÓPICOS
            ================================= */

            client.subscribe(
                TOPICO_TEMPERATURA
            );

            client.subscribe(
                TOPICO_UMIDADE
            );

            client.subscribe(
                TOPICO_AR
            );

            console.log(
                "Tópicos MQTT assinados."
            );

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


/* =====================================================
INICIAR SISTEMA
===================================================== */

conectarMQTT();