import { render, screen, fireEvent } from '@testing-library/react';
import { ResultScreen } from '../components/ResultScreen';

it('shows message and triggers play again', () => {
  const onPlayAgain = vi.fn();
  render(<ResultScreen correct={false} message="Deneme" onPlayAgain={onPlayAgain} />);
  expect(screen.getByText('Deneme')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /yeni tur/i }));
  expect(onPlayAgain).toHaveBeenCalledTimes(1);
});
