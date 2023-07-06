import React from 'react';
import { FormState } from '../formState';

describe('FormState Component', () => {
  it('should render a basic component', () => {
    const props = { setValues: { lorem: 'ipsum' } };

    const component = renderComponent(
      <FormState {...props}>
        {({ values }) => (
          <form>
            <label>
              Lorem
              <input name="lorem" value={values.lorem} readOnly type="text" />
            </label>
          </form>
        )}
      </FormState>
    );

    expect(component.instance.props).toMatchSnapshot('initial props');
    expect(component.instance.state).toMatchSnapshot('initial state');

    expect(component).toMatchSnapshot('basic');
  });

  it('should update handle reset, changes, and submit events while updating state', () => {
    const props = { setValues: { lorem: 'ipsum' }, resetUsingSetValues: true, validate: () => ({}) };

    const component = renderComponent(
      <FormState {...props}>
        {({ values, handleOnEvent, handleOnReset, handleOnSubmit }) => (
          <form onSubmit={handleOnSubmit} onReset={handleOnReset}>
            <label>
              Lorem
              <input name="lorem" value={values.lorem} type="text" onChange={handleOnEvent} />
            </label>
            <button type="submit">Submit</button>
          </form>
        )}
      </FormState>
    );

    const componentInstance = component.instance;

    componentInstance.onEvent({
      target: { value: 'dolor', name: 'lorem' },
      persist: () => {},
      preventDefault: () => {}
    });
    expect(componentInstance.state).toMatchSnapshot('onevent');
    expect(componentInstance.values).toMatchSnapshot('onevent values updated');

    componentInstance.onReset({ persist: () => {} });
    expect(componentInstance.state).toMatchSnapshot('onreset');
    expect(componentInstance.values).toMatchSnapshot('reset values updated');

    componentInstance.onSubmit({ persist: () => {}, preventDefault: () => {} });
    expect(componentInstance.state).toMatchSnapshot('onsubmit');
  });

  it('should do a basic validation check', () => {
    const props = {
      setValues: {
        lorem: 'ipsum'
      },
      validate: ({ values }) => {
        const updatedErrors = {};

        if (!values.lorem) {
          updatedErrors.lorem = 'required';
        }

        return updatedErrors;
      }
    };

    const component = renderComponent(
      <FormState {...props}>
        {({ errors, values, handleOnEvent }) => (
          <form>
            <label>
              Lorem
              <input id="lorem" value={values.lorem} type="text" onChange={handleOnEvent} />
              <span className="error">{errors.lorem}</span>
            </label>
          </form>
        )}
      </FormState>
    );

    const componentInstance = component.instance;
    expect(componentInstance.errors).toMatchSnapshot('initial errors');

    const mockEvent = { target: { value: '', id: 'lorem' }, persist: () => {}, preventDefault: () => {} };
    componentInstance.onEvent(mockEvent);
    expect(componentInstance.errors).toMatchSnapshot('basic validation');
  });

  it('should handle custom events', () => {
    const props = {
      setValues: {
        lorem: 'ipsum',
        dolor: ''
      },
      validate: ({ values }) => {
        const updatedErrors = {};

        if (!values.lorem) {
          updatedErrors.lorem = 'required';
        }

        return updatedErrors;
      }
    };

    const component = renderComponent(
      <FormState {...props}>
        {({ errors, values, handleOnEventCustom }) => (
          <form>
            <label>
              Lorem
              <input name="lorem" value={values.lorem} type="text" onChange={handleOnEventCustom} />
              <span className="error">{errors.lorem}</span>
              <input name="dolor" value={values.dolor} type="hidden" />
            </label>
          </form>
        )}
      </FormState>
    );

    const componentInstance = component.instance;
    componentInstance.onEventCustom({ name: 'lorem', value: 'woot' });
    expect(componentInstance.values).toMatchSnapshot('single custom event');

    componentInstance.onEventCustom([
      { name: 'lorem', value: 'woot again' },
      { name: 'dolor', value: 'sit' }
    ]);
    expect(componentInstance.values).toMatchSnapshot('multiple custom events');
  });

  it('should clone returned values to avoid mutation by consumer', () => {
    const props = {
      setValues: {
        lorem: 'ipsum'
      },
      validate: ({ values }) => {
        const updatedErrors = {};

        // eslint-disable-next-line
        values.lorem = 'mutated';

        return updatedErrors;
      }
    };

    const component = renderComponent(
      <FormState validateOnmount {...props}>
        {({ values }) => <div>Lorem = {values.lorem}</div>}
      </FormState>
    );

    expect(component.instance.values).toMatchSnapshot('not mutated');
  });
});
