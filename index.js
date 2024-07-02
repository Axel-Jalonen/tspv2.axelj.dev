"use strict"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const CELL_SIDE_LENGTH = 70

const colors = {
  black : "#005050",
  red : "#002525",
  white : "#FF0000",
}

const pixelBuffer = {}

class Board {
  points 
  cells
  constructor() {
    this.points = []
    this.cells = []
  }
  addPoint(x,y) {
    this.points.push({x,y})
  }
  addCell(cell) {
    this.cells.push(cell)
  }
  getRandomCell() {
    console.log("Get random cell was called")
    const occupiedCellLength = this.cells.length
    const chosenCell = this.cells[Math.floor(Math.random() * occupiedCellLength)]
    return chosenCell
  }
  connectDots() {
    for (let j = 0; j < this.points.length; j++) {
      const prevPoint = this.points[j]
      const nextPoint = this.points[j+1]
      if (!nextPoint) {
        break
      }
      drawLine(prevPoint.x, prevPoint.y, nextPoint.x, nextPoint.y)
    }
  }
}

class Cell{
  xc
  yc
  w
  bc
  points
  pointCount
  constructor(x, y, width, bc) {
    this.xc = x
    this.yc = y
    this.w = width
    this.bc = bc
    this.points = []
    this.pointCount = 0
  }
  draw() {
    ctx.fillStyle = this.bc
    ctx.fillRect(this.xc, this.yc, this.w, this.w)
  }
  addPoint(x, y) {
    this.points.push({x,y})
    this.pointCount++
    console.log(this.points, this.pointCount)
  }
  turnRed() {
    ctx.fillStyle = colors.white
    ctx.fillRect(this.xc, this.yc, this.w, this.w)
    for (let point of this.points) {
      drawPoint(point.x, point.y)
    }
  }
  get pointCount() {
    return this.pointCount
  }
  makeArbColor(c) {
    ctx.fillStyle = c
    ctx.fillRect(this.xc, this.yc, this.w, this.w)
  }
}

window.addEventListener("DOMContentLoaded", () => {

  const board = new Board()
  
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight

  let count = 0;
  for (let j = 0; j < Math.floor(window.innerHeight / CELL_SIDE_LENGTH); j++) {
    for (let i = 0; i < Math.floor(window.innerWidth / CELL_SIDE_LENGTH); i++) {
      const color = count % 2 === 0 ? colors.black : colors.red
      const cell = new Cell(
        i * CELL_SIDE_LENGTH, 
        j * CELL_SIDE_LENGTH, 
        CELL_SIDE_LENGTH, 
        color
      )
      cell.draw()
      pixelBuffer[count] = cell
      count++
    }
    count++
  }

  window.addEventListener("mousedown", (mouseEvent) => {
    const clickX = mouseEvent.offsetX
    const clickY = mouseEvent.offsetY
    const screenWidth = window.innerWidth

    const pixelNumber = getPixelNumber(clickX, clickY, screenWidth)
    const cell = pixelBuffer[pixelNumber]

    cell.addPoint(clickX, clickY)
    cell.turnRed()

    board.addCell(cell)

    drawPoint(clickX, clickY)

    board.addPoint(clickX, clickY)

    board.connectDots()

    const randCell = board.getRandomCell()
    randCell.makeArbColor("#FFFFFF")

  })
})

// Returns the cell index under a certain point
// takes x & y coordinates and the screen width
function getPixelNumber(x, y, w) {
    const col = Math.floor(x / CELL_SIDE_LENGTH)
    const row = Math.floor(y / CELL_SIDE_LENGTH)

    const cellCountW = Math.floor(w / CELL_SIDE_LENGTH)

    const pixelNumber = Math.floor(row * cellCountW * (1 + 1 / cellCountW) + col)
    return pixelNumber
}

window.addEventListener("contextmenu", (e) => {e.preventDefault()})

function drawPoint(x, y) {
  ctx.beginPath()
  ctx.arc(x, y, 10, 0, 2 * Math.PI)
  ctx.fillStyle = "#FFFF00"
  ctx.fill()
}

function drawLine(x, y, tx, ty) {
  ctx.beginPath()
  ctx.moveTo(x,y)
  ctx.lineTo(tx,ty)
  ctx.strokeStyle = "#FFFF00"
  ctx.stroke()
}
