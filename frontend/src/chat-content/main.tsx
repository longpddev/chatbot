import { render } from 'preact'
import { App } from './app.tsx'
import './styles/index.scss'
import './socket'
render(<App />, document.getElementById('app') as HTMLElement)
