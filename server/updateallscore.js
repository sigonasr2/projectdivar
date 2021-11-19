const axios = require('axios')

axios.get("http://projectdivar.com:4501/playdata")
.then((data)=>{data.data.forEach((song)=>{return axios.get("http://projectdivar.com:4501/recalculatescore/"+song.id)
.then((data)=>{console.log(data.data)})
.catch((err)=>{console.log(err.message)})})})
.catch((err)=>{console.log(err.message)})