"use strict"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const CELL_SIDE_LENGTH = 70

const colors = {
	black : "#E7F0DC",
	red : "#597445",
	white : "#FF0000",
}

const pixelBuffer = {}

class Cell {
	xc;
	yc;
	w;
	bc;
	points;
	pointCount;
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
}

window.addEventListener("DOMContentLoaded", () => {

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

		const col = Math.floor(clickX / CELL_SIDE_LENGTH)
		const row = Math.floor(clickY / CELL_SIDE_LENGTH)

		const cellCountW = Math.floor(screenWidth / CELL_SIDE_LENGTH)

		const pixelNumber = Math.floor(row * cellCountW * (1 + 1 / cellCountW) + col)
	
		const cell = pixelBuffer[pixelNumber]
		// Add the add point functionality
		cell.addPoint(clickX, clickY)
		cell.turnRed()
		drawPoint(clickX, clickY)
	})
})

window.addEventListener("contextmenu", (e) => {e.preventDefault()})

function drawPoint(x, y) {
	ctx.beginPath()
	ctx.arc(x, y, 10, 0, 2 * Math.PI)
	ctx.fillStyle = "#000000"
	ctx.fill()
}
