import React from 'react'
import ReactDOM from 'react-dom/client'
import { ActionPopup } from './components/ActionPopup'
import './index.css'

const rootElement = document.getElementById('popup-root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ActionPopup />
    </React.StrictMode>
  )
}
