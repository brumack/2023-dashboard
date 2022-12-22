import { useState, useEffect, useRef } from 'react'
import 'semantic-ui-css/semantic.min.css'
import Form from './components/Form'
import Table from './components/Table'
import moment from 'moment'

import KrackenAPI from './api/kracken'
import ThresholdNodes from './api/thresholdNodes'

import { Header } from 'semantic-ui-react'

function App() {

  const [trackedAssets, setTrackedAssets] = useState([])
  const [dictionary, setDictionary] = useState({})
  const [totalValue, setTotalValue] = useState(0)
  const [dailyOpen, setDailyOpen] = useState()
  const [startOfDay, setStartOfDay] = useState(moment().startOf('day'))
  const [preUptime, setPreUptime] = useState([1,1,1,1,1,1,1,1,1,1])
  const [tBTCUptime, settBTCUptime] = useState([1,1,1,1,1,1,1,1,1,1])

  const fetchInterval = useRef()
  const tBTCInterval = useRef()
  const preInterval = useRef()


  const addAsset = (symbol, quantity) => {
    setTrackedAssets([ ...trackedAssets, symbol ])
    setDictionary({ ...dictionary, [symbol]: { quantity, price: 0, value: 0 }})
    setDailyOpen()
  }

  const removeAsset = symbol => {
    setTrackedAssets(trackedAssets.filter(asset => asset.symbol !== symbol))
    const clonedDict = { ...dictionary }
    delete clonedDict[symbol]
    setDictionary(clonedDict)
    setDailyOpen()
  }

  const editAsset = (symbol, quantity) => {
    const clonedDict = { ...dictionary }
    clonedDict[symbol].quantity = quantity
    clonedDict[symbol].value = quantity * clonedDict[symbol].price
    setDictionary(clonedDict)
    setDailyOpen()
    calcTotalValue(clonedDict)
  }

  const getPreHealth = async () => {
    const newStatusArray = preUptime.slice(1)
    try {
      const response = await ThresholdNodes.preHealth()
      return setPreUptime([...newStatusArray, response.statusCode === 200 ? 1: 0])
    } catch (e) {
      setPreUptime([...newStatusArray, 0])
    }
  }

  const gettBTCHealth = async () => {
    const newStatusArray = tBTCUptime.slice(1)
    try {
      const response = await ThresholdNodes.tBTChealth()
      console.log(response)
      return settBTCUptime([...newStatusArray, response.statusCode === 200 ? 1: 0])
    } catch (e) {
      settBTCUptime([...newStatusArray, 0])
    }
  }

  const getLatestPrice = async () => {
    let dict = { ...dictionary }
    for (let asset in dictionary) {
      try {
        const lastPrice = await KrackenAPI.getQuote(asset)
        dict[asset].price = lastPrice
        dict[asset].value = dict[asset].quantity * lastPrice
      } catch (e) {
        console.log(e)
      }
    } 
    setDictionary(dict)
    calcTotalValue(dict)
  }

  const calcTotalValue = (dict) => {
    let total = 0
    for (let asset in dict) {
      total += dict[asset].quantity * dict[asset].price
    }
    setTotalValue(total)

    if (!dailyOpen) setDailyOpen(total)
    else if (Math.abs(moment().diff(startOfDay) > 1000 * 60 * 60 * 24)) {
      setStartOfDay(moment())
      setDailyOpen(total)
    }
  }

  useEffect(() => {
    clearInterval(fetchInterval.current)
    fetchInterval.current = setInterval(() => getLatestPrice(), 5000)
    return () => clearInterval(fetchInterval.current.value)
  }, [trackedAssets])

  // useEffect(() => {
  //   getPreHealth()
  //   preInterval.current = setInterval(() => getPreHealth(), 60000)
  //   tBTCInterval.current = setInterval(() => gettBTCHealth(), 60000)
  // }, [])

  const tBTCstatus = tBTCUptime[9] === 0
    ? 'DOWN'
    : tBTCUptime.includes(0)
      ? 'UNSTABLE'
      : 'HEALTHY'

  const PREstatus = preUptime[9] === 0
      ? 'DOWN'
      : preUptime.includes(0)
        ? 'UNSTABLE'
        : 'HEALTHY'

  return (
    <div className="App" style={{ padding: '60px' }}>
      <p style={{ color: '#fff'}}>TBTC: {tBTCstatus}<br/> PRE: {PREstatus}</p>
      <Header 
        style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '50px',
          textAlign: 'center', 
          fontSize: '195px', 
          margin: '20px', 
          color: '#666'
        }} 
        as='h1'
      >
        { totalValue && dictionary['BTCUSD'] && <span style={{ fontSize: '110px'}}>
        ₿{(totalValue / dictionary['BTCUSD'].price).toFixed(2)}
        </span> }
        ${Number(totalValue).toFixed(2)} 
        { totalValue && dailyOpen && (
        <span style={{ fontSize: '110px', color: totalValue >= dailyOpen ? 'green' : 'red'}}>
          { (Math.abs(1 - totalValue / dailyOpen) * 100).toFixed(2) }%
        </span> )}
      </Header>
      <Form addAsset={addAsset} removeAsset={removeAsset} />
      <Table assets={dictionary} removeAsset={removeAsset} editAsset={editAsset}/>
    </div>
  );
}

export default App;
