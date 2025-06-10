// Chart rendering functions
function initializeCharts() {
  // Sample chart data (replace with your actual data)
  const chartData = {
    conversion: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: "Conversion Rate",
          data: [12, 19, 3, 5, 2],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    },
    journey: {
      labels: ["Homepage", "Product Page", "Cart", "Checkout"],
      datasets: [
        {
          data: [100, 80, 60, 40],
        },
      ],
    },
    campaign: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Campaign Performance",
          data: [15, 22, 18, 29],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    },
  }

  // Initialize conversion chart
  const conversionCanvas = document.getElementById("conversionChart")
  if (conversionCanvas) {
    drawLineChart(conversionCanvas, chartData.conversion)
  }

  // Initialize journey chart
  const journeyCanvas = document.getElementById("journeyChart")
  if (journeyCanvas) {
    drawFunnelChart(journeyCanvas, chartData.journey)
  }

  // Initialize heatmap chart
  const heatmapCanvas = document.getElementById("heatmapChart")
  if (heatmapCanvas) {
    drawHeatmap(heatmapCanvas)
  }

  // Initialize campaign chart
  const campaignCanvas = document.getElementById("campaignChart")
  if (campaignCanvas) {
    drawLineChart(campaignCanvas, chartData.campaign)
  }

  // Initialize keyword chart
  const keywordCanvas = document.getElementById("keywordChart")
  if (keywordCanvas) {
    drawBarChart(keywordCanvas)
  }
}

function drawLineChart(canvas, data) {
  const ctx = canvas.getContext("2d")
  const width = (canvas.width = canvas.offsetWidth)
  const height = (canvas.height = canvas.offsetHeight)

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Chart dimensions
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  // Draw grid
  ctx.strokeStyle = "#e5e7eb"
  ctx.lineWidth = 1

  // Vertical grid lines
  for (let i = 0; i <= data.labels.length; i++) {
    const x = padding + (i * chartWidth) / data.labels.length
    ctx.beginPath()
    ctx.moveTo(x, padding)
    ctx.lineTo(x, height - padding)
    ctx.stroke()
  }

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight) / 5
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // Draw data lines
  data.datasets.forEach((dataset, index) => {
    ctx.strokeStyle = dataset.borderColor
    ctx.fillStyle = dataset.backgroundColor
    ctx.lineWidth = 2

    const maxValue = Math.max(...dataset.data)
    const points = []

    // Calculate points
    dataset.data.forEach((value, i) => {
      const x = padding + ((i + 0.5) * chartWidth) / data.labels.length
      const y = height - padding - (value / maxValue) * chartHeight
      points.push({ x, y })
    })

    // Draw line
    ctx.beginPath()
    points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()

    // Draw points
    ctx.fillStyle = dataset.borderColor
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  })

  // Draw labels
  ctx.fillStyle = "#6b7280"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"

  data.labels.forEach((label, i) => {
    const x = padding + ((i + 0.5) * chartWidth) / data.labels.length
    ctx.fillText(label, x, height - 10)
  })
}

function drawFunnelChart(canvas, data) {
  const ctx = canvas.getContext("2d")
  const width = (canvas.width = canvas.offsetWidth)
  const height = (canvas.height = canvas.offsetHeight)

  ctx.clearRect(0, 0, width, height)

  const padding = 40
  const funnelWidth = width - 2 * padding
  const funnelHeight = height - 2 * padding
  const stepHeight = funnelHeight / data.labels.length

  data.labels.forEach((label, i) => {
    const value = data.datasets[0].data[i]
    const maxValue = Math.max(...data.datasets[0].data)
    const stepWidth = (value / maxValue) * funnelWidth

    const x = padding + (funnelWidth - stepWidth) / 2
    const y = padding + i * stepHeight

    // Draw funnel step
    ctx.fillStyle = `hsl(${280 + i * 20}, 70%, ${60 + i * 5}%)`
    ctx.fillRect(x, y, stepWidth, stepHeight - 5)

    // Draw label
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(label, width / 2, y + stepHeight / 2 + 4)

    // Draw value
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px sans-serif"
    ctx.fillText(`${value}%`, width / 2, y + stepHeight / 2 + 18)
  })
}

function drawHeatmap(canvas) {
  const ctx = canvas.getContext("2d")
  const width = (canvas.width = canvas.offsetWidth)
  const height = (canvas.height = canvas.offsetHeight)

  ctx.clearRect(0, 0, width, height)

  const cellSize = 20
  const cols = Math.floor(width / cellSize)
  const rows = Math.floor(height / cellSize)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const intensity = Math.random()
      const alpha = intensity * 0.8

      ctx.fillStyle = `rgba(232, 58, 119, ${alpha})`
      ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1)
    }
  }

  // Add legend
  ctx.fillStyle = "#374151"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "left"
  ctx.fillText("Guest Activity Heatmap", 10, height - 10)
}

function drawBarChart(canvas) {
  const ctx = canvas.getContext("2d")
  const width = (canvas.width = canvas.offsetWidth)
  const height = (canvas.height = canvas.offsetHeight)

  ctx.clearRect(0, 0, width, height)

  const keywords = [
    "belize luxury resort",
    "belize beach resort",
    "belize adventure",
    "belize honeymoon",
    "belize all inclusive",
  ]
  const values = [2.34, 2.12, 1.98, 2.67, 2.45]

  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding
  const barWidth = chartWidth / keywords.length - 10
  const maxValue = Math.max(...values)

  keywords.forEach((keyword, i) => {
    const barHeight = (values[i] / maxValue) * chartHeight
    const x = padding + i * (barWidth + 10)
    const y = height - padding - barHeight

    // Draw bar
    ctx.fillStyle = "#3d0c3a"
    ctx.fillRect(x, y, barWidth, barHeight)

    // Draw value
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`$${values[i]}`, x + barWidth / 2, y - 5)

    // Draw label (rotated)
    ctx.save()
    ctx.translate(x + barWidth / 2, height - 10)
    ctx.rotate(-Math.PI / 4)
    ctx.textAlign = "right"
    ctx.font = "10px sans-serif"
    ctx.fillText(keyword, 0, 0)
    ctx.restore()
  })
}
