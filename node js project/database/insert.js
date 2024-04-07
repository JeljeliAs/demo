
const createCollection = async (client, dataToInsert, collectionName) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);

    const result = await myColl.insertOne(dataToInsert);
    console.log(
        `A document was inserted with the _id: ${result.insertedId}`,
    );

    return result.insertedId
}

exports.createCollection = createCollection
