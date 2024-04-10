//?id=asdasd&description=pedro
export default function extractSearchParams(params) {
  return params.substr(1).split("&").reduce((queryParams, param) => {
    const [key,value] = param.split("=")
    queryParams[key] = value

    return queryParams
  },{})
}