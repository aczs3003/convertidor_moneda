// Tu API Key de Exchange Rate API
const apiKey = "a03f19ed54efb6ca4aa3a703";

// Elementos del DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');

// Función para obtener las tasas de cambio
async function obtenerTasaCambio(fromCurrency, toCurrency) {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.result === "success") {
            return data.conversion_rate;
        } else {
            throw new Error("Error al obtener la tasa de cambio.");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para convertir la moneda
async function convertirMoneda() {
    const amount = parseFloat(amountInput.value.replace(',', '.')); // Asegúrate de manejar la coma como separador decimal
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = "Por favor, ingresa una cantidad válida.";
        return;
    }

    const tasaCambio = await obtenerTasaCambio(fromCurrency, toCurrency);

    if (tasaCambio) {
        const resultado = (amount * tasaCambio).toFixed(2);
        resultDiv.innerHTML = `${amount.toFixed(2)} ${fromCurrency} son ${resultado} ${toCurrency}.`;
    } else {
        resultDiv.innerHTML = "No se pudo obtener la tasa de cambio. Intenta de nuevo.";
    }
}

// Evento para el botón de convertir
convertBtn.addEventListener('click', convertirMoneda);

// Formateo del campo de entrada
amountInput.addEventListener('input', function() {
    let value = amountInput.value;
    value = value.replace(/[^0-9,.]/g, ''); // Solo permite números, comas y puntos
    const parts = value.split(/[,\.]/);
    
    // Limita a dos decimales
    if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2); // Mantener solo dos decimales
    }
    
    // Reconstruye el valor
    amountInput.value = parts.join('.');
});
