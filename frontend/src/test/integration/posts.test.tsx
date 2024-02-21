import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { b, server } from '@/test/unit/mockEndpoints';
import { createWrapper } from '@/test/unit/RouterProviderTestWrapper';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, RequestHandler } from 'msw';
import { myProfile, notifications, post } from '@/test/unit/mocks';
import { PostEntity } from '@/types/posts';

let posts: PostEntity[] = []

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

describe('post', () => {
  beforeEach(() => {
    posts = []
  })

  afterEach(() => {
    server.restoreHandlers()
  })

  it('should successfully create new post', async () => {
    const {rendered, router, user} = setup(
      http.get(b('notification'), () => {
        return HttpResponse.json(notifications);
      }),
      http.get(b('user/me'), () => {
        return HttpResponse.json(myProfile);
      }),
      http.get(b('post/filter/feed'), () => {
        return HttpResponse.json([]);
      }),
      http.get(b('post/filter/mine*'), () => {
        return HttpResponse.json({
          content: posts
        });
      }),
      http.post(b('post'), async ({ request }) => {
        const data = await request.json() as Partial<PostEntity>
        posts.push({
          ...post,
          ...data
        })
        return HttpResponse.json()
      }),
    )
    await waitFor(() => router.navigate('/me'))

    expect(rendered.getByText(/У вас нет постов/)).toBeInTheDocument();

    const newsFeedLink = rendered.getByLabelText(/Новости/);

    await user.click(newsFeedLink)

    const openCreatePostModalButton = rendered.getByTestId('create-post');

    await user.click(openCreatePostModalButton)

    const titleInput = rendered.getByLabelText('title');
    const bodyInput = rendered.getByLabelText('body');
    const publishButton = rendered.getByLabelText('publish');

    await user.type(titleInput, '123')
    await user.type(bodyInput, '123')
    await user.click(publishButton)

    await waitFor(() => router.navigate('/me'))

    expect(rendered.getAllByTestId(/post-body/)).length(1);
    expect(rendered.getAllByTestId(/post-title/)).length(1);
  })
})