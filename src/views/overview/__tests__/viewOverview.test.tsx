import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { shallowComponent } from '../../../../config/jest.setupTests';
import OverviewView from '../viewOverview';

jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next');
  const stableT = (...args) => `t(${JSON.stringify(args, null, 2)})`;

  return {
    ...actual,
    useTranslation: () => ({
      t: stableT
    }),

    Trans: ({ i18nKey }) => {
      return React.createElement('div', {}, `t(${i18nKey})`);
    }
  };
});

describe('OverviewView', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<OverviewView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should toggle accordion items when clicked', async () => {
    const user = userEvent.setup();

    render(<OverviewView />);

    const firstAccordionContent = screen.getByText(/view\.overview\.faq\.item1\.content/i);
    expect(firstAccordionContent).toBeVisible();
    const secondAccordionContent = screen.getByText(/view\.overview\.faq\.item2\.content/i);
    expect(secondAccordionContent).not.toBeVisible();

    const secondAccordionToggle = screen.getByText(/view\.overview\.faq\.item2\.label/i);
    await user.click(secondAccordionToggle);

    expect(firstAccordionContent).not.toBeVisible();
    expect(secondAccordionContent).toBeVisible();
  });
});
