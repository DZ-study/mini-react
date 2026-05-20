import '@mini-react/react/jsx-dev-runtime'
import { createRoot } from '@mini-react/react-dom/client'

const Test = () => {
  return (
    <div>
      <h1>Hello, mini react</h1>
      <h3>Hello, mini react</h3>
    </div>
  ) 
}

createRoot(document.getElementById('root')!).render(
  <div>
    <h1>Hello, mini react</h1>
    <h3>Hello, mini react</h3>
    <Test />
  </div>
)