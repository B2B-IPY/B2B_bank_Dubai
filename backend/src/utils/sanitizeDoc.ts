export function sanitizeDoc(input: string): string {
    return input.replace(/[.\-/]/g, "");
  }