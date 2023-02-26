const BrowserPrintObj = () => {
	function g (a, d) {
		const c = new XMLHttpRequest()
		if ('withCredentials' in c) {
            c.open(a, d, !0)
        } else {
            // if("undefined" != typeof XDomainRequest) {
            //     c = new XDomainRequest
            //     c.open(a, d)
            // } else {
            //     c = null
            // }
        }
		return c
	}
	function h (a, d, c, b) {
        if (void 0 !== a) {
            if (void 0 === c) {
                c = a.sendFinishedCallback
            }
            if (void 0 === b) {
                b = a.sendErrorCallback
            }
        }
		d.onreadystatechange = function () {
            if (d.readyState === XMLHttpRequest.DONE && d.status === 200) {
                c(d.responseText)
            } else {
                if (d.readyState === XMLHttpRequest.DONE) {
                    if (b) {
                        b(d.responseText)
                    } else {
                        console.log('error occurred with no errorCallback set.')
                    }
                }
            }
		}
		return d
	}
	const e = {}
	const k = {}
    let f = 'http://127.0.0.1:9100/'
    if (navigator.userAgent.indexOf('Trident/7.0') <= 0 && location.protocol === 'https:') {
        f = 'https://localhost:9101/'
    }
	e.Device = function (a) {
		var d = this
		this.name = a.name
		this.deviceType = a.deviceType
		this.connection = a.connection
		this.uid = a.uid
		this.version = 2
		this.provider = a.provider
		this.manufacturer = a.manufacturer
		this.sendErrorCallback = function (c) { }
		this.sendFinishedCallback = function (c) { }
		this.send = function (c, a, l) {
            var b = g('POST', f + 'write')
            if (b) {
                h(d, b, a, l)
                b.send(JSON.stringify({
                    device: {
                        name: this.name,
                        uid: this.uid,
                        connection: this.connection,
                        deviceType: this.deviceType,
                        version: this.version,
                        provider: this.provider,
                        manufacturer: this.manufacturer
                    },
                    data: c
                }))
            }
		}
		this.sendUrl = function (c, a, l) {
			var b = g('POST', f + 'write')
			if (b) {
                h(d, b, a, l)
                b.send(JSON.stringify({
                    device: {
                        name: this.name,
                        uid: this.uid,
                        connection: this.connection,
                        deviceType: this.deviceType,
                        version: this.version,
                        provider: this.provider,
                        manufacturer: this.manufacturer
                    },
                    url: c
                }))
            }
		}
		this.readErrorCallback = function (c) { }
		this.readFinishedCallback = function (c) { }
		this.read = function (c, a) {
            var b = g('POST', f + 'read')
            if (b) {
                h(d, b, c, a)
                b.send(JSON.stringify({
                    device: {
                        name: this.name,
                        uid: this.uid,
                        connection: this.connection,
                        deviceType: this.deviceType,
                        version: this.version,
                        provider: this.provider,
                        manufacturer: this.manufacturer
                    }
                }))
            }
		}
		this.sendThenRead = function (a, b, d) {
			this.send(a, (a) => {
					return function () {
						a.read(b, d)
					}
				}, d)
		}
	}
	e.ApplicationConfiguration = function () {
		this.application = {
			version: '1.2.0.3',
			build_number: 3,
			api_level: 2,
			platform: ''
		}
	}
	e.getLocalDevices = function (a, d, c) {
        var b = g('GET', f + 'available')
        if (b) {
            const finishedFunction = function (b) {
                let response = b
                response = JSON.parse(response)
                for (var d in response) {
                    if (response.hasOwnProperty(d) && response[d].constructor === Array) {
                        for (let arr = response[d], b = 0; b < arr.length; ++b) arr[b] = new e.Device(arr[b])
                    }
                }
                if (void 0 === c) {
                    a(response)
                } else {
                    if (response.hasOwnProperty(c)) {
                        response[c] = []
                    }
                    a(response[c])
                }
            }
            h(void 0, b, finishedFunction, d)
            b.send()
        }
	}
	e.getDefaultDevice = function (a, d, c) {
        var b = 'default'
        if (void 0 !== a && a !== null) {
            b = b + '?type=' + a
        }
        a = g('GET', f + b)
		if (a) {
            const finishedFunction = function (a) {
                let response = a
                if (response === '') {
                    d(null)
                } else {
                    response = JSON.parse(response)
                    a = new e.Device(response)
                    d(a)
                }
            }
            a = h(void 0, a, finishedFunction, c)
			a.send()
        }
	}
	e.getApplicationConfiguration = function (a, d) {
        var c = g('GET', f + 'config')
        if (c) {
            const finishedFunction = function (b) {
                let response = b
                if (response === '') {
                    a(null)
                } else {
                    response = JSON.parse(response)
                    a(response)
                }
            }
            h(void 0, c, finishedFunction, d)
            c.send()
        }
	}
	e.readOnInterval = function (a, d, c) {
		if (void 0 === c || c === 0) {
            c = 1
        }
		const readFunc = function () {
			a.read(function (b) {
				d(b)
				k[a] = setTimeout(readFunc, c)
			},
            function (b) {
                k[a] = setTimeout(readFunc, c)
            })
		}
		k[a] = setTimeout(readFunc, c)
	}
	e.stopReadOnInterval = function (a) {
		k[a] && clearTimeout(k[a])
	}
	e.bindFieldToReadData = function (a, d, c, b) {
		e.readOnInterval(a,
			function (a) {
                if (a !== '') {
                    d.value = a
                    if (void 0 !== b && b !== null) {
                        b()
                    }
                }
			},
			c)
    }
	return e
}
const BrowserPrint = BrowserPrintObj()
export { BrowserPrint }
