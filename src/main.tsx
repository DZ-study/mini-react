import { render, useState, createElement } from './react'

function App() {
  const [count, setCount] = useState({
    count: 0,
    name: 'Mini React',
  })
  const [name, setName] = useState('Mini React')
  const [num, setNum] = useState(1)

    return (
      <div>
        <h1>Count: {count.count}</h1>
        <button onClick={() => setCount({
          count: 'sd',
          name: 'Mini React 2',
        })}>Increment</button>
        <h1>Name: {name}</h1>
        <button onClick={() => setName('Mini React 2')}>Change Name</button>
        <h1>Num: {num}</h1>
        <button onClick={() => setNum(num + 1)}>Increment</button>
      </div>
    )
}

render(<App />, document.getElementById('app') as HTMLElement)