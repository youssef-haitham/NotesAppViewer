import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

const renderNotFoundPage = () => {
  return render(
    <BrowserRouter>
      <NotFoundPage />
    </BrowserRouter>
  );
};

describe('NotFoundPage', () => {
  it('should render 404 heading', () => {
    renderNotFoundPage();

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });

  it('should render page not found message', () => {
    renderNotFoundPage();

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    renderNotFoundPage();

    const homeLink = screen.getByRole('link', { name: /go to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/notes');
  });

  it('should have correct page structure', () => {
    renderNotFoundPage();

    const heading = screen.getByRole('heading', { name: '404' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });
});
