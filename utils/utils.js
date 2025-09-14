// utils/utils.js
export function getTimestamp() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth()+1).padStart(2,'0'),
    String(d.getDate()).padStart(2,'0'),
    String(d.getHours()).padStart(2,'0'),
    String(d.getMinutes()).padStart(2,'0'),
    String(d.getSeconds()).padStart(2,'0')
  ].join('');
}

export function getPassword(timestamp) {
  const str = `${process.env.BUSINESS_SHORT_CODE}${process.env.PASS_KEY}${timestamp}`;
  return Buffer.from(str).toString('base64');
}
