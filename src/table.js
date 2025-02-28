// Verificar se o elemento que a função vai receber como parametro, se ele é um array e se não está vazio
const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) || arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
  // Passamos os elementos Array como parametro para verificar se é um array e se não está vazio.
  // Como a função retorna false para é um array ou para tamanho > 0, temos que usar o operador de inversão
  if (
    !isNonEmptyArray(columnsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    throw new Error(
      'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também do id do elemento tabela selecionado'
    );
  }

  // Agora através do tableId, capituramos o objeto table do html
  const tableElement = document.getElementById(tableId);
  // O teste if verifica se foi possivel selecionar o elemento e se ele se trata de um objeto table
  if (!tableElement || tableElement.nodeName !== 'TABLE') {
    throw new Error('Id informado não corresponde a nenhum elemento table');
  }

  createTableHeader(tableElement, columnsArray);
  createTableBody(tableElement, dataArray, columnsArray);
};

// Função responsável por gerar o cabeçalho da tabela de forma dinamica
function createTableHeader(tableReference, columnsArray) {
  /* <table></table> || 
      <table>
        <thead></thead>
        <tbody></tbody>
      </table> */
  function createTheadElement(tableReference) {
    const thead = document.createElement('thead'); // <thead></thead>
    tableReference.appendChild(thead); // <table><thead></thead></table>
    return thead;
  }

  const tableHeaderReference =
    tableReference.querySelector('thead') ?? createTheadElement(tableReference);
  // <table><thead></thead></table>
  const headerRow = document.createElement('tr'); // <tr></tr>
  ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) =>
    headerRow.classList.add(cssClass)
  );
  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class='text-center'>${tableColumnObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement;
  }
  // <tr><th class='text-center'>NomeDaColuna</th><th class='text-center'>NomeDaColuna</th></tr>
  tableHeaderReference.appendChild(headerRow);
}
function createTableBody(tableReference, tableItems, columnsArray) {
  // FUNÇÃO ACESSORA QUE GERA A TAG TBODY
  function createTbodyElement(tableReference) {
    const tbody = document.createElement('tbody');
    return tableReference.appendChild(tbody);
  }

  // A VARIAVEL RECEBE DOIS VALORES PARA CASO O PRIMEIRO SEJA FALSO RECEBE O SEGUNDO
  const tableBodyReference =
    tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

  // Laço abaixo cria as linhas
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    //
    const tableRow = document.createElement('tr');
    // FORMATAMOS AS CORES ALTERNADAS
    if (itemIndex % 2 !== 0) {
      tableRow.classList.add('bg-blue-200');
    }

    // Agora que temos a linha, temos que colocar cada um dos dados em suas respectivas colunas
    for (const tableColumn of columnsArray) {
      // a VARIAVEL formatFn recebe a função que vem lá da main, com isso conseguimos estar utilizando no arquivo table
      const formatFn = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class='text-center'>${formatFn(
        tableItem[tableColumn.accessor]
      )}</td>`;
    }
    tableBodyReference.appendChild(tableRow);
  }
}
