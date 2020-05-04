let currentEnergyPrice;
const getComedLast24HrsPrice = () => {
  // bare comed api gives us a CORS error,
  // this proxy mitigates the need for cors
  fetch('https://cors-anywhere.herokuapp.com/https://hourlypricing.comed.com/api?type=currenthouraverage')
    .then(resp => resp.json())
    .then(data => {
      currentEnergyPrice = (data[0].price)/100;
  });
}
getComedLast24HrsPrice();
