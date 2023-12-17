// App.js
import Chart from "chart.js/auto"
import { useEffect, useState } from "react"
import { CategoryScale } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Bar } from "react-chartjs-2"
import { Card, CardBody, CardHeader, Spinner } from "reactstrap"
import { COLORS, COMPOSITIONS } from "../shared"

Chart.register(CategoryScale)
Chart.register(ChartDataLabels)

const AverageSection = () => {
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false)
  const [spacingOffset, setSpacingOffset] = useState(20)
  const [totalCompositions, setTotalCompositions] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://flask-production-6205.up.railway.app/"
        )
        const data = await response.json()
        setTotalCompositions(
          data.reduce((a, b) => a + b.composition.reduce((a, b) => a + b, 0), 0)
        )
        const chart = {
          labels: ["Average"],
          options: {
            indexAxis: "y",
          },
          // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
          datasets: Array.from({ length: 5 }).map((_, idx) => {
            return {
              label: COMPOSITIONS[idx],
              // Averages the values in the composition array
              data: [data.reduce((a, b) => a + b.composition[idx], 0)],
              backgroundColor: COLORS[idx],
              borderSkipped: false,
              barThickness: 50,
              borderRadius: {
                topLeft: 4,
                topRight: 4,
                bottomLeft: 4,
                bottomRight: 4,
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

  const adjustBarPosition = {
    id: "adjustBarPosition",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((dataPoint, index) => {
          dataPoint.x -= spacingOffset
        })
      })
      setSpacingOffset(0)
    },
    // beforeDraw(chart, args, options) {
    //   const { ctx } = chart
    //   // Check if the translation has not been applied yet
    //   if (!chart.__translationApplied) {
    //     // Apply translation only once
    //     ctx.translate(30, 0)
    //     chart.__translationApplied = true
    //   }
    // },
  }

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
            plugins={[adjustBarPosition]}
            data={chartData}
            options={{
              hover: { mode: null },
              interaction: {
                mode: null,
              },
              clip: true,
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
                    const val = (value / totalCompositions) * 100
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
                  beginAtZero: true,
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
