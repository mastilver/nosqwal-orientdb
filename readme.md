# nosqwal-orientdb [![Build Status](https://travis-ci.org/mastilver/nosqwal-orientdb.svg?branch=master)](https://travis-ci.org/mastilver/nosqwal-orientdb) [![Coverage Status](https://coveralls.io/repos/github/mastilver/nosqwal-orientdb/badge.svg?branch=master)](https://coveralls.io/github/mastilver/nosqwal-orientdb?branch=master)

> [Nosqwal](https://github.com/mastilver/nosqwal) adapter for Orientdb



## Install

```
$ npm install --save nosqwal-orientdb
```


## Usage

```js
const nosqwalOrientdb = require('nosqwal-orientdb');
const db = nosqwalOrientdb();

const userCollection = db.defineCollection('user');

userCollection.query()
.then(users => {
    console.log(users);
    // => []
});

```


## API

### nosqwalOrientdb([options])

Retuns a noSqwal instance, see api [here](https://github.com/mastilver/nosqwal#api)

#### options.host

Type: `string`<br>
Default: `localhost`

Hostname of the server


#### options.port

Type: `number`<br>
Default: `2424`

Port of the server


#### options.dbName

Type: `string`<br>
Default: `default`

Database name


#### options.user

Type: `string`<br>
Default: `admin`

Username to connect to the database


#### options.password

Type: `string`<br>
Default: `admin`

Password to connect to the database


## License

MIT © [Thomas Sileghem](http://mastilver.com)
