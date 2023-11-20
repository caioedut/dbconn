import { string } from './string.helper';

export function orderBy(items: any[], attrs: string | string[]) {
  if (typeof attrs === 'string') {
    attrs = [attrs];
  }

  attrs.reverse().forEach((attr) => {
    const sortDesc = attr.trim().substr(0, 1) === '-';

    if (sortDesc) {
      attr = attr.trim().substr(1);
    }

    items.sort((a, b) => {
      const diff = string(a[attr]).localeCompare(string(b[attr]));

      if (sortDesc) {
        return diff * -1;
      }

      return diff;
    });
  });

  return items;
}

export function groupBy<T>(
  data: T[],
  keyAttr = 'key',
  titleAttr?: string,
): {
  data: T[];
  key: string;
  title: string;
}[] {
  const groups: {
    data: any[];
    key: string;
    title: string;
  }[] = [];

  data.forEach((item) => {
    // @ts-expect-error
    const key = item[keyAttr];
    // @ts-expect-error
    const title = item[titleAttr || keyAttr];

    let group = groups.find((a) => a.key === key);

    if (!group) {
      group = { title, data: [], key };
      groups.push(group);
    }

    group.data.push(item);
  });

  return groups;
}

export function uniqueBy(array: any[], keyAttr: string) {
  return array.filter((item) => {
    const itemIndex = array.indexOf(item);
    const firstIndex = array.findIndex((a) => a[keyAttr] === item[keyAttr]);
    return itemIndex === firstIndex;
  });
}

export function remove(array: any[], value: any) {
  const index = array.indexOf(value);

  if (index !== -1) {
    array.splice(index, 1);
  }

  return array;
}
