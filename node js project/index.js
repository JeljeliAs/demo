const express = require("express");
const { run } = require('./connect')
const { createCollection } = require('./database/insert')
const { getCollection, getDocumentById, getDocumentByField, getDocumentsByField } = require('./database/get')
const { deleteDocumentById, deleteDocumentsByField } = require('./database/delete')
const cors = require('cors');
const { ObjectId } = require('mongodb');

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
  const type = req.body.type

  let totalScore = 0
  let counter = 0
  let scoreForP1 = {
    green: 0,
    yellow: 0,
    red: 0
  }

  for (let [question, score] of Object.entries(poteniel)) {
    if (score === 'N/B') continue

    if (type === 'P1') {
      scoreForP1[score]++ 
    } else {
      totalScore += score
      counter++
    }
  }

  let finalCompute = 0

  if (type === 'P1') {
    const maxRes = Math.max(scoreForP1.green, scoreForP1.red, scoreForP1.yellow)
    if (scoreForP1.green === maxRes) return res.send('green')
    if (scoreForP1.yellow === maxRes) return res.send('yellow')
    if (scoreForP1.red === maxRes) return res.send('red')
  } else {
    finalCompute = (totalScore / (counter * 10)) * 100
  }

  // return response
  res.send(`pourcentage: ${finalCompute}`)
});

app.get("/audit/all", async (req, res) => {
  const client = await run()
  const response = []

  // question, type
  const projects = await getCollection(client, "Project")

  for (const project of projects) {
    const auditId = project.auditId
    const audit = await getDocumentById(client, "Audit", auditId)

    const auditorAudit = await getDocumentByField(client, 'AuditorAudit','auditId', auditId)
    const auditorId = auditorAudit.auditorId
    const auditor = await getDocumentById(client, "Auditor", auditorId)

    const organisationToAuditId = project.organisationToAuditId
    const organisationToAudit = await getDocumentById(client, "OrganisationToAudit", organisationToAuditId)
  
    const addressId = organisationToAudit.addressId
    const address = await getDocumentById(client, "Address", addressId)

    const projectId = project._id
    const questions = await getDocumentsByField(client, 'Question', "projectId", projectId)

    let questionsDetailed = []
    for (const question of questions) {
      const questionDataId = question.questionDataId
      const questionData = await getDocumentById(client, "QuestionData", questionDataId)
      questionsDetailed.push({
        response: question.response,
        commentaire1: question.commentaire1,
        commentaire2: question.commentaire2,
        fileUrl: question.fileUrl,
        questionContent: questionData.question,
        type: questionData.type,
      })

    }

    response.push({
      project: {
        name: project.nom,
        date: project.date,
      },
      audit: {
        date: audit.date,
        objectAudit: audit.objectAudit,
        cause: audit.cause,
      },
      auditor: {
        type: auditor.type,
        name: auditor.name,
        company: auditor.company,
        departement: auditor.departement,
        idCertif: auditor.idCertif,
        mail: auditor.mail,
      },
      organisationToAudit: {
        name: organisationToAudit.name,
        status: organisationToAudit.status,
        email: organisationToAudit.email,
        idLivraison: organisationToAudit.idLivraison,
        equipToAudit: organisationToAudit.equipToAudit,
        ceo: organisationToAudit.ceo,
        phone: organisationToAudit.phone,
        qualityManager: organisationToAudit.qualityManager,
        ChiefExecutorExpl: organisationToAudit.ChiefExecutorExpl,
        signedBy: organisationToAudit.signedBy,
        address: {
          city: address.city,
          cp: address.cp,
          street1: address.street1,
          street2: address.street2,
          country: address.country,
        }
      },
      questions: questionsDetailed
    });
  }

  res.json(response)
})

app.get("/audit/:projectId", async (req, res) => {
  const client = await run()

  const projectId = req.params.projectId
  const project = await getDocumentById(client, "Project", projectId)

  const auditId = project.auditId
  const audit = await getDocumentById(client, "Audit", auditId)

  const auditorAudit = await getDocumentByField(client, 'AuditorAudit','auditId', auditId)
  const auditorId = auditorAudit.auditorId
  const auditor = await getDocumentById(client, "Auditor", auditorId)

  const organisationToAuditId = project.organisationToAuditId
  const organisationToAudit = await getDocumentById(client, "OrganisationToAudit", organisationToAuditId)

  const addressId = organisationToAudit.addressId
  const address = await getDocumentById(client, "Address", addressId)

  const projectIdObject = new ObjectId(projectId);
  const questions = await getDocumentsByField(client, 'Question', "projectId", projectIdObject)

  let questionsDetailed = []
  for (const question of questions) {
    const questionDataId = question.questionDataId
    const questionData = await getDocumentById(client, "QuestionData", questionDataId)
    questionsDetailed.push({
      response: question.response,
      commentaire1: question.commentaire1,
      commentaire2: question.commentaire2,
      fileUrl: question.fileUrl,
      questionContent: questionData.question,
      type: questionData.type,
    })
  }

  res.json(
    {
      project: {
        name: project.nom,
        date: project.date,
      },
      audit: {
        date: audit.date,
        objectAudit: audit.objectAudit,
        cause: audit.cause,
      },
      auditor: {
        type: auditor.type,
        name: auditor.name,
        company: auditor.company,
        departement: auditor.departement,
        idCertif: auditor.idCertif,
        mail: auditor.mail,
      },
      organisationToAudit: {
        name: organisationToAudit.name,
        status: organisationToAudit.status,
        email: organisationToAudit.email,
        idLivraison: organisationToAudit.idLivraison,
        equipToAudit: organisationToAudit.equipToAudit,
        ceo: organisationToAudit.ceo,
        phone: organisationToAudit.phone,
        qualityManager: organisationToAudit.qualityManager,
        ChiefExecutorExpl: organisationToAudit.ChiefExecutorExpl,
        signedBy: organisationToAudit.signedBy,
        address: {
          city: address.city,
          cp: address.cp,
          street1: address.street1,
          street2: address.street2,
          country: address.country,
        }
      },
      questions: questionsDetailed
    }
  )
})

app.delete("/audit/:projectId", async (req, res) => {
  const client = await run()
  const projectId = req.params.projectId
  const project = await getDocumentById(client, "Project", projectId)
  const projectIdObject = project._id

  const auditId = project.auditId
  await deleteDocumentById(client, "Project", project._id)
  await deleteDocumentById(client, "Audit", auditId)

  const auditorAudit = await getDocumentByField(client, 'AuditorAudit','auditId', auditId)
  await deleteDocumentById(client, "AuditorAudit", auditorAudit._id)
 await  deleteDocumentsByField(client, 'Question', "projectId", projectIdObject)
 res.send("Successfully deleted an audit")
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
