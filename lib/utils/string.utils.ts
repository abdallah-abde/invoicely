export function capitalize(value: string) {
  const firstLetter = value[0].toUpperCase();
  const rest = value.substring(1);

  return `${firstLetter}${rest}`;
}
