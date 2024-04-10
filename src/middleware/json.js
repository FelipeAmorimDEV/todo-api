const json = async (req,res) => {
const buffers = []

for await (const chunk of req) {
  buffers.push(chunk)
}

const fullData = Buffer.concat(buffers).toString()

try{
  req.body = JSON.parse(fullData)
}catch{
  req.body = null
}

res.setHeader('Content-Type', 'application/json')
}

export { json }