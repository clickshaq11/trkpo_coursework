import { describe, expect, it } from 'vitest';
import { createWrapper } from '@/test/unit/RouterProviderTestWrapper';
import { act, render, waitFor } from '@testing-library/react';
import { b, server } from '@/test/unit/mockEndpoints';
import { http, HttpResponse, RequestHandler } from 'msw';
import { RegisterFields } from '@/types/auth';
import userEvent from '@testing-library/user-event';

const validRegisterData: RegisterFields = {
  login: 'login123',
  password: 'password123',
  repeatPassword: 'password123',
  shortInfo: 'info'
};

const returnData = {
  token: '123123123'
};

const setup = (...handlers: RequestHandler[]) => {
  const user = userEvent.setup();

  server.use(...handlers);

  const { router, wrapper } = createWrapper();

  const rendered = render(wrapper);

  act(() => {
    router.navigate('/register');
  });

  const loginInput: HTMLInputElement =
    rendered.container.querySelector('#login')!;
  const passwordInput: HTMLInputElement =
    rendered.container.querySelector('#password')!;
  const repeatPasswordInput: HTMLInputElement =
    rendered.container.querySelector('#repeat-password')!;
  const shortInfoInput: HTMLInputElement =
    rendered.container.querySelector('#short-info')!;
  const registerButton: HTMLButtonElement =
    rendered.container.querySelector('button')!;

  return {
    user,
    rendered,
    router,
    loginInput,
    passwordInput,
    repeatPasswordInput,
    shortInfoInput,
    registerButton
  };
};


describe('register', () => {
  it('should successfully put token in localStorage and redirect', async () => {
    const {
      loginInput,
      passwordInput,
      registerButton,
      repeatPasswordInput,
      router,
      shortInfoInput,
      user
    } = setup(http.post(b('security/*'), () => {
      return HttpResponse.json({
        token: returnData.token,
        status: 200
      });
    }));

    await user.type(loginInput, validRegisterData.login);
    await user.type(passwordInput, validRegisterData.password);
    await user.type(repeatPasswordInput, validRegisterData.repeatPassword);
    await user.type(shortInfoInput, validRegisterData.shortInfo);

    await user.click(registerButton);

    expect(localStorage.getItem('token')).toBe(returnData.token);
    expect(router.state.location.pathname).toBe('/');
  });

  it('should display message after trying to register with taken login', async () => {
    const {
      rendered,
      loginInput,
      passwordInput,
      registerButton,
      repeatPasswordInput,
      shortInfoInput,
      user
    } = setup(http.post(b('security/*'), () => {
      return new HttpResponse(null, {
        status: 400
      });
    }));

    await user.type(loginInput, validRegisterData.login);
    await user.type(passwordInput, validRegisterData.password);
    await user.type(repeatPasswordInput, validRegisterData.repeatPassword);
    await user.type(shortInfoInput, validRegisterData.shortInfo);

    await user.click(registerButton);

    expect(rendered.getByRole('alert')).toBeInTheDocument();
  });
});

describe('logout', () => {
  it('should delete token and url is changed to /login', async () => {
    localStorage.setItem('token', '123');

    const { router, rendered, user } = setup();

    await waitFor(() => router.navigate('/'));

    const logoutButton = rendered.getByLabelText(/Выйти из аккаунта/);

    await user.click(logoutButton)

    expect(localStorage.getItem('token')).toBeNull()
    expect(router.state.location.pathname).toBe('/login')
  });
});
