module.exports = {
  formatAmount: (amount, currency) => {
    return (amount / 100).toLocaleString("en-GB", {
      style: "currency",
      currency: currency
    });
  }
};
