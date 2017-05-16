var ns = require('./index.js')
var fs = require('fs')

var content  = fs.readFileSync('./_package.json', 'utf-8');

ns.config({
  getRegistry: function(name, version){
    return 'http://registry.npmjs.org/'
  }
})

ns.ls(content)
.then(map=>{
  console.info(Object.keys(map).length)
  fs.writeFileSync('./data.json', JSON.stringify(map))
  console.info('done! you will see the json file at data.json');
})