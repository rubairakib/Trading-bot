import { getEma, getMacd, getMidPrices } from "./indicators";
import {
  CandlestickApi,
  IsomorphicFetchHttpLibrary,
  ServerConfiguration,
} from "./lighter-sdk-ts/generated";
const BASE_URL = "https://mainnet.zklighter.elliot.ai";
const SOL_MARKET_ID = 2;

const klinesApi = new CandlestickApi({
  baseServer: new ServerConfiguration<{}>(BASE_URL, {}),
  httpApi: new IsomorphicFetchHttpLibrary(),
  middleware: [],
  authMethods: {},
});

export async function getIndicators(duration: "5m" | "4h", marketId: number) {
  const klines = await klinesApi.candlesticks(
    SOL_MARKET_ID,
    "4h",
    Date.now() - 1000 * 60 * 60 * (duration === "5m" ? 2 : 96),
    Date.now(),
    50,
    false
  );

  const midPrices = getMidPrices(klines.candlesticks);
  const macd = getMacd(midPrices).slice(-10);
  const ema20s = getEma(midPrices, 20);

  return {
    midPrices: midPrices.slice(-10),
    macd: macd.slice(-10),
    ema20s: ema20s.slice(-10),
  };
}
