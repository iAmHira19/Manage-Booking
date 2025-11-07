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

function formatDateWithDay(dateString) {
  const [day, month, year] = dateString.split("/");
  const date = new Date(year, month - 1, day);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const dayName = dayNames[date.getDay()];
  const formattedDay = parseInt(day, 10);
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
  return `${dayName}, ${formattedDay} ${formattedMonth} ${year}`;
}

export { formatDateWithSlash, formatDateWithSlashWithoutYear, formatDateWithDay };
