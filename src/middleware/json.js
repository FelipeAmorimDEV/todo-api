const json = async (req,res) => {
const buffers = []

for await (const chunk of req) {
  buffers.push(chunk)
}

const fullData = Buffer.concat(buffers).toString()
console.log(fullData)
try{
  req.body = JSON.parse(fullData)
}catch{
  req.body = null
}
}

export { json }