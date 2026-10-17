const required = (obj, fields) => fields.find((field) => obj[field] === undefined || obj[field] === null || String(obj[field]).trim() === '');
function requireFields(body, fields) {
  const field = required(body, fields);
  if (field) { const error = new Error(`${field.replaceAll('_', ' ')} is required.`); error.status = 400; throw error; }
}
function positiveInteger(value, name) {
  if (!Number.isInteger(Number(value)) || Number(value) < 1) { const error = new Error(`${name} must be a positive integer.`); error.status = 400; throw error; }
}
function validEmail(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) { const error = new Error('Please provide a valid email address.'); error.status = 400; throw error; }
}
module.exports = { requireFields, positiveInteger, validEmail };
