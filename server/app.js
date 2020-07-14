const express = require('express') 
const app = express() 
const port = 4501
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`)) 
const bodyParser = require('body-parser')
const { json } = require('body-parser')
const Pool = require('pg').Pool 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

  
let allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', "*");
	res.header('Access-Control-Allow-Methods', "*");
	next();
  }
  app.use(allowCrossDomain);

const db = 
new Pool({
  user: 'postgres',
  password: '',
  host: 'postgres',
  database: 'divar',
  port: 5432,
})

app.get('/song/:songname', (req, res) => {
    db.query('select * from songs where name=$1 or romanized_name=$1 or english_name=$1', [req.params.songname] , (error, results) => {
      if (error) {
		res.status(500).json(error.message)
      } else {
		  //console.log(req.params.songname+":"+JSON.stringify(results.rows));
		res.status(200).json(results.rows)
	  }
    })
})

app.post('/register', (req, res) => {
	if (req.body && req.body.username &&
req.body.username.length>2 && req.body.email) {
		var duplicateFound=false;
		db.query('select * from users where username=$1',[req.body.username])
		.then((data)=>{
			if (data.rows.length>0) {
				throw new Error("User "+data.rows[0].username+" already exists!");
			} else {
				return db.query('insert into users(username,email) values($1,$2) returning username,email',[req.body.username,req.body.email])
			}
		})
		.then((data)=>{res.status(200).json(data.rows)})
		.catch((err)=>{res.status(500).json(err.message)})
	} else {
		res.status(400).json("Invalid username!")
	}
})

app.post('/submit', (req, res) => {
	if (req.body &&
	req.body.username!==undefined && req.body.authentication_token!==undefined && req.body.song!==undefined && req.body.difficulty!==undefined && req.body.cool!==undefined && req.body.fine!==undefined && req.body.safe!==undefined && req.body.sad!==undefined && req.body.worst!==undefined && req.body.percent!==undefined) {
		var fail = true;
		if (req.body.fail!==undefined) {
			fail = (req.body.fail=='true');
			console.log("Fail is "+fail+" type:"+typeof(fail))
		}
		
		if (!(req.body.difficulty==="H"||req.body.difficulty==="N"||req.body.difficulty==="E"||req.body.difficulty==="EX"||req.body.difficulty==="EXEX"))
		{throw new Error("Invalid difficulty!")}
		var userId = -1,songId=-1;
		db.query("select id,authentication_token from users where username=$1",[req.body.username])
		.then((data)=>{if(data.rows.length>0){if (data.rows[0].authentication_token===req.body.authentication_token){userId=data.rows[0].id;return db.query("select id from songs where name=$1 or romanized_name=$1 or english_name=$1",[req.body.song])}else{throw new Error("Could not authenticate!")}}else{throw new Error("Could not find user.")}
		})
		.then((data)=>{if(data.rows.length>0){songId=data.rows[0].id;var score=CalculateSongScore({cool:req.body.cool,fine:req.body.fine,safe:req.body.safe,sad:req.body.sad,worst:req.body.worst,percent:req.body.percent,difficulty:req.body.difficulty,fail:fail});return db.query("insert into plays(songId,userId,difficulty,cool,fine,safe,sad,worst,percent,date,score,fail) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",[songId,userId,req.body.difficulty,req.body.cool,req.body.fine,req.body.safe,req.body.sad,req.body.worst,req.body.percent,new Date(),score,fail])}else{throw new Error("Could not find song.")}})
		.then((data)=>{if(data.rows.length>0){res.status(200).json(data.rows[0])}else{throw new Error("Could not submit song.")}})
		.catch((err)=>{
			console.log(req.body);
			res.status(500).json(err.message);})
	} else {
		console.log(req.body);
		res.status(400).json("Missing required parameters!");
	}
})

CalculateSongScore=(song)=>{
	if (song.fail==true){return 0;}
	var noteCount=song.cool+song.fine+song.safe+song.sad+song.worst;
	var comboBreaks=song.safe+song.sad+song.worst;
	var scoreMult=1;
	switch (song.difficulty){
		case "H":{if(song.percent<60){scoreMult=0}else{if(comboBreaks===0){scoreMult=5}else if(song.percent>=90){scoreMult=3}else{scoreMult=1.5}}}break;
		case "EX":
		case "EXEX":{if(song.percent<70){scoreMult=0}else{if(comboBreaks===0){scoreMult=10}else if(song.percent>=95){scoreMult=6}else{scoreMult=5}}}break;
		default:{
			if(song.percent<60){scoreMult=0}else{if(comboBreaks===0){scoreMult=3}else if(song.percent>=90){scoreMult=2}else{scoreMult=1}}
		}
	}
	var score = ((song.cool*100+song.fine*50+song.safe*10+song.sad*5)/((noteCount)/(noteCount/1000)))*scoreMult
	return Number(score);
}

CalculateRating=(username)=>{
	var songs = [];
	var debugScoreList = "";
	var userId = -1;
	/* //Old rating algorithm.
	return db.query('select id from users where username=$1',[username])
	.then((data)=>{if(data.rows.length>0){userId=data.rows[0].id;return db.query('select * from plays where userid=$1 order by score desc limit 100',[userId])}else{return 0}})
	.then((data)=>{if(data.rows.length>0){return data.rows.reduce((sum,song,i)=>{
		return sum+Number(CalculateSongScore(song)*(Math.pow(0.8,i)))},0)}else{return 0}})
	.catch((err)=>{throw new Error(err.message)})*/
	return db.query('select id from users where username=$1',[username])
	.then((data)=>{if(data.rows.length>0){userId=data.rows[0].id;return db.query('select * from songs order by id asc;')}else{return 0}})
	.then((data)=>{if(data.rows.length>0){songs=data.rows;return Promise.all(data.rows.map((song)=>{return db.query('select * from plays where userId=$1 and songId=$2 order by score desc limit 100',[userId,song.id]).then((data)=>{if (data.rows.length>0){debugScoreList+=song.name+"\n"; songs[song.id-1].score=data.rows.reduce((sum,play,i)=>{debugScoreList+="  "+(play.score)+" -> "+(play.score*Math.pow(0.8,i))+"\n";/*console.log("Play score:"+play.score+". Sum:"+sum);*/return sum+play.score*Math.pow(0.8,i);},0);debugScoreList+=" "+songs[song.id-1].score+"\n";}})}))}})
	.then(()=>{return songs.sort((a,b)=>{var scorea=(a.score)?a.score:0;var scoreb=(b.score)?b.score:0;return (scorea>scoreb)?-1:1;}).reduce((sum,song,i)=>{if(song.score){debugScoreList+=song.name+": "+song.score+" -> "+(song.score*Math.pow(0.8,i))+"\n";return sum+song.score*Math.pow(0.8,i)}else{return sum}},0);})
	.then((data)=>{/*console.log(debugScoreList);*/return data})
}

app.get('/recalculatescore/:playid',(req,res)=>{
	db.query('select * from plays where id=$1',[req.params.playid])
	.then((data)=>{if (data.rows.length>0){var song=data.rows[0];console.log(song);var score=CalculateSongScore({cool:song.cool,fine:song.fine,safe:song.safe,sad:song.sad,worst:song.worst,percent:song.percent,difficulty:song.difficulty,fail:song.fail});return db.query('update plays set score=$1 where id=$2 returning *',[score,req.params.playid]);}else{throw new Error("This play does not exist!")}})
	.then((data)=>{if (data.rows.length>0){res.status(200).json(data.rows[0])}else{throw new Error("Failed to update score!")}})	.catch((err)=>{res.status(500).json(err.message);})
});

app.get('/bestplay/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;if(req.params.songname){return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1', [req.params.songname])}else{return db.query('select * from plays where userid=$1 order by score desc',[userId])}}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;if(req.params.difficulty){return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 order by score desc,percent desc limit 1',[userId,songId,req.params.difficulty])}else{return db.query('select * from plays where userid=$1 and songid=$2 order by score desc,percent desc limit 1',[userId,songId])}}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json(data.rows[0])}else{res.status(400).json("No data found!")}})
	.catch((err)=>{res.status(500).json(err.message+JSON.stringify(req.body))})
})

app.get('/playcount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;if(req.params.songname){return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1', [req.params.songname])}else{return db.query('select * from plays where userid=$1',[userId])}}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;if(req.params.difficulty){return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 order by score desc',[userId,songId,req.params.difficulty])}else{return db.query('select * from plays where userid=$1 and songid=$2',[userId,songId])}}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({playcount:data.rows.length})}else{res.status(200).json({playcount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/songpasscount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;if(req.params.songname){return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1', [req.params.songname])}else{return db.query('select * from plays where userid=$1 and score>0',[userId])}}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;if(req.params.difficulty){return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and score>0',[userId,songId,req.params.difficulty])}else{return db.query('select * from plays where userid=$1 and songid=$2 and score>0',[userId,songId])}}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({passcount:data.rows.length})}else{res.status(200).json({passcount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/songfccount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;if(req.params.songname){return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1', [req.params.songname])}else{return db.query('select * from plays where userid=$1 and safe=0 and sad=0 and worst=0',[userId])}}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;if(req.params.difficulty){return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and safe=0 and sad=0 and worst=0',[userId,songId,req.params.difficulty])}else{return db.query('select * from plays where userid=$1 and songid=$2 and safe=0 and sad=0 and worst=0',[userId,songId])}}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({fccount:data.rows.length})}else{res.status(200).json({fccount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/rating/:username',(req,res)=>{
	if (req.params.username) {
		CalculateRating(req.params.username).
		then((data)=>res.status(200).json({rating:data}))
	} else {
		res.status(400).json("Invalid username!")
	}
})