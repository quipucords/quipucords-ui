import { serviceCall } from './config';

const addFacts = (data = {}) =>
  serviceCall({
    method: 'post',
    url: `${process.env.REACT_APP_FACTS_SERVICE}`,
    data
  });

const factsService = {
  addFacts
};

export { factsService as default, factsService, addFacts };
