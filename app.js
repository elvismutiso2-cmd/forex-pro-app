// ----------- NAVIGATION ----------
const sections = document.querySelectorAll("section");
const navButtons = document.querySelectorAll("nav button");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sections.forEach((sec) => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  });
});

// ----------- LIVE FOREX PRICES ----------
const apiURL = "https://api.exchangerate.host/latest?base=USD";

async function fetchLivePrices() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Update prices in the DOM
    document.getElementById("eurusd").textContent = data.rates.EUR.toFixed(4);
    document.getElementById("gbpusd").textContent = data.rates.GBP.toFixed(4);
    document.getElementById("usdjpy").textContent = data.rates.JPY.toFixed(2);
    document.getElementById("usdchf").textContent = data.rates.CHF.toFixed(4);
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

// Refresh prices every 10 seconds
setInterval(fetchLivePrices, 10000);
fetchLivePrices();

// ----------- RISK CALCULATOR ----------
const riskForm = document.getElementById("risk-form");
const riskResult = document.getElementById("risk-result");

riskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const accountBalance = parseFloat(document.getElementById("balance").value);
  const riskPercent = parseFloat(document.getElementById("risk").value);
  const stopLoss = parseFloat(document.getElementById("stoploss").value);

  if (isNaN(accountBalance) || isNaN(riskPercent) || isNaN(stopLoss)) {
    riskResult.textContent = "Please enter valid numbers!";
    return;
  }

  const riskAmount = (accountBalance * riskPercent) / 100;
  const lotSize = riskAmount / stopLoss;

  riskResult.textContent = `Risk: $${riskAmount.toFixed(
    2
  )} | Recommended Lot Size: ${lotSize.toFixed(2)} lots`;
});

// ----------- TRADING JOURNAL ----------
const journalForm = document.getElementById("journal-form");
const journalTable = document.getElementById("journal-body");

journalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const pair = document.getElementById("pair").value;
  const direction = document.getElementById("direction").value;
  const entry = document.getElementById("entry").value;
  const exit = document.getElementById("exit").value;
  const profit = document.getElementById("profit").value;

  // Add new trade to table
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${pair}</td>
        <td>${direction}</td>
        <td>${entry}</td>
        <td>${exit}</td>
        <td>${profit}</td>
    `;
  journalTable.appendChild(newRow);

  // Save to local storage
  const savedTrades = JSON.parse(localStorage.getItem("trades")) || [];
  savedTrades.push({ pair, direction, entry, exit, profit });
  localStorage.setItem("trades", JSON.stringify(savedTrades));

  journalForm.reset();
});

// Load saved trades on page load
window.addEventListener("load", () => {
  const savedTrades = JSON.parse(localStorage.getItem("trades")) || [];
  savedTrades.forEach((trade) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
            <td>${trade.pair}</td>
            <td>${trade.direction}</td>
            <td>${trade.entry}</td>
            <td>${trade.exit}</td>
            <td>${trade.profit}</td>
        `;
    journalTable.appendChild(newRow);
  });
});
