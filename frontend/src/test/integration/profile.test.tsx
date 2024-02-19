import { it, describe, afterEach, expect } from 'vitest';
import { http, HttpResponse, RequestHandler } from 'msw';
import userEvent from '@testing-library/user-event';
import { b, server } from '@/test/unit/mockEndpoints';
import { createWrapper } from '@/test/unit/RouterProviderTestWrapper';
import { render } from '@testing-library/react';
import { myProfile, notifications } from '@/test/unit/mocks';
import { ProfileEntity } from '@/types/profiles';

let newProfileData = myProfile;

const fields = {
  shortInfo: 'new',
  password: 'new123123',
  repeatPassword: 'new123123'
}

const setup = (...handlers: RequestHandler[]) => {
  localStorage.setItem('token', '123')

  const user = userEvent.setup();

  server.resetHandlers(...handlers);

  const { router, wrapper } = createWrapper();

  const rendered = render(wrapper);

  return {
    router,
    rendered,
    user
  }
}

describe('profile', () => {
  afterEach(() => {
    newProfileData = myProfile;
  })

  it('should correctly update profile', async () => {
    const {rendered, user} = setup(
      http.get(b('notification'), () => {
        return HttpResponse.json(notifications);
      }),
      http.put(b('user'), async ({ request }) => {
        const data = await request.json() as Partial<ProfileEntity>
        newProfileData = {
          ...newProfileData,
          ...data
        }
        return HttpResponse.json();
      }),
      http.get(b('post/filter/mine*'), () => {
        return HttpResponse.json({
          content: []
        });
      }),
      http.get(b('user/me'), () => {
        return HttpResponse.json(newProfileData)
      })
    )

    const linkToMyProfile = rendered.getByLabelText(/Мой профиль/);

    await user.click(linkToMyProfile)

    const openUpdateModalButton = rendered.getByLabelText(/Open profile update modal/);

    await user.click(openUpdateModalButton)

    const shortInfoInput = rendered.getByLabelText('short-info');
    const passwordInput = rendered.getByLabelText('password');
    const repeatPasswordInput = rendered.getByLabelText('repeat-password');
    const saveButton = rendered.getByText('Сохранить');

    await user.type(shortInfoInput, fields.shortInfo)
    await user.type(passwordInput, fields.password)
    await user.type(repeatPasswordInput, fields.repeatPassword)

    await user.click(saveButton)

    const shortInfo = rendered.getByText(new RegExp(fields.shortInfo))

    expect(shortInfo).toBeInTheDocument()
  })
})