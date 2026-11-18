/** "YYYY년 M월 D일". timeZone을 주지 않으면 실행 환경(브라우저)의 시간대를 쓴다. */
export function formatSavedDate(iso: string, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone,
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((p) => p.type === type)?.value
  return `${get('year')}년 ${get('month')}월 ${get('day')}일`
}
