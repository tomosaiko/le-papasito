/**
 * Test de validation de l'infrastructure de test
 */

describe('Infrastructure de Test', () => {
  it('devrait fonctionner correctement', () => {
    expect(1 + 1).toBe(2)
  })

  it('devrait supporter les fonctions asynchrones', async () => {
    const result = await Promise.resolve('test')
    expect(result).toBe('test')
  })

  it('devrait avoir accès aux mocks Jest', () => {
    const mockFn = jest.fn()
    mockFn('test')
    
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
}) 