var fs = require('fs')
var request = require('request')

const DEFAULT_REGISTRY = 'http://registry.npmjs.org/';

module.exports = {
  _conf:{},
  ls: ls,
  config: function(opt){
    this._conf = Object.assign({}, this._conf, opt);
  }
}

function ls(packageJson){
  var jsonObj = JSON.parse(packageJson);
  var {getRegistry} = this._conf
  if(!getRegistry){
    getRegistry = function(){
      return DEFAULT_REGISTRY;
    }
  }
  return new Promise((done, notDone)=>{
    var map = {};
    walk(jsonObj, map, jsonObj.name+'@'+jsonObj.version, getRegistry)
    .then(_=>{
      // fs.writeFileSync('./data2.json', JSON.stringify(map))
      done(map);
    })
    .catch(notDone)
  });
}



function getInfo(name, version, getRegistry){
  return new Promise((done, notDone)=>{
    request(getRegistry(name, version) + name+'/'+version, function(err, res, body){
      if(err){
        return notDone(err);
      }
      done(body);
    })
  })
}

function walkInfo(name, version, map, getRegistry){
  return new Promise((done, notDone)=>{
    getInfo(name, version, getRegistry)
    .then(json=>{
      var jsonObj = JSON.parse(json);
      walk(jsonObj, map, name+'@'+version, getRegistry)
      .then(done);
    })
    .catch(done)
  })
}

function walk(packageJson, map, parent, getRegistry){
  var depen = packageJson.dependencies;
  var keys = Object.keys(depen);
  return Promise.all(keys.map((name, index)=>{
      if(map[name] == null){
          map[name] = [{
            version: depen[name],
            parent: parent
          }];
          return walkInfo(name, depen[name], map, getRegistry);
      }else if(!map[name].some(_=>_.version==depen[name])){
          map[name].push({
            version: depen[name],
            parent: parent
          })
          return walkInfo(name, depen[name], map, getRegistry);
      }else{
        return Promise.resolve();
      }
    }))
}
