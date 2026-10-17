function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'A record with one of these unique values already exists.' });
  if (error.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ message: 'This record is still referenced by another record and cannot be deleted.' });
  res.status(error.status || 500).json({ message: error.message || 'Internal server error.' });
}
module.exports = { notFound, errorHandler };
