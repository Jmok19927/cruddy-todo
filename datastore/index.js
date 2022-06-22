const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

*/
  const data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.error('readdir error', err)
    } else {
      files.forEach((file) => {
        let id = file.slice(0,5);
        // fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
        //   if (err) {
        //     console.error('exports.readAll readFile err', err);
        //   } else {
        //     var obj = { id, text };
        //     data.push(obj);
        //   }
        // })
        data.push({id, text: id});
      })
      callback(null, data);
    }
  })
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
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
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
