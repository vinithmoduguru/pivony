// App.js
import Chart from "chart.js/auto"
import { useState, useEffect } from "react"
import { CategoryScale } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar } from "react-chartjs-2"
import { Card, Spinner } from "reactstrap"
import AverageSection from "./AverageSection"
import { COLORS, COMPOSITIONS } from "../shared"

Chart.register(CategoryScale)
Chart.register(ChartDataLabels)

const BarChart = () => {
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false)
  const [prevHoveredState, setPrevHoveredState] = useState(undefined)
  const [hovered, setHovered] = useState(undefined)
  const [offset, setOffset] = useState(20)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://flask-production-6205.up.railway.app/"
        )
        const data = await response.json()
        const chart = {
          labels: data.map((d) => d.name),
          options: {
            indexAxis: "y",
          },
          datasets: Array.from({ length: 5 }).map((_, idx) => {
            return {
              label: COMPOSITIONS[idx],
              data: data.map((item) => item.composition[idx]),
              backgroundColor: COLORS[idx],
              borderSkipped: false,

              lineTension: 0.4,
              barThickness: 25,
              borderRadius: {
                topLeft: 25,
                topRight: 25,
                bottomLeft: 25,
                bottomRight: 25,
              },
            }
          }),
        }
        setChartData(chart)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const barPosition = {
    id: "barPosition",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      chart.data.datasets.forEach((dataset, i) => {
        if (i !== chart.data.datasets?.length - 1) {
          chart.getDatasetMeta(i).data.forEach((dataPoint, index) => {
            dataPoint.x = dataPoint.x + offset
          })
        }
      })
      setOffset(0)
    },
  }

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Card className="w-75 p-3 border-0">
        {chartData?.datasets?.length && (
          <Bar
            data={chartData}
            plugins={[barPosition]}
            options={{
              hover: { mode: null },
              maintainAspectRatio: true,
              clip: true,
              interaction: {
                mode: null,
              },
              plugins: {
                title: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
                },
                legend: {
                  display: false,
                },
                datalabels: {
                  display: true,
                  color: function (context) {
                    return context.dataset.backgroundColor === "#e7e0f4"
                      ? "#4201ae"
                      : "#fff"
                  },
                  labels: {
                    title: {
                      font: {
                        size: "14px",
                        family: "Poppins",
                        lineHeight: 25,
                      },
                    },
                  },
                  formatter: (value, ctx) => {
                    const val =
                      (value / ctx.dataset.data.reduce((a, b) => a + b, 0)) *
                      100
                    return `${val.toFixed(0)}%`
                  },
                },
              },
              indexAxis: "y",
              scales: {
                x: {
                  border: {
                    display: false,
                  },
                  stacked: true,
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  border: {
                    display: false,
                  },
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    // display: false,
                  },
                },
              },
            }}
          />
        )}
      </Card>
      <div className="w-100 justify-content-center d-flex mt-4">
        <AverageSection data={chartData} />
      </div>
    </>
  )
}

export default BarChart
