import { afterAll, describe, expect, it, vi } from 'vitest';
import { PostPage } from '@/pages/Post';
import * as useGetPostModule from '@/api/hooks/post/useGetPost';
import * as useGetPostCommentsModule from '@/api/hooks/post/useGetPostComments';
import { postPage } from '@/test/mocks';
import { renderWithRouter } from '@/test/renderWithRouter';
import dayjs from 'dayjs';
import { dateFormat } from '@/const/dates';

const useGetPostSpy = vi.spyOn(useGetPostModule, 'useGetPost')
const useGetPostCommentsSpy = vi.spyOn(useGetPostCommentsModule, 'useGetPostComments')

const setup = () => {
  const rendered = renderWithRouter(<PostPage />, [])

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

    expect(rendered.getByText(/Такого поста не существует/i)).toBeInTheDocument()
  })

  it('should render circular progress icon when loading', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useGetPostSpy.mockImplementation(() => {
      return {
        isSuccess: false,
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useGetPostCommentsSpy.mockImplementation(() => {
      return {
        isSuccess: false,
      }
    })

    const { rendered } = setup()

    expect(rendered.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render correctly if data is loaded', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useGetPostSpy.mockImplementation(() => {
      return {
        isSuccess: true,
        data: postPage
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useGetPostCommentsSpy.mockImplementation(() => {
      return {
        isSuccess: true,
        data: []
      }
    })

    const { rendered } = setup()

    expect(rendered.queryByRole('progressbar')).not.toBeInTheDocument()

    const title = rendered.getByText(postPage.title)
    const body = rendered.getByText(postPage.body)
    const authorLogin = rendered.getByText(postPage.authorLogin)
    const date = rendered.getByText(RegExp(dayjs(postPage.createdAt).format(dateFormat)))

    expect(title).toBeInTheDocument()
    expect(body).toBeInTheDocument()
    expect(authorLogin).toBeInTheDocument()
    expect(date).toBeInTheDocument()
  })
})