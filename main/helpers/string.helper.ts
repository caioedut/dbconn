import { AnyObject } from '@react-bulk/core';

export function string(value: any): string {
  if ([null, undefined].includes(value)) {
    return '';
  }

  if (!Number.isNaN(Number(value))) {
    return value.toString();
  }

  return `${value || ''}`;
}

export function unmask(value: any | string, replaceRegex = /\W+/g, replaceValue = ''): string {
  return string(value).replace(replaceRegex, replaceValue);
}

export function mask(value: any, pattern: string): string {
  value = unmask(value);

  const defined: AnyObject = {
    cep: '##.###-###',
    cnpj: '##.###.###.####/##',
    cpf: '###.###.###-##',
    date: '##/##/####',
  };

  pattern = defined[pattern] || pattern;

  // Numeric only
  if (['cep', 'cnpj', 'cpf', 'date'].includes(pattern)) {
    value = value.replace(/\D/g, '');
  }

  if (pattern === 'phone') {
    value = value.replace(/^0+/, '');
    pattern = value.length > 10 ? '(##) #####-####' : '(##) ####-####';
  }

  let maskared = '';
  let sIndex = 0;

  for (let mIndex = 0; mIndex < pattern.length; mIndex += 1) {
    if (!value[sIndex]) {
      break;
    }

    // @ts-ignore
    if (pattern[mIndex] === '#') {
      maskared += value[sIndex];
      sIndex += 1;
    } else {
      // @ts-ignore
      maskared += pattern[mIndex];
    }
  }

  return maskared;
}

export function stripTags(input: any | string, allowed?: any | string) {
  input = string(input).replace(/<br ?\/?>/g, '\n');

  allowed = (
    string(allowed)
      .toLowerCase()
      .match(/<[a-z][a-z0-9]*>/g) || []
  ).join('');

  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  return input.replace(commentsAndPhpTags, '').replace(tags, ($0: string, $1: string) => {
    return allowed.indexOf(`<${$1.toLowerCase()}>`) > -1 ? $0 : '';
  });
}

export function color(input: any | string) {
  let hash = 0;
  let colour = '#';

  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }

  return colour;
}

export function pluralize(count: number, singular: string, plural?: string) {
  plural = plural ?? `${singular}s`;
  return count > 1 ? plural : singular;
}
