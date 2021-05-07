class Person {
  constructor(nationality) {
    this.nationality = nationality;
  }
}
const answer = function (nationality, person) {
  if (person.nationality === nationality) {
    return true;
  }
  return false;
};
