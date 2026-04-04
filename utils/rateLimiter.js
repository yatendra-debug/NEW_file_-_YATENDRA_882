const LIMIT = 27;

const store = {};

module.exports = (email) => {
  const now = Date.now();

  if (!store[email]) {
    store[email] = { count: 0, time: now };
  }

  if (now - store[email].time > 3600000) {
    store[email] = { count: 0, time: now };
  }

  if (store[email].count >= LIMIT) return false;

  store[email].count++;
  return true;
};
