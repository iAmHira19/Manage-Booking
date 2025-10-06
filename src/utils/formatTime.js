export function formatTime(timeString) {
  if (!timeString || typeof timeString !== "string") {
    throw new Error("Invalid Time format");
  }
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
}
