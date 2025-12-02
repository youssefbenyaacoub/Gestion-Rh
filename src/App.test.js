import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HR chatbot heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/HR Chatbot/i);
  expect(headingElement).toBeInTheDocument();
});
