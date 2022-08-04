const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/v1/getUrl/', (req: any, res: any) => {
  const request = req.body;
  // Do your stuff and return the result as json format
  // ex. res.send({ url: 'https://tbschema.......' });
  res.send(request);
});

app.listen(5000, () => {
  console.log('The application is listening on port 5000!');
});
