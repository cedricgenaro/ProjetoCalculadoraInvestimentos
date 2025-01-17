// Quando criamos uma função temos que deixa-la bem robusta, ou seja que ela seja capaz de auto se reolver, pois as vezes o usuário pode deixar algum campo em branco, ou colocar alguma letra em um campo numérico.

// Função responsável por converter uma taxa anual para mensal, pois vamos trabalhar como sendo mensal então temos que converter todos para a mesma base
function convertToMontlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

// Função responsavel de gerar uma lista com o retorno do rendimento dos investimentos
function generateReturnsArray(
  startingAmount = 0, // investimento inicial
  timeHorizon = 0, // numero do periodo
  timePeriod = 'monthly', // Anual ou mensal
  monthlyContribution = 0, // Aportes adicionais
  returnRate = 0, // taxa de retorno
  returnTimeFrame = 'monthly' // unidade mensal ou anual
) {
  // Como iniciamos essas variaveis com 0 (0 é falsy logo é falso) por isso usamos o operador not, para inverter. se é falsy se torna verdadeiro
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      'Investimento inicial e prazo devem ser preenchidos com valores positivos'
    );
  }

  const finalReturnRate =
    returnTimeFrame == 'monthly'
      ? 1 + returnRate / 100 // Convertemos o percentual
      : convertToMontlyReturnRate(1 + returnRate / 100);

  // Como vamos trabalhar considerando tudo periodo mensal, temos que converter para meses caso seja informado o periodo em anos
  const finalTimeHorizon =
    timePeriod == 'monthly' ? timeHorizon : timeHorizon * 12;

  const referenceInvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0, // retorno de juros do ultimo mês
    totalInterestReturns: 0, // Informa o retorno total deis do primeiro mês até o atual
    month: 0, // Retorna a quantidade de meses que já se passaram
    totalAmount: startingAmount, // A soma de tudo que já investi mais o retorno total
  };

  // O array irá armazenar inicialmente o primeiro objeto
  const returnsArray = [referenceInvestmentObject];
  for (let timeReference; timeReference <= finalTimeHorizon; timeReference++) {
    // pega o valor do ultimo objeto criado no array * a taxa convertida + valor de aporte ao termino de cada iteração
    const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      monthlyContribution;
    // Quanto rendeu no mes atual da iteração - pegou o valor total que tinha no mês passado * a taxa de rendimento
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate;
    // Quanto que já investi - quantia inicial + aporte do mês * a quantidade de meses que se passaram
    const investedAmount = startingAmount + monthlyContribution * timeReference;
    // Total de rendimento do primeiro mês ao atual - pegando o valor total que tenho mais os rendimentos - o total já investido
    const totalInterestReturns = totalAmount - investedAmount;

    // Adicionamos um novo objeto a cada interação atualizando os dados
    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }
  return returnsArray;
}
