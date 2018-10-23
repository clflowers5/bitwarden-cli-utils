const promisify = require('util').promisify;
const exec = require('child_process').exec;

export default promisify(exec);
