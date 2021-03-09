var socket = io()

var enginesStart = document.getElementById('engines-start')
var balanceValue = document.getElementById('balanceVal')
var pVal = document.getElementById('pVal')
var iVal = document.getElementById('iVal')
var dVal = document.getElementById('dVal')

enginesStart.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'engineSwitch',
    value: enginesStart.checked,
  })
})

balanceValue.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'balanceValue',
    value: balanceValue.value,
  })
})

pVal.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'pVal',
    value: pVal.value,
  })
})

iVal.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'iVal',
    value: iVal.value,
  })
})

dVal.addEventListener('change', function (e) {
  e.preventDefault()
  socket.emit('paramUpdate', {
    param: 'dVal',
    value: dVal.value,
  })
})
