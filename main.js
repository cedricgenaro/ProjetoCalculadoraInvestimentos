import { generateReturnsArray } from './src/investmentGoals.js';
// Importando a bibliotca Charts
import { Chart } from 'chart.js/auto';
// iMPORTANDO A FUNCIONALIDADE DE GERAR TABELA
import { createTable } from './src/table.js';

// const calculateButton = document.getElementById('calculate-results');
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');
// Selecionando os canvas dos gráficos
const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
// Variaveis que iram receber os gráficos
let doughnutChartReference = {};
let progressChartReference = {};

// Objeto necessário para a inteligencia da nossa tabela
const columnsArray = [
  { columnLabel: 'Mês', accessor: 'month' },
  {
    columnLabel: 'Total investido',
    accessor: 'investedAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Rendimento mensal',
    accessor: 'interestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Rendimento total',
    accessor: 'totalInterestReturns',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: 'Quantia Total',
    accessor: 'totalAmount',
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

// Função que formata os valores numéricos para o formato de moeda para a tabela
function formatCurrencyToTable(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função que formata os valores numéricos para os gráficos
//
function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

// Função que irá calcular e gerar todos os gráficos e tabelas

function renderProgressions(evt) {
  evt.preventDefault();
  //Verifica se há algum elemento com a Classe error, se houver ele não executa a função
  if (document.querySelector('.error')) {
    return;
  }

  // Logo antes de renderizar os resultados, resetamos os gráficos
  resetCharts();
  resetTable();
  const startingAmount = Number(
    form['starting-amount'].value.replace(',', '.')
  );
  const additionalContribution = Number(
    document.getElementById('additional-contribution').value.replace(',', '.')
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(
    document.getElementById('return-rate').value.replace(',', '.')
  );
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(
    document.getElementById('tax-rate').value.replace(',', '.')
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  // PARTE DOS GRÁFICOS
  const finalInvestmentObject = returnsArray[returnsArray.length - 1]; // Exibe o ultimo objeto adicionado na lista

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total Investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            // QUANTO INVESTIMOS
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              // Aqui entra o resultado da operação: o quanto o investimento RENDEU
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              //QUANTO PAGAMOS DE IMPOSTO
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 5,
        },
      ],
    },
  });

  // Segundo gráfico
  progressChartReference = new Chart(progressionChart, {
    type: 'bar', // Tipo barra
    data: {
      // Rótulos do eixo x
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      // Configuração das barras
      datasets: [
        {
          // Primeira barra
          label: 'Total Investido',
          // data recebe um array resultado do map
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          //Segunda barra
          label: 'Retorno do Investimento',
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturns)
          ),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
  createTable(columnsArray, returnsArray, 'results-table');
}

// Função que verifica se o objeto está vazio
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// FUNÇÃO PARA RESETAR OS GRÁFICOS
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressChartReference)
  ) {
    doughnutChartReference.destroy();
    progressChartReference.destroy();
  }
}

function resetTable() {
  const table_results = document.getElementById('results-table');
  if (table_results.querySelector('thead')) {
    table_results.innerHTML = '';
  }
}

function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribution'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';
  resetCharts();
  resetTable();
  const errorInputsContainers = document.querySelectorAll('.error');

  for (const errorInputsContainer of errorInputsContainers) {
    errorInputsContainer.classList.remove('error');
    // Pega o elemento avô, procura por uma tag p e a remove
    errorInputsContainer.parentElement.querySelector('p').remove();
  }
}

// Função que irá validar a entrada do usuário.
// A mensagem de erro será exibida, quando o que o usuário digitou, não atendeu a regra do campo. A mensagem irá aparecer assim que o usuário trocar de campo
// Dois eventos precisam ser monitorados o Blur (borrão) - o campo perde o foco- Como os valores do campo ainda não foram submetidos, eles ainda são valores no formato de string, por isso temos que converter.
// Essa função irá validar o campo que está perdendo o foco, e como objeto evento pode ter um parametro com as informações do objeto que acionou o evento, então passamos um parametro
// O evento possui muitas informações dentro dele, que podemos utilizar, um exemplo é o target, ele vai apontar justamente para o objeto que disparou o evento. como objeto estando selecionado podemos estar pegando o valor que ele possui e fazer algumas validações
function validateInput(evt) {
  // Não exxecuta nada em casa de campo vazio
  if (evt.target.value === '') {
    return;
  }
  // Criamos uma referencia ao elemento Pai e o elemento avô
  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;

  // Pegamos o valor do objeto que acionou o evento blur
  const inputValue = evt.target.value.replace(',', '.');

  // Verificamos se a informação digitada não é um número ou se o valor é negativo
  if (
    (isNaN(inputValue) || Number(inputValue) <= 0) &&
    !parentElement.classList.contains('error') //!parentElement.classList.contains('error') só vai marcar como erro somente se o campo ainda não foi marcado como erro
  ) {
    // Criamos o elemento da mensagem de erro
    const errorTextElement = document.createElement('p');
    errorTextElement.classList.add('text-red-500');
    errorTextElement.innerText = 'Insira um valor numérico e maior que zero';

    // Pinta a borda do campo de texto em vermelho
    parentElement.classList.add('error');

    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains('error') &&
    (!isNaN(inputValue) || inputValue > 0)
  ) {
    parentElement.classList.remove('error');
    grandParentElement.querySelector('p').remove();
  }
}

// vamos acessar cada campo do nosso formulário através da lista de objetos
for (const formElement of form) {
  // Validamos se o campo atual deve ser validado ou não
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validateInput);
  }
}

// INTELIGENCIA DO CARROSSEL
// A TAG MAIN É A QUE ENGLOBA AS DUAS SECTIONS A DOS GRÁFICOS E A DA TABELA, QUANDO ACIONAR O BOTÃO DE AVANÇAR A SECTION DA TABELA DEVE SER EXIBIDA

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

nextButton.addEventListener('click', () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener('click', () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener('submit', renderProgressions);
clearFormButton.addEventListener('click', clearForm);
// calculateButton.addEventListener('click', renderProgressions);
