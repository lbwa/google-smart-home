import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { dbRef } from './firebase'
import Item, { initialDeviceState } from './Item'
import { project_id } from '../config/index.json'

export default function() {
  const [state, setState] = useState(initialDeviceState)
  useEffect(() => {
    fetch(`https://us-central1-${project_id}.cloudfunctions.net/requestSync`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(({ code }) => {
        code === 200 && console.log('Request sync success !')
      })
    dbRef.child('washer').on('value', snapshot => {
      if (snapshot.exists()) {
        setState(snapshot.val())
      }
    })

    return () => {}
  }, [])
  return (
    <Article>
      <header className="title">
        <h1>smart home dashboard</h1>
      </header>
      <main className="main">
        <Item state={state} />
      </main>
      <footer className="footer">
        &copy;{new Date().getFullYear()}&nbsp;Build with 💗
      </footer>
    </Article>
  )
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
    // color: white;
  }

  .title {
    h1 {
      margin: 0;
      text-transform: capitalize;
      // color: white;
    }
  }

  .main {
    flex: 1;
    max-width: 980px;
  }
`
