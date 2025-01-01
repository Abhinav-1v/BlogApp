const { createHmac,randomBytes } = require('crypto');

const secret=randomBytes(8);
console.log(secret);
const password='notyourbussines';
const hash = createHmac('sha256', secret).update(password).digest('hex');
console.log(password);