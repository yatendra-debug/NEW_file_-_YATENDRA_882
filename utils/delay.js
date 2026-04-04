const limits = {};

function canSend(email) {
  const now = Date.now();

  if (!limits[email]) {
    limits[email] = {
      count: 0,
      startTime: now,
    };
  }

  const diff = now - limits[email].startTime;

  // reset after 1 hour
  if (diff > 60 * 60 * 1000) {
    limits[email] = {
      count: 0,
      startTime: now,
    };
  }

  if (limits[email].count >= 27) {
    return false;
  }

  limits[email].count++;
  return true;
}

module.exports = canSend;
