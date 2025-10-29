import { render, screen, fireEvent } from '@testing-library/react';
import { StartScreen } from '../components/StartScreen';

it('renders and starts game on click', () => {
  const handleStart = vi.fn();
  render(<StartScreen onStart={handleStart} />);
  expect(screen.getByText(/AI Görsel Tahmin Oyunu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /başla/i }));
  expect(handleStart).toHaveBeenCalledTimes(1);
});
