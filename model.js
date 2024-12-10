import * as Algo from './algo.js';

const form = document.getElementById('input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const word = document.getElementById('word').value
    .replace(/\s+/g, '').toLowerCase();
  const text = document.getElementById('text').value
    .replace(/\s+/g, '').toLowerCase();
  const choice = document.getElementById('algo').value;
  const res = 'display-response';
  const aux = 'dispay-auxilary-tables';
  let algo_aux, algo;

  switch (choice) {
    case 'mp':
      algo_aux = [[word + ' ', Algo.bon_pref, 'bon-pref']];
      algo = Algo.morris_pratt;
      break;
    case 'kmp':
      algo_aux = [[word + ' ', Algo.meil_pref, 'meil-pref']];
      algo = Algo.knuth_morris_pratt;
      break;
    case 'bm':
      algo_aux = [[word, Algo.bon_suff, 'bon-suff'], 
        [word, Algo.suffixes, 'suff'],
        [[... supprimerDoublonsConsecutifs(word), 'Autre'], (x, m) => {
        return [... Algo.dern_occ(x, m).filter((v) => v != m), m]}, 'dern-occ']];
      algo = Algo.boyer_moore;
      break;
    case 'h':
      algo_aux = [
        [[... Array.from(supprimerDoublonsConsecutifs(word.slice(0, -1))).sort(), 'Autre'], 
        (x, m) => { return [... Algo.dern_occ(x, m).filter((v) => v != m), m]}, 
        'dern-occ']
      ];
      algo = Algo.horspool;
      break;
    case 'q':
      algo_aux = [
        [[... Array.from(supprimerDoublonsConsecutifs(word)).sort(), 'Autre'], 
        (x, m) => { return [... Algo.qs_table(x, m).filter((v) => v != m + 1), m + 1]}, 
        'qck']
      ];
      algo = Algo.quick_search;
      break;
    default:
      return;
  }

  remove_childs(res);
  remove_childs(aux);
  const decals = algo(word, word.length, text, text.length);
  createSearchTable(text, word, decals, res);
  for (let [h,f, n] of algo_aux) {
    createAuxilariTables(n, h, f(word, word.length), aux);
  }

  const one = document.getElementById(res);
  const two = document.getElementById(aux);
  one.style.visibility = 'visible';
  two.style.visibility = 'visible';
});

function createTableElements() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  table.appendChild(thead);
  table.appendChild(tbody);
  return { table, thead, tbody };
}

function appendHeaderRow(thead, headers) {
  const headerRow = document.createElement('tr');
  for (const text of headers) {
    const th = document.createElement('th');
    th.appendChild(document.createTextNode(text));
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
}

function appendBodyRow(tbody, cells, line_class = '', start = undefined, 
  end = undefined, bad = undefined) {
  let b = start != undefined && end != undefined;
  let i = -1;
  const bodyRow = document.createElement('tr');
  for (const cellText of cells) {
    const td = document.createElement('td');
    if (cellText != '') {
      ++i;
    }
    
    if (b && i >= start && i <= end) {
      td.classList.add('comparaison-g');
    }
    if (bad != undefined && i == bad) {
      td.classList.remove('comparaison-g');
      td.classList.add('comparaison-b');
    }
    if (line_class != '' && cellText != '') {
      td.classList.add(line_class);
    }
    td.appendChild(document.createTextNode(cellText));
    bodyRow.appendChild(td);
  }
  tbody.appendChild(bodyRow);
}

function insertTableIntoDOM(table, id) {
  document.getElementById(id).appendChild(table);
}

function createEmptyCellsRow(length) {
  return new Array(length).fill('');
}

function remove_childs(id) {
  const element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createSearchTable(text, word, offsets, id) {
  const { table, thead, tbody } = createTableElements();

  appendHeaderRow(thead, text);

  let currOffset = 0;
  
  for (const offset of offsets) {
    const emptyCells = createEmptyCellsRow(currOffset + offset.decal);
    currOffset += offset.decal;
    
    const lineCells = [...emptyCells, ...word];
    
    appendBodyRow(tbody, lineCells, (offset.find  ? 'find' : 'other-match'), 
      offset.deb, offset.end, offset.bad);
    
  }

  insertTableIntoDOM(table, id);
}

function createAuxilariTables(name, header, values, id) {
  const { table, thead, tbody } = createTableElements();
  
  header = ['', ...header];
  appendHeaderRow(thead, header);

  const firstBodyRow = document.createElement('tr');
  const nameTd = document.createElement('td');
  nameTd.appendChild(document.createTextNode(name));
  firstBodyRow.appendChild(nameTd);

  for (const v of values) {
    const td = document.createElement('td');
    td.appendChild(document.createTextNode(v));
    firstBodyRow.appendChild(td);
  }
  tbody.appendChild(firstBodyRow);

  insertTableIntoDOM(table, id);
}

function supprimerDoublonsConsecutifs(str) {
  let resultat = '';
  
  for (let i = 0; i < str.length; i++) {
    if (!resultat.includes(str[i])) {
      resultat += str[i];
    }
  }
  return resultat;
}
