// App.js
import Chart from "chart.js/auto"
import { useEffect, useState } from "react"
import { CategoryScale } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar } from "react-chartjs-2"
import { Card, CardBody, CardHeader, Spinner } from "reactstrap"

Chart.register(CategoryScale)
Chart.register(ChartDataLabels)

const AverageSection = () => {
  const colors = ["#4401ab", "#cd2b8a", "#8c62cc", "#a2a7b0", "#e7e0f4"]
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:105/")
        const data = await response.json()
        const chart = {
          labels: ["Average"],
          options: {
            indexAxis: "y",
          },
          // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
          datasets: Array.from({ length: 5 }).map((_, idx) => {
            return {
              label: ["K", "L", "M", "N", "O"][idx],
              data: data.map((item) => item.composition[idx]),
              backgroundColor: colors[idx],
              borderSkipped: false,

              lineTension: 0.4, // Adjust the line tension to make the edges curvy
              barThickness: 55,
              borderWidth: 10,
              borderColor: "white",
              borderRadius: {
                topLeft: 10,
                topRight: 10,
                bottomLeft: 10,
                bottomRight: 10,
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

  return loading ? (
    <Spinner />
  ) : (
    <Card className="w-75 border-0">
      <CardHeader
        style={{ fontWeight: 600 }}
        className="text-start px-4 bg-white">
        Overall Average
      </CardHeader>
      <CardBody>
        {chartData?.datasets?.length && (
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
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
                  grid: {
                    display: false,
                    drawTicks: false,
                  },

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
                  grid: {
                    display: false,
                    drawTicks: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              },
            }}
          />
        )}
      </CardBody>
    </Card>
  )
}

export default AverageSection
