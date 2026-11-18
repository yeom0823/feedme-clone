/** http:// 또는 https://로 시작하는 주소 형식인지 확인한다. */
export function isHttpUrl(value: string): boolean {
  const v = value.trim();
  if (!/^https?:\/\/[^\s]+$/i.test(v)) return false;
  try {
    const { hostname } = new URL(v);
    return hostname.length > 0;
  } catch {
    return false;
  }
}
