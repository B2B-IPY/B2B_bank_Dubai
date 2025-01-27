export function removePunctuation(value: string): string {
   return value.replace(/[^\d]/g, "");
}
