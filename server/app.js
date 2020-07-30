const express = require('express') 
const axios = require('axios') 
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
const fileUpload = require('express-fileupload');
const unzipper = require('unzipper');
const fs = require('fs');
app.use(
	fileUpload({createParentPath:true,
	limits: { fileSize: 15 * 1024 * 1024, files: 1 },
	safeFileNames: true, preserveExtension: true,
	abortOnLimit:true, uploadTimeout:0})
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
    db.query('select * from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname] , (error, results) => {
      if (error) {
		res.status(500).json(error.message)
      } else {
		  //console.log(req.params.songname+":"+JSON.stringify(results.rows));
		res.status(200).json(results.rows)
	  }
    })
})

app.get('/songs', (req, res) => {
    db.query('select songs.*,songdata.rating as rating,songdata.difficulty from songs left join songdata on songs.id=songdata.songid' , (error, results) => {
      if (error) {
		res.status(500).json(error.message)
      } else {
		  //console.log(req.params.songname+":"+JSON.stringify(results.rows));
		//res.status(200).json(results.rows)
		var data = {}
		results.rows.forEach((song)=>{
			if (data[song.id]) {
				if (typeof(data[song.id].rating)==="string"){
					var oldRating = data[song.id].rating;
					data[song.id].rating={}
					data[song.id].rating[data[song.id].difficulty]=oldRating;
				}
				data[song.id].rating[song.difficulty]=song.rating;
			} else {
				data[song.id]=song
			}})
		res.status(200).json(data)
	  }
    })
})

app.post('/register', (req, res) => {
	if (req.body && req.body.username &&
req.body.username.length>2 && req.body.email) {
		var duplicateFound=false;
		db.query('select * from users where username=$1 limit 1',[req.body.username])
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

app.delete('/remove',(req,res)=>{
	if (req.body &&
	req.body.username!==undefined && req.body.authentication_token!==undefined && req.body.playid!==undefined) {
		var userObj={},songObj={},rating=0,isFirstClear=false;
		db.query("select id,authentication_token,playcount,fccount,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear from users where username=$1 limit 1",[req.body.username])
		.then((data)=>{if(data && data.rows.length>0){userObj=data.rows[0];if (req.body.authentication_token===userObj.authentication_token){return db.query("delete from plays where id=$1 and userid=$2 returning *",[req.body.playid,userObj.id])}else{throw new Error("Could not authenticate user!")}}else{throw new Error("Cannot find user!")}})
		.then((data)=>{if(data && data.rows.length>0){songObj=data.rows[0];return CalculateRating(req.body.username)}else{throw new Error("Could not find play!")}})
		.then((data)=>{rating=data;return db.query("select * from plays where songid=$1 and userid=$2 and difficulty=$3 limit 1",[songObj.songid,userObj.id,songObj.difficulty])})
		.then((data)=>{if(data && data.rows.length===0){isFirstClear=true;}/*console.log([data,userObj.playcount-1,(songObj.safe==0&&songObj.sad==0&&songObj.worst==0)?userObj.fccount-1:userObj.fccount,userObj.cool-songObj.cool,userObj.fine-songObj.fine,userObj.safe-songObj.safe,userObj.sad-songObj.sad,userObj.worst-songObj.worst,(songObj.difficulty=="E")?userObj.ecount-1:userObj.ecount,(songObj.difficulty=="N")?userObj.ncount-1:userObj.ncount,(songObj.difficulty=="H")?userObj.hcount-1:userObj.hcount,(songObj.difficulty=="EX")?userObj.excount-1:userObj.excount,(songObj.difficulty=="EXEX")?userObj.exexcount-1:userObj.exexcount]);*/return db.query("update users set rating=$1,playcount=$2,fccount=$3,cool=$4,fine=$5,safe=$6,sad=$7,worst=$8,eclear=$9,nclear=$10,hclear=$11,exclear=$12,exexclear=$13 where id=$14 returning rating,playcount,fccount,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear",[rating,userObj.playcount-1,(songObj.safe==0&&songObj.sad==0&&songObj.worst==0)?userObj.fccount-1:userObj.fccount,userObj.cool-songObj.cool,userObj.fine-songObj.fine,userObj.safe-songObj.safe,userObj.sad-songObj.sad,userObj.worst-songObj.worst,(songObj.difficulty=="E" && isFirstClear)?userObj.eclear-1:userObj.eclear,(songObj.difficulty=="N" && isFirstClear)?userObj.nclear-1:userObj.nclear,(songObj.difficulty=="H" && isFirstClear)?userObj.hclear-1:userObj.hclear,(songObj.difficulty=="EX" && isFirstClear)?userObj.exclear-1:userObj.exclear,(songObj.difficulty=="EXEX" && isFirstClear)?userObj.exexclear-1:userObj.exexclear,userObj.id])})
		.then((data)=>{if(data && data.rows.length>0){res.status(200).json({user:data.rows[0],song:songObj})}else{throw new Error("Could not update user information, but song is deleted!")}})
		.catch((err)=>{res.status(500).json(err.message)})
	} else {
		res.status(400).json("Missing required parameters!");
	}
})

app.post('/upload', function(req, res) {
	
  if (!req.files || Object.keys(req.files).length === 0 || req.body.username===undefined || req.body.authentication_token===undefined) {
	res.status(400).send('No files were uploaded. Invalid parameters.');
	return;
  }
  
  let file = req.files.file;
	//console.log(file)
	
  if (file.size>15*1024*1024) {
	  res.status(400).send("File is too large! Max is 15MB! Consider splitting your plays into chunks (Recommended 50 files per zip).")
	  return;
  }
  
  if (file.mimetype!=="application/x-zip-compressed" &&
			file.mimetype!=="image/jpeg" && file.mimetype!=="image/png") {
		res.status(400).send('File type is invalid!');
		return;
	}

	var uploads = 0;
	var userId = -1;
	var fileLoc = "";
	var count=0;
  db.query("select uploads,id from users where username=$1 and authentication_token=$2",[req.body.username,req.body.authentication_token])
  .then((data)=>{
	  if (data.rows.length>0) {
		  uploads=data.rows[0].uploads;
			userId=data.rows[0].id;
			fileLoc = "files/plays/"+userId+"/"+uploads;
		  return file.mv(fileLoc);
	  } else {
		  throw new Error("Could not find / authenticate user with name "+req.body.username+"!")
	  }
  })
  .then((data)=>{
	  if (file.mimetype!=="application/x-zip-compressed") {
		  return db.query("update users set uploads=$1 where username=$2",[Number(uploads)+1,req.body.username])
	  } else {
		  //console.log(uploads)
		  uploads++;
		  //console.log(uploads)
		  return {}
  }})
  .then((data)=>{
	  if (file.mimetype!=="application/x-zip-compressed") {
		return axios.post("http://projectdivar.com/image",{url:"http://projectdivar.com/"+fileLoc,user:req.body.username,auth:req.body.authentication_token})
	  } else {
		//This is a zip file.
		var promises = []  
		promises.push(new Promise((resolve)=>{
		var stream = fs.createReadStream(fileLoc)
		  stream
		  .pipe(unzipper.Parse())
		  .on('entry', function (entry) {
			const fileName = entry.path;
			const type = entry.type; // 'Directory' or 'File'
			const size = entry.vars.uncompressedSize; // There is also compressedSize;
			if (type=="File" 
			&& (fileName.includes(".jpg") || fileName.includes(".jpeg") || fileName.includes(".png"))) {
			  promises.push(new Promise((resolve)=>{var file="files/plays/"+userId+"/"+uploads++;entry.pipe(fs.createWriteStream(file))
			  .on('finish',()=>{/*console.log("Promise finished!");*/count++;resolve({file:"http://projectdivar.com/"+file})})
				})
				.then((data)=>{return db.query("insert into uploadedplays values($1,$2,$3)",[data.file,userId,new Date()]);}))
			} else {
			  entry.autodrain();
			}
		  })
		  .on('finish',()=>{/*console.log("Read finished");*/resolve()})
		 }))
			setTimeout(()=>(console.dir(promises)),5000)
		 return Promise.all(promises)
  }})
  .then((data)=>{
	  if (file.mimetype!=="application/x-zip-compressed") {
		res.status(200).send("Your play has been submitted! Thank you.");
	  } else {
		 //console.log(data)
		 //console.log(uploads))
		 fs.unlink(fileLoc,(err)=>{})
		return db.query("update users set uploads=$1 where username=$2",[Number(uploads)+1,req.body.username])
	  }
  })
  .then((data)=>{
	  if (file.mimetype!=="application/x-zip-compressed") {
	  } else {
		res.status(200).send("Submitted "+count+" plays to the submission system. They will be processed shortly! Thank you.")
	  }
  })
  .catch((err)=>{console.log(err.message);res.status(500).send(err.message)})
  
});

app.post('/submit', (req, res) => {
	if (req.body &&
	req.body.username!==undefined && req.body.authentication_token!==undefined && req.body.song!==undefined && req.body.difficulty!==undefined && req.body.cool!==undefined && req.body.fine!==undefined && req.body.safe!==undefined && req.body.sad!==undefined && req.body.worst!==undefined && req.body.percent!==undefined) {
		var fail = true;
		if (req.body.fail!==undefined) {
			fail = (req.body.fail=='true');
			//console.log("Fail is "+fail+" type:"+typeof(fail))
		}
		var submitDate = new Date();
		if (req.body.submitDate!==undefined) {
			submitDate=req.body.submitDate;
		}
		
		if (!(req.body.difficulty==="H"||req.body.difficulty==="N"||req.body.difficulty==="E"||req.body.difficulty==="EX"||req.body.difficulty==="EXEX"))
		{throw new Error("Invalid difficulty!")}
		var songsubmitdata={},mod="",combo=-1,gameScore=-1,isFC=false,songRating=-1,userId = -1,songId=-1,playcount=-1,fccount=-1,cool=-1,fine=-1,safe=-1,sad=-1,worst=-1,alreadyPassed=false,eclear=-1,nclear=-1,hclear=-1,exclear=-1,exexclear=-1;
		
		if (req.body.mod!==undefined) {
			mod = req.body.mod;
		}
		if (req.body.combo!==undefined) {
			combo = req.body.combo;
		}
		if (req.body.gameScore!==undefined) {
			gameScore = req.body.gameScore;
		}
		
		db.query("select id,authentication_token,playcount,fccount,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear from users where username=$1 limit 1",[req.body.username])
		.then((data)=>{if(data && data.rows.length>0){if (data.rows[0].authentication_token===req.body.authentication_token){
			var obj = data.rows[0];
			eclear=obj.eclear;nclear=obj.nclear;hclear=obj.hclear;exclear=obj.exclear;exexclear=obj.exexclear;
			cool=data.rows[0].cool;fine=data.rows[0].fine;safe=data.rows[0].safe;sad=data.rows[0].sad;worst=data.rows[0].worst;
			fccount=data.rows[0].fccount;playcount=data.rows[0].playcount;userId=data.rows[0].id;return db.query("select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1",[req.body.song])}else{throw new Error("Could not authenticate!")}}else{throw new Error("Could not find user.")}
		})
		.then((data)=>{if(data && data.rows.length>0){songId=data.rows[0].id; return db.query('select rating from songdata where songid=$1 and difficulty=$2 limit 1',[songId,req.body.difficulty])}else{throw new Error("Could not find song.")}})
		.then((data)=>{songRating=data.rows[0].rating;return db.query("select id from plays where userid=$1 and score>0 and difficulty=$2 and songid=$3 limit 1",[userId,req.body.difficulty,songId])})
		.then((data)=>{if(data && data.rows.length>0){alreadyPassed=true;/*console.log(data);*/};var score=CalculateSongScore({rating:songRating,cool:req.body.cool,fine:req.body.fine,safe:req.body.safe,sad:req.body.sad,worst:req.body.worst,percent:req.body.percent,difficulty:req.body.difficulty,fail:fail});return db.query("insert into plays(songId,userId,difficulty,cool,fine,safe,sad,worst,percent,date,score,fail,mod,combo,gamescore,src) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning *",[songId,userId,req.body.difficulty,req.body.cool,req.body.fine,req.body.safe,req.body.sad,req.body.worst,req.body.percent,submitDate,score,fail,mod,combo,gameScore,(req.body.src)?req.body.src:""])})
		.then((data)=>{if(data && data.rows.length>0){
			songsubmitdata = data.rows[0];
			//console.log(alreadyPassed+" / "+typeof(alreadyPassed))
			if(alreadyPassed===false && songsubmitdata.score>0){switch(req.body.difficulty){case"E":{eclear++}break;case"N":{nclear++}break;case"H":{hclear++}break;case"EX":{exclear++}break;case"EXEX":{exexclear++}break;}}
			isFC = songsubmitdata.safe===0 && songsubmitdata.sad===0 && songsubmitdata.worst===0;
			return CalculateRating(req.body.username)}else{throw new Error("Could not submit song.")}})
		.then((data)=>{return db.query("update users set rating=$1,last_played=$3,playcount=$4,fccount=$5,cool=$6,fine=$7,safe=$8,sad=$9,worst=$10,eclear=$11,nclear=$12,hclear=$13,exclear=$14,exexclear=$15 where username=$2",[data,req.body.username,new Date(),++playcount,fccount+((isFC)?1:0),cool+Number(req.body.cool),fine+Number(req.body.fine),safe+Number(req.body.safe),sad+Number(req.body.sad),worst+Number(req.body.worst),eclear,nclear,hclear,exclear,exexclear])})
		.then((data)=>{return songsubmitdata;})
		.then((data)=>{res.status(200).json(data);})
		.catch((err)=>{
			//console.log(req.body);
			//console.log(err);
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
	var percentMult=1;
	if (song.fine===0&&song.safe===0&&song.sad===0&&song.worst===0){scoreMult=3}else if(comboBreaks===0){scoreMult=2}else{scoreMult=1}
	switch (song.difficulty){
		case "E":{if(song.percent<30){percentMult=0;}else{percentMult=1+(0.4*((song.percent-30)/70.0))}}break;
		case "N":{if(song.percent<50){percentMult=0}else{percentMult=1+(0.4*((song.percent-50)/50.0))}}break;
		case "H":{if(song.percent<60){percentMult=0}else{percentMult=1+(0.4*((song.percent-60)/40.0))}}break;
		case "EX":
		case "EXEX":{if(song.percent<70){percentMult=0}else{percentMult=1+(0.4*((song.percent-70)/30.0))}}break;
		default:{
			if(song.percent<60){percentMult=0}else{percentMult=1+(0.4*((song.percent-60)/40.0))}
		}
	}
	var score = ((song.cool*100+song.fine*50+song.safe*10+song.sad*5)/1000.0)*percentMult*scoreMult
	if (scoreMult>0 && percentMult>0) {
		score += Math.pow(song.rating,3)/5
	}
	return Number(score);
}

CalculateAccuracy=(cool,fine,safe,sad,worst)=>{
	var noteCount = cool+fine+safe+sad+worst;
	var sum = cool+(fine*0.5)+(safe*0.1)+(sad*0.05);
	return sum/noteCount;
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
	return db.query('select id from users where username=$1 limit 1',[username])
	.then((data)=>{if(data.rows.length>0){userId=data.rows[0].id;return db.query('select * from songs order by id asc')}else{return 0}})
	.then((data)=>{if(data.rows.length>0){songs=data.rows;return Promise.all(data.rows.map((song)=>{return db.query('select * from plays where userId=$1 and songId=$2 and score!=$3 order by score desc limit 100',[userId,song.id,"NaN"]).then((data)=>{if (data.rows.length>0){debugScoreList+=song.name+"\n"; songs[song.id-1].score=data.rows.reduce((sum,play,i)=>{debugScoreList+="  "+(play.score)+" -> "+(play.score*Math.pow(0.2,i))+"";if (i===0 && play.fine+play.safe+play.sad+play.worst===0){songs[play.songid-1].pfc=true;debugScoreList+="+"}else if (i===0 && play.safe+play.sad+play.worst===0){songs[play.songid-1].fc=true;debugScoreList+="*"}debugScoreList+="\n";/*console.log("Play score:"+play.score+". Sum:"+sum);*/return sum+play.score*Math.pow(0.2,i);},0);debugScoreList+=" "+songs[song.id-1].score+"\n";}})}))}})
	.then(()=>{return songs.sort((a,b)=>{var scorea=(a.score)?a.score:0;var scoreb=(b.score)?b.score:0;return (scorea>scoreb)?-1:1;}).reduce((sum,song,i)=>{if(song.score && !isNaN(song.score)){debugScoreList+=song.name+": "+song.score+" -> "+(song.score*Math.pow(0.9,i))+((song.pfc)?("+"+2):(song.fc)?("+"+1):0)+"\n";return sum+song.score*Math.pow(0.9,i)+((song.pfc)?2:(song.fc)?+1:0)}else{return sum}},0);})
	.then((data)=>{/*console.log(debugScoreList);*/return data})
}

app.get('/songdiffs',(req,res)=>{
	var diffObj={}
	db.query("select COUNT(*) from songdata where difficulty='E'")
	.then((data)=>{diffObj.E=data.rows[0].count;return db.query("select COUNT(*) from songdata where difficulty='N'")})
	.then((data)=>{diffObj.N=data.rows[0].count;return db.query("select COUNT(*) from songdata where difficulty='H'")})
	.then((data)=>{diffObj.H=data.rows[0].count;return db.query("select COUNT(*) from songdata where difficulty='EX'")})
	.then((data)=>{diffObj.EX=data.rows[0].count;return db.query("select COUNT(*) from songdata where difficulty='EXEX'")})
	.then((data)=>{diffObj.EXEX=data.rows[0].count;res.status(200).json(diffObj)})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/accuracy/:username',(req,res)=>{
	db.query('select cool,fine,safe,sad,worst from users where username=$1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){return CalculateAccuracy(data.rows[0].cool,data.rows[0].fine,data.rows[0].safe,data.rows[0].sad,data.rows[0].worst)}else{throw new Error("User does not exist!")}})
	.then((data)=>{res.status(200).json({accuracy:data})})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/recalculatescore/:playid',(req,res)=>{
	var userId=-1;
	var username=null;
	var songRating=-1;
	var song;
	
	db.query('select * from plays where id=$1 limit 1',[req.params.playid])
	.then((data)=>{if (data.rows.length>0){song=data.rows[0];userId=song.userid;/*console.log(song);*/
		return db.query('select rating from songdata where songid=$1 and difficulty=$2 limit 1',[song.songid,song.difficulty])
	}else{throw new Error("This play does not exist!")}})
	.then((data)=>{if (data.rows.length>0){songRating=data.rows[0].rating;var score=CalculateSongScore({rating:songRating,cool:song.cool,fine:song.fine,safe:song.safe,sad:song.sad,worst:song.worst,percent:song.percent,difficulty:song.difficulty,fail:song.fail});return db.query('update plays set score=$1 where id=$2 returning *',[score,req.params.playid]);}else{throw new Error("Failed to retrieve song data!")}})
	.then((data)=>{console.log(data);if (data.rows.length>0){
	var scoreData=data.rows[0];
	return db.query('select username from users where id=$1',[userId]).then((data)=>{username=data.rows[0].username; return CalculateRating(username)}).then((data)=>{db.query("update users set rating=$1 where username=$2",[data,username])})
	.then(()=>{return scoreData;})
	}else{throw new Error("Failed to update score!")}})
	.then((data)=>res.status(200).json(data)).catch((err)=>{console.log(err);res.status(500).json(err.message);})
});

/*app.get('/playdata',(req,res)=>{
	db.query('select * from plays')
	.then((data)=>{res.status(200).json(data.rows)})
	.catch((err)=>res.status(500).json(err.message))
})*/

app.get('/completionreport/:username',(req,res)=>{
	//Number of passes,plays,fcs,pfcs, and the best play.
	var userId=-1,songs,promises=[];
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then ((data)=>{
		if (data.rows.length>0) {
			userId=data.rows[0].id;
			return db.query('select * from songs')
		} else {
			throw new Error("Cannot find user!")
		}
	})
	.then((data)=>{
		songs = data.rows;
		songs.forEach((song)=>{
			promises.push(db.query("select * from (select userid,count(*) filter(where difficulty='E' and mod='SD' and score>0) as ESDCount,count(*) filter(where difficulty='N' and mod='SD' and score>0) as NSDCount,count(*) filter(where difficulty='H' and mod='SD' and score>0) as HSDCount,count(*) filter(where difficulty='EX' and mod='SD' and score>0) as EXHDCount,count(*) filter(where difficulty='E' and mod='HD' and score>0) as EHDCount,count(*) filter(where difficulty='N' and mod='HD' and score>0) as NHDCount,count(*) filter(where difficulty='H' and mod='HD' and score>0) as HHDCount,count(*) filter(where difficulty='EX' and mod='HD' and score>0) as EXHDCount,count(*) filter(where difficulty='E' and mod='HS' and score>0) as EHSCount,count(*) filter(where difficulty='N' and mod='HS' and score>0) as NHSCount,count(*) filter(where difficulty='H' and mod='HS' and score>0) as HHSCount,count(*) filter(where difficulty='EX' and mod='HS' and score>0) as EXHSCount,count(*) filter(where difficulty='EXEX' and mod='HS' and score>0) as EXEXHSCount,Count(*) filter(where difficulty='E' and score>0) as EClearCount,Count(*) filter(where difficulty='N' and score>0) as NClearCount,Count(*) filter(where difficulty='H' and score>0) as HClearCount,Count(*) filter(where difficulty='EX' and score>0) as EXClearCount,Count(*) filter(where difficulty='EXEX' and score>0) as EXEXClearCount,count(*) filter(where difficulty='E') as ECount,count(*) filter(where difficulty='N') as NCount,count(*) filter(where difficulty='H') as HCount,count(*) filter(where difficulty='EX') as EXCount,count(*) filter(where difficulty='EXEX') as EXEXCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='E') as EFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='N') as NFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='H') as HFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='EX') as EXFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='EXEX') as EXEXFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='E') as EPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='N') as NPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='H') as HPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='EX') as EXPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='EXEX') as EXEXPFCCount from plays where userid=$1 and songid=$2 group by userid)t1 join (select rank,t.score,t.percent from (select row_number()over(order by score desc)rank,* from(select distinct on (userid) * from (select * from plays where songid=$2)t order by userid,score desc)t)t where userid=$1)t2 on t1.userid=t1.userid",[userId,song.id])
			.then((data)=>{
				if (data.rows.length>0) {
					song.report=data.rows[0]
				} else {
					song.report={ecount:0,ncount:0,hcount:0,excount:0,exexcount:0,efccount:0,nfccount:0,hfccount:0,exfccount:0,exexfccount:0,epfccount:0,npfccount:0,hpfccount:0,expfccount:0,exexpfccount:0,rank:0}
				}
				})
			)
		})
		return Promise.all(promises)
	})
	.then((data)=>{
		return res.status(200).json(songs);
	})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/ratings/:songname/:username',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1', [req.params.username])
	.then((data)=>{
		if (data.rows.length>0) {
			userId=data.rows[0].id
			return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])
		} else {
			throw new Error("Could not find user!")
		}
	})
	.then((data)=>{
		if (data.rows.length>0) {
			songId=data.rows[0].id
			return db.query("select * from (select row_number()over(order by score desc)rank,* from(select distinct on (userid) * from (select * from plays where songid=$1)t order by userid,score desc)t)t where userid=$2",[songId,userId])
		} else {
			throw new Error("Could not find song!")
		}
 	})
	.then((data)=>{
		res.status(200).json(data.rows)
	})
	.catch((err)=>{res.status(500).json(err.message)})
	
})

app.get('/bestplays/:username',(req,res)=>{
	var songId=-1,userId=-1,songPromises=[],plays=[];
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query("select * from (select distinct on (songid) * from plays where userid=$1 "+((req.query.fails==="false")?"and score!=0":"")+" order by songid,score desc)t order by score desc;",[userId])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{
		res.status(200).json(data.rows)
	})
	.catch((err)=>{res.status(500).json(err.message+JSON.stringify(req.body))})
})

app.get('/bestplay/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;if(req.params.songname){return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{return db.query('select * from plays where userid=$1 order by score desc',[userId])}}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 order by score desc,percent desc limit 1',[userId,songId,req.params.difficulty])}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json(data.rows[0])}else{res.status(400).json("No data found!")}})
	.catch((err)=>{res.status(500).json(err.message+JSON.stringify(req.body))})
})

app.get('/userdata/:username',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select playcount,fccount,rating,last_played,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json(data.rows[0])}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/playcount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 order by score desc',[userId,songId,req.params.difficulty])}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({playcount:data.rows.length})}else{res.status(200).json({playcount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/songpasscount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and score>0',[userId,songId,req.params.difficulty])}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({passcount:data.rows.length})}else{res.status(200).json({passcount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/songfccount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and safe=0 and sad=0 and worst=0',[userId,songId,req.params.difficulty])}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({fccount:data.rows.length})}else{res.status(200).json({fccount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/songpfccount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and fine=0 and safe=0 and sad=0 and worst=0',[userId,songId,req.params.difficulty])}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({fccount:data.rows.length})}else{res.status(200).json({fccount:0})}})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/songmods/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1,hs=0,sd=0,hd=0;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select COUNT(mod) from (select * from plays where userid=$1 and songid=$2 and difficulty=$3 and mod=$4)t',[userId,songId,req.params.difficulty,"HS"])}else{res.status(400).json("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){
		hs=data.rows[0].count;
	}
		return db.query('select COUNT(mod) from (select * from plays where userid=$1 and songid=$2 and difficulty=$3 and mod=$4)t',[userId,songId,req.params.difficulty,"SD"])
	})
	.then((data)=>{if(data && data.rows.length>0){
		sd=data.rows[0].count;
		}
		return db.query('select COUNT(mod) from (select * from plays where userid=$1 and songid=$2 and difficulty=$3 and mod=$4)t',[userId,songId,req.params.difficulty,"HD"])
	})
	.then((data)=>{if(data && data.rows.length>0){
		hd=data.rows[0].count;
	}
		res.status(200).json({hs:hs,sd:sd,hd:hd})
	})
	.catch((err)=>{res.status(500).json(err.message)})
})

app.get('/rating/:username',(req,res)=>{
	if (req.params.username) {
		db.query('select rating from users where username=$1 limit 1',[req.params.username])
		.then((data)=>{if(data.rows.length>0){res.status(200).json(data.rows[0])}else{res.status(200).json({rating:0})}})
	} else {
		res.status(400).json("Invalid username!")
	}
})

app.get('/users/:orderby/:sortorder',(req,res)=>{
	if (req.params.orderby && req.params.sortorder && req.query.limit && req.query.offset) {
		var valid = ["rating","last_played","playcount","username","fccount"];
		var validsort = ["desc","asc"];
		if (valid.includes(req.params.orderby) && validsort.includes(req.params.sortorder)) {
			db.query('select username,rating,last_played,playcount,fccount from users order by '+req.params.orderby+' '+req.params.sortorder+",rating desc limit $1 offset $2",[req.query.limit,req.query.offset])
			.then((data)=>{return res.status(200).json(data.rows)})
			.catch((err)=>{res.status(500).json(err.message)})
		} else {
			res.status(400).json("Not a valid sort option!");
		}
	} else {
		res.status(400).json("Invalid query!")
	}
})
/*
app.get('/twitter/mentions', function(req, res) {
	if (req.query.data) {
		console.log(req.query.data)
		res.status(200).json("OK!")
	} else {
		res.status(400).json("Empty input")
	}
})

const pixels = require("get-pixels");
*/




var process_images = []
var processPromises = []
var largestId = 0
var filterId = 0

function Process(data){
	for (var i in data.data.statuses) {
		var tweet = data.data.statuses[i]
		if (tweet.source && tweet.source.includes("Nintendo Switch Share")) {
			if (tweet.extended_entities) {
				//console.log(tweet.extended_entities.media)
				for (var j=0;j<tweet.extended_entities.media.length;j++) {
					var media = tweet.extended_entities.media[j]
					process_images.push({image:media.media_url,user:tweet.user.id,id:tweet.id})
				}
			}
		}
	}
	//console.log(process_images)
	if (data.data.search_metadata.next_results) {
		return axios.get('https://api.twitter.com/1.1/search/tweets.json'+data.data.search_metadata.next_results, {
			headers: {
			/*BEARER*/	Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
		}})
		.then((data)=>{return Process(data)})
	}
	return "Done!";
}

app.use('/files',express.static('files'))

/*
axios.get('https://api.twitter.com/1.1/search/tweets.json?q=@divarbot', {
	headers: {
		Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
	}
})
.then((data)=>{
	//console.log(data.data.statuses)
	//console.log(data.data)
	return Process(data);
})
.then((data)=>{process_images.forEach((image)=>{console.log(image)})})*/

setInterval(
()=>{
	var uploadData=undefined;
	db.query("select * from uploadedplays order by submissiondate asc limit 1;")
	.then((data)=>{
		if (data.rows.length>0) {
			uploadData=data.rows[0];
			return db.query("select username,authentication_token from users where id=$1",[uploadData.userid])
		}
	})
	.then((data)=>{
		if (uploadData && data.rows.length>0) {
			return axios.post("http://projectdivar.com/image",
			{url:uploadData.filename,user:data.rows[0].username,auth:data.rows[0].authentication_token})
		}
	})
	.then((data)=>{
		if (uploadData) {
			if (data.data==="Invalid parameters!") {
				throw new Error("Invalid parameters while trying to submit play!")
			} else {
				return db.query("delete from uploadedplays where id=$1",[uploadData.id])
			}
		}
	})
	.catch((err)=>{console.log(err)})
}
,5000)

setInterval(()=>{db.query("select * from twitter_bot limit 1")
.then((data)=>{
	largestId=filterId=data.rows[0].lastpost;
	//console.log("Filter Id: "+filterId);
	return axios.get('https://api.twitter.com/1.1/search/tweets.json?q=@divarbot', {
		headers: {
			Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
		}
	})
})
.then((data)=>{
	//console.log(data.data.statuses)
	//console.log(data.data)
	//data.data.s
	return Process(data);
})
.then((data)=>{
	//console.log(process_images)
	var promisesDone=0;
	process_images.forEach((obj)=>{
	if (filterId<obj.id) {
		if (largestId<obj.id) {largestId=obj.id}
		processPromises.push(new Promise((resolve,reject)=>{
		//console.log("Process Twitter Post: "+obj.id);	
		return db.query("select id from users where twitter=$1",[obj.user])
		.then((data)=>{
			if (data.rows.length>0) {
				return db.query("insert into uploadedplays values($1,$2,$3)",[obj.image,data.rows[0].id,new Date()])
				.then(()=>{resolve("Done!")})
			} else {
				reject("Not associated with an Id!")
			}
		})
		.catch((err)=>{console.log(err.message);reject("Failed!")})}))
	}
})
//setTimeout(()=>{console.dir(processPromises, {'maxArrayLength': null})},2000)
return Promise.allSettled(processPromises)
})
.then((data)=>{
	//console.log(largestId)
	return db.query("update twitter_bot set lastpost=$1 returning *",[largestId])
})
.catch((err)=>{console.log(err.message)})
},60000)