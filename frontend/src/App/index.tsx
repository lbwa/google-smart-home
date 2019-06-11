import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card } from 'antd'
import { dbRef } from './firebase'
import Modes from './Modes'
import Switch, { SwitchProps } from '../components/Switch'
import { project_id } from '../config/index.json'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [deviceState, setDeviceState] = useState({} as DeviceState)
  const [stateMap, setStateMap] = useState([] as SwitchProps[])
  useEffect(() => {
    requestSync()

    // Listen database value changing
    dbRef.child('washer').on('value', snapshot => {
      if (snapshot.exists()) {
        const state = snapshot.val()
        setDeviceState(state)
        setStateMap([
          {
            title: 'On/Off',
            isChecked: state.OnOff.on,
            tag: 'OnOff/on'
          },
          {
            title: 'RunCycle',
            isChecked: state.RunCycle.dummy,
            tag: 'RunCycle/dummy'
          },
          {
            title: 'Start/Stop: isPaused',
            isChecked: state.StartStop.isPaused,
            tag: 'StartStop/isPaused'
          },
          {
            title: 'Start/Stop: isRunning',
            isChecked: state.StartStop.isRunning,
            tag: 'StartStop/isRunning'
          },
          {
            title: 'Toggles Turbo',
            isChecked: state.Toggles.Turbo,
            tag: 'Toggles/Turbo'
          }
        ])
      }
      setLoading(false)
    })

    return () => {}
  }, [])
  return (
    <Article>
      <header className="title">
        <h1>smart home dashboard</h1>
      </header>
      <main className="main">
        <Card title="Smart Device" style={{ width: 300 }} loading={loading}>
          <Modes mode={deviceState.Modes}>1</Modes>
          {stateMap.map(map => (
            <Switch key={map.title} {...map} />
          ))}
        </Card>
      </main>
      <footer className="footer">
        &copy;{new Date().getFullYear()}&nbsp;Build with 💗
      </footer>
    </Article>
  )
}

function requestSync() {
  return fetch(
    `https://us-central1-${project_id}.cloudfunctions.net/requestSync`,
    {
      method: 'POST'
    }
  )
    .then(res => res.json())
    .then(({ code }) => {
      code === 200 && console.log('Request sync success !')
    })
}

interface DeviceState {
  Modes: {
    load: string
  }
  OnOff: {
    on: boolean
  }
  RunCycle: {
    dummy: boolean
  }
  StartStop: {
    isPaused: boolean
    isRunning: boolean
  }
  Toggles: {
    Turbo: boolean
  }
  [key: string]: any
}

const Article = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background-color: #282c34;
  width: 100%;
  min-height: 100vh;

  .title,
  .main,
  .footer {
    width: 100%;
  }

  .title,
  .footer {
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .title {
    h1 {
      margin: 0;
      text-transform: capitalize;
    }
  }

  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    max-width: 980px;
  }
`
