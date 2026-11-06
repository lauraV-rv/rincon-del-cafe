
const seed = require('../data/seed.json');

let estado = structuredClone(seed);

module.exports = {
  get: () => estado,
  reiniciar: () => {
    estado = structuredClone(seed);
  },
};
