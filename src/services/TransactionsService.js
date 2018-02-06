import Api from "./Api";
import firebase from "firebase";
import DateService from "./DateService";

export default {
  async fetchTransactions() {
    let { data } = await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().get("/transactions", {
          headers: { Authorization: `${idToken}` }
        });
      });
    if (!data.error) {
      return this.sortTransactions(data);
    }
    return data;
  },
  sortTransactions(transactions) {
    const uniqueMonths = Array.from(
      new Set(
        transactions.map(transaction => {
          return DateService.monthNumToName(
            new Date(transaction.created).getMonth()
          );
        })
      )
    );
    const sortedTransactions = {};
    uniqueMonths.map(month => {
      const monthTransactions = transactions.filter(transaction => {
        if (
          DateService.monthNumToName(
            new Date(transaction.created).getMonth()
          ) === month
        ) {
          return transaction;
        }
      });
      return (sortedTransactions[month] = monthTransactions);
    });
    return sortedTransactions;
  }
};
