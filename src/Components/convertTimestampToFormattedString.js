function convertTimestampToFormattedString(timestamp, setTimeFunction) {
  const now = new Date(timestamp);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, "0");

  const formattedTimestamp = `${date}-${month}-${year} ${strHours}:${minutes} ${ampm}`;
  setTimeFunction(formattedTimestamp);
}
export default convertTimestampToFormattedString;
