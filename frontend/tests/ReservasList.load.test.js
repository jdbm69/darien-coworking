// tests/ReservasList.load.test.jsx
// Test “carga inicial (happy path)” usando mock del módulo apiFetch.

import { render, screen } from '@testing-library/react';
import ReservasList from '@/components/ReservaList';

// Mockeamos el módulo que usa el componente para pedir datos
jest.mock('../src/lib/fetcher', () => ({
  apiFetch: jest.fn(),
}));

describe('ReservasList - carga inicial (happy path)', () => {
  test('renderiza 3 items cuando la API devuelve 3 reservas', async () => {
    const { apiFetch } = require('../src/lib/fetcher');

    apiFetch.mockResolvedValueOnce({
      items: [{ id: 'res-1' }, { id: 'res-2' }, { id: 'res-3' }],
      page: 1,
      totalPages: 2,
    });

    render(<ReservasList />);

    const items = await screen.findAllByTestId('reserva-item');
    expect(items).toHaveLength(3);
  });
});

