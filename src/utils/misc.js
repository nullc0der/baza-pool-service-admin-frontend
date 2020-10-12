export const getReadableCoins = (coins, coinUnits) =>
    Number(coins / coinUnits).toFixed(coinUnits.toString().length - 1)
