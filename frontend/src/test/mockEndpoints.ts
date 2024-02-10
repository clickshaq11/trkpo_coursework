import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http, delay } from 'msw';
import { BASE_URL } from '@/api/axios';
import { comments, myProfile, notifications, otherProfile, post, posts, profiles } from '@/test/mocks';
import { queryClient } from '@/test/QueryProviderTestWrapper';

export const b = (path: string) => {
  return new URL(path, `${BASE_URL}/`).toString();
};

export const restHandlers = [
  http.post(b('security/*'), () => {
    return HttpResponse.json({
      token: '123',
      status: 200
    });
  }),
  http.get(b('post/filter/feed'), () => {
    return HttpResponse.json(posts);
  }),
  http.post(b('post'), () => {
    return HttpResponse.json();
  }),
  http.get(b('notification'), () => {
    return HttpResponse.json(notifications);
  }),
  http.get(b('user/login/*'), () => {
    return HttpResponse.json(profiles);
  }),
  http.get(b('user/me'), () => {
    return HttpResponse.json(myProfile);
  }),
  http.get(b('post/filter/mine*'), () => {
    return HttpResponse.json(posts);
  }),
  http.put(b('user'), async () => {
    await delay(1);
    return HttpResponse.json();
  }),
  http.get(b('user/id/*'), () => {
    return HttpResponse.json(otherProfile);
  }),
  http.get(b('post/user/*'), () => {
    return HttpResponse.json(posts);
  }),
  http.post(b('subscription/*'), () => {
    return HttpResponse.json();
  }),
  http.post(b('post/*'), () => {
    return HttpResponse.json();
  }),
  http.get(b('post/*/comment'), () => {
    return HttpResponse.json(comments);
  }),
  http.get(b('post/*'), async () => {
    console.log('dasdsad');
    //await delay(1);
    return HttpResponse.json(post);
  }),
  http.delete(b('post/*'), () => {
    return HttpResponse.json();
  }),
  http.put(b('post/*'), () => {
    return HttpResponse.json();
  })
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
beforeEach(() => queryClient.clear());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
