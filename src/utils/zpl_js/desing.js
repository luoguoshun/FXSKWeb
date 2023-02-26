import JsBarcode from 'jsbarcode'
import QRcode from 'qrcode'
let rWidth
let size
export function writeCanvasZpl (idContext, jsonZPL) {
    var canvas = document.getElementById(idContext)
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < jsonZPL.length; i++) {
        const objZPL = jsonZPL[i]
        switch (objZPL.type) {
            case 'text':
                canvasText(ctx, objZPL)
                break
            case 'box':
                canvasBox(ctx, objZPL)
                break
            case 'line':
                canvasLine(ctx, objZPL)
                break
            case 'barcode':
                canvasBarcode(ctx, objZPL)
                break
            case 'qrcode':
                canvasQRcode(ctx, objZPL)
                break
            default:
                break
        }
    }
}

function canvasText (ctx, objZPL) {
    const content = objZPL.content
    const x = objZPL.x
    const y = objZPL.y
    const size = objZPL.size
    const rotate = objZPL.rotate
    ctx.save()
    ctx.font = `${size}pt Verdana`
    rWidth = ctx.measureText(content).width
    switch (rotate) {
        case 90:
            ctx.translate(x, y)
            ctx.rotate(0.5 * Math.PI)
            ctx.fillText(content, 0, 0)
            break
        case 180:
            ctx.translate(x + rWidth, y)
            ctx.rotate(1.0 * Math.PI)
            ctx.fillText(content, 0, 0)
            break
        case 270:
            ctx.translate(x + size, y + rWidth)
            ctx.rotate(1.5 * Math.PI)
            ctx.fillText(content, 0, 0)
            break
        default:
            ctx.translate(x, y + size)
            ctx.fillText(content, 0, 0)
            break
    }
    ctx.restore()
}

function canvasBox (ctx, objZPL) {
    var x = objZPL.x
    var y = objZPL.y
    var w = objZPL.w
    var h = objZPL.h
    var border = objZPL.border
    ctx.beginPath()
    ctx.lineWidth = border
    ctx.rect(x, y, w, h)
    ctx.stroke()
}

function canvasLine (ctx, objZPL) {
    var x = objZPL.x
    var y = objZPL.y
    var border = objZPL.border
    var w = objZPL.rotate === 90 ? 0 : objZPL.w
    var h = objZPL.rotate === 90 ? objZPL.w : 0
    ctx.beginPath()
    ctx.lineWidth = border
    ctx.rect(x, y, w, h)
    ctx.stroke()
}

function canvasQRcode (ctx, objZPL) {
    const content = objZPL.content
    const x = objZPL.x
    const y = objZPL.y
    const h = objZPL.h
    const w = objZPL.w
    const qrcodeCanvas = document.getElementById('QRcode')
    QRcode.toCanvas(qrcodeCanvas, content)
    ctx.drawImage(qrcodeCanvas, x, y, h, w)
    ctx.restore()
}

function canvasBarcode (ctx, objZPL) {
    var content = objZPL.content
    var x = objZPL.x
    var y = objZPL.y
    var h = objZPL.h
    var scale = objZPL.scale
    var rotate = objZPL.rotate
    JsBarcode('#barcode', content, {
        format: 'CODE128',
        lineColor: '#000',
        width: scale,
        height: h,
        margin: 0
    })
    const barcode = document.getElementById('barcode')
    ctx.save()
    switch (rotate) {
        case 90:
            ctx.translate(x + h, y)
            ctx.rotate(0.5 * Math.PI)
            break
        case 180:
            ctx.translate(x + rWidth, y)
            ctx.rotate(1.0 * Math.PI)
            break
        case 270:
            ctx.translate(x + size, y + rWidth)
            ctx.rotate(1.5 * Math.PI)
            break
        default:
            ctx.translate(x, y)
            break
    }
    ctx.drawImage(barcode, 0, 0)
    ctx.restore()
}
