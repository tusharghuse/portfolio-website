require('dotenv').config();
const mongoose = require('mongoose');

console.log('URI:', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ CONNECTED');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FULL ERROR:');
    console.error(err);
    process.exit(1);
  });