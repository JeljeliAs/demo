
const { ObjectId } = require('mongodb');

const getCollection = async (client, collectionName) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);
    
    return await myColl.find().toArray()
}

const getDocumentById = async (client, collectionName, id) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);

    const documentId = new ObjectId(id);
    return await myColl.findOne({ _id: documentId });
}

exports.getCollection = getCollection
exports.getDocumentById = getDocumentById
