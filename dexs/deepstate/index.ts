import { FetchOptions, SimpleAdapter } from "../../adapters/types";
import { ethers } from "ethers";

const DEEPSTATE_V1 =
  "0x6cf19308C22FC82ea620Fa0B3E94948d20f27B96";

const NVDA =
  "0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC";

const USDG =
  "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";

const DEEP =
  "0x1DA24f6Bb623b9d1aFEae3F3146659A2662D6d27";

const abiCoder = ethers.AbiCoder.defaultAbiCoder();

function sortPair(a: string, b: string): [string, string] {
  return a.toLowerCase() < b.toLowerCase()
    ? [a, b]
    : [b, a];
}

function computePoolId(
  token0: string,
  token1: string
): string {
  return ethers.keccak256(
    abiCoder.encode(
      ["address", "address"],
      [token0, token1]
    )
  );
}

const [NVDA0, NVDA1] = sortPair(NVDA, USDG);
const [DEEP0, DEEP1] = sortPair(DEEP, USDG);

const PAIRS = [
  {
    label: "NVDA/USDG",
    token0: NVDA0,
    token1: NVDA1,
    poolId: computePoolId(NVDA0, NVDA1),
    usdgIsToken0:
      NVDA0.toLowerCase() === USDG.toLowerCase(),
  },
  {
    label: "DEEP/USDG",
    token0: DEEP0,
    token1: DEEP1,
    poolId: computePoolId(DEEP0, DEEP1),
    usdgIsToken0:
      DEEP0.toLowerCase() === USDG.toLowerCase(),
  },
];

const BOOK_INITIALIZED_ABI =
  "event BookInitialized(bytes32 poolId, bytes32 bookId, uint256 epoch)";

const SINGLE_EVENTS = [
  {
    abi: "event AskMatched(bytes32 bookId, bytes32 restingNode)",
    isBid: false,
    batch: false,
  },
  {
    abi: "event BidMatched(bytes32 bookId, bytes32 restingNode)",
    isBid: true,
    batch: false,
  },
  {
    abi: "event AsksMatched(bytes32 bookId, bytes32[] restingNodes)",
    isBid: false,
    batch: true,
  },
  {
    abi: "event BidsMatched(bytes32 bookId, bytes32[] restingNodes)",
    isBid: true,
    batch: true,
  },
];

const SUBTREE_EVENTS = [
  "event AskSubtreeMatched(bytes32 bookId, bytes32 subtreeRoot, uint160 quantity, uint256 quoteAmount)",
  "event BidSubtreeMatched(bytes32 bookId, bytes32 subtreeRoot, uint160 quantity, uint256 quoteAmount)",
];

/*
 * Exact TickMath32 constants.
 */
const FACTOR0 = [
  "0x100000000000000000000000000000000",
  "0xffffff4e8de845adac77243cd0914b37",
  "0xfffffe9d1bd1065a50971275792f1c83",
  "0xfffffdeba9ba4205ec0a898fcd6f94e9",
  "0xfffffd3a37a3f8b07e7c4871dc00d76e",
  "0xfffffc88c58e2a5a07970e01eea908e4",
  "0xfffffbd75378d702870599268a464fcf",
  "0xfffffb25e163fea9fc72a8c66eced432",
  "0xfffffa746f4fa1506788fbc89750bf71",
  "0xfffff9c2fd3bbef5c7f3511439f23c11",
  "0xfffff9118b28579a1d5c6790c7f175ab",
  "0xfffff86019156b3d676efe25eda498b3",
  "0xfffff7aea702f9dfa5d5d3bb9279d256",
  "0xfffff6fd34f10380d83ba739d8f75046",
  "0xfffff64bc2df8820fe4b37891ebb409f",
  "0xfffff59a50ce87c017af4391fc7bd1b4",
].map(BigInt);

const FACTOR1 = [
  "0x100000000000000000000000000000000",
  "0xfffff4e8debe025e24128a3d460731f1",
  "0xffffe9d1bdf703aef21ea4dcfb0682d8",
  "0xffffdeba9dab03ed16130032411d9852",
  "0xffffd3a37dda03133bde87a8379c8932",
  "0xffffc88c5e84011c0f7061c1f8747ebb",
  "0xffffbd753fa8fe023cb7f01a95a85617",
  "0xffffb25e2148f9c06fa4cf6516bd41ca",
  "0xffffa7470363f4515426d76c762b6b61",
  "0xffff9c2fe5f9edaf962e1b139ece9519",
  "0xffff9118c90ae5d5e1aae8556956bbce",
  "0xffff8601ac96dcbee28dc84499b8b8dd",
  "0xffff7aea909dd26544c77f0bdc9ee440",
  "0xffff6fd3751fc6c3b4490bedc4d9b6af",
  "0xffff64bc5a1cb9d4dd03a944c8d06bfb",
  "0xffff59a53f94ab936ae8cc833ff1a560",
].map(BigInt);

const FACTOR2 = [
  "0x100000000000000000000000000000000",
  "0xffff4e8e25879bfa09ea263360240c1a",
  "0xfffe9d1cc60ddab126de1aec4a87e7b8",
  "0xfffdebabe19266e494faa08bf06f95d2",
  "0xfffd3a3b7814eb53cd7629d70fea116a",
  "0xfffc88cb899512be849eb1004af9a6da",
  "0xfffbd75c161287e4a9d98eb29b205e4e",
  "0xfffb25ed1d8cf58667a3511be150639f",
  "0xfffa747ea0040664238f92f792405805",
  "0xfff9c3109d77653e7e48d2997f2379d1",
  "0xfff911a315e6bcd6539048f8bac58ea3",
  "0xfff860360951b7ecba3dc0ba9b0a7c4d",
  "0xfff7aec977b80143043f6d3dd6d17cca",
  "0xfff6fd5d6119439abe99c1a5c03bd998",
  "0xfff64bf1c57529b5b16747e59b571acc",
  "0xfff59a86a4cb5e55dfd877cc112a9619",
].map(BigInt);

const FACTOR3 = [
  "0x100000000000000000000000000000000",
  "0xfff4e91bff1b8c3d88338e0ebf284a4d",
  "0xffe9d2b2f7db2755ddf1d28a378a438c",
  "0xffdebcc4e4eb184180b1fe46ef229c17",
  "0xffd3a751c0f7e10bd3b9f8ae012fbe06",
  "0xffc8925986ae3ed08f06593fe67ac1bf",
  "0xffbd7ddc30bb29b9304ec1b3093eeb72",
  "0xffb269d9b9cbd4fa6c269773746a69d9",
  "0xffa756521c8daed19f3a1b48fb94c589",
  "0xff9c434553ae60823fa7dde946a88ebf",
  "0xff9130b359dbce534e76903b39de605f",
  "0xff861e9c29c4178cc9272e1140473f0b",
  "0xff7b0cffbe1596751b6382200cc3b5d9",
  "0xff6ffbde117ee04e90c901f772e3d464",
  "0xff64eb371eaec554c6d000c306ca5e48",
  "0xff59db0ae05450ba1ecf379840cb103d",
].map(BigInt);

const FACTOR4 = [
  "0x100000000000000000000000000000000",
  "0xff4ecb59511ec8a5301ba217ef18dd7c",
  "0xfe9e115c7b8f884badd25995e79d2f09",
  "0xfdedd1b496a89f34c46757b38a53619a",
  "0xfd3e0c0cf486c174853f3a5931e0ee03",
  "0xfc8ec01121e447bb455d621825da76cd",
  "0xfbdfed6ce5f09c489da5ff395ecae2e6",
  "0xfb3193cc4227c3f46f66a72687c5c9a",
  "0xfa83b2db722a033a7c25bb14315d7fcc",
  "0xf9d64a46eb939f352d2e093e4110a050",
  "0xf92959bb5dd4ba7434b7e1b1c86a6355",
  "0xf87ce0e5b2094d9bbff35cfc575603f6",
  "0xf7d0df730ad13bb8fe90d496d60fb6ea",
  "0xf7255510c4288238d1b490ead1a26390",
  "0xf67a416c733f846d81897dca4e77a30e",
  "0xf5cfa433e653729065e4527c9e33781c",
].map(BigInt);

const FACTOR5 = [
  "0x100000000000000000000000000000000",
  "0xf5257d152486cc2c7b9d0c7aed980fc3",
  "0xeac0c6e7dd24392ed02d75b3706e54fa",
  "0xe0ccdeec2a94e111065895048dd333c8",
  "0xd744fccad69d6af439a68bb9902d3fde",
  "0xce248c151f8480e3e235838f95f2c6ec",
  "0xc5672a115506dadd3e2ad0c964dd9f36",
  "0xbd08a39f580c36bea8811fb66d0faf78",
  "0xb504f333f9de6484597d89b3754abe9f",
  "0xad583eea42a14ac64980a8c8f59a2ec4",
  "0xa5fed6a9b15138ea1cbd7f621710701a",
  "0x9ef5326091a111ada0911f09ebb9fdcf",
  "0x9837f0518db8a96f46ad23182e42f6f6",
  "0x91c3d373ab11c3360fd6d8e0ae5ac9d6",
  "0x8b95c1e3ea8bd6e6fbe4628758a53c8f",
  "0x85aac367cc487b14c5c95b8c2154c1b0",
].map(BigInt);

const RESIDUAL = [
  "0x100000000000000000000000000000000",
  "0xffffffd3a37a05e383e14c90273c94f5",
  "0xffffffa746f41376f74124cd483186d4",
  "0xffffff7aea6e28ba5a1e33b2f9234215",
].map(BigInt);

function q128Mul(a: bigint, b: bigint): bigint {
  return (a * b) >> 128n;
}

function fractionFactor(fraction: bigint): bigint {
  const residual = Number(fraction & 0x03n);
  let x = fraction >> 2n;

  let factor = FACTOR0[Number(x & 0x0fn)];

  let nibble = Number((x >> 4n) & 0x0fn);
  if (nibble !== 0) {
    factor = q128Mul(factor, FACTOR1[nibble]);
  }

  nibble = Number((x >> 8n) & 0x0fn);
  if (nibble !== 0) {
    factor = q128Mul(factor, FACTOR2[nibble]);
  }

  nibble = Number((x >> 12n) & 0x0fn);
  if (nibble !== 0) {
    factor = q128Mul(factor, FACTOR3[nibble]);
  }

  nibble = Number((x >> 16n) & 0x0fn);
  if (nibble !== 0) {
    factor = q128Mul(factor, FACTOR4[nibble]);
  }

  nibble = Number((x >> 20n) & 0x0fn);
  if (nibble !== 0) {
    factor = q128Mul(factor, FACTOR5[nibble]);
  }

  if (residual !== 0) {
    factor = q128Mul(
      factor,
      RESIDUAL[residual]
    );
  }

  return factor;
}

function getPriceFactorAtTick(tick: bigint) {
  const scaledTick = tick * 3n;

  let integerExponent =
    scaledTick >> 26n;

  const fraction =
    scaledTick -
    integerExponent * (1n << 26n);

  let factor: bigint;

  if (fraction <= 0x2000000n) {
    const inverseFactor =
      fractionFactor(fraction);

    factor =
      ((1n << 256n) - 1n) /
        inverseFactor +
      1n;
  } else {
    integerExponent += 1n;

    factor = fractionFactor(
      0x4000000n - fraction
    );
  }

  return {
    factor,
    shift: 128n - integerExponent,
  };
}

function quoteAtFactor(
  tick: bigint,
  quantity: bigint,
  roundUp: boolean
): bigint {
  if (quantity === 0n) return 0n;

  const {
    factor,
    shift,
  } = getPriceFactorAtTick(tick);

  const product =
    quantity * factor;

  let quote =
    product >> shift;

  if (
    roundUp &&
    (product &
      ((1n << shift) - 1n)) !==
      0n
  ) {
    quote += 1n;
  }

  return quote;
}

function decodeNode(node: string) {
  const raw = BigInt(node);

  const quantity =
    (raw >> 64n) &
    ((1n << 160n) - 1n);

  const correctionCode =
    (raw >> 32n) &
    0xffffffffn;

  const tickRaw =
    (raw >> 224n) &
    0xffffffffn;

  const tick =
    tickRaw >= 0x80000000n
      ? tickRaw -
        0x100000000n
      : tickRaw;

  return {
    tick,
    quantity,
    correctionCode,
  };
}

function quoteFromMatchNode(
  node: string,
  restingIsBid: boolean
): bigint {
  const {
    tick,
    quantity,
    correctionCode,
  } = decodeNode(node);

  let quote =
    quoteAtFactor(
      tick,
      quantity,
      restingIsBid
    );

  const delta =
    correctionCode - 1n;

  if (restingIsBid) {
    quote += delta;
  } else {
    quote -= delta;
  }

  return quote;
}

const fetch = async (
  options: FetchOptions
) => {
  const dailyVolume =
    options.createBalances();

  const bookIdToPair =
    new Map<
      string,
      (typeof PAIRS)[number]
    >();

  /*
   * BookInitialized is only used for historical
   * book discovery. Start before the adapter's
   * start date so an already-created book is not missed.
   */
  const initializedLogs: any[] =
    await options.getLogs({
      target: DEEPSTATE_V1,
      eventAbi: BOOK_INITIALIZED_ABI,
      fromTimestamp: Math.floor(
        new Date(
          "2026-08-15T00:00:00Z"
        ).getTime() / 1000
      ),
      cacheInCloud: true,
    });

  for (const log of initializedLogs) {
    const poolId =
      String(log.poolId).toLowerCase();

    const pair =
      PAIRS.find(
        (p) =>
          p.poolId.toLowerCase() ===
          poolId
      );

    if (!pair) continue;

    const bookId =
      String(log.bookId).toLowerCase();

    bookIdToPair.set(
      bookId,
      pair
    );
  }

  /*
   * Epoch zero is deterministic and is kept as
   * a fallback for deployments where its
   * initialization happened before the scan window.
   */
  for (const pair of PAIRS) {
    const epochZeroBookId =
      ethers.keccak256(
        abiCoder.encode(
          [
            "address",
            "address",
            "uint256",
          ],
          [
            pair.token0,
            pair.token1,
            0n,
          ]
        )
      );

    bookIdToPair.set(
      epochZeroBookId.toLowerCase(),
      pair
    );
  }

  /*
   * Single and batch match events.
   */
  for (const event of SINGLE_EVENTS) {
    const logs: any[] =
      await options.getLogs({
        target: DEEPSTATE_V1,
        eventAbi: event.abi,
      });

    for (const log of logs) {
      const pair =
        bookIdToPair.get(
          String(log.bookId).toLowerCase()
        );

      if (!pair) continue;

      const nodes: string[] =
        event.batch
          ? log.restingNodes
          : [log.restingNode];

      for (const node of nodes) {
        const {
          quantity,
        } = decodeNode(node);

        /*
         * USDG is token0 for NVDA/USDG.
         * In this orientation the matched base
         * quantity itself is USDG notional.
         *
         * USDG is token1 for DEEP/USDG.
         * In this orientation quoteAmount is
         * the USDG notional.
         */
        if (pair.usdgIsToken0) {
          if (quantity > 0n) {
            dailyVolume.add(
              USDG,
              quantity.toString()
            );
          }
        } else {
          const quote =
            quoteFromMatchNode(
              node,
              event.isBid
            );

          if (quote > 0n) {
            dailyVolume.add(
              USDG,
              quote.toString()
            );
          }
        }
      }
    }
  }

  /*
   * Exact aggregate subtree match events.
   */
  for (const eventAbi of SUBTREE_EVENTS) {
    const logs: any[] =
      await options.getLogs({
        target: DEEPSTATE_V1,
        eventAbi,
      });

    for (const log of logs) {
      const pair =
        bookIdToPair.get(
          String(log.bookId).toLowerCase()
        );

      if (!pair) continue;

      const quantity =
        BigInt(log.quantity.toString());

      const quoteAmount =
        BigInt(
          log.quoteAmount.toString()
        );

      if (pair.usdgIsToken0) {
        if (quantity > 0n) {
          dailyVolume.add(
            USDG,
            quantity.toString()
          );
        }
      } else if (quoteAmount > 0n) {
        dailyVolume.add(
          USDG,
          quoteAmount.toString()
        );
      }
    }
  }

  return {
    dailyVolume,
  };
};

const methodology = {
  Volume:
    "USDG-denominated notional matched on DeepstateV1 NVDA/USDG and DEEP/USDG order books. Match-node quote reconstruction follows TickMath32 exact integer factor/shift arithmetic and DeepstateV1 rounding/correction semantics. Subtree match events use their exact emitted quoteAmount. No arbitrary 1e12 scaling or floating-point price calculation is applied.",
};

const adapter: SimpleAdapter = {
  version: 2,
  pullHourly: true,
  fetch,
  chains: ["robinhood"],
  start: "2026-08-16",
  methodology,
};

export default adapter;
