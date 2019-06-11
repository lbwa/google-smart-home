import React from 'react'
import { Radio } from 'antd'

const MODES = ['large', 'small']

export default function Modes(props: any) {
  return (
    <>
      <h3>Device modes</h3>
      <Radio.Group value={props.mode && props.mode.load}>
        {MODES.map(mode => (
          <Radio key={mode} value={mode}>
            {mode}
          </Radio>
        ))}
      </Radio.Group>
    </>
  )
}
