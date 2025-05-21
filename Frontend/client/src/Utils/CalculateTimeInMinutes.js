export function CalculateTimeInMinutes(end, start) {
  // get hours and minutes from each one
  const end_details = end.split(":");
  const start_details = start.split(":");

  // Convert hours to minutes
  const end_in_minutes =
    parseInt(end_details[0]) * 60 + parseInt(end_details[1]);

  const start_in_minutes =
    parseInt(start_details[0]) * 60 + parseInt(start_details[1]);

  return end_in_minutes - start_in_minutes;
}
