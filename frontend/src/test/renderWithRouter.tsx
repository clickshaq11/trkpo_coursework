import { render } from "@testing-library/react";
import { RouterProvider, createMemoryRouter, RouteObject } from 'react-router-dom';
import { isValidElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export function renderWithRouter(children: any, routes: RouteObject[]) {
  const queryClient = new QueryClient()

  const options = isValidElement(children)
    ? { element: children, path: "/" }
    : children;

  const router = createMemoryRouter([{ ...options }, ...routes], {
    initialEntries: [options.path],
    initialIndex: 1,
  });

  return render(<QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>);
}