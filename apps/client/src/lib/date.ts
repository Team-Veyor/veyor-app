type DateInput = string | number | Date;

const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value));

export const formatDate = (value: DateInput, format = 'yyyy.mm.dd') => {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const tokens: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    mm: String(date.getMonth() + 1).padStart(2, '0'),
    dd: String(date.getDate()).padStart(2, '0'),
    m: String(date.getMonth() + 1),
    d: String(date.getDate()),
  };

  return format.replace(/yyyy|mm|dd|m|d/g, (token) => tokens[token]);
};
