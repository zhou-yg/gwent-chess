const resources = [
  'TrialButton.png',
  'Title.png',
  'Prince.json',
  'grass0.png',
  'grass1.png',
  'grass2.png',
  'grass3.png',
  'block0.png',
  'block1.png',
];

const myLoader = new PIXI.loaders.Loader();

var resource;

export function load(cb) {

  resources.map((imgName) => {

    const name = imgName.replace(/\.[\w]+/,'');

    myLoader.add(name, `/web2/static/${imgName}`);
  });

  myLoader.load(function (curLoader, resourceMap) {

    resource = resourceMap;

    cb(resourceMap);
  });
}

export default function getLoader() {

  return resource;
};
