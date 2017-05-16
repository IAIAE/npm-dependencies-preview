# npm-dependencies-preview
this is a scanner that can view all the dependencies before you install it


# usage

```javascript
var content  = fs.readFileSync('./_package.json', 'utf-8');

ns.config({
  getRegistry: function(name, version){
    return 'http://registry.npmjs.org/'
  }
})

ns.ls(content)
.then(map=>{
  fs.writeFileSync('./data.json', JSON.stringify(map))
  console.info('done! you will see the json file at data.json');
})
```

