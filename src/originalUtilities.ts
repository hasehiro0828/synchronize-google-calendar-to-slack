export namespace OriginalUtilities {
  export const dayToMilliseconds = (day: number): number => day * 24 * 60 * 60 * 1000;

  export const roundNumber = (number: number, decimalPlaces: number): number => {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  };
}
