import { format, parseISO } from "date-fns";

export const shortenDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, "MMM d, yyyy");
};
