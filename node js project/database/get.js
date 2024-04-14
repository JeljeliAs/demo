
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

const getDocumentByField = async (client, collectionName, fieldName, fieldValue) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);
    
    const query = { [fieldName]: fieldValue };
    return await myColl.findOne(query);
}

const getDocumentsByField = async (client, collectionName, fieldName, fieldValue) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);
    const query = { [fieldName]: fieldValue };

    return await myColl.find(query).toArray();
}

exports.getCollection = getCollection
exports.getDocumentById = getDocumentById
exports.getDocumentByField = getDocumentByField
exports.getDocumentsByField = getDocumentsByField
