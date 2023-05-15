export const itemIndex = (data = [], mun = false) => (data.map((elm, idx) => ({ idx: mun ? idx + 100 : idx, name: elm })))
