export function formatPrice(value) {
  return value
    ? Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : 0
}