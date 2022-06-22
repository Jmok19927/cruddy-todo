const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const pReaddir = Promise.promisify(fs.readdir);
const pReadFile = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //call write file with the inputs, a path that uses the unique id as the file name, content (text), err
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.error('get unique id error', err)
    } else {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        console.error('write file error', err)
      } else {
        callback(null, { id, text });
      }
    })
    }
  })


  // var id = counter.getNextUniqueId();
//   items[id] = text;
//   callback(null, { id, text });
};

exports.readAll = (callback) => {
/*
readdir -> all file names in an array
  files.forEach -> id
    fs.readFile -> text

promisify everything (readdir, readfile)
promisify the data at the end, Promise.all(data).then(todo) => callback
*/

  return pReaddir(exports.dataDir).then((files) => {

    var data = files.map((file) => {
      let id = file.slice(0,5);
      return pReadFile(path.join(exports.dataDir,  `${id}.txt`), 'utf8').then((text) => {
        return { 'id': id, 'text': text};
      })
    })
    Promise.all(data).then((data) => {
      console.log(data)
      callback(null, data)
    })
  })

};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`),'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { 'id': id, 'text': text });
    }
  })
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var newText = text;
fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
  if (err) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), newText, (err) => {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null, { id: id, text: newText });
      }
    })
  }
})

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
