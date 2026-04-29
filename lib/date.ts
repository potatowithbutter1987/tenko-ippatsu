export const JST_OFFSET_MIN = 9 * 60;

export const toJstDateString = (date: Date): string => {
  const jst = new Date(date.getTime() + JST_OFFSET_MIN * 60_000);
  return jst.toISOString().slice(0, 10);
};
