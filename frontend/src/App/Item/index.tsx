import React from 'react'
import Modes from './Modes'
import { Card, Switch } from 'antd'
import styled from 'styled-components'

export default function Item({ state }: ItemProps) {
  const stateWithTitle: { [key: string]: boolean } = {
    onOff: state.OnOff.on,
    runCyCle: state.RunCycle.dummy,
    isPaused: state.StartStop.isPaused,
    isRunning: state.StartStop.isRunning,
    turbo: state.Toggles.Turbo
  }
  return (
    <Card title="Smart Device" style={{ width: 300 }}>
      <Modes mode={state.Modes}>1</Modes>
      {Object.keys(stateWithTitle).map(title => (
        <P key={title}>
          <span>{title.replace(/^[a-z]/, key => key.toUpperCase())}</span>
          <Switch checked={stateWithTitle[title]} />
        </P>
      ))}
    </Card>
  )
}

interface ItemProps {
  children?: JSX.Element | string | (JSX.Element | string)[]
  state: DeviceState
  onClick?: (prams: any) => any
}

export interface DeviceState {
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

export const initialDeviceState: DeviceState = {
  Modes: {
    load: 'string'
  },
  OnOff: {
    on: false
  },
  RunCycle: {
    dummy: false
  },
  StartStop: {
    isPaused: false,
    isRunning: false
  },
  Toggles: {
    Turbo: false
  }
}

const P = styled.p`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`
