function loadJson(url) {
  return fetch(url).then(x => x.json());
}

export function getData() {
  return loadJson('kepler-demo.json').then(data => {
    return {
      demo: data
    };
  });
}
