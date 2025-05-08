export const currencyFormatter_old = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: localStorage.getItem("currency") || "USD",
});
