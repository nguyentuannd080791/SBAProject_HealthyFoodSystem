function displayPriority({ product, promotion }) {
  if (product.status !== "AVAILABLE" || product.availableQuantity === 0) return 2;
  return promotion ? 0 : 1;
}

export function sortMenuCards(cards, sortBy = "default") {
  if (sortBy !== "default") return [...cards];
  return [...cards].sort((left, right) => displayPriority(left) - displayPriority(right));
}
