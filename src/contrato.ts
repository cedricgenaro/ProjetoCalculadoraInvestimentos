// contrato

// 1 - Sistema deve usar o Tailwindcss
// 2 - Sistema deve ter um elemento html do tipo Table (com id definido) preparado e sem informações dentro
// 3 - São necessários dois arrays para a geração da tabela
// 3.1 - Um Array de dados
// 3.2 - Um array com objetos que caracterizam as colunas
// 3.3 - Não é necessário, mas pode-se passar uma função de formatação dos dados daquela coluna

type columnObject = {
  columnLabel: string,
  accessor: string,
  formatFN?: (info: number | string) => string,
};

type columnsArray = columnObject[];

//Exemplo de objeto inteligente que atende os requisitos
[
  { columnLabel: 'Total investido', accessor: 'investedAmount' },
  { columnLabel: 'Rendimento mensal', accessor: 'interestReturns' },
  { columnLabel: 'Rendimento total', accessor: 'totalInterestReturns' },
  { columnLabel: 'Mês', accessor: 'month' },
  { columnLabel: 'Quantia Total', accessor: 'totalAmount' },
];
