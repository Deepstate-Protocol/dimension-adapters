import { FetchOptions, SimpleAdapter } from "../../adapters/types";
import { addTokensReceived } from "../../helpers/token";
import { METRIC } from "../../helpers/metrics";

const DEEPSTATE_V1 = "0x6cf19308C22FC82ea620Fa0B3E94948d20f27B96";
const FEE_RECIPIENT = "0xbfb7b3Ff3D498a559b946B836d26F0E168f273D5";

const USDG = "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";
const NVDA = "0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC";
const DEEP = "0x1DA24f6Bb623b9d1aFEae3F3146659A2662D6d27";

const FEE_TOKENS = [USDG, NVDA, DEEP];

const fetch = async (options: FetchOptions) => {
  const dailyFees = options.createBalances();

  for (const token of FEE_TOKENS) {
    const tokenFees = await addTokensReceived({
      options,
      token,
      target: FEE_RECIPIENT,
      fromAddressFilter: DEEPSTATE_V1,
      skipIndexer: true,
    });

    dailyFees.addBalances(tokenFees, METRIC.TRADING_FEES);
  }

  return {
    dailyFees,
    dailyRevenue: dailyFees,
    dailyProtocolRevenue: dailyFees,
  };
};

const methodology = {
  Fees:
    "Protocol execution fees generated on matched DeepstateV1 fills. Fees are measured from ERC20 transfers sent directly by DeepstateV1 to the configured fee recipient. Vault fee purchases (buyFees) are excluded.",
  Revenue:
    "100% of protocol execution fees are retained by the protocol.",
  ProtocolRevenue:
    "Full protocol execution fee amount transferred by DeepstateV1 to the configured fee recipient.",
};

const breakdownMethodology = {
  Fees: {
    [METRIC.TRADING_FEES]:
      "Basis-point protocol fee charged on matched taker output. Depending on the taker side, the fee can be denominated in token0 or token1.",
  },
  Revenue: {
    [METRIC.TRADING_FEES]:
      "Entire protocol execution fee is retained by the protocol.",
  },
  ProtocolRevenue: {
    [METRIC.TRADING_FEES]:
      "Protocol execution fee transferred directly from DeepstateV1 to the configured fee recipient.",
  },
};

const adapter: SimpleAdapter = {
  version: 2,
  pullHourly: true,
  fetch,
  chains: ["robinhood"],
  start: "2026-08-16",
  methodology,
  breakdownMethodology,
};

export default adapter;
