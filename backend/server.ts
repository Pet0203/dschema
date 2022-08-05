const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/v1/getUrl/', (req: any, res: any) => {
  // Object with below properties
  const request = req.body;
  
  // String of group
  const group = req.body.group;
  // Boolean of whether or not to improve the location
  const modLocation = req.body.modLocation;
  // Boolean of whether or not to show exams in calendar
  const modExam = req.body.modExam;
  // Array of courses
  const courses = req.body.courses;

  // Do your stuff and return the result as json format
  // ex. res.send({ url: 'https://tbschema.......' });
  res.send(request);
});

app.listen(5000, () => {
  console.log('The application is listening on port 5000!');
});
