const { initialize } = require('./store');

async function testConnection() {
  initialize();
  console.log('JSON datastore initialized.');
}

module.exports = { testConnection };
