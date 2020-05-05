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
}

// the different data sets have their power consumption stats stored under different keys
const filterDevicesWithPowerConsumptionStats = (devicesArr) => {
  let filtered = [];
  const keys = ["annual_energy_use_kwh_year",
                "average_power_consumption_2_minutes_before_apd_watts",
                "single_room_configuration_test_results_on_mode_power_w",
                "multi_room_configuration_test_results_on_mode_power_w",
                "standby_power_w",
                "power_consumption_in_on_mode_watts",
                "audio_playback_power_consumption_watts"
               ]

  devicesArr.map((deviceObj) => {
    keys.map((key, idx) => {
      if (key in deviceObj) {
        deviceObj.powerConsumption = deviceObj[key];
        filtered.push(deviceObj);
      }
    });
  });
  return filtered;
}