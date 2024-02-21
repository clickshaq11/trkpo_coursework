import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import SortButtons from '@/components/Profile/SortButtons';
import { pagination } from '@/test/unit/mocks';
import userEvent from '@testing-library/user-event';

// order: asc
// type: createdAt
const setup = () => {
  const paginationValue = pagination;
  const paginationSetter = () => {};

  const rendered = render(
    <SortButtons
      pagination={{
        paginationParams: paginationValue,
        setPaginationParams: paginationSetter,
      }}
    />,
  );

  const typeButton = rendered.getByText(/Тип сортировки/i);
  const orderButton = rendered.getByText(/Сортировка по/i);

  return {
    rendered,
    typeButton,
    orderButton,
  };
};

describe('SortButtons', () => {
  it('should display default sort values correctly', () => {
    const { rendered } = setup();

    expect(rendered.getByText(/По дате/i)).toBeInTheDocument();
    expect(rendered.getByText(/По возрастанию/i)).toBeInTheDocument();
  });

  it('should open sort dropdown when pressing on type button', async () => {
    const user = userEvent.setup();

    const { rendered, typeButton } = setup();

    await user.click(typeButton);

    expect(rendered.getByText(/По популярности/i)).toBeInTheDocument();

    const buttons = rendered.getAllByText(/По дате/i);

    expect(buttons).length(2);
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });
});
