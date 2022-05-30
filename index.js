const { CloudantV1 } = require('@ibm-cloud/cloudant')
const service = CloudantV1.newInstance({})

const sleep = async (t) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t)
  })
}

const bar = (reading, val, max, character) => {
  const frac = val / max
  const v = Math.floor(frac * 20)
  const p = Math.floor(frac * 100).toString()
  return `  ${reading.padEnd(5, ' ')} ${character.repeat(v).padEnd(20)} ${val.toString().padStart(3)}/${max.toString().padEnd(3)} ${p.padStart(3)} %`
}

const main = async () => {
  let response
  response = await service.getCapacityThroughputInformation()
  const capacity = response.result.current.throughput

  do {
    response = await service.getCurrentThroughputInformation()
    const usage = response.result.throughput
    console.log(bar('READ', Math.min(usage.read, capacity.read), capacity.read, '#'))
    console.log(bar('WRITE', Math.min(usage.write, capacity.write), capacity.write, '#'))
    console.log(bar('QUERY', Math.min(usage.query, capacity.query), capacity.query, '#'))
    process.stdout.moveCursor(0, -3)
    await sleep(1000)
  } while (true)
}

module.exports = {
  main
}
