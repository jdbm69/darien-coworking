// tests/ReservasList.pagination.test.jsx
// Test de paginación: simula click en “Siguiente” y carga la página 2.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservasList from '@/components/ReservaList';

jest.mock('../src/lib/fetcher', () => ({
  apiFetch: jest.fn(),
}));

describe('ReservasList - paginación', () => {
  test('al hacer click en “Siguiente” carga la página 2', async () => {
    const { apiFetch } = require('../src/lib/fetcher');

    // Primer fetch: page=1
    apiFetch.mockResolvedValueOnce({
      items: [{ id: 'res-1' }, { id: 'res-2' }, { id: 'res-3' }],
      page: 1,
      totalPages: 2,
    });

    render(<ReservasList />);

    // Espera items de la página 1
    const itemsPage1 = await screen.findAllByTestId('reserva-item');
    expect(itemsPage1).toHaveLength(3);

    // Segundo fetch: page=2
    apiFetch.mockResolvedValueOnce({
      items: [{ id: 'res-4' }, { id: 'res-5' }, { id: 'res-6' }],
      page: 2,
      totalPages: 2,
    });

    // Click en “Siguiente”
    const siguiente = screen.getByRole('button', { name: /siguiente/i });
    await userEvent.click(siguiente);

    // Se deben volver a renderizar 3 ítems
    const itemsPage2 = await screen.findAllByTestId('reserva-item');
    expect(itemsPage2).toHaveLength(3);

    // Asegura que apiFetch fue llamado 2 veces y la segunda con page=2
    expect(apiFetch).toHaveBeenCalledTimes(2);
    const lastCall = apiFetch.mock.calls[1][0];
    expect(String(lastCall)).toMatch(/page=2/);
    expect(String(lastCall)).toMatch(/limit=3/);
  });
});