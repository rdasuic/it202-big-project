const getComedLast24HrsPrice = () => {
  // bare comed api gives us a CORS error,
  // this proxy mitigates the need for cors
  fetch('https://cors-anywhere.herokuapp.com/https://hourlypricing.comed.com/api?type=5minutefeed')
    .then(resp => resp.json())
    .then(data => console.log(data));
}
getComedLast24HrsPrice();
