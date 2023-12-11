function memSince(memberSince) {
    const currentDate = new Date();
    const memberSinceDate = new Date(memberSince);
    const diffInMilliseconds = currentDate - memberSinceDate;
  
    const years = Math.floor(diffInMilliseconds / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diffInMilliseconds % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diffInMilliseconds % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diffInMilliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diffInMilliseconds % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diffInMilliseconds % (60 * 1000)) / 1000);
  
    const durationParts = [
      { value: years, unit: 'year' },
      { value: months, unit: 'month' },
      { value: days, unit: 'day' },
      { value: hours, unit: 'hour' },
      { value: minutes, unit: 'minute' },
      { value: seconds, unit: 'second' },
    ];
  
    // Filter out parts with zero value
    const nonZeroParts = durationParts.filter((part) => part.value > 0);
  
    // Construct the duration string
    const durationString = nonZeroParts
      .map((part) => `${part.value} ${part.unit}${part.value !== 1 ? 's' : ''}`)
      .join(', ');
  
    return durationString || 'just now';
  }
  
  export default  memSince ;
  

