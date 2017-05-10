const resources = [
  'Start.jpg',
  'TrialButton.png',
  'Title.png',
  'Prince.json',
];

const myLoader = new PIXI.loaders.Loader();

var resource;

export function load(cb) {

  resources.map((imgName) => {

    const name = imgName.replace(/\.[\w]+/,'');

    myLoader.add(name, `/web2/view/${name}/${imgName}`);
  });

  myLoader.load(function (curLoader, resourceMap) {

    resource = resourceMap;

    cb(resourceMap);
  });
}

export default function getLoader() {

  return resource;
};
