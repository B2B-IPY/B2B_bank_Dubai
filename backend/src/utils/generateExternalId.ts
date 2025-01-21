export function generateExternalId(): string {
  const randomLetters = (length: number): string => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return [...Array(length)]
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");
  };

  const part1 = randomLetters(16);
  const part2 = randomLetters(4);
  const part3 = randomLetters(4);
  const part4 = randomLetters(6);
  const part5 = randomLetters(10);
  const part6 = randomLetters(8);

  return `${part1}${part2}${part3}${part4}${part5}${part1}${part6}`;
}
