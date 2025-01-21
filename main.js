import { generateReturnsArray } from './src/investmentGoals.js';

// const calculateButton = document.getElementById('calculate-results');
const form = document.getElementById('investment-form');

// Função que irá calcular e gerar todos os gráficos e tabelas

function renderProgressions(evt) {
  evt.preventDefault();
  const startingAmount = Number(form['starting-amount'].value);
  const additionalContribution = Number(
    document.getElementById('additional-contribution').value
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(document.getElementById('return-rate').value);
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(document.getElementById('tax-rate').value);

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

form.addEventListener('submit', renderProgressions);
// calculateButton.addEventListener('click', renderProgressions);
