import React from 'react'
import styled from 'styled-components'
import { Switch as AntSwitch } from 'antd'

export interface SwitchProps {
  title: string
  isChecked: boolean
  tag?: string
  onChange?: (checked: boolean, evt: Event) => any
}

export default function Switch({ title, isChecked }: SwitchProps) {
  return (
    <P>
      <span>{title}</span>
      <AntSwitch checked={isChecked} />
    </P>
  )
}

const P = styled.p`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`
