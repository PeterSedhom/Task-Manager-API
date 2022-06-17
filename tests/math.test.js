const {fahrenheitToCelsius , celsiusToFahrenheit} = require('../src/math')

test('should convert 32 F to 0 C', () => {
    const cels = fahrenheitToCelsius(32)
    expect(cels).toBe(0)
})

test('should convert 0 C to 32 F', () => {
    const fahr = celsiusToFahrenheit(0)
    expect(fahr).toBe(32)
})