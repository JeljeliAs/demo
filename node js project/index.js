const express = require("express");

const app = express();
app.use(express.json());

app.post("/compute-score", (req, res) => {

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


  // stock in DB 


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


app.listen(3000, () => {
  console.log("I am listening in port 3000");
});
