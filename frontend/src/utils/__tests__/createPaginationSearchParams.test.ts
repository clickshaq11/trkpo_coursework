import { describe, expect, it } from 'vitest';
import { createPaginationSearchParams } from '../createPaginationSearchParams';

const paramsWithNoSort = createPaginationSearchParams({
  page: 0,
  size: 0,
  type: 'createdAt',
  order: 'asc',
})

const keysWithNoSort = [...paramsWithNoSort.keys()]
const entriesWithNoSort = Object.fromEntries(paramsWithNoSort.entries())

describe('createPaginationSearchParams function with no sort specified', () => {
  it('returns URLSearchParams object with necessary keys', () => {
    expect(keysWithNoSort, "doesn't have page prop").toContain("page")
    expect(keysWithNoSort, "doesn't have size prop").toContain("size")
    expect(keysWithNoSort, "doesn't have sort prop").toContain("sort")
  });

  it('returns URLSearchParams with sort defaulted to id,desc"', () => {
    expect(entriesWithNoSort['sort'], "isn't defaulted to id,desc").eq('id,desc')
  })
});

const paramsWithSort = createPaginationSearchParams({
  page: 0,
  size: 0,
  type: 'createdAt',
  order: 'asc',
}, true)

const entriesWithSort = Object.fromEntries(paramsWithSort.entries())

describe('createPaginationSearchParams function with sort specified', () => {
  it('returns URLSearchParams with sort equal to type,order"', () => {
    expect(entriesWithSort['sort'], "isn't equal to type,order").eq('createdAt,asc')
  })
});