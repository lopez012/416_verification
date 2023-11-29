

function FormatDate(date) {
    const currTime = new Date();
    const askedTime = new Date(date);
    const diff = currTime - askedTime;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days === 0) {
    if (hours < 1) {
      if (minutes < 1) {
        return `${seconds} seconds ago`;
      }
      return `${minutes} minutes ago`;
    }
    return `${hours} hours ago`;
  } else if (days === 1) {
    return `yesterday at ${askedTime.toLocaleTimeString()}`;
  } else if (currTime.getFullYear() === askedTime.getFullYear()) {
    
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return `on ${askedTime.toLocaleDateString(undefined, options)}`;
  } else {
    // Display month, day, year, and time
    const longOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return `on ${askedTime.toLocaleDateString(undefined, longOptions)}`;
  }
}

export default FormatDate;
