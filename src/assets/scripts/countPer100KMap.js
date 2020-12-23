export default function countPer100K(cases, population) {
  return Math.round((cases / population) * 100000);
}
