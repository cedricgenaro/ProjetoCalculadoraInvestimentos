import { generateReturnsArray } from './src/investmentGoals.js';
// Importando a bibliotca Charts
import { Chart } from 'chart.js/auto';

// const calculateButton = document.getElementById('calculate-results');
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');
// Selecionando os canvas dos gráficos
const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
// Função que irá calcular e gerar todos os gráficos e tabelas

function renderProgressions(evt) {
  evt.preventDefault();
  //Verifica se há algum elemento com a Classe error, se houver ele não executa a função
  if (document.querySelector('.error')) {
    return;
  }
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

  new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  });
}

function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribution'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

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
form.addEventListener('submit', renderProgressions);
clearFormButton.addEventListener('click', clearForm);
// calculateButton.addEventListener('click', renderProgressions);
