export const generateRandomStockPrice = (currentPrice: number): number => {
    const minFluctuation = -0.5; // -50%
    const maxFluctuation = 0.5;  // +50%
  
    const fluctuation = (Math.random() * (maxFluctuation - minFluctuation) + minFluctuation) * currentPrice;
    return parseFloat((currentPrice + fluctuation).toFixed(2));
  };
  