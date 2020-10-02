const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

app.listen(process.env.PORT, () => {
  console.log('SERVER LISTENING AT: ', process.env.PORT);
});
