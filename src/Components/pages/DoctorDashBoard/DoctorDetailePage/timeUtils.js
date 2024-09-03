export const calculateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
  
    while (start < end) {
      const slotStart = start.toTimeString().substring(0, 5);
      start.setHours(start.getHours() + 1);
      const slotEnd = start.toTimeString().substring(0, 5);
      slots.push(`${slotStart}-${slotEnd}`);
    }
  
    return slots;
  };