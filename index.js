'use strict';
const orientDB = require('orientjs');

module.exports = function (options) {
    options = options || {};

    const host = options.host || 'localhost';
    const port = options.port || 2424;

    const dbName = options.dbName || 'default';
    const user = options.user || 'admin';
    const password = options.password || 'admin';

    const server = orientDB({
        host,
        port
    });

    const db = server.use({
        name: dbName,
        user,
        password
    });

    return {
        defineCollection(collectionName) {
            const classP = db.class.create(collectionName);

            return {
                get(id) {
                    return db.record.get(id)
                        .then(doc => {
                            return Object.assign(doc, {
                                id: doc['@rid'].toString()
                            });
                        });
                },

                create(doc) {
                    return classP.then(c => {
                        return c.create(doc);
                    })
                    .then(createdDoc => {
                        return Object.assign(createdDoc, {
                            id: createdDoc['@rid'].toString()
                        });
                    });
                },

                update(doc) {
                    return this.get(doc.id)
                        .then(docToUpdate => {
                            return db.record.update(Object.assign(docToUpdate, doc));
                        });
                },

                delete(id) {
                    return this.get(id)
                        .then(docToDelete => {
                            return db.record.delete(docToDelete);
                        });
                },

                query(/* queryOptions */) {

                }
            };
        }
    };
};
