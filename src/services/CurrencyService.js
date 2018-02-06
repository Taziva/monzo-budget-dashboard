export const formatAmount = (amount, currency) => {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: currency
  });
};
