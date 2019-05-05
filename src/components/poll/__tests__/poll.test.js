import React from 'react';
import { shallow } from 'enzyme';
import { Poll, PollCache } from '../poll';

describe('Poll Component', () => {
  it('should render a component that polls', done => {
    const props = {
      itemId: 'lorem',
      itemIdCheck: true,
      onPoll: jest.fn(),
      interval: 1
    };

    const component = shallow(<Poll {...props}>lorem ipsum</Poll>);
    expect(component).toMatchSnapshot('basic');
    expect(PollCache).toMatchSnapshot('pre cache');

    setTimeout(() => {
      component.setProps({
        itemIdCheck: false
      });

      expect(props.onPoll).toHaveBeenCalled();
      expect(PollCache).toMatchSnapshot('post cache');
      done();
    }, 3);
  });
});
