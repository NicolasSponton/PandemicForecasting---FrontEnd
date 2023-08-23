import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Line } from '@ant-design/plots'
import { Col, Row } from 'antd'

function App() {

  const [dailyCases,setDailyCases] = useState([])
  const [forecastedCases,setForecastedCases] = useState([])

  useEffect(()=>{
    fetch('http://localhost:8080/app/cases')
    .then(res => res.json())
    .then(res => {

      const currentDate = new Date();
      const tomorrow = currentDate.setDate(currentDate.getDate() + 1);

      const mappedDailyCases = res?.daily?.map((value, index, array) => ({
        cases: value,
        date: new Date(currentDate.getTime() - (array.length - index - 1) * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      }));

      const mappedForecastedCases = res?.forecast?.map((value, index) => ({
        cases: value,
        date: new Date(currentDate.getTime() + index * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10), // Increasing dates
      }));
      
      setDailyCases(mappedDailyCases || [])
      setForecastedCases(mappedForecastedCases || [])
    })
  },[])

  const config = {
    data:[...dailyCases, ...forecastedCases],
    width: 800,
    height: 400,
    autoFit: false,
    xField: 'date',
    yField: 'cases',
    lineStyle: { lineWidth: 2 },
    tooltip: { showMarkers: true, shared: true },
    responsive: true, 
    xAxis: {
      label: { autoHide: true },
    },
    yAxis: {
      label: { autoHide: true },
    },
  };

  let chart;

  return (
    <>
      <Row>
        <Col span={12}>
          <button type="button" onClick={()=>chart?.downloadImage()} style={{ marginRight: 24 }}>
            Export Image
          </button>
          <button type="button" onClick={()=>console.log(chart?.toDataURL())}>
            Get base64
          </button>
          <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </Col>
        <Col span={12}>
            <h2>Last 7 Days</h2>
            {forecastedCases.map(item => (
              <p><strong>{item.date}: </strong>{item.cases}</p>
            ))}
        </Col>
      </Row>
      
    </>
  )
}

export default App
