import React from 'react'
import styled from 'styled-components'
import { Switch as AntSwitch } from 'antd'

export interface SwitchProps {
  title: string
  isChecked: boolean
  path?: string[]
  onChange?: (payload: {
    checked: boolean
    path: string[] | undefined
    title: string
  }) => any
}

export default function Switch({
  title,
  isChecked,
  path,
  onChange
}: SwitchProps) {
  return (
    <P>
      <span>{title}</span>
      <AntSwitch
        onChange={(checked, evt) => {
          onChange && onChange({ checked, path, title })
        }}
        checked={isChecked}
      />
    </P>
  )
}

const P = styled.p`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`
