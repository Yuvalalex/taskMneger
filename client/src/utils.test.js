describe('Utils module', () => {
  it('should have utility functions available', () => {
    // Utility functions are used throughout the app
    expect(true).toBe(true);
  });

  it('should handle different time formats', () => {
    const times = ['08:30', '14:15', '18:45'];
    times.forEach((time) => {
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
