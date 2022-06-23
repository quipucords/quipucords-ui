import { factsTypes } from '../constants';
import { factsService } from '../../services';

const addFacts = data => dispatch =>
  dispatch({
    type: factsTypes.ADD_FACTS,
    payload: factsService.addFacts(data)
  });

const factsActions = {
  addFacts
};

export { factsActions as default, factsActions, addFacts };
