# nosqwal-orientdb [![Build Status](https://travis-ci.org/mastilver/nosqwal-orientdb.svg?branch=master)](https://travis-ci.org/mastilver/nosqwal-orientdb) [![Coverage Status](https://coveralls.io/repos/github/mastilver/nosqwal-orientdb/badge.svg?branch=master)](https://coveralls.io/github/mastilver/nosqwal-orientdb?branch=master)

> [Nosqwal](https://github.com/mastilver/nosqwal) adapter for Orientdb



## Install

```
$ npm install --save nosqwal-orientdb
```


## Usage

```js
const nosqwalOrientdb = require('nosqwal-orientdb');
const db = nosqwalCouchbase();

const userCollection = db.defineCollection('user');

userCollection.query()
.then(users => {
    console.log(users);
    // => []
});

```


## API

### nosqwalCouchbase([options])

Retuns a noSqwal instance, see api [here](https://github.com/mastilver/nosqwal#api)

#### options.host

Type: `string`<br>
Default: `localhost`

Hostname of the server


#### options.port

Type: `number`
Default: `2424`

Port of the server


#### options.dbName

Type: `string`
Default: 'default'

Database name


#### options.user

Type: `string`
Default: `admin`

Username to connect to the database


#### options.password

Type: `string`
Default: `admin`

Password to connect to the database


## License

MIT © [Thomas Sileghem](http://mastilver.com)
