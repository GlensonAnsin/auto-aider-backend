// HASH PASS SCRIPT

import bcrypt from 'bcryptjs';

const hashedPass = await bcrypt.hash('admin-ansin', 10);

console.log(hashedPass);