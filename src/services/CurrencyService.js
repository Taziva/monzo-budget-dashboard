export const formatAmount = (amount, currency) => {
  if (typeof amount !== "number") {
    amount = parseInt(amount);
  }
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: currency
  });
};
