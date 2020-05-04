const calculateEnergyConsumptionPerDay = (watts, hoursPerDay) => ((watts*hoursPerDay)/1000);
const calculateEnergyCostPerDay = (energyConsumptionPerDay, energyCost) => ((energyConsumptionPerDay*energyCost)/100);
const calculateEnergyCost = (watts, hours, energyCost) => {
  const kw = watts/1000;
  return kw * energyCost;
}