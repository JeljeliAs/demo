const deleteDocumentById = async (client, collectionName, id) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);

    return await myColl.deleteOne({ _id: id });
}

const deleteDocumentByField = async (client, collectionName, fieldName, fieldValue) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);

    return await myColl.deleteOne({ [fieldName]: fieldValue });
}

const deleteDocumentsByField = async (client, collectionName, fieldName, fieldValue) => {
    const myDB = client.db("auditapp");
    const myColl = myDB.collection(collectionName);

    return await myColl.deleteMany({ [fieldName]: fieldValue });
}

exports.deleteDocumentById = deleteDocumentById
exports.deleteDocumentByField = deleteDocumentByField
exports.deleteDocumentsByField = deleteDocumentsByField
