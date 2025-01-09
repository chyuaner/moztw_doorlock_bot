const axios = require('axios')
const aesCmac = require('node-aes-cmac').aesCmac
let sesame_id      = process.env["SESAME_ID"]  // uuid
let key_secret_hex = process.env["KEY_SECRET_HEX"]
let api_key        = process.env["API_KEY"]


let getDoorStatus = async () => {
  let after_cmd = await axios({
    method: 'get',
    url: `https://app.candyhouse.co/api/sesame2/${sesame_id}`,
    headers: { 'x-api-key': api_key },
  })
//   console.log(after_cmd)
  return after_cmd;
}

let openDoor = async () => {
    let cmd = 89 //(toggle:88,lock:82,unlock:83)
    let base64_history = Buffer.from('test2').toString('base64')
  
    let sign = generateRandomTag(key_secret_hex)
    let after_cmd = await axios({
      method: 'post',
      url: `https://app.candyhouse.co/api/sesame2/${sesame_id}/cmd`,
      headers: { 'x-api-key': api_key },
      data: {
        cmd: cmd,
        history: base64_history,
        sign: sign,
      },
    })
    // console.log(after_cmd)
    return after_cmd;
  }

function generateRandomTag(secret) {
  // * key:key-secret_hex to data
  let key = Buffer.from(secret, 'hex')

  // message
  // 1. timestamp  (SECONDS SINCE JAN 01 1970. (UTC))  // 1621854456905
  // 2. timestamp to uint32  (little endian)   //f888ab60
  // 3. remove most-significant byte    //0x88ab60
  const date = Math.floor(Date.now() / 1000)
  const dateDate = Buffer.allocUnsafe(4)
  dateDate.writeUInt32LE(date)
  const message = Buffer.from(dateDate.slice(1, 4))

  return aesCmac(key, message)
}

module.exports = {   
    getDoorStatus: getDoorStatus,   
    openDoor: openDoor
}