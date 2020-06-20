import React, { useState, useEffect } from 'react'
import copy from 'copy-to-clipboard'
import _ from 'lodash'

import {
  getSettingsColumns,
  getOrderColumns,
  getOrderRows,
  getPlColumns,
  getPlRows,
  getOrders,
  getBinanceFuturesOrders,
} from './functions'
import TableEdit from './TableEdit'

function App() {
  const [settings, setSettings] = useState({
    id: 'settings',
    symbol: 'tBTCF0:USTF0',
    entryPrice: 9000,
    entryAmount: 0.005,
    pricePercent: -10,
    xPrice: 0.011,
    xPositionAmount: 0,
    xAmount: 2,
    leverage: 25,
    aff_code: 'Uv2r2svs8',
    fee: 0.075,
    log: 1,
  })
  const [orderRows, setOrderRows] = useState(getOrderRows(settings))
  const [plRows, setPlRows] = useState(getPlRows(orderRows))

  useEffect(() => {
    setOrderRows(getOrderRows(settings))
  }, [settings])

  const settingsColumns = getSettingsColumns()

  const handleCopyOrders = (exchange) => {
    const getOrdersFnMap = {
      'bitfinex': getOrders,
      'binancefutures': getBinanceFuturesOrders,
    }
    const orders = getOrdersFnMap[exchange](settings, orderRows)
    console.log(orders)
    copy(orders)
  }

  return (
    <div>
      <center>
        <h3>Settings</h3>
      </center>
      <TableEdit
        rows={[settings]}
        columns={settingsColumns}
        onChange={rows => setSettings(rows[0])}
      />
      <center>
        <h3>Positions / Orders</h3>
      </center>
      <button onClick={() => setOrderRows([])}>Clear positions / orders</button>
      <button
        onClick={() => {
          const data = JSON.parse(prompt('copy(__state().data)'))
          if (!data) return
          const plRows = _.filter(
            data.positions,
            position => position.status === 'ACTIVE',
          ).map(({ id, basePrice, amount }) => ({ id, price: basePrice, amount, exitPirce: basePrice }))
          setPlRows(plRows)
          const positionRows = _.filter(
            data.positions,
            position => position.pair === settings.symbol && position.status === 'ACTIVE',
          ).map(({ id, basePrice, amount }) => ({ id, op: basePrice, oa: amount }))
          const newOrderRows = _.filter(
            data.orders.all,
            order =>
              order.symbol === settings.symbol.slice(1) &&
              order.status === 'ACTIVE' &&
              order.type === 'LIMIT' &&
              Math.sign(order.amount) === Math.sign(settings.entryAmount),
          ).map(({ id, price, amount }) => ({ id, op: price, oa: amount }))
          setOrderRows(positionRows.concat(newOrderRows))
        }}
      >
        Import Data
      </button>
      <button onClick={() => handleCopyOrders('bitfinex')}>Copy Bitfinex orders</button>
      <button onClick={() => handleCopyOrders('binancefutures')}>Copy Binance Futures orders</button>
      <TableEdit rows={orderRows} columns={getOrderColumns(orderRows)} onChange={setOrderRows} />
      <center>
        <h3>Profit / Loss</h3>
      </center>
      <TableEdit rows={plRows} columns={getPlColumns()} onChange={setPlRows} />
    </div>
  )
}

export default App
