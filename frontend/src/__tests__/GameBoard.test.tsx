import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../components/GameBoard';

it('renders three images and calls onSelect', () => {
  const images = ['/a.jpg', '/b.jpg', '/c.jpg'];
  const onSelect = vi.fn();
  render(<GameBoard images={images} onSelect={onSelect} hint={null} />);
  const buttons = screen.getAllByRole('button', { name: /bu görseli seç/i });
  expect(buttons).toHaveLength(3);
  fireEvent.click(buttons[1]);
  expect(onSelect).toHaveBeenCalledWith(1);
});
