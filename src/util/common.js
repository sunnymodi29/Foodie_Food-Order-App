import { format } from "date-fns";

function getFirstCharacters(str) {
  if (str) {
    const userProfileVal =
      str.split(" ").length > 1
        ? str.split(" ")[0].charAt(0) +
          str.split(" ").slice(-1).toString().charAt(0)
        : str.split(" ")[0].charAt(0);

    return userProfileVal;
  }
}

export default getFirstCharacters;

export function formatDateTime(str) {
  if (!str) return "N/A";
  const date = new Date(str);
  return isNaN(date.getTime()) ? "Invalid Date" : format(date, "dd MMM yyyy, hh:mm a");
}
