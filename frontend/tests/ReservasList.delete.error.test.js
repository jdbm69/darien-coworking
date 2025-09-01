// tests/ReservasList.delete.error.test.js
// Eliminar con error de servidor:
// 1) GET inicial: 3 items.
// 2) confirm() = true → DELETE falla (reject).
// 3) La lista se mantiene con 3 items (no se elimina nada).
// Validamos que se intentó el DELETE y NO se redujo el número de ítems.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservasList from '@/components/ReservaList';

jest.mock('../src/lib/fetcher', () => ({
  apiFetch: jest.fn(),
}));

describe('ReservasList - eliminar (error del servidor)', () => {
  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('si DELETE falla, no se quita el ítem y se mantiene la lista', async () => {
    const { apiFetch } = require('../src/lib/fetcher');

    // 1) GET inicial: 3 items
    apiFetch.mockResolvedValueOnce({
      items: [{ id: 'res-1' }, { id: 'res-2' }, { id: 'res-3' }],
      page: 1,
      totalPages: 2,
    });

    render(<ReservasList />);

    const itemsIniciales = await screen.findAllByTestId('reserva-item');
    expect(itemsIniciales).toHaveLength(3);

    // 2) DELETE falla
    apiFetch.mockRejectedValueOnce(new Error('DELETE failed'));

    // Click en el primer "Eliminar"
    const botonesEliminar = screen.getAllByRole('button', { name: /eliminar/i });
    await userEvent.click(botonesEliminar[0]);

    // 3) La lista debe seguir mostrando 3 items (no se eliminó)
    const itemsDespues = await screen.findAllByTestId('reserva-item');
    expect(itemsDespues).toHaveLength(3);

    // Se llamó al menos dos veces: GET inicial y luego DELETE
    expect(apiFetch).toHaveBeenCalledTimes(2);

    // Verifica que la 2da llamada fue el DELETE a /api/reservas con query id
    const deleteCall = apiFetch.mock.calls[1];
    const deleteUrl = String(deleteCall[0]);
    const deleteOpts = deleteCall[1] || {};
    expect(deleteUrl).toMatch(/\/api\/reservas\?id=.+/i);
    expect((deleteOpts.method || '').toUpperCase()).toBe('DELETE');
  });
});
