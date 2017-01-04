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
            // NOTE: catching the error here as it will throws if the collection is already defined
            const classP = db.class.create(collectionName)
                             .catch(() => {});

            return {
                get(id) {
                    return db.record.get(id);
                },

                create(doc) {
                    return classP.then(c => {
                        return c.create(doc);
                    })
                    .then(createdDoc => {
                        return this.update(Object.assign(createdDoc, {
                            id: createdDoc['@rid'].toString()
                        }));
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

                query(queryOptions) {
                    return Promise.resolve()
                    .then(() => {
                        queryOptions = queryOptions || {};

                        const sql = buildQuery(collectionName, queryOptions);

                        return db.query(sql.query, {
                            params: sql.params
                        });
                    });
                }
            };
        }
    };
};

function buildQuery(collectionName, queryOptions) {
    const where = queryOptions.where || {};
    const limit = queryOptions.limit;
    const offset = queryOptions.offset || 0;
    const orderBy = queryOptions.orderBy || [];

    const queryParams = [];
    let queryString = `
        SELECT * from ${collectionName}
    `;

    const whereString = Object.keys(where).map(prop => {
        const operator = Object.keys(where[prop])[0];

        switch (operator) {
            case '$eq': {
                const paramId = addParams(where[prop].$eq);
                return `
                    ${prop} = :${paramId}
                `;
            }
            case '$contains': {
                const paramId = addParams(where[prop].$contains);
                return `
                    :${paramId} IN ${prop}
                `;
            }
            default:
                throw new Error(`Operator: ${operator} not handled`);
        }
    })
    .join(' AND ');

    if (whereString != '') {
        queryString += ` WHERE ${whereString}`;
    }

    const orderByString = orderBy.map(order => {
        const asc = order[1] == null || order[1] === true;

        return `
            ${order[0]} ${asc ? 'ASC' : 'DESC'}
        `;
    })
    .join(', ');

    if (orderByString != '') {
        queryString += ` ORDER BY ${orderByString}`;
    }

    if (limit != null) {
        queryString += `
            LIMIT ${limit}
        `;

        if (offset !== 0) {
            queryString += `
                OFFSET ${offset}
            `;
        }
    }

    return {
        query: `${queryString};`,
        params: queryParams.reduce((obj, value, key) => {
            return Object.assign({
                [`p${key}`]: value
            }, obj);
        }, {})
    };

    function addParams(param) {
        queryParams.push(param);
        return `p${queryParams.length - 1}`;
    }
}
