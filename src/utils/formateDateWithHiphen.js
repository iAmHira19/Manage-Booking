export function formateDateWithHiphen(date) {
  let newDate = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedMonth = monthNames[parseInt(newDate.getMonth(), 10) - 1];
  let oneDate = newDate.getDate();
  return `${oneDate} ${formattedMonth}`;
}
