// tests/ReservasList.delete.ok.test.js
// Caso feliz de eliminación:
// 1) Carga inicial con 3 items (page=1).
// 2) Confirm = true → dispara DELETE.
// 3) Re-fetch de la página actual → se re-renderiza con 2/menos items.
// Verificamos llamadas a apiFetch: GET inicial, DELETE, GET de refresco.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservasList from '@/components/ReservaList';

jest.mock('../src/lib/fetcher', () => ({
  apiFetch: jest.fn(),
}));

describe('ReservasList - eliminar (flujo feliz)', () => {
  beforeEach(() => {
    // Mock del confirm para aceptar la eliminación
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('cuando confirm es true, llama DELETE y luego re-fetch', async () => {
    const { apiFetch } = require('../src/lib/fetcher');

    // 1) GET inicial: 3 items, page=1
    apiFetch.mockResolvedValueOnce({
      items: [{ id: 'res-1' }, { id: 'res-2' }, { id: 'res-3' }],
      page: 1,
      totalPages: 2,
    });

    render(<ReservasList />);

    // Espera items iniciales
    const itemsIniciales = await screen.findAllByTestId('reserva-item');
    expect(itemsIniciales).toHaveLength(3);

    // 2) Mock del DELETE (responde OK)
    apiFetch.mockResolvedValueOnce({ ok: true });

    // 3) Mock del GET posterior al delete (re-fetch de la página 1)
    apiFetch.mockResolvedValueOnce({
      items: [{ id: 'res-2' }, { id: 'res-3' }], // por ejemplo, ya no está res-1
      page: 1,
      totalPages: 2,
    });

    // Click en el primer botón "Eliminar"
    // (Ajusta el selector si tu botón tiene otro texto/testid)
    const botonesEliminar = screen.getAllByRole('button', { name: /eliminar/i });
    await userEvent.click(botonesEliminar[0]);

    // Espera al re-render con 2 items
    const itemsPostDelete = await screen.findAllByTestId('reserva-item');
    expect(itemsPostDelete.length).toBe(2);

    // Validaciones de llamadas:
    // 1) GET inicial
    // 2) DELETE /api/reservas/:id
    // 3) GET de refresco page=1
    expect(apiFetch).toHaveBeenCalledTimes(3);

    const deleteCall = apiFetch.mock.calls[1]; // [urlOrPath, options]
    const deleteArg = String(deleteCall[0]);
    expect(deleteArg).toMatch(/\/api\/reservas(\?.*id=.+)?$/i);

    // Método DELETE
    const deleteOpts = deleteCall[1] || {};
    expect((deleteOpts.method || '').toUpperCase()).toBe('DELETE');

    const refetchCall = apiFetch.mock.calls[2][0];
    expect(String(refetchCall)).toMatch(/page=1/);
    expect(String(refetchCall)).toMatch(/limit=3/);
  });
});
