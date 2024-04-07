const express = require("express");
const { run } = require('./connect')
const { createCollection } = require('./database/insert')
const { getCollection, getDocumentById } = require('./database/get')
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// computing data...
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

app.get("/audit/all", async (req, res) => {
  const client = await run()
  const response = []

  // question, type
  const projects = await getCollection(client, "Project")

  projects.forEach(project => {
    const name = project.nom
    const projectDate = project.date

    const auditId = project.auditId
    const audit = getDocumentById(client, "Audit", auditId)
    const auditDate = audit.date
    const auditobject = audit.objectAudit
    const auditCause = audit.cause

    

    const organisationToAuditId = project.organisationToAuditId

  });

  res.send(project)
})

// project API
app.post("/execute-audit", async (req, res) => {
  const { project, audit, auditor, organisationToAudit, address, questions } = req.body
  const client = await run()

  // relation 
  // project: idAudit, idOrganisationToAudit
  // question: idProject, idQuestionData
  // Auditor Audit -> idAudit, idAuditor
  // OrganisationToAudit: idAddress


  // city, cp, street1, street2, country
  const addressId = await createCollection(client, address, "Address")

  // date, object of audit, cause 
  const auditId = await createCollection(client, audit, "Audit")

  // name, status, email, idLivraison, equipToAudit, ceo, phone, qualityManager, ChiefExecutorExpl, signedBy
  const organisationToAuditId = await createCollection(
    client,
    { ...organisationToAudit, addressId },
    "OrganisationToAudit"
  )

  // key, name, date, idAudit, idOrganisationToAudit
  const projectId = await createCollection(
    client,
    { ...project, auditId, organisationToAuditId },
    "Project"
  )

  // type, name, company, departement, idCertif, mail
  const auditorId = await createCollection(client, auditor, "Auditor")

  // type, name, company, departement, idCertif, mail
  await createCollection(client, { auditId, auditorId }, "AuditorAudit")

  // response, commentaire1, commentaire2, fileUrl
  // questionDataId should be supplied in the frontEnd
  questions.forEach( async (question) => {
    await createCollection(
      client,
      { ...question, projectId },
      "Question"
    )
  })

  res.send("Successfully create an audit")
})

app.post("/create-question", async (req, res) => {
  const questionData = req.body
  const client = await run()

  // question, type
  const id = await createCollection(client, questionData, "QuestionData")

  console.log(`created question data with id ${id}`)

  res.send("Successfully create a question data")
})

app.get("/get-question", async (req, res) => {
  const client = await run()

  // question, type
  const questionData = await getCollection(client, "QuestionData")

  res.send(questionData)
})


// Server running
app.listen(3000, () => {
  console.log("I am listening in port 3000");
});
