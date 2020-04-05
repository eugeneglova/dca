import _ from 'lodash'

export const precision = (value, decimals = 6) =>
  Math.floor(value * 10 ** decimals) / 10 ** decimals

const getCost = (p, a) => precision(p * a)
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

export const getPosition = (pp, pa, op, oa) => {
  const p = getPosPrice(pp, pa, op, oa)
  const a = precision(pa + oa)
  const pl = getPositionPL(p, op, a, 0.002)
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

const getNextPrice = (price, xPrice, sign, index) => precision(price + sign * price * xPrice)
const getNextAmount = (amount, xAmount, index) => precision(amount * xAmount)

export const getSettingsColumns = () => [
  { name: 'symbol', title: 'Symbol' },
  { name: 'entryPrice', title: 'Entry Price' },
  { name: 'entryAmount', title: 'Entry Amount' },
  { name: 'pricePercent', title: 'Price Percent' },
  {
    name: 'price',
    title: 'Price',
    getCellValue: row => getPercentPrice(row.entryPrice, row.pricePercent),
  },
  { name: 'xPrice', title: 'x Price' },
  { name: 'xPositionAmount', title: 'x Position Amount' },
  { name: 'xAmount', title: 'x Amount' },
]

export const getPositionColumns = () => [
  { name: 'price', title: 'Pos Price' },
  { name: 'amount', title: 'Pos Amount' },
  { name: 'pc', title: 'Pos Cost', getCellValue: row => getCost(row.price, row.amount) },
  { name: 'op', title: 'Ord Price' },
  { name: 'oa', title: 'Ord Amount' },
  { name: 'oc', title: 'Ord Cost', getCellValue: row => getCost(row.op, row.oa) },
  { name: 'pl', title: 'P/L' },
  { name: 'plp', title: 'P/L%' },
]

export const getAvgPosition = (orders, maxIndex = orders.length - 1) =>
  orders.reduce((acc, order, index) => {
    if (index > maxIndex) return acc
    const { price, amount } = _.isEmpty(acc) ? { price: 0, amount: 0 } : acc
    return getPosition(price, amount, parseFloat(order.op), parseFloat(order.oa))
  }, {})

export const getOrderColumns = rows => [
  {
    name: 'price',
    title: 'Pos Price',
    getCellValue: row => getAvgPosition(rows, rows.indexOf(row)).price,
  },
  {
    name: 'amount',
    title: 'Pos Amount',
    getCellValue: row => getAvgPosition(rows, rows.indexOf(row)).amount,
  },
  {
    name: 'pc',
    title: 'Pos Cost',
    getCellValue: row => {
      const { price, amount } = getAvgPosition(rows, rows.indexOf(row))
      return getCost(price, amount)
    },
  },
  { name: 'op', title: 'Ord Price' },
  { name: 'oa', title: 'Ord Amount' },
  { name: 'oc', title: 'Ord Cost', getCellValue: row => getCost(row.op, row.oa) },
  {
    name: 'pl',
    title: 'P/L',
    getCellValue: row => getAvgPosition(rows, rows.indexOf(row)).pl,
  },
  {
    name: 'plp',
    title: 'P/L%',
    getCellValue: row => getAvgPosition(rows, rows.indexOf(row)).plp,
  },
]

export const getOrderRows = ({
  entryPrice = 6046.3,
  entryAmount = 0.001,
  pricePercent = -10,
  xPrice = 0.009,
  xPositionAmount = 0,
  xAmount = 1.35,
}) => {
  const rows = []

  let price = parseFloat(entryPrice)
  let amount = parseFloat(entryAmount)
  const sign = Math.sign(pricePercent)
  const endPrice = getPercentPrice(parseFloat(entryPrice), parseFloat(pricePercent))
  while (price * sign < sign * endPrice) {
    rows.push({ id: _.uniqueId(), op: price, oa: amount })
    const index = rows.length - 1
    const pos = getAvgPosition(rows, index)
    price = getNextPrice(price, xPrice, sign, index)
    amount = getNextAmount(parseInt(xPositionAmount) === 1 ? pos.amount : amount, xAmount, index)
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
    getCellValue: row => getPositionPL(row.price, row.exitPrice, row.amount, 0.002),
  },
  {
    name: 'plp',
    title: 'P/L%',
    getCellValue: row => precision(getPositionPLPercent(row.price, row.exitPrice, row.amount)),
  },
]

export const getPlRows = orderRows => {
  const pos = getAvgPosition(orderRows)
  return [
    { id: 'exit1', price: pos.price, amount: pos.amount, exitPrice: getPercentPrice(pos.price, 1) },
    { id: 'exit2', price: pos.price, amount: pos.amount, exitPrice: getPercentPrice(pos.price, 2) },
    { id: 'exit3', price: pos.price, amount: pos.amount, exitPrice: getPercentPrice(pos.price, 3) },
  ]
}

export const getOrders = (symbol, orderRows) => orderRows.map(({ op: price, oa: amount }) => {
  const data = {
    type: 'LIMIT',
    symbol,
    flags: 0,
    price: String(price),
    amount: String(amount),
  }
  return `__dispatch(` + JSON.stringify({
    type: 'WS_REQUEST_SEND',
    meta: { isPublic: false, throttle: true },
    payload: JSON.stringify([0, 'on', null, data]),
  }) + `)`
}).join('\n')
