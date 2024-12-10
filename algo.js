export function bon_pref(x, m) {
  let bp = [];
  bp[0] = -1;
  let i = 0;
  for (let j = 1; j < m; ++j) {
    bp[j] = i;
    while (i >= 0 && x[i] != x[j]) {
      i = bp[i];
    }
    ++i;
  }
  bp[m] = i;
  return bp;
}

export function morris_pratt(x, m, y, n) {
  let i = 0;
  let decal = [{
    find : false,
    display : '',
    decal : 0,
    deb : 0
  }];
  let bp = bon_pref(x, m);
  for (let j = 0; j < n && j + m < n; ++j) {
    while (i >= 0 && x[i] != y[j]) {
      decal[decal.length - 1].end = i;
      decal[decal.length - 1].bad = i;
      decal.push({
        find : false, 
        display : i + ' - ' + bp[i], 
        decal : i - bp[i],
        deb : (bp[i] == - 1 ? 0 : bp[i])
      });
      i = bp[i];
    }
    ++i;
    if (i == m) {
      decal[decal.length - 1].end = m;
      decal[decal.length - 1].bad = m;
      decal[decal.length - 1].find = true;
      decal.push({
        find : false, 
        display : i + ' - ' + bp[i], 
        decal : i - bp[i],
        deb : (bp[i] == - 1 ? 0 : bp[i])
      });
      i = bp[i];
    }
  }
  decal[decal.length - 1].bad = i;
  decal[decal.length - 1].end = i;
  return decal;
}

export function meil_pref(x, m) {
  let mp = [];
  mp[0] = -1;
  let i = 0;
  for (let j = 1; j < m; ++j) {
    if (x[i] == x[j]) {
      mp[j] = mp[i];
    } else {
      mp[j] = i;
      do {
        i = mp[i];
      } while (i >= 0 && x[i] != x[j]);
    }
    ++i;
  }
  mp[m] = i;
  return mp;
}

export function knuth_morris_pratt(x, m, y, n) {
  let i = 0;
  let decal = [{
    find : false,
    display : '',
    decal : 0,
    deb : 0
  }];
  let mp = meil_pref(x, m);
  for (let j = 0; j < n && j + m < n; ++j) {
    while (i >= 0 && x[i] != y[j]) {
      decal[decal.length - 1].end = i;
      decal[decal.length - 1].bad = i;
      decal.push({
        find : false, 
        display : i + ' - ' + mp[i], 
        decal : i - mp[i],
        deb : (mp[i] == - 1 ? 0 : mp[i])
      });
      i = mp[i];
    }
    ++i;
    if (i == m) {
      decal[decal.length - 1].end = m;
      decal[decal.length - 1].bad = m;
      decal[decal.length - 1].find = true;
      decal.push({
        find : false, 
        display : i + ' - ' + mp[i], 
        decal : i - mp[i],
        deb : (mp[i] == - 1 ? 0 : mp[i])
      });
      i = mp[i];
    }
  }
  decal[decal.length - 1].bad = i;
  decal[decal.length - 1].end = i;
  return decal;
}

export function dern_occ(x, m) {
  const UCHAR_MAX = 255;
  let derno = new Array(UCHAR_MAX + 1).fill(m);

  for (let i = 0; i < m - 1; i++) {
    const charCode = x.charCodeAt(i);
    derno[charCode] = m - i - 1;
  }
  return derno;
}

export function suffixes(x, m) {
  let suff = []
  let g = m - 1;
  let f = 0;
  suff[m - 1] = m;
  for (let i = m - 2; i >= 0; --i) {
    if (i > g && suff[i + m - 1 - f] != i - g) {
      suff[i] = Math.min(suff[i + m - 1 - f], i - g);
    } else {
      g = Math.min(i, g);
      f = i;
      while (g >= 0 && x[g] == x[g + m - 1 - f]) {
        --g;
      }
      suff[i] = f - g;
    }
  }
  return suff;
}

export function bon_suff(x, m) {
  let bs = [];
  let suff = suffixes(x, m);
  let i = 0;
  for (let j = m - 2; j >= -1; --j) {
    if (j == -1 || suff[j] == j + 1) {
      while (i < m - 1 - j) {
        bs[i] = m - 1 - j;
        ++i;
      }
    }
  }
  for (let j = 0; j <= m - 2; ++j) {
    bs[m - 1 - suff[j]] = m - 1 - j;
  }
  return bs;
}

export function boyer_moore(x, m, y, n) {
  let derno = dern_occ(x, m);
  let bs = bon_suff(x, m);
  let decal = [{
    find : false,
    display : '',
    decal : 0,
    end : m - 1
  }];
  let j = m - 1;
  while (j < n) {
    let i = m - 1;
    while (i >= 0 && x[i] == y[j - m + 1 + i]) {
      --i;
    }
    if (i < 0) {
      decal[decal.length - 1].deb = 0;
      decal[decal.length - 1].bad = m;
      decal[decal.length - 1].find = true;
      decal.push({
        find : false, 
        display : 'bs[0] = ' + bs[0], decal : bs[0],
        end : m - 1
      });
      j += bs[0];
    } else {
      decal[decal.length - 1].deb = i;
      decal[decal.length - 1].bad = i;
      let j_ = j +  Math.max(bs[i], 
        derno[y.charCodeAt(j - m + 1 + i)] - m + 1 + i);
      if (j_ < n) {
        decal.push({
          find : false, 
          display : 'max{' + bs[i] + ', ' + derno[y[j - m + 1 + i]] - m + 1 + i + '}', 
          decal :  Math.max(bs[i], derno[y.charCodeAt(j - m + 1 + i)] - m + 1 + i),
          end : m - 1
        });
        j += Math.max(bs[i], derno[y.charCodeAt(j - m + 1 + i)] - m + 1 + i);
      } else {
        break;
      }
    }
  }
  return decal;
}

export function horspool(x, m, y, n) {
  let derno = dern_occ(x, m);
  let i = 0;
  let decal = [{
    find : false,
    display : '',
    decal : 0,
    deb : 0
  }];
  while (i <= n - m) {
    let c;
    let b = false;
    if ((c = memcmp(y, i, x, m)) == m - 1) {
      b = true;
    }
    decal[decal.length - 1].end = c;
    decal[decal.length - 1].bad = c;
    if (b) {
      decal[decal.length - 1].find = true;
    }
    if (i + derno[y.charCodeAt(i + m - 1)] <= n - m) {
      decal.push({
        find : false, 
        display : derno[y.charCodeAt(i + m - 1)], 
        decal : derno[y.charCodeAt(i + m - 1)],
        deb : 0
      });
      i += derno[y.charCodeAt(i + m - 1)];
    }  else {
      break;
    }
  }
  return decal;
}

function memcmp(y, i, x, length) {
  for (let idx = 0; idx < length; idx++) {
    if (y[i + idx] !== x[idx]) {
      return idx;
    }
  }
  return length;
}

export function qs_table(x, m) {
  const UCHAR_MAX = 255;
  let derno = new Array(UCHAR_MAX + 1).fill(m + 1);

  for (let i = 0; i < m; ++i) {
    const charCode = x.charCodeAt(i);
    derno[charCode] = m - i;
  }
  return derno;
}

export function quick_search(x, m, y, n) {
  let qs = qs_table(x, m);
  let decal = [{
    find : false,
    display : '',
    decal : 0,
    deb: 0
  }];
  let j = 0;
  while (j <= n - m) {
    let c;
    let b = false;
    if ((c = memcmp(y, j, x, m)) == m) {
      b = true;
    }
    decal[decal.length - 1].end =  c;
    decal[decal.length - 1].bad =  c;
    if (b) {
      decal[decal.length - 1].find = true;
    }
    if (j + qs[y.charCodeAt(j + m)] <= n - m) {
      decal.push({
        find : false, 
        display : qs[y.charCodeAt(j + m)], 
        decal : qs[y.charCodeAt(j + m)],
        deb : 0
      });
      j += qs[y.charCodeAt(j + m)];
    } else {
      break;
    }
  }
  return decal;
}