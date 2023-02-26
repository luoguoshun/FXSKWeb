export function compilerZpl (jsonZPL) {
    let preCompiler = ''
    for (let i = 0; i < jsonZPL.length; i++) {
        const objZPL = jsonZPL[i]
        switch (objZPL.type) {
            case 'text':
                preCompiler += zplText(objZPL)
                break
            case 'box':
                preCompiler += zplBox(objZPL)
                break
            case 'line':
                preCompiler += zplLine(objZPL)
                break
            case 'barcode':
                preCompiler += zplBarCode(objZPL)
                break
            case 'qrcode':
                preCompiler += zplQRCode(objZPL)
                break
            default:
                break
        }
    }
    return `^XA^CW1,E:SIMSUN.FNT^CI28\n${ preCompiler }^PQ1^XZ`
}

function zplText (objZPL) {
    const x = objZPL.x
    const y = objZPL.y
    const size = objZPL.size
    // const rotate = objZPL.rotate
    // let angule = ''
    // switch (rotate) {
    //     case 0:
    //         angule = 'N'
    //         break
    //     case 90:
    //         angule = 'R'
    //         break
    //     case 180:
    //         angule = 'I'
    //         break
    //     case 270:
    //         angule = 'B'
    //         break
    //     default:
    //         angule = 'N'
    //         break
    // }
    var content = objZPL.content
    return `^FO${x},${y}^A1,${size}^FD${content}^FS\n`
}
function zplBox (objZPL) {
    const x = objZPL.x
    const y = objZPL.y
    const w = objZPL.w
    const h = objZPL.h
    const border = objZPL.border
    return `^FO${x},${y}^GB${w},${h},${border}^FS\n`
}
function zplLine (objZPL) {
    const x = objZPL.x
    const y = objZPL.y
    const border = objZPL.border
    const w = objZPL.rotate === 90 ? 0 : objZPL.w
    const h = objZPL.rotate === 90 ? objZPL.w : 0
    return `^FO${x},${y}^GB${w},${h},${border}^FS\n`
}
function zplBarCode (objZPL) {
    const content = objZPL.content
    const x = objZPL.x
    const y = objZPL.y
    const h = objZPL.h
    const scale = objZPL.scale
    const rotate = objZPL.rotate
    let angule = ''
    switch (rotate) {
        case 0:
            angule = 'N'
            break
        case 90:
            angule = 'R'
            break
        case 180:
            angule = 'I'
            break
        case 270:
            angule = 'B'
            break
        default:
            angule = 'N'
            break
    }
    return `^FO${x},${y}^BY${scale},2,${h}^BC${ angule },,N,,,A^FD${content}^FS\n`
}
function zplQRCode (objZPL) {
    const content = objZPL.content
    const x = objZPL.x
    const y = objZPL.y
    const h = objZPL.h
    const w = objZPL.w
    return `^FO${x},${y}^BQN,${h},${w}^FDMM,A${ content }^FS\n`
}
