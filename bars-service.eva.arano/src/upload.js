const express = require('express');

const port = `3000`;

const { router: upload } = require(`./fileReader`);

const app = express();

app.use(express.json());

app.use(upload);

app.listen(3000, () => {
  console.log(`Server is up on port ${port}`);
});
