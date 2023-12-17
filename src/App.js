import "./App.css"
import BarChart from "./components/HorizontalBarChart"

function App() {
  return (
    <div className="App">
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          height: "100vh",
          background: "#f2f3f6",
        }}>
        <BarChart />
      </div>
    </div>
  )
}

export default App
