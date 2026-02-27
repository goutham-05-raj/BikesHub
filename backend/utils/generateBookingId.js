const generateBookingId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BR${timestamp.slice(-6)}${random}`;
};

module.exports = generateBookingId;