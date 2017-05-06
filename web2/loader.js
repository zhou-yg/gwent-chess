const resources = [
  'Start.jpg'
];

const myLoader = new PIXI.loaders.Loader();

var loader;

export function load(cb) {

  resources.map((imgName) => {

    const name = imgName.replace(/\.[\w]+/,'');

    myLoader.add(name, `/web2/view/${name}/${imgName}`);
  });

  myLoader.load(function (curLoader, resourceMap) {

    loader = resourceMap;

    cb(resourceMap);
  });
}

export default function getLoader() {

  return loader;
};
