const express = require("express");
const { run } = require('./connect')
const { createProject } = require('./database/project')
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post("/compute-score", async (req, res) => {

  /* 
    poteniels: {
      q1...q7
    }
    Body {
      poteniels[]
    }
  */

  /* 
    poteniel: {
      q1: 8, q2: 0...q7
    }
  */

  // compute score
  const poteniel = req.body.poteniel

  let totalScore = 0
  let counter = 0

  for (let [question, score] of Object.entries(poteniel)) {
    if (score !== 'N/B') {
      totalScore += score
      counter++
    }
  }

  const finalCompute = (totalScore / (counter * 10)) * 100

  // return response
  res.send(`pourcentage: ${finalCompute}`)
});

app.post("/add-project", async (req, res) => {
  const project = req.body
  const client = await run()
  await createProject(client, project)

  res.send(project)
})

app.listen(3000, () => {
  console.log("I am listening in port 3000");
});
