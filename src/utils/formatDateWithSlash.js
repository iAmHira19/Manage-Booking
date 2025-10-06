function formatDateWithSlashWithoutYear(dateString) {
  const [day, month, year] = dateString.split("/");
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
  const formattedDay = parseInt(day, 10);
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  return `${formattedDay} ${formattedMonth}`;
}
function formatDateWithSlash(dateString) {
  const [day, month, year] = dateString.split("/");
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
  const formattedDay = parseInt(day, 10);
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  return `${formattedDay} ${formattedMonth} ${year}`;
}
export { formatDateWithSlash, formatDateWithSlashWithoutYear };
