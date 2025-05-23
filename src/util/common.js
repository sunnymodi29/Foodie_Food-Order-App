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
  return format(new Date(str), "dd MMM yyyy, hh:mm a");
}
