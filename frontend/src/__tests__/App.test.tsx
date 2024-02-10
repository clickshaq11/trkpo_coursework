import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import App from '@/App';


describe('App', () => {
  it('should render root div correctly', () => {
    const rendered = render(<App />)

    expect(rendered.container).not.toBeEmptyDOMElement()
  })
})