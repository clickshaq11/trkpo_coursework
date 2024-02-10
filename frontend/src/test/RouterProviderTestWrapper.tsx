import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { routes } from '@/config/routes';
import { vi } from 'vitest';

vi.mock('react-router-dom', async (importOriginal: any) => {
  return {
    ...await importOriginal(),
    Navigate: vi.fn(({to}) => `test redirect to ${to}`),
  };
});


const createWrapper = () => {
  const queryClient = new QueryClient();
  const router = createMemoryRouter(routes, {
    initialEntries: ['/me'],
  });

  return {
    wrapper: <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
    router,
  };
};

export { createWrapper };