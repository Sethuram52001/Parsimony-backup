const app = require('./server');
const db = require('./db');

db.connectToMongoDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
