// App.js
import Chart from "chart.js/auto"
import { useState, useEffect } from "react"
import { CategoryScale } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar } from "react-chartjs-2"
import { Card, Spinner } from "reactstrap"
import AverageSection from "./AverageSection"

Chart.register(CategoryScale)
Chart.register(ChartDataLabels)

const BarChart = () => {
  const COLORS = ["#4401ab", "#cd2b8a", "#8c62cc", "#a2a7b0", "#e7e0f4"]
  const COMPOSITIONS = ["K", "L", "M", "N", "O"]
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false)

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
      const { hovered } = chart

      if (hovered === undefined) {
        for (let i = 0; i < 4; i++) {
          chart.getDatasetMeta(i).data.forEach((dataPoint, index) => {
            dataPoint.x = dataPoint.x + 20
          })
        }
      }
    },
    beforeEvent(chart, args, pluginOptions) {
      chart.hovered = args.event.type
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
              maintainAspectRatio: true,
              clip: true,
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
