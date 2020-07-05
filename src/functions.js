import _ from 'lodash'

const getDecimals = (value) => {
  const absValue = Math.abs(value)
  if (absValue < 0.0005) return 6
  if (absValue < 0.005) return 5
  if (absValue < 0.05) return 4
  if (absValue < 0.5) return 3
  if (absValue < 1) return 2
  if (absValue < 1000) return 2
  if (absValue < 10000) return 1
  return 0
}

export const precision = (value, decimals = getDecimals(value)) =>
  Math.floor(value * 10 ** decimals) / 10 ** decimals

const getCost = (p, a) => p * a
const getPosPrice = (pp, pa, op, oa) => precision((getCost(pp, pa) + getCost(op, oa)) / (pa + oa))

export const getPositionPL = (entryPrice, exitPrice, amount, fee) => {
  const pl = (exitPrice - entryPrice) * amount
  const exitFee = exitPrice * Math.abs(amount) * fee
  return precision(pl - exitFee)
}

const getPositionCost = (entryPrice, exitPrice, amount) => {
  const positiveAmount = Math.abs(amount)
  if (amount < 0) {
    return Math.max(positiveAmount * entryPrice, positiveAmount * exitPrice, 0)
  }
  return Math.max(positiveAmount * entryPrice, 0)
}

export const getPositionPLPercent = (entryPrice, exitPrice, amount) => {
  const pl = getPositionPL(entryPrice, exitPrice, amount, 0)
  const cost = getPositionCost(entryPrice, exitPrice, amount)
  return pl && cost !== 0 ? (pl / cost) * 100 : 0
}

export const getPosition = (pp, pa, op, oa, fee = 0.002) => {
  const p = getPosPrice(pp, pa, op, oa)
  const a = precision(pa + oa)
  const pl = getPositionPL(p, op, a, fee)
  const plp = precision(getPositionPLPercent(p, op, a))
  return {
    id: _.uniqueId(),
    price: p,
    amount: a,
    op,
    oa,
    pl,
    plp,
  }
}

export const getPercentPrice = (entryPrice, percent) =>
  precision(parseFloat(entryPrice) + parseFloat(entryPrice) * (parseFloat(percent) / 100))
export const getPricePercent = (price, entryPrice) =>
  precision(((parseFloat(price) - parseFloat(entryPrice)) * 100) / parseFloat(entryPrice))

const getNextPrice = (price, xPrice, sign, index, log) => {
  return parseFloat(log)
    ? precision(price + sign * price * xPrice * Math.log10((index + 2) * 1.3))
    : precision(price + sign * price * xPrice)
    // : precision(price + sign * price * xPrice * Math.pow(index + 1, 1 / 3))
}
const getNextAmount = (amount, xAmount, index) => precision(amount * xAmount)

const getLiqPrice = (price, amount, leverage, min_margin) => (
  price * (1 + (1 / leverage - min_margin) * Math.sign(amount) * -1)
)

export const getSettingsColumns = () => [
  { name: 'symbol', title: 'Symbol' },
  { name: 'entryPrice', title: 'Entry Price' },
  { name: 'entryAmount', title: 'Entry Amount' },
  { name: 'pricePercent', title: 'Price Percent' },
  {
    name: 'price',
    title: 'Price',
    getCellValue: (row) => getPercentPrice(row.entryPrice, row.pricePercent),
  },
  { name: 'xPrice', title: 'x Price' },
  { name: 'xAmount', title: 'x Amount' },
  { name: 'xAmountAfter', title: 'x After' },
  { name: 'leverage', title: 'Leverage' },
  { name: 'min_margin', title: 'Min Margin' },
  { name: 'aff_code', title: 'Ref' },
  { name: 'fee', title: 'Fee %' },
  { name: 'log', title: 'Log10 or Linear' },
]

export const getAvgPosition = (orders, maxIndex = orders.length - 1, fee) =>
  orders.reduce((acc, order, index) => {
    if (index > maxIndex) return acc
    const { price, amount } = _.isEmpty(acc) ? { price: 0, amount: 0 } : acc
    return getPosition(price, amount, parseFloat(order.op), parseFloat(order.oa), fee)
  }, {})

export const getOrderColumns = (rows, settings) => [
  {
    name: 'price',
    title: 'Pos Price',
    getCellValue: (row) => getAvgPosition(rows, rows.indexOf(row)).price,
  },
  {
    name: 'liq_price',
    title: 'Pos Liq Price (diff)',
    getCellValue: (row) => {
      const { op } = getAvgPosition(rows, rows.indexOf(row) + 1)
      const { price, amount } = getAvgPosition(rows, rows.indexOf(row))
      const liq_price = getLiqPrice(price, amount, settings.leverage, settings.min_margin)
      const diff = amount > 0 ? op - liq_price : liq_price - op
      return `${precision(liq_price)} (${precision(diff)})`
    },
  },
  {
    name: 'price diff',
    title: 'Pos Price diff',
    getCellValue: (row) => {
      const prevPrice = getAvgPosition(rows, rows.indexOf(row) - 1).price
      const diff = prevPrice - getAvgPosition(rows, rows.indexOf(row)).price
      const diffPercent = (diff / prevPrice) * 100
      return `${precision(diff || 0)} (${precision(diffPercent || 0, 2)}%)`
    },
  },
  {
    name: 'amount',
    title: 'Pos Amount',
    getCellValue: (row) => getAvgPosition(rows, rows.indexOf(row)).amount,
  },
  {
    name: 'pc',
    title: 'Pos Cost',
    getCellValue: (row) => {
      const { price, amount } = getAvgPosition(rows, rows.indexOf(row))
      return precision(getCost(price, amount))
    },
  },
  { name: 'op', title: 'Ord Price' },
  {
    name: 'oliq_price',
    title: 'Ord Liq Price',
    getCellValue: (row) => {
      const { op, oa } = getAvgPosition(rows, rows.indexOf(row))
      const liq_price = getLiqPrice(op, oa, settings.leverage, settings.min_margin)
      return precision(liq_price)
    },
  },
  {
    name: 'opp',
    title: 'Ord Price diff',
    getCellValue: (row) => {
      const { op: prevPrice } = rows[rows.indexOf(row) - 1] || {}
      const diff = prevPrice - row.op
      const diffPercent = (diff / prevPrice) * 100
      return `${precision(diff || 0)} (${precision(diffPercent || 0, 2)}%)`
    },
  },
  { name: 'oa', title: 'Ord Amount' },
  { name: 'oc', title: 'Ord Cost', getCellValue: (row) => precision(getCost(row.op, row.oa)) },
  {
    name: 'pl',
    title: 'P/L (%)',
    getCellValue: (row) => {
      const { pl, plp } = getAvgPosition(rows, rows.indexOf(row))
      return `${precision(pl, 3)} (${precision(plp, 2)}%)`
    },
  },
  {
    name: 'pl2',
    title: 'Fee P/L (%)',
    getCellValue: (row) => {
      const { pl, plp } = getAvgPosition(rows, rows.indexOf(row), (settings.fee * 2) / 100)
      return `${precision(pl, 3)} (${precision(plp, 2)}%)`
    },
  },
]

export const getOrderRows = ({
  entryPrice = 6046.3,
  entryAmount = 0.001,
  pricePercent = -10,
  xPrice = 0.009,
  xAmount = 1.35,
  xAmountAfter = 2,
  log = 1,
}) => {
  const rows = []

  let price = parseFloat(entryPrice)
  let amount = parseFloat(entryAmount)
  const sign = Math.sign(pricePercent)
  const endPrice = getPercentPrice(parseFloat(entryPrice), parseFloat(pricePercent))
  while (price * sign < sign * endPrice) {
    rows.push({ id: _.uniqueId(), op: price, oa: amount })
    const index = rows.length - 1
    price = getNextPrice(price, xPrice, sign, index, log)
    amount = index + 1 >= xAmountAfter ? getNextAmount(amount, xAmount, index) : amount
  }
  return rows
}

export const getPlColumns = () => [
  { name: 'price', title: 'Pos Price' },
  { name: 'amount', title: 'Pos Amount' },
  { name: 'exitPrice', title: 'Exit Price' },
  {
    name: 'pl',
    title: 'P/L',
    getCellValue: (row) => {
      const pl = getPositionPL(row.price, row.exitPrice, row.amount, 0.002)
      const plp = getPositionPLPercent(row.price, row.exitPrice, row.amount)
      return `${precision(pl, 3)} (${precision(plp, 2)}%)`
    },
  },
]

export const getPlRows = (orderRows) => {
  const pos = getAvgPosition(orderRows)
  return [
    { id: 'exit1', price: pos.price, amount: pos.amount, exitPrice: getPercentPrice(pos.price, 1) },
    { id: 'exit2', price: pos.price, amount: pos.amount, exitPrice: getPercentPrice(pos.price, 2) },
    { id: 'exit3', price: pos.price, amount: pos.amount, exitPrice: getPercentPrice(pos.price, 3) },
  ]
}

export const getOrders = (settings, orderRows) =>
  orderRows
    .map(({ op: price, oa: amount }) => {
      const data = {
        type: 'LIMIT',
        symbol: settings.symbol,
        flags: 0,
        price: String(price),
        amount: String(amount),
        meta: {
          lev: settings.leverage ? settings.leverage : undefined,
          aff_code: settings.aff_code,
        }
      }
      return (
        `__dispatch(` +
        JSON.stringify({
          type: 'WS_REQUEST_SEND',
          meta: { isPublic: false, throttle: true },
          payload: JSON.stringify([0, 'on', null, data]),
        }) +
        `)`
      )
    })
    .join('\n')

export const getBinanceFuturesOrders = (settings, orderRows) =>
  orderRows
    .map(({ op: price, oa: amount }) => {
      const payload = {
        symbol: settings.symbol,
        quantity: Math.abs(amount),
        type: 'LIMIT',
        timeInForce: 'GTC',
        leverage: settings.leverage,
        side: amount > 0 ? 'BUY' : 'SELL',
        stopPrice: null,
        workingType: null,
        positionSide: amount > 0 ? 'LONG' : 'SHORT',
        price: String(price),
      }
      return (
        `__NEXT_REDUX_STORE__.dispatch(` +
        JSON.stringify({
          type: 'futuresOrderForm/placeOrder',
          payload,
        }) +
        `)`
      )
    })
    .join('\n')
