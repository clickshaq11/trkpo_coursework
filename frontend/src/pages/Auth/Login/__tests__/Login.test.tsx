import { describe, expect, it } from 'vitest';
import { Login, Register } from '@/pages';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@/test/unit/renderWithRouter';

const VALID_LOGIN = 'Abcabc123';
const VALID_PASSWORD = 'Abcabc123';

const INVALID_LOGIN = '123123';
const INVALID_PASSWORD = '123123';

const getFields = () => {
  const user = userEvent.setup();
  const rendered = renderWithRouter(<Login />, []);

  const loginInput: HTMLInputElement =
    rendered.container.querySelector('#login')!;
  const passwordInput: HTMLInputElement =
    rendered.container.querySelector('#password')!;
  const loginButton: HTMLButtonElement =
    rendered.container.querySelector('button')!;

  return {
    user,
    rendered,
    loginInput,
    passwordInput,
    loginButton,
  };
};

describe('Login page', () => {
  it('submit button should be disabled if fields are empty', async () => {
    const rendered = renderWithRouter(<Login />, []);

    expect(rendered.getByText('Войти')).toBeDisabled();
  });

  it('anchor should link to register page', async () => {
    const user = userEvent.setup();

    const rendered = renderWithRouter(<Login />, [
      {
        path: '/register',
        element: <Register />,
      },
    ]);

    await user.click(rendered.container.querySelector('a')!);

    expect(rendered.getByText('Регистрация')).toBeInTheDocument();
  });

  it('submit button should not be disabled if all the fields are correct', async () => {
    const { loginInput, passwordInput, loginButton, user } = getFields();

    await user.type(loginInput, VALID_LOGIN);
    await user.type(passwordInput, VALID_PASSWORD);

    expect(loginInput.value).toBe(VALID_LOGIN);
    expect(loginButton).not.toBeDisabled();
  });

  it('submit button should be disabled if login input is correct, but password is not', async () => {
    const { loginInput, passwordInput, loginButton, user } = getFields();

    await user.type(loginInput, VALID_LOGIN);

    await user.type(passwordInput, INVALID_PASSWORD);

    expect(loginButton).toBeDisabled();
  });

  it('submit button should be disabled if password input is correct, but login is not', async () => {
    const { loginInput, passwordInput, loginButton, user } = getFields();

    await user.type(loginInput, INVALID_LOGIN);

    await user.type(passwordInput, VALID_PASSWORD);

    expect(loginButton).toBeDisabled();
  });

  it('should check for login input edge cases', async () => {
    const { loginInput, passwordInput, loginButton, user } = getFields();

    await user.type(passwordInput, VALID_PASSWORD);

    expect(loginButton).toBeDisabled();

    await user.type(loginInput, 'x'.repeat(7));

    expect(
      loginButton,
      'login input is not validated for min length',
    ).toBeDisabled();

    await user.type(loginInput, 'x'.repeat(51));

    expect(
      loginButton,
      'login input is not validated for max length',
    ).toBeDisabled();

    await user.type(loginInput, 'Неправильные символы');

    expect(
      loginButton,
      'login input is not validated for characters',
    ).toBeDisabled();
  });

  it('should check for password input edge cases', async () => {
    const { loginInput, passwordInput, loginButton, user } = getFields();

    await user.type(loginInput, VALID_LOGIN);

    expect(loginButton).toBeDisabled();

    await user.type(passwordInput, 'x'.repeat(7));

    expect(
      loginButton,
      'password input is not validated for min length',
    ).toBeDisabled();

    await user.type(passwordInput, 'x'.repeat(51));

    expect(
      loginButton,
      'password input is not validated for max length',
    ).toBeDisabled();

    await user.type(passwordInput, 'Неправильные символы');

    expect(
      loginButton,
      'password input is not validated for characters',
    ).toBeDisabled();
  });

  it('field errors are shown', async () => {
    const { loginInput, passwordInput, user, rendered } = getFields();

    await user.type(loginInput, INVALID_LOGIN);
    await user.type(passwordInput, INVALID_PASSWORD);

    const errors = rendered.getAllByRole('alert');

    expect(errors).length(2);
  });
});
