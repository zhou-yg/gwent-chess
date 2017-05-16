fs=require('fs')
path = require('path');

const viewDir = path.join(__dirname, './web2/view/');

fs.readdirSync(viewDir).map(name=>{

  const dir = path.join(viewDir, name);

  fs.readdirSync(dir).map(fileName=>{
    const f = path.join(dir,fileName);
    var target = '';

    if(/\.js/.test(fileName)){
      target = path.join(viewDir, `index/${fileName}`);
    } else {
      target = path.join(__dirname, `./web2/${fileName}`);
    }
    fs.writeFileSync(target,fs.readFileSync(f));
  });
})
