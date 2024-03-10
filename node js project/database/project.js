const createProject = async (client, project) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection("Project");

    const result = await myColl.insertOne(project);
    console.log(
    `A document was inserted with the _id: ${result.insertedId}`,
    );

    return project
}

exports.createProject = createProject
