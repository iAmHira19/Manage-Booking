// Simple node script to test the payment validation logic used by the UI
// This doesn't run React code; it validates the same field rules used in the UI

function isFormValid(billingInfo, TAC) {
  if (!billingInfo) return false;
  const required = [
    billingInfo.firstName,
    billingInfo.lastName,
    billingInfo.country,
    billingInfo.city,
    billingInfo.addressLine1,
    billingInfo.postalCode,
    billingInfo.phone,
    billingInfo.email,
  ];
  const allFilled = required.every((v) => v && String(v).trim().length > 0);
  return allFilled && TAC === true;
}

const sampleGood = {
  firstName: 'John',
  lastName: 'Doe',
  country: 'PK',
  city: 'LHE',
  addressLine1: 'Street 1',
  postalCode: '54000',
  phone: '03120000000',
  email: 'a@b.com'
};

const sampleBad = { ...sampleGood, email: '' };

console.log('good valid ->', isFormValid(sampleGood, true));
console.log('bad valid ->', isFormValid(sampleBad, true));
console.log('no TAC ->', isFormValid(sampleGood, false));
