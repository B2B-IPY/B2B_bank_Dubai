export default function normalizeTimeStamp(isoString: string) {
  let date = new Date(isoString);
  let pad = (n: number) => (n < 10 ? "0" + n : n);
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}
