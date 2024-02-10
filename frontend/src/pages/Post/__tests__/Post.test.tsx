import { afterAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostPage } from '@/pages/Post';
import { createWrapper } from '@/test/QueryProviderTestWrapper';
import * as useGetPostModule from '@/api/hooks/post/useGetPost';

const useGetPostSpy = vi.spyOn(useGetPostModule, 'useGetPost')

const setup = () => {
  const wrapper = createWrapper()
  const rendered = render(<PostPage />, {
    wrapper
  })

  return {
    rendered
  }
}


describe('Post page', () => {
  afterAll(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  it('should render message when there is no post with id', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useGetPostSpy.mockImplementation(() => {
      return {
        isError: true,
        error: {
          response: {
            status: 404
          }
        }
      }
    })

    const { rendered } = setup()

    screen.debug()

    expect(rendered.getByText(/Такого поста не существует/i)).toBeInTheDocument()
  })
})