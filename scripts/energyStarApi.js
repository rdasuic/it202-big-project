const searchForDevice = (query) => {
  const apiEndpoints = [
    "https://data.energystar.gov/resource/t9u7-4d2j.json", // dryers
    "https://data.energystar.gov/resource/bghd-e2wd.json", // washers
    "https://data.energystar.gov/resource/58b3-559d.json", // dishwashers
    "https://data.energystar.gov/resource/8t9c-g3tn.json", // freezers
    "https://data.energystar.gov/resource/re47-njqw.json", // refrigerators
    "https://data.energystar.gov/resource/ewhi-bvce.json", // audio/video
    "https://data.energystar.gov/resource/e567-rku5.json", // set-top boxes
    "https://data.energystar.gov/resource/bpzy-9tg8.json", // telephones
    "https://data.energystar.gov/resource/vd8s-5tty.json", //tvs
  ]
  let results = [];
  let requests = apiEndpoints.map(endpoint => fetch(`${endpoint}?$q=${query}`));
  return Promise.all(requests)
    .then(responses => Promise.all(responses.map(r => r.json())))
//     .then(data => {
//       data.map(d => {
//         results.push(...d);
//         return results;
//       });
//   });
//   return results;
}
searchForDevice('sony')
//   .then(data => console.log(...data))
    .then(data => console.log(data))