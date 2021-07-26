const express = require('express') 
const axios = require('axios') 
const twitchStreams = require('twitch-get-stream')
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
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const unzipper = require('unzipper');
const fs = require('fs');
const moment = require('moment');
const { exec,spawn } = require('child_process');
app.use(
	fileUpload({createParentPath:true,
	limits: { fileSize: 15 * 1024 * 1024, files: 1 },
	safeFileNames: true, preserveExtension: true,
	abortOnLimit:true, uploadTimeout:0})
)
const QuickChart = require('quickchart-js');

  
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

const db2 = 
new Pool({
  user: 'postgres',
  password: '',
  host: 'postgres',
  database: 'ngsplanner2',
  port: 5432,
})

const ENDPOINTDATA=[
	{
		endpoint:"class",
		requiredfields:["name"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"class_level_data",
		requiredfields:["class_id","level","hp","atk","def"],
		optionalfields:[],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"class_weapon_type_data",
		requiredfields:["class_id","weapon_type_id"],
		optionalfields:[],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"weapon",
		requiredfields:["name","rarity","level_req","atk"],
		optionalfields:["potential_id","variance","base_affix_slots","drop_info","pb_gauge_build","icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"weapon_existence_data",
		requiredfields:["weapon_type_id","weapon_id"],
		optionalfields:[],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"weapon_type",
		requiredfields:["name"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"armor",
		requiredfields:["name","rarity","level_req","def"],
		optionalfields:["hp","pp","mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","all_down_res","burn_res","freeze_res","blind_res","shock_res","panic_res","poison_res","battle_power_value","pb_gauge_build","icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"potential",
		requiredfields:["name"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"potential_data",
		requiredfields:["potential_id","level"],
		optionalfields:["mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","all_down_res","burn_res","freeze_res","blind_res","shock_res","panic_res","poison_res","battle_power_value","pb_gauge_build"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"builds",
		requiredfields:["user_id","creator","build_name","class1","created_on","last_modified","data"],
		optionalfields:["class2","likes"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"skill",
		requiredfields:["name","skill_type_id"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"skill_type",
		requiredfields:["name"],
		optionalfields:[],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"skill_data",
		requiredfields:["skill_id","level"],
		optionalfields:["variance","mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"augment",
		requiredfields:["augment_type_id","level"],
		optionalfields:["variance","hp","pp","mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","affix_success_rate","all_down_res","burn_res","freeze_res","blind_res","shock_res","panic_res","poison_res","battle_power_value","pb_gauge_build"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"augment_type",
		requiredfields:["name"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"food",
		requiredfields:["material"],
		optionalfields:["potency","pp","dmg_res","hp","pp_consumption","pp_recovery","weak_point_dmg","hp_recovery"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"food_mult",
		requiredfields:["amount"],
		optionalfields:["potency","pp","dmg_res","hp","pp_consumption","pp_recovery","weak_point_dmg","hp_recovery"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"roles",
		requiredfields:["name"],
		optionalfields:[],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"users",
		requiredfields:["username","email","created_on","role_id"],
		optionalfields:["avatar"],
		excludedfields:["password_hash"] //Fields to not output in GET.
	}
]

function CreateDynamicEndpoints() {
	ENDPOINTDATA.map((endpoint)=>{
		app.get("/"+endpoint.endpoint,(req,res)=>{
			db2.query('select * from '+endpoint.endpoint+" order by id desc")
			.then((data)=>{
				res.status(200).json({fields:data.fields,rows:data.rows})
			})
			.catch((err)=>{
				res.status(500).send(err.message)
			})
		})
		
		
		app.post("/"+endpoint.endpoint,(req,res)=>{
			
			var allExist=true
			endpoint.requiredfields.forEach((field)=>{
				if (!(field in req.body)) {
					allExist=false;
				}
			})
			if (!allExist) {
				res.status(300).send("Required fields are: "+endpoint.requiredfields.filter((field)=>!(field in req.body)).join(','))
				return
			}
			
			var combinedfields = [...endpoint.requiredfields,...endpoint.optionalfields,...endpoint.excludedfields]
			//console.log(combinedfields)
			var all_filled_fields=combinedfields.filter((field)=>(field in req.body))
			
			db2.query('insert into '+endpoint.endpoint+"("+all_filled_fields.join(',')+") values("+all_filled_fields.map((field,i)=>"$"+(i+1)).join(",")+") returning *",all_filled_fields.map((field)=>req.body[field]))
			.then((data)=>{
				res.status(200).json(data.rows)
			})
			.catch((err)=>{
				res.status(500).send(err.message)
			})
		})
		
		app.patch("/"+endpoint.endpoint,(req,res)=>{
			if (req.body.id) {
				var combinedfields = [...endpoint.requiredfields,...endpoint.optionalfields,...endpoint.excludedfields]
				//console.log(combinedfields)
				var all_filled_fields=combinedfields.filter((field)=>(field in req.body))
				
				db2.query('update '+endpoint.endpoint+' set '+all_filled_fields.map((field,i)=>field+"=$"+(i+1)).join(",")+" where id=$"+(all_filled_fields.length+1)+" returning *",[...all_filled_fields.map((field)=>req.body[field]),req.body.id])
				.then((data)=>{
					res.status(200).json(data.rows)
				})
				.catch((err)=>{
					res.status(500).send(err.message)
				})
			} else {
				res.status(300).send("Invalid query!")
			}
		})
		
		app.delete("/"+endpoint.endpoint,(req,res)=>{
			if (req.body.id) {
				db2.query('delete from '+endpoint.endpoint+'  where id=$1 returning *',[req.body.id])
				.then((data)=>{
					res.status(200).json(data.rows)
				})
				.catch((err)=>{
					res.status(500).send(err.message)
				})
			} else {
				res.status(300).send("Invalid query!")
			}
		})
	})
}

/*const db2 =
new Pool({
  user: 'read_only_user',
  password: 'divar1234',
  host: 'postgres',
  database: 'divar',
  port: 5432,
})

app.get('/event/query',(req,res)=>{
	if (req.query.query&&req.query.query.length>0) {
		db2.query(req.query.query)
		.then((data)=>{
			res.status(200).json(data.rows)
		})
		.catch((err)=>{
			res.status(500).json(err.message)
		})
	} else {
		res.status(400).send("Empty query!")
	}
})*/

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
    db.query('select songs.*,songdata.rating as rating,songdata.difficulty,songdata.notecount from songs left join songdata on songs.id=songdata.songid' , (error, results) => {
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
					var oldNoteCount = data[song.id].notecount;
					data[song.id].rating={}
					data[song.id].notecount={}
					data[song.id].rating[data[song.id].difficulty]=oldRating;
					data[song.id].notecount[data[song.id].difficulty]=oldNoteCount;
				}
				data[song.id].rating[song.difficulty]=song.rating;
				data[song.id].notecount[song.difficulty]=song.notecount;
			} else {
				data[song.id]=song
				if (data[song.id].rating===null) {
					data[song.id].rating={}
				}
				if (data[song.id].notecount===null) {
					data[song.id].notecount={};
				}
			}})
		res.status(200).json(data)
	  }
    })
})

/*app.post('/register', (req, res) => {
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
})*/

app.delete('/remove',(req,res)=>{
	if (req.body &&
	req.body.username!==undefined && req.body.authentication_token!==undefined && req.body.playid!==undefined) {
		var userObj={},songObj={},rating=0,isFirstClear=false;
		db.query("select id,authentication_token,playcount,fccount,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear from users where username=$1 limit 1",[req.body.username])
		.then((data)=>{if(data && data.rows.length>0){userObj=data.rows[0];if (req.body.authentication_token===userObj.authentication_token){return db.query("delete from plays where id=$1 and userid=$2 returning *",[req.body.playid,userObj.id])}else{throw new Error("Could not authenticate user!")}}else{throw new Error("Cannot find user!")}})
		.then((data)=>{if(data && data.rows.length>0){songObj=data.rows[0];return CalculateRating(req.body.username)}else{throw new Error("Could not find play!")}})
		.then((data)=>{rating=data;return db.query("select * from plays where songid=$1 and userid=$2 and difficulty=$3 and score>0 limit 1",[songObj.songid,userObj.id,songObj.difficulty])})
		.then((data)=>{if(data && data.rows.length===0){isFirstClear=true;}/*console.log([data,userObj.playcount-1,(songObj.safe==0&&songObj.sad==0&&songObj.worst==0)?userObj.fccount-1:userObj.fccount,userObj.cool-songObj.cool,userObj.fine-songObj.fine,userObj.safe-songObj.safe,userObj.sad-songObj.sad,userObj.worst-songObj.worst,(songObj.difficulty=="E")?userObj.ecount-1:userObj.ecount,(songObj.difficulty=="N")?userObj.ncount-1:userObj.ncount,(songObj.difficulty=="H")?userObj.hcount-1:userObj.hcount,(songObj.difficulty=="EX")?userObj.excount-1:userObj.excount,(songObj.difficulty=="EXEX")?userObj.exexcount-1:userObj.exexcount]);*/return db.query("update users set rating=$1,playcount=$2,fccount=$3,cool=$4,fine=$5,safe=$6,sad=$7,worst=$8,eclear=$9,nclear=$10,hclear=$11,exclear=$12,exexclear=$13 where id=$14 returning rating,playcount,fccount,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear",[rating,userObj.playcount-1,(songObj.safe==0&&songObj.sad==0&&songObj.worst==0)?userObj.fccount-1:userObj.fccount,userObj.cool-songObj.cool,userObj.fine-songObj.fine,userObj.safe-songObj.safe,userObj.sad-songObj.sad,userObj.worst-songObj.worst,(songObj.difficulty=="E" && isFirstClear)?userObj.eclear-1:userObj.eclear,(songObj.difficulty=="N" && isFirstClear)?userObj.nclear-1:userObj.nclear,(songObj.difficulty=="H" && isFirstClear)?userObj.hclear-1:userObj.hclear,(songObj.difficulty=="EX" && isFirstClear)?userObj.exclear-1:userObj.exclear,(songObj.difficulty=="EXEX" && isFirstClear)?userObj.exexclear-1:userObj.exexclear,userObj.id])})
		.then((data)=>{if(data && data.rows.length>0){res.status(200).json({user:data.rows[0],song:songObj})
			axios.post("http://projectdivar.com/updates/"+userObj.id,{password:process.env.GMAIL,type:"delete"})	
		}else{throw new Error("Could not update user information, but song is deleted!")}})
		.catch((err)=>{res.status(500).json(err.message)})
	} else {
		res.status(400).send("Missing required parameters!");
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
			file.mimetype!=="image/jpeg" && file.mimetype!=="image/png" && file.mimetype!=="application/octet-stream") {
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
		  if (req.body.playid!==undefined) {
			//Add the url to that play.
			return db.query("update plays set src=$1 where id=$2 and userid=$3",["http://projectdivar.com/"+fileLoc,Number(req.body.playid),userId])
		  } else {
			return axios.post("http://projectdivar.com/image",{url:"http://projectdivar.com/"+fileLoc,user:req.body.username,auth:req.body.authentication_token})
		  }
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
	function addToQueue(src,userid,songid) {
		if (src) {
			db.query("select * from uploadedplays where filename=$1",[req.body.src])
			.then((data)=>{
				if (data.rows.length>0) {
					if (data.rows[0].tries>-5) {
						db.query("update uploadedplays set filename=$1,userid=$2,submissiondate=$3,id=$4,tries=$5 returning *",
							[src,userid,moment(),songid,(data.rows[0].tries*-1)+1])
						.then((data)=>{
							if (data.rows.length>0) {
								console.log("Added back to queue: "+JSON.stringify(data.rows[0]))
							}
						})
					}
				}
			})
		}	
	}
	
	if (req.body &&
	req.body.username!==undefined && req.body.authentication_token!==undefined && req.body.song!==undefined && req.body.difficulty!==undefined && req.body.cool!==undefined && req.body.fine!==undefined && req.body.safe!==undefined && req.body.sad!==undefined && req.body.worst!==undefined && req.body.fail!==undefined && req.body.percent!==undefined) {
		
		if (req.body.cool==-1||req.body.fine==-1||req.body.safe==-1||req.body.sad==-1||req.body.worst==-1) {
			fs.writeFileSync("invalidSongs",JSON.stringify(req.body)+"\n",{flag:"a"});
			res.status(400).json("Invalid note parameters!");
		}
		
		var fail = true;
		if (req.body.fail!==undefined) {
			fail = (req.body.fail=='true');
			//console.log("Fail is "+fail+" type:"+typeof(fail))
		}
		var submitDate = new Date();
		if (req.body.submitDate!==undefined) {
			submitDate=req.body.submitDate;
		}
		var playstyle="",songsubmitdata={},mod="",combo=-1,gameScore=-1,isFC=false,songRating=-1,userId = -1,songId=-1,playcount=-1,fccount=-1,cool=-1,fine=-1,safe=-1,sad=-1,worst=-1,alreadyPassed=false,eclear=-1,nclear=-1,hclear=-1,exclear=-1,exexclear=-1;
		var songdata={},userObj={};
		if (req.body.mod!==undefined) {
			mod = req.body.mod;
		}
		if (req.body.combo!==undefined) {
			combo = req.body.combo;
		}
		if (req.body.gameScore!==undefined) {
			gameScore = req.body.gameScore;
		}
		
		db.query("select id,authentication_token,playcount,fccount,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear,playstyle,megamix,futuretone from users where username=$1 limit 1",[req.body.username])
		.then((data)=>{if(data && data.rows.length>0){if (data.rows[0].authentication_token===req.body.authentication_token){
			var obj = data.rows[0];
			userObj = data.rows[0];
			playstyle=data.rows[0].playstyle;
			eclear=obj.eclear;nclear=obj.nclear;hclear=obj.hclear;exclear=obj.exclear;exexclear=obj.exexclear;
			cool=data.rows[0].cool;fine=data.rows[0].fine;safe=data.rows[0].safe;sad=data.rows[0].sad;worst=data.rows[0].worst;
			fccount=data.rows[0].fccount;playcount=data.rows[0].playcount;userId=data.rows[0].id;return db.query("select id,mega39s,futuretone from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1",[req.body.song])}else{throw new Error("Could not authenticate!")}}else{console.log(req.body); throw new Error("Could not find user.")}
		})
		.then((data)=>{if(data && data.rows.length>0){songId=data.rows[0].id; 
			songdata=data.rows[0];
			if (!(req.body.difficulty==="H"||req.body.difficulty==="N"||req.body.difficulty==="E"||req.body.difficulty==="EX"||req.body.difficulty==="EXEX"))
			{
				throw new Error("Invalid difficulty!")
			}			
			if (req.body.cool==-1||req.body.fine==-1||req.body.safe==-1||req.body.sad==-1||req.body.worst==-1) {
				throw new Error("Invalid submission!")
			}
		return db.query('select rating from songdata where songid=$1 and difficulty=$2 limit 1',[songId,req.body.difficulty])}else{throw new Error("Could not find song.")}})
		.then((data)=>{songRating=data.rows[0].rating;return db.query("select id from plays where userid=$1 and score>0 and difficulty=$2 and songid=$3 limit 1",[userId,req.body.difficulty,songId])})
		.then((data)=>{if(data && data.rows.length>0){alreadyPassed=true;/*console.log(data);*/};var score=CalculateSongScore({rating:songRating,cool:req.body.cool,fine:req.body.fine,safe:req.body.safe,sad:req.body.sad,worst:req.body.worst,percent:req.body.percent,difficulty:req.body.difficulty,fail:fail});return db.query("insert into plays(songId,userId,difficulty,cool,fine,safe,sad,worst,percent,date,score,fail,mod,combo,gamescore,src,playstyle) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) returning *",[songId,userId,req.body.difficulty,req.body.cool,req.body.fine,req.body.safe,req.body.sad,req.body.worst,req.body.percent,submitDate,score,fail,mod,combo,gameScore,(req.body.src)?req.body.src:"",(playstyle)?playstyle:""])})
		.then((data)=>{if(data && data.rows.length>0){
			songsubmitdata = data.rows[0];
			//console.log(alreadyPassed+" / "+typeof(alreadyPassed))
			if(alreadyPassed===false && songsubmitdata.score>0){switch(req.body.difficulty){case"E":{eclear++}break;case"N":{nclear++}break;case"H":{hclear++}break;case"EX":{exclear++}break;case"EXEX":{exexclear++}break;}}
			isFC = songsubmitdata.safe===0 && songsubmitdata.sad===0 && songsubmitdata.worst===0;
			return CalculateRating(req.body.username)}else{throw new Error("Could not submit song.")}})
		.then((data)=>{return db.query("update users set rating=$1,last_played=$3,playcount=$4,fccount=$5,cool=$6,fine=$7,safe=$8,sad=$9,worst=$10,eclear=$11,nclear=$12,hclear=$13,exclear=$14,exexclear=$15,megamix=$16,futuretone=$17 where username=$2",[data,req.body.username,new Date(),++playcount,fccount+((isFC)?1:0),cool+Number(req.body.cool),fine+Number(req.body.fine),safe+Number(req.body.safe),sad+Number(req.body.sad),worst+Number(req.body.worst),eclear,nclear,hclear,exclear,exexclear,(songdata.mega39s||userObj.megamix),(songdata.futuretone&&!songdata.mega39s)||userObj.futuretone])})
		.then((data)=>{return songsubmitdata;})
		.then((data)=>{
			//userId
			//password, type
			axios.post("http://projectdivar.com/updates/"+userId,{password:process.env.GMAIL,type:"submit"})
			if (req.body.src) {
				db.query("delete from uploadedplays where filename=$1",[req.body.src])
			}
			res.status(200).json(data);
		})
		.catch((err)=>{
			//console.log(req.body);
			console.log(err);
			addToQueue(req.body.src,userId,songId)
			res.status(500).send(err.message);})
	} else {
		console.log(req.body);
		res.status(400).send("Missing required parameters!");
	}
})

CalculateSongScore=(song)=>{
	if (song.fail==true){return 0;}
	var noteCount=Number(song.cool)+Number(song.fine)+Number(song.safe)+Number(song.sad)+Number(song.worst);
	var comboBreaks=Number(song.safe)+Number(song.sad)+Number(song.worst);
	/*console.log("Combo Breaks: "+comboBreaks)
	console.log("Is FC? "+(comboBreaks===0))
	console.log("Is PFC? "+(song.fine===0&&song.safe===0&&song.sad===0&&song.worst===0))*/
	var scoreMult=1;
	var percentMult=1;
	if (song.percent>110) {
		song.percent=100
	}
	if (song.fine===0&&song.safe===0&&song.sad===0&&song.worst===0){scoreMult=2.4}else if(comboBreaks===0){scoreMult=1.4}else{scoreMult=1}
	switch (song.difficulty){
		case "E":{if(song.percent<30){percentMult=0;}else{percentMult=1+Math.pow(1.0*((song.percent-30)/70.0),3)}}break;
		case "N":{if(song.percent<50){percentMult=0}else{percentMult=1+Math.pow(1.0*((song.percent-50)/50.0),3)}}break;
		case "H":{if(song.percent<60){percentMult=0}else{percentMult=1+Math.pow(1.0*((song.percent-60)/40.0),3)}}break;
		case "EX":
		case "EXEX":{if(song.percent<70){percentMult=0}else{percentMult=1+Math.pow(1.0*((song.percent-70)/30.0),3)}}break;
		default:{
			if(song.percent<60){percentMult=0}else{percentMult=1+(Math.pow(1.0*((song.percent-60)/40.0),3))}
		}
	}
	/*console.log("Score mult: "+scoreMult)
	console.log("Percent mult: "+percentMult)*/
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
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/accuracy/:username',(req,res)=>{
	db.query('select cool,fine,safe,sad,worst from users where username=$1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){return CalculateAccuracy(data.rows[0].cool,data.rows[0].fine,data.rows[0].safe,data.rows[0].sad,data.rows[0].worst)}else{throw new Error("User does not exist!")}})
	.then((data)=>{res.status(200).json({accuracy:data})})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/updates/:userid',(req,res)=>{
	db.query('select * from userupdate where userid=$1',[req.params.userid])
	.then((data)=>{
		if (data.rows.length>0) {
			res.status(200).json(data.rows[0])
		} else {
			res.status(400).send("No user update found!")
		}
	})
	.catch((err)=>{
		res.status(500).send(err.message)
	})
})

app.post('/updates/:userid',(req,res)=>{
	if (req.body&&req.body.password&&req.body.type) {
		if (req.body.password===process.env.GMAIL) {
			db.query("insert into userupdate(userid,update_type,date) values($1,$2,$3) on conflict(userid) do update set update_type=$2,date=$3 where userupdate.userid=$1 returning *",[req.params.userid,req.body.type,moment()])
			.then((data)=>{
				if (data.rows.length>=0) {
					res.status(200).send(data.rows[0])
				} else {
					throw new Error("Could not update user.")
				}
			})
			.catch((err)=>{
				res.status(500).send(err.message)
			})
		} else {
			res.status(403).send("Could not authenticate")
		}
	} else {
		res.status(400).send("Invalid credentials!")
	}
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
	.then((data)=>{//console.log(data);
	if (data.rows.length>0){
	var scoreData=data.rows[0];
	return db.query('select username from users where id=$1',[userId])
	.then((data)=>{username=data.rows[0].username; return CalculateRating(username)})
	.then((data)=>{db.query("update users set rating=$1 where username=$2",[data,username])})
	.then(()=>{return scoreData;})
	.catch((err)=>{
		throw new Error("Could not update score");
	})
	}else{throw new Error("Failed to update score!")}})
	.then((data)=>{
		res.status(200).json(data)
		axios.post("http://projectdivar.com/updates/"+userId,{password:process.env.GMAIL,type:"recalculate"})
	})
	.catch((err)=>{console.log(err);res.status(500).send(err.message);})
});

/*
app.get('/playdata',(req,res)=>{
	db.query('select * from plays')
	.then((data)=>{res.status(200).json(data.rows)})
	.catch((err)=>res.status(500).json(err.message))
})*/

app.post('/recalculatePlayerData/:id',(req,res)=>{
	if (req.body&&req.body.password) {
		if (req.body.password===process.env.GMAIL) {
			db.query(" select COUNT(*) as plays,SUM(cool) as coolsum,SUM(fine) as finesum,SUM(safe) as safesum,SUM(sad) as sadsum,SUM(worst) as worstsum,COUNT(*) filter(where safe=0 and sad=0 and worst=0) as fc from plays where userid=$1",[req.params.id])
			.then((data)=>{
				var d = data.rows[0];
				return db.query("update users set playcount=$1,fccount=$2,cool=$3,fine=$4,safe=$5,sad=$6,worst=$7 where id=$8 returning playcount,fccount,cool,fine,safe,sad,worst,id",
				[d.plays,d.fc,(d.coolsum!==null)?d.coolsum:0,(d.finesum!==null)?d.finesum:0,(d.safesum!==null)?d.safesum:0,(d.sadsum!==null)?d.sadsum:0,(d.worstsum!==null)?d.worstsum:0,req.params.id])
			}
			)
			.then((data)=>{
				res.status(200).json(data.rows[0])
			})
		}
	}
})

app.get('/completionreport/:username',(req,res)=>{
	//Number of passes,plays,fcs,pfcs, and the best play.
	var userId=-1,songs,promises=[];
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then ((data)=>{
		if (data.rows.length>0) {
			userId=data.rows[0].id;
			return db.query('select * from songs order by id asc')
		} else {
			throw new Error("Cannot find user!")
		}
	})
	.then((data)=>{
		songs = data.rows;
		songs.forEach((song)=>{
			promises.push(db.query("select * from (select userid,count(*) filter(where difficulty='E' and mod='SD' and score>0) as ESDCount,count(*) filter(where difficulty='N' and mod='SD' and score>0) as NSDCount,count(*) filter(where difficulty='H' and mod='SD' and score>0) as HSDCount,count(*) filter(where difficulty='EX' and mod='SD' and score>0) as EXSDCount,count(*) filter(where difficulty='EXEX' and mod='SD' and score>0) as EXEXSDCount,count(*) filter(where difficulty='E' and mod='HD' and score>0) as EHDCount,count(*) filter(where difficulty='N' and mod='HD' and score>0) as NHDCount,count(*) filter(where difficulty='H' and mod='HD' and score>0) as HHDCount,count(*) filter(where difficulty='EX' and mod='HD' and score>0) as EXHDCount,count(*) filter(where difficulty='EXEX' and mod='HD' and score>0) as EXEXHDCount,count(*) filter(where difficulty='E' and mod='HS' and score>0) as EHSCount,count(*) filter(where difficulty='N' and mod='HS' and score>0) as NHSCount,count(*) filter(where difficulty='H' and mod='HS' and score>0) as HHSCount,count(*) filter(where difficulty='EX' and mod='HS' and score>0) as EXHSCount,count(*) filter(where difficulty='EXEX' and mod='HS' and score>0) as EXEXHSCount,Count(*) filter(where difficulty='E' and score>0) as EClearCount,Count(*) filter(where difficulty='N' and score>0) as NClearCount,Count(*) filter(where difficulty='H' and score>0) as HClearCount,Count(*) filter(where difficulty='EX' and score>0) as EXClearCount,Count(*) filter(where difficulty='EXEX' and score>0) as EXEXClearCount,count(*) filter(where difficulty='E') as ECount,count(*) filter(where difficulty='N') as NCount,count(*) filter(where difficulty='H') as HCount,count(*) filter(where difficulty='EX') as EXCount,count(*) filter(where difficulty='EXEX') as EXEXCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='E') as EFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='N') as NFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='H') as HFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='EX') as EXFCCount,Count(*) filter(where safe=0 and sad=0 and worst=0 and difficulty='EXEX') as EXEXFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='E') as EPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='N') as NPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='H') as HPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='EX') as EXPFCCount,Count(*) filter(where fine=0 and safe=0 and sad=0 and worst=0 and difficulty='EXEX') as EXEXPFCCount from plays where userid=$1 and songid=$2 group by userid)t1 join (select rank,t.score,t.percent from (select row_number()over(order by score desc)rank,* from(select distinct on (userid) * from (select * from plays where songid=$2)t order by userid,score desc)t)t where userid=$1)t2 on t1.userid=t1.userid",[userId,song.id])
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
	.catch((err)=>{res.status(500).send(err.message)})
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
	.catch((err)=>{res.status(500).send(err.message)})
	
})

app.get('/bestplays/:username',(req,res)=>{
	var songId=-1,userId=-1,songPromises=[],plays=[],limit=5,offset=0;
	if (req.query.limit) {limit=req.query.limit}
	if (req.query.offset) {offset=req.query.offset}
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query("select * from (select distinct on (songid) * from plays where userid=$1 "+((req.query.fails==="false")?"and score!=0":"")+" order by songid,score desc)t order by score desc limit $2 offset $3",[userId,Number(limit),Number(offset)])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{
		res.status(200).json(data.rows)
	})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/bestplay/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;if(req.params.songname){return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{return db.query('select * from plays where userid=$1 order by score desc',[userId])}}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 order by score desc,percent desc limit 1',[userId,songId,req.params.difficulty])}else{res.status(400).send("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json(data.rows[0])}else{res.status(400).send("No data found!")}})
	.catch((err)=>{res.status(500).send(err.message+JSON.stringify(req.body))})
})

app.get('/userdata/:username',(req,res)=>{
	var songId=-1,userId=-1,finalData={};
	db.query('select id,megamix,futuretone,playstyle,playcount,fccount,rating,last_played,cool,fine,safe,sad,worst,eclear,nclear,hclear,exclear,exexclear from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if(data && data.rows.length>0){finalData=data.rows[0];return db.query("select t.difficulty,COUNT(t.difficulty) from (select distinct on(songid) songid,*,users.id from plays join users on userid=users.id where users.username=$1 and plays.safe=0 and plays.worst=0 and plays.sad=0)t group by t.difficulty",[req.params.username])}else{throw new Error("Could not retrieve user data!")}})
	.then((data)=>{
		if (data) {
			var fcData={}
			data.rows.forEach((fc)=>{fcData[fc.difficulty]=fc.count})
			finalData={...{fcdata:fcData},...finalData}
			return db.query("select t.difficulty,COUNT(t.difficulty) from (select distinct on(songid) songid,*,users.id from plays join users on userid=users.id where users.username=$1 and plays.fine=0 and plays.safe=0 and plays.worst=0 and plays.sad=0)t group by t.difficulty",[req.params.username])
		}else{throw new Error("Could not retrieve user data!")}
	})
	.then((data)=>{
		if (data) {
			var fcData={}
			data.rows.forEach((fc)=>{fcData[fc.difficulty]=fc.count})
			finalData={...{pfcdata:fcData},...finalData}
			res.status(200).json(finalData)
		}else{throw new Error("Could not retrieve user data!")}
	})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/plays/:username/:songid',(req,res)=>{
	var limit=5,offset=0;
	if (req.query.limit) {limit=req.query.limit}
	if (req.query.offset) {offset=req.query.offset}
	db.query("select plays.* from plays join users on users.id=plays.userid where users.username=$1 and plays.songid=$2 order by score desc,percent desc,date desc limit $3 offset $4",[req.params.username,req.params.songid,Number(limit),Number(offset)])
	.then((data)=>{
		res.status(200).json(data.rows)
	})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/playcount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 order by score desc',[userId,songId,req.params.difficulty])}else{res.status(400).send("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({playcount:data.rows.length})}else{res.status(200).json({playcount:0})}})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/songpasscount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and score>0',[userId,songId,req.params.difficulty])}else{res.status(400).send("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({passcount:data.rows.length})}else{res.status(200).json({passcount:0})}})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/songfccount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and safe=0 and sad=0 and worst=0',[userId,songId,req.params.difficulty])}else{res.status(400).send("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({fccount:data.rows.length})}else{res.status(200).json({fccount:0})}})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/songpfccount/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select * from plays where userid=$1 and songid=$2 and difficulty=$3 and fine=0 and safe=0 and sad=0 and worst=0',[userId,songId,req.params.difficulty])}else{res.status(400).send("Could not find song!")}})
	.then((data)=>{if(data && data.rows.length>0){res.status(200).json({fccount:data.rows.length})}else{res.status(200).json({fccount:0})}})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/songmods/:username/:songname/:difficulty',(req,res)=>{
	var songId=-1,userId=-1,hs=0,sd=0,hd=0;
	db.query('select id from users where username=$1 limit 1',[req.params.username])
	.then((data)=>{if (data.rows.length>0){userId=data.rows[0].id;return db.query('select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1', [req.params.songname])}else{throw new Error("Cannot find user!")}})
	.then((data)=>{if(req.params.songname &&data.rows.length>0){songId=data.rows[0].id;return db.query('select COUNT(mod) from (select * from plays where userid=$1 and songid=$2 and difficulty=$3 and mod=$4)t',[userId,songId,req.params.difficulty,"HS"])}else{res.status(400).send("Could not find song!")}})
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
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/rating/:username',(req,res)=>{
	if (req.params.username) {
		db.query('select rating from users where username=$1 limit 1',[req.params.username])
		.then((data)=>{if(data.rows.length>0){res.status(200).json(data.rows[0])}else{res.status(200).json({rating:0})}})
	} else {
		res.status(400).send("Invalid username!")
	}
})

app.get('/recentplays/:username',(req,res)=>{
	if (req.params.username) {
		db.query('select plays.* from plays join users on users.id=plays.userid where users.username=$1 order by plays.id desc limit 5',[req.params.username])
		.then((data)=>{if(data.rows.length>0){res.status(200).json(data.rows)}else{res.status(200).json([])}})
	} else {
		res.status(400).send("Invalid username!")
	}
})

app.get('/users/:orderby/:sortorder',(req,res)=>{
	if (req.params.orderby && req.params.sortorder && req.query.limit && req.query.offset) {
		var valid = ["rating","last_played","playcount","username","fccount"];
		var validsort = ["desc","asc"];
		if (valid.includes(req.params.orderby) && validsort.includes(req.params.sortorder)) {
			db.query('select username,rating,last_played,playcount,fccount from users order by '+req.params.orderby+' '+req.params.sortorder+",rating desc limit $1 offset $2",[req.query.limit,req.query.offset])
			.then((data)=>{return res.status(200).json(data.rows)})
			.catch((err)=>{res.status(500).send(err.message)})
		} else {
			res.status(400).send("Not a valid sort option!");
		}
	} else {
		res.status(400).send("Invalid query!")
	}
})

function ValidateToken(username,token) {
	return db.query('select authentication_token from users where username=$1 limit 1',[username])
	.then((data)=>{
		if (data.rows.length>0) {
			return token===data.rows[0].authentication_token;
		} else {
			return false;
		}
	})
}

function GetSongId(songname) {
	return db.query("select id from songs where name=$1 or romanized_name=$1 or english_name=$1 limit 1",[songname])
	.then((data)=>{
		if (data.rows.length>0) {
			return data.rows[0].id;
		} else {
			throw new Error("Could not get song ID for song '"+songname+"'")
		}
	})
}

function GetNoteCount(songname,difficulty) {
	var songID=-1;
	return GetSongId(songname)
	.then((id)=>{songID=id;return db.query("select notecount from songdata where songid=$1 and difficulty=$2 limit 1",[songID,difficulty])})
	.then((data)=>{
		if (data.rows.length>0) {
			return data.rows[0].notecount;
		} else {
			throw new Error("Could not get note count for song '"+songname+"' on difficulty '"+difficulty+"'")
		}
	})
}

app.post('/song/:songname/:difficulty',(req,res)=>{
	if (req.body&&req.params.songname&&req.params.difficulty&&req.body.username&&req.body.percent&&req.body.authentication_token) {
		var noteCount=0,songID=0,fail=false;
		ValidateToken(req.body.username,req.body.authentication_token)
		.then((allowed)=>{
			if (allowed) {
				return GetSongId(req.params.songname)
			}else{throw new Error("Could not authenticate!")}
		})
		.then((songId)=>{
			if (songId) {
				songID=songId;
				return GetNoteCount(req.params.songname,req.params.difficulty)
			}else{throw new Error("Could not find song ID!")}
		})
		.then((noteCount)=>{
			var percentThreshold=(req.params.difficulty==="E"?100:107)/100.0
			var percent=(req.params.difficulty==="E"?100:107)?Math.min(req.body.percent/100.0,percentThreshold):Math.min(req.body.percent/107.0,percentThreshold);
			var cool = 0;
			var fine = 0;
			var safe = 0;
			var sad = 0;
			var worst = 0;
			for (var i=0;i<noteCount;i++) {
				if (req.body.isFC) {
					if (Math.random()<percent) {
						cool++;
					} else {
						fine++;
					}
				} else 
				{
					if (Math.random()<percent) {
						cool++;
						continue;
					} else 
					if (Math.random()<percent) {
						fine++;
						continue;
					} else 
					if (Math.random()<percent) {
						worst++;
						continue;
					} else 
					if (Math.random()<percent) {
						safe++;
						continue;
					} else 
					if (Math.random()<percent) {
						sad++;
						continue;
					} else {
						worst++;
					}
				}
			}
			
			switch (req.params.difficulty){
				case "E":{
					if (req.body.percent<30){fail=true;}
				}break;
				case "N":{
					if (req.body.percent<50){fail=true;}
				}break;
				case "H":{
					if (req.body.percent<60){fail=true;}
				}break;
				case "EX":
				case "EXEX":{
					if (req.body.percent<70){fail=true;}
				}break;
				default:{
					if (req.body.percent<60){fail=true;}
				}break;
			}
			
			if (req.body.fail) {
				fail=req.body.fail
			}
			//res.status(200).json({cool:cool,fine:fine,safe:safe,sad:sad,worst:worst,percent:req.body.percent})
			return axios.post("http://projectdivar.com/submit",{
				username:req.body.username,authentication_token:req.body.authentication_token,song:req.params.songname,difficulty:req.params.difficulty,cool:cool,fine:fine,safe:safe,sad:sad,worst:worst,percent:req.body.percent,fail:String(fail)
			})
		})
		.then((data)=>{
			res.status(200).json(data.data)
		})
		.catch((err)=>{res.status(400).send(err.message)})
	} else {
		res.status(400).send("Invalid query!")
	}
})

function CheckUserExists(username,email) {
	return db.query("select id,username,email,registered from users where username=$1 or email=$2 limit 1",[username,email])
}

function SendLoginEmail(username,emailTo,authCode) {
	const transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: 'admin@projectdivar.com',
		pass: process.env.GMAIL // naturally, replace both with your real credentials or an application-specific password
	  }
	});
	transporter.sendMail({
		from: 'admin@projectdivar.com',
		to: emailTo,
		subject: 'Project DivaR Login Code',
		html: `<b>${username}</b>,<br><br>Thank you for using Project DivaR!<br><br>Your authentication code is <b>${authCode}</b>!`
	}, (err, info) => {
		if (err) { 
			console.log(err.message)
		} else {
			console.log(info.envelope);
			console.log(info.messageId);
		}
	});
}

function SendRegistrationEmail(username,emailTo,authCode) {
	const transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: 'admin@projectdivar.com',
		pass: process.env.GMAIL // naturally, replace both with your real credentials or an application-specific password
	  }
	});
	transporter.sendMail({
		from: 'admin@projectdivar.com',
		to: emailTo,
		subject: 'Project DivaR Registration Code',
		html: `<b>${username}</b>,<br><br>Thank you for signing up for Project DivaR!<br><br>Your authentication code is <b>${authCode}</b>!`
	}, (err, info) => {
		if (err) { 
			console.log(err.message)
		} else {
			console.log(info.envelope);
			console.log(info.messageId);
		}
	});
}

function GetUserInfo(username) {
	return db.query("select id,username,email,code_time from users where username=$1 limit 1",[username])
}
function GetUserLoginAllowed(username,authCode) {
	return db.query("select id,username,email,code_time,playstyle,twitter_name,twitch_name from users where username=$1 and code=$2 limit 1",[username,authCode])
}
app.post('/authenticate/authToken',(req,res)=>{
	if (req.body&&req.body.username&&req.body.authCode) {
		GetUserLoginAllowed(req.body.username.trim(),req.body.authCode.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				return db.query("select authentication_token from users where id=$1",[data.rows[0].id])
			} else {
				return new Error("Failed login!")
			}
		})
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).json(data.rows[0])
			} else {
				return new Error("Failed to get authentication token!")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid Credentials!")
	}
})

app.post('/authenticate/login',(req,res)=>{
	if (req.body&&req.body.username&&req.body.authCode) {
		GetUserLoginAllowed(req.body.username.trim(),req.body.authCode.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).json(data.rows[0])
			} else {
				return new Error("Failed login!")
			}
		})
	} else {
		res.status(400).send("Invalid Credentials!")
	}
})

app.post('/sendemail/login',function(req,res) {
	if (req.body&&req.body.username) {
		GetUserInfo(req.body.username.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).send("Email sent.")
				//console.log(data.rows[0].code_time)
				if (data.rows[0].code_time) {
					if (moment(data.rows[0].code_time,"YYYY-MM-DD HH:mm:ss.SSSZ").diff(moment(),'minutes')<=-15) {
						var authCode=Math.floor(Math.random()*90000)+10000
						SendLoginEmail(req.body.username,data.rows[0].email,authCode)
						db.query("update users set code=$1,code_time=$3 where id=$2",[authCode,data.rows[0].id,moment()])
					}
					//console.log(moment(data.rows[0].code_time,"YYYY-MM-DD HH:mm:ss.SSSZ").diff(moment(),'minutes'))
				} else {
					var authCode=Math.floor(Math.random()*90000)+10000
					SendLoginEmail(req.body.username,data.rows[0].email,authCode)
					db.query("update users set code=$1,code_time=$3 where id=$2",[authCode,data.rows[0].id,moment()])
				}
			} else {
				return new Error("User does not exist!")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.patch('/updateRegisteredState',function(req,res) {
	if (req.body&&req.body.username&&req.body.authCode) {
		GetUserLoginAllowed(req.body.username,req.body.authCode)
		.then((data)=>{
			if (data.rows.length>0) {
				return db.query("update users set registered=$1 where id=$2",[true,data.rows[0].id])
			} else {
				throw new Error("Could not login!")
			}
		})
		.then((data)=>{
			res.status(200).send("Registered!")
		})
		.catch((err)=>{
			res.status(500).send("Could not finish registration!")
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.post('/sendemail/register',function(req,res) {
	if (req.body&&req.body.username&&req.body.email) {
		//Generate a token for the user to login with.
		CheckUserExists(req.body.username.trim(),req.body.email.trim())
		.then((data)=>{
			var authCode=Math.floor(Math.random()*90000)+10000
			var authenticationToken=String(Math.floor(Math.random()*90000)+10000)+"-"+String(Math.floor(Math.random()*90000)+10000)+"-"+String(Math.floor(Math.random()*90000)+10000);
			if (data.rows.length>0) {
				//db.query("update users set code=$1 where id=$2",[authCode,data.rows[0].id])
				if (data.rows[0].registered) {
					throw new Error("User already exists!")
				} else {
					return db.query("update users set code=$1 where id=$2 returning code",[authCode,data.rows[0].id])
				}
			} else {
				return db.query("insert into users(username,email,authentication_token,code) values($1,$2,$3,$4) returning code",
				[req.body.username,req.body.email,authenticationToken,authCode])
			}
		})
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).send("Email sent.")
				SendRegistrationEmail(req.body.username,req.body.email,data.rows[0].code)
			} else {
				throw new Error("Something bad happened!")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

function AuthenticateUser(username,auth) {
	return db.query("select id,username,email from users where username=$1 and authentication_token=$2 limit 1",[username,auth])
}

app.post('/authenticateuser',function(req,res) {
	if (req.body&&req.body.username&&req.body.authenticationToken) {
		AuthenticateUser(req.body.username.trim(),req.body.authenticationToken.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).send("Authentication Success!")
			} else {
				throw new Error("Authentication Failed!")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.post('/updateuser', function(req, res) {
	var userId=-1;
	if (req.body&&req.body.playStyle&&req.body.username&&req.body.authCode) {
		GetUserLoginAllowed(req.body.username ,req.body.authCode)
		.then((data)=>{
			if (data.rows.length>0) {
				userId=data.rows[0].id
				if (req.body.twitchName) {
					db.query("update users set twitch_name=$1 where id=$2",[req.body.twitchName,userId])
				}
				
				
				if (req.body.twitterName) {
					return axios.get('https://api.twitter.com/1.1/users/show.json?screen_name='+req.body.twitterName, {
						headers: {
							/*BEARER*/	Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
						}
					})
				} else 
				{
					return {data:{}}
				}
			} else {
				throw new Error("Could not login!")
			}
		})
		.then((data)=>{
			if (data.data.id) {
				return db.query("update users set playstyle=$1,twitter=$2,twitter_name=$3 where id=$4",[req.body.playStyle,data.data.id,req.body.twitterName,userId])
			} else {
				return db.query("update users set playstyle=$1 where id=$2",[req.body.playStyle,userId])
			}
		})
		.then((data)=>{
			res.status(200).send("Successfully updated user settings!")
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.post('/getUserAuthData', function(req, res) {
	if (req.body&&req.body.password&&req.body.userId) {
		if (req.body.password===process.env.GUARDIANPASSWORD) {
			db.query("select uploads,username,authentication_token from users where id=$1",[req.body.userId])
			.then((data)=>{
				if (data.rows.length>0) {
					res.status(400).json(data.rows[0])
					db.query("update users set uploads=$1 where id=$2",[data.rows[0].uploads+1,req.body.userId])
				} else {
					res.status(400).send("No user found!")
				}
			}
			)
			.catch((err)=>{
				res.status(500).send(err.message)
			})
		} else {
			res.status(400).send("Authentication failed!")
		}
	} else {
		res.status(400).send("Invalid credentials!");
	}
})

app.post('/passImageData',function(req,res) {
	if (req.body&&req.body.user&&req.body.auth&&req.body.url) {
		axios.post("http://projectdivar.com/image",{user:req.body.user,auth:req.body.auth,url:req.body.url})
		.then((data)=>{
			res.status(200).json(data.data)
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.post('/streamstart/:id',function (req,res){
	if (req.body&&req.body.username&&req.body.authentication_token) {
		GetUserLoginAllowed(req.body.username.trim(),req.body.authentication_token.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				spawn("../divabotguardian/stream_monitor.sh",[Number(req.params.id)])
				res.status(200).send("Monitor started")
			} else {
				res.status(400).send("Failed to authenticate")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.post('/streamtop/:id',function (req,res){
	exec("ps 43",(err,out,stderr)=>{
		if (err) {
			res.status(500).send(`${err.message}`);
			return;
		}
		if (stderr) {
			res.status(500).send(`${stderr}`);
			return;
		}
		res.status(200).send(`${out}`);
	})
})

app.post('/streaminfo/:id',function (req,res){
	if (req.body&&req.body.username&&req.body.authentication_token) {
		GetUserLoginAllowed(req.body.username.trim(),req.body.authentication_token.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				exec("ps $(cat ../divabotguardian/processes/"+Number(req.params.id)+".ffmpeg)|wc -l",(err,out,stderr)=>{
					if (err) {
						res.status(500).send(`${err.message}`);
						return;
					}
					if (stderr) {
						res.status(500).send(`${stderr}`);
						return;
					}
					res.status(200).send(`${out}`);
				})
			} else {
				res.status(400).send("Failed to authenticate")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

var lastscores_JP={}
const EVENTID=26;
var EVENTSTART=moment('2021-07-25 03:00:00+00');
var EVENTEND=moment('2021-07-29 11:59:59+00');

var lastscores_EN={}
const EVENTID_EN=23;
var EVENTSTART_EN=moment('2021-06-28 03:00:00+00');
var EVENTEND_EN=moment('2021-07-06 11:59:59+00');
 
app.get("/helpmetestwithoutbreakingshit", (req,res) => {
	res.status(200).send("hi")
	db.query("select eventid, startdate, enddate from event order by id desc limit 1").then(res.status(200).send)
})

app.post('/eventsubmit',function(req,res) {
	
	const lastscores = req.query.en ? lastscores_EN: lastscores_JP;
	function submit() {
		if (req.query.en) {
			lastscores_EN[req.body.rank]=Number(req.body.points)
		} else {
			lastscores_JP[req.body.rank]=Number(req.body.points)
		}
		db.query("insert into "+(req.query.en?"en_":"")+"eventdata(eventid,rank,date,name,description,points) values($1,$2,$3,$4,$5,$6) returning *;",
		[req.body.eventid,req.body.rank,req.body.date?req.body.date:req.body.fin?moment(EVENTEND).add(5,'minutes').format("YYYY-MM-DD HH:mm:ssZ"):new Date(),req.body.name,req.body.description,req.body.points])
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).send("Submitted.")
			} else {
				res.status(500).send("Failed to submit.")
			}
		})
		.catch((err)=>{
			res.status(500).send(`${err.message}`);
		})
	}
	
	//add to table.
	
	function FurtherTierIsOkay(tier,scores,points) {
		var tiers= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,50,100,500,1000,2000,5000,10000,20000,30000,50000]
		if (tier<=1) {
			return true;
		} else 
		{
			//Find the previous tier.
			var previousTier = -1;
			for (var i=0;i<tiers.length;i++) {
				if (tiers[i]==tier) {
					previousTier=tiers[i-1]
				}
			}
			if (previousTier==-1) {
				console.log("Something weird happened....")
				return false; //Something terrible happened.
			} else 
			if (!scores[tier]) {
				return true; //It's okay since no score is submitted yet.
			} else
			{
				return points<scores[previousTier] //If it's greater something's wrong...
			}
		}
	}

	function EndsWithZeroes(str) {
		var zeroCount=0;
		var string = String(str)
		for (var i=0;i<string.length;i++) {
			if (string[i]=='0') {
				zeroCount++;
			} else {
				zeroCount=0;
			}
		}
		return zeroCount>=2;
	}

	function ScoreIsSanitary(rank,name,description,points) {
		if (Number(rank)<=20) {
			return true;
		} else {
			if (EndsWithZeroes(name)||EndsWithZeroes(description)||EndsWithZeroes(points)) {
				return false;
			} else {
				return true;
			}
		}
	}
	
	//Try to update last scores.
	db.query('select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from '+(req.query.en?"en_":"")+'eventdata where eventid='+EVENTID+' order by rank,date desc)t order by rank,date desc')
	.then((data) =>
		{
			
			if (!lastscores[req.body.rank]
				|| (/*FurtherTierIsOkay(req.body.rank,lastscores,req.body.points)&&*/lastscores[req.body.rank]<req.body.points
                &&(req.body.fin||ScoreIsSanitary(req.body.rank,req.body.name,req.body.description,req.body.points))/*||(lastscores[req.body.rank]<req.body.points
                        &&(FurtherTierIsOkay(req.body.rank,lastscores,req.body.points))*/))
			 {
				submit()
			} else {
				res.status(200).send("No update required.")
			}
			if (data.rows.length>0) {
				data.rows.map((row)=>{lastscores[row.rank]=row.points})
				
			}
		}
	)
})

var chartData={}
var predictionChartData={}

var diffData=[]

var en_chartData={}
var en_predictionChartData={}

var en_diffData=[]

const PREDICTIONS=true

const en_PREDICTIONS=true

var lastCachedDate=EVENTSTART

var en_lastCachedDate=EVENTSTART

const nyoomfactor={//Percentage of original speed to use when nyoom'ing
	1:1.0,
	2:1.0,
	3:1.0,
	4:1.0,
	5:1.0,
	6:1.0,
	7:1.0,
	8:1.0,
	9:1.0,
	10:1.0,
	11:1.0,
	12:0.9,
	13:0.7,
	14:0.5,
	15:0.3,
	16:0.3,
	17:0.3,
	18:0.3,
	19:0.3,
	20:0.3,
	50:0.81,
	100:0.76,
	500:0.28,
	1000:0.24,
	2000:0.09,
	5000:0.07,
	10000:0.04,
	20000:0.02
}


const slowdownFactor={//Percentage of slowdown per hour.
	1:0.00001,
	2:0.00003,
	3:0.00003,
	4:0.00005,
	5:0.00005,
	6:0.00005,
	7:0.00005,
	8:0.00005,
	9:0.00005,
	10:0.00005,
	11:0.00005,
	12:0.00006,
	13:0.00007,
	14:0.00008,
	15:0.00009,
	16:0.0001,
	17:0.0001,
	18:0.0001,
	19:0.0001,
	20:0.0001,
	50:0.0002,
	100:0.0003,
	500:0.0004,
	1000:0.0005,
	2000:0.0005,
	5000:0.0005,
	10000:0.0005,
	20000:0.0005
}

var MAXSPEED=0

function SetupPredictionModel() {
	if (chartData['1']&&chartData['1'].length>400) {
		MAXSPEED=Math.floor(chartData['1'][400].points/(moment(chartData['1'][400].date).diff(EVENTSTART,'minutes')/60))
	} else 
	if (chartData['1']&&chartData['1'].length>0){
		MAXSPEED=Math.floor(chartData['1'][chartData['1'].length-1].points/(moment(chartData['1'][chartData['1'].length-1].date).diff(EVENTSTART,'minutes')/60))
	} else {
		MAXSPEED=0
	}
	if (en_chartData['1']&&en_chartData['1'].length>400) {
		MAXSPEED=Math.floor(en_chartData['1'][400].points/(moment(en_chartData['1'][400].date).diff(EVENTSTART,'minutes')/60))
	} else 
	if (en_chartData['1']&&en_chartData['1'].length>0){
		MAXSPEED=Math.floor(en_chartData['1'][en_chartData['1'].length-1].points/(moment(en_chartData['1'][en_chartData['1'].length-1].date).diff(EVENTSTART,'minutes')/60))
	} else {
		MAXSPEED=0
	}
}
const RATEDURATION=2 //In hours. How much EP/hr is shown.

function GetRate(rank,en) {
	if (en) {
		if (en_chartData[rank].length>2) {
			var lastpoint=en_chartData[rank][en_chartData[rank].length-1]
			for (var i=en_chartData[rank].length-1;i>=0;i--) {
				var diff = moment().diff(en_chartData[rank][i].date,'hours')
				if (diff>=RATEDURATION) {
					break;
				} else {
					lastpoint=en_chartData[rank][i]
				}
			}
			var timediff = moment(en_chartData[rank][en_chartData[rank].length-1].date).diff(moment(lastpoint.date),'minutes')
			if (timediff<120) {
				if (lastpoint===en_chartData[rank][en_chartData[rank].length-1]) {
					return "???"
				} else 
				return (en_chartData[rank][en_chartData[rank].length-1].points-lastpoint.points)/RATEDURATION
			} else {
				return Math.ceil((en_chartData[rank][en_chartData[rank].length-1].points-lastpoint.points)/
					(moment(en_chartData[rank][en_chartData[rank].length-1].date).diff(moment(lastpoint.date),'minutes')/60)
				)
			}
		} else {
			if (en_chartData[rank].length>0) {
				var startPoint=en_chartData[rank][en_chartData[rank].length-1]
				return Math.ceil(GetRank(rank)/(moment(startPoint.date).diff(EVENTSTART,'minutes')/60))
			} else {
				return 0
			}
		}
	} else {
		if (chartData[rank].length>2) {
			var lastpoint=chartData[rank][chartData[rank].length-1]
			for (var i=chartData[rank].length-1;i>=0;i--) {
				var diff = moment().diff(chartData[rank][i].date,'hours')
				if (diff>=RATEDURATION) {
					break;
				} else {
					lastpoint=chartData[rank][i]
				}
			}
			var timediff = moment(chartData[rank][chartData[rank].length-1].date).diff(moment(lastpoint.date),'minutes')
			if (timediff<120) {
				if (lastpoint===chartData[rank][chartData[rank].length-1]) {
					return "???"
				} else 
				return (chartData[rank][chartData[rank].length-1].points-lastpoint.points)/RATEDURATION
			} else {
				return Math.ceil((chartData[rank][chartData[rank].length-1].points-lastpoint.points)/
					(moment(chartData[rank][chartData[rank].length-1].date).diff(moment(lastpoint.date),'minutes')/60)
				)
			}
		} else {
			if (chartData[rank].length>0) {
				var startPoint=chartData[rank][chartData[rank].length-1]
				return Math.ceil(GetRank(rank)/(moment(startPoint.date).diff(EVENTSTART,'minutes')/60))
			} else {
				return 0
			}
		}
	}
}

function GetPointCount(rank,en) {
	var pointCount=1;
	if (en) {
		if (!en_chartData[rank]) {
			return pointCount;
		}
		if (en_chartData[rank].length>2) {
			var lastpoint=en_chartData[rank][en_chartData[rank].length-1]
			for (var i=en_chartData[rank].length-1;i>=0;i--) {
				var diff = moment().diff(en_chartData[rank][i].date,'hours')
				if (diff>=RATEDURATION) {
					break;
				} else {
					lastpoint=en_chartData[rank][i]
					pointCount++;
				}
			}
			return pointCount;
		} else {
			if (en_chartData[rank].length>0) {
				return en_chartData[rank].length;
			} else {
				return pointCount;
			}
		}
	} else
	{
		if (!chartData[rank]) {
			return pointCount;
		}
		if (chartData[rank].length>2) {
			var lastpoint=chartData[rank][chartData[rank].length-1]
			for (var i=chartData[rank].length-1;i>=0;i--) {
				var diff = moment().diff(chartData[rank][i].date,'hours')
				if (diff>=RATEDURATION) {
					break;
				} else {
					lastpoint=chartData[rank][i]
					pointCount++;
				}
			}
			return pointCount;
		} else {
			if (chartData[rank].length>0) {
				return chartData[rank].length;
			} else {
				return pointCount;
			}
		}
	}
}

function CreatePrediction(precision,rank,en) {
	if (en) {
		if (!en_chartData[rank]) {
			return []
		}
		var startPoint=en_chartData[rank][en_chartData[rank].length-1]
		if (rank<=20) {
			startPoint={points:startPoint.points,date:moment()}
		}
		var startTime=moment(startPoint.date)
		if (en_PREDICTIONS&&startTime.diff(EVENTSTART_en,'hours')>36&&moment(startPoint.date).diff(EVENTSTART_en,'hours')>=36) {
			//console.log(MAXSPEED)
			//Precision is in hours. 1 is default
			var finalChart=[{y:en_chartData[rank][en_chartData[rank].length-1].points,x:en_chartData[rank][en_chartData[rank].length-1].date}]
			//Start from the time of the last reported rank.
			var myPoints = startPoint.points
			var pointSpeed = Math.ceil(GetRank(rank,en)/(moment(startPoint.date).diff(EVENTSTART_en,'minutes')/60))
			var speedGoal = MAXSPEED*nyoomfactor[rank]
			while (startTime<EVENTEND_en) {
				startTime.add(precision,'hours')
				myPoints+=Math.floor(pointSpeed)
				if (EVENTEND_en.diff(startTime,'hours')>11) {
					pointSpeed-=pointSpeed*(slowdownFactor[rank]*10/*CONSTANT for adjustment*/)
				} else {
					pointSpeed=Math.max(
						GetRank(rank,en)/(moment(startPoint.date).diff(EVENTSTART_en,'minutes')/60),
						Math.min((12-EVENTEND_en.diff(startTime,'hours'))*(speedGoal/5),speedGoal))
					//pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
					//console.log(pointSpeed)
				}
				finalChart=[...finalChart,{y:Number.isInteger(myPoints)?myPoints:"???",x:moment(startTime)}]
			}
			predictionen_chartData[rank]=finalChart
			return finalChart
		} else
		if (PREDICTIONS_en&&startTime.diff(EVENTSTART_en,'hours')>24&&moment(startPoint.date).diff(EVENTSTART_en,'hours')>=24) {
			//console.log(MAXSPEED)
			//Precision is in hours. 1 is default
			var finalChart=[{y:en_chartData[rank][en_chartData[rank].length-1].points,x:en_chartData[rank][en_chartData[rank].length-1].date}]
			//Start from the time of the last reported rank.
			var myPoints = startPoint.points
			var pointSpeed = GetRate(rank,en)
			var speedGoal = MAXSPEED*nyoomfactor[rank]
			while (startTime<EVENTEND_en) {
				startTime.add(precision,'hours')
				myPoints+=Math.floor(pointSpeed)
				if (EVENTEND_en.diff(startTime,'hours')>11) {
					pointSpeed-=pointSpeed*(slowdownFactor[rank]*10/*CONSTANT for adjustment*/)
				} else {
					pointSpeed=Math.max(
						GetRank(rank,en)/(moment(startPoint.date).diff(EVENTSTART,'minutes')/60),
						Math.min((12-EVENTEND_en.diff(startTime,'hours'))*(speedGoal/5),speedGoal))
					//pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
					//console.log(pointSpeed)
				}
				finalChart=[...finalChart,{y:Number.isInteger(myPoints)?myPoints:"???",x:moment(startTime)}]
			}
			en_predictionChartData[rank]=finalChart
			return finalChart
		} else {
			return []
		}
	} else {
		if (!chartData[rank]) {
			return []
		}
		var startPoint=chartData[rank][chartData[rank].length-1]
		if (rank<=20) {
			startPoint={points:startPoint.points,date:moment()}
		}
		var startTime=moment(startPoint.date)
		if (PREDICTIONS&&startTime.diff(EVENTSTART,'hours')>36&&moment(startPoint.date).diff(EVENTSTART,'hours')>=36) {
			//console.log(MAXSPEED)
			//Precision is in hours. 1 is default
			var finalChart=[{y:chartData[rank][chartData[rank].length-1].points,x:chartData[rank][chartData[rank].length-1].date}]
			//Start from the time of the last reported rank.
			var myPoints = startPoint.points
			var pointSpeed = Math.ceil(GetRank(rank)/(moment(startPoint.date).diff(EVENTSTART,'minutes')/60))
			var speedGoal = MAXSPEED*nyoomfactor[rank]
			while (startTime<EVENTEND) {
				startTime.add(precision,'hours')
				myPoints+=Math.floor(pointSpeed)
				if (EVENTEND.diff(startTime,'hours')>11) {
					pointSpeed-=pointSpeed*(slowdownFactor[rank]*10/*CONSTANT for adjustment*/)
				} else {
					pointSpeed=Math.max(
						GetRank(rank)/(moment(startPoint.date).diff(EVENTSTART,'minutes')/60),
						Math.min((12-EVENTEND.diff(startTime,'hours'))*(speedGoal/5),speedGoal))
					//pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
					//console.log(pointSpeed)
				}
				finalChart=[...finalChart,{y:Number.isInteger(myPoints)?myPoints:"???",x:moment(startTime)}]
			}
			predictionChartData[rank]=finalChart
			return finalChart
		} else
		if (PREDICTIONS&&startTime.diff(EVENTSTART,'hours')>24&&moment(startPoint.date).diff(EVENTSTART,'hours')>=24) {
			//console.log(MAXSPEED)
			//Precision is in hours. 1 is default
			var finalChart=[{y:chartData[rank][chartData[rank].length-1].points,x:chartData[rank][chartData[rank].length-1].date}]
			//Start from the time of the last reported rank.
			var myPoints = startPoint.points
			var pointSpeed = GetRate(rank)
			var speedGoal = MAXSPEED*nyoomfactor[rank]
			while (startTime<EVENTEND) {
				startTime.add(precision,'hours')
				myPoints+=Math.floor(pointSpeed)
				if (EVENTEND.diff(startTime,'hours')>11) {
					pointSpeed-=pointSpeed*(slowdownFactor[rank]*10/*CONSTANT for adjustment*/)
				} else {
					pointSpeed=Math.max(
						GetRank(rank)/(moment(startPoint.date).diff(EVENTSTART,'minutes')/60),
						Math.min((12-EVENTEND.diff(startTime,'hours'))*(speedGoal/5),speedGoal))
					//pointSpeed+=(speedGoal-pointSpeed) //Increase towards final goal.
					//console.log(pointSpeed)
				}
				finalChart=[...finalChart,{y:Number.isInteger(myPoints)?myPoints:"???",x:moment(startTime)}]
			}
			predictionChartData[rank]=finalChart
			return finalChart
		} else {
			return []
		}
	}
}

function numberWithCommas(x) {
	if (Number.isInteger(x)) {
		var num_parts = x.toString().split(".");
		num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return num_parts.join(".");
	} else {
		return x
	}
}

function ChartData(rank,en) {
	if (en) {
		if (!en_chartData[rank]) {
			return [{x:0,y:0}]
		}
		if (rank<=20) {
			return [...en_chartData[rank].map((data)=>{return {x:data.date,y:data.points}}),{x:moment().isBefore(EVENTEND)?moment():EVENTEND,y:en_chartData[rank][en_chartData[rank].length-1].points}]
		} else {
			return [{x:EVENTSTART_en,y:0},...en_chartData[rank].map((data)=>{return {x:data.date,y:data.points}})]
		}
	} else {
		if (!chartData[rank]) {
			return [{x:0,y:0}]
		}
		if (rank<=20) {
			return [...chartData[rank].map((data)=>{return {x:data.date,y:data.points}}),{x:moment().isBefore(EVENTEND)?moment():EVENTEND,y:chartData[rank][chartData[rank].length-1].points}]
		} else {
			return [{x:EVENTSTART,y:0},...chartData[rank].map((data)=>{return {x:data.date,y:data.points}})]
		}

	}
}

function GetRank(rank,en) {
	if (en) {
		if (en_chartData[rank]) {
			return en_chartData[rank][en_chartData[rank].length-1].points
		} else {
			return "???"
		}		
	} else {
		if (chartData[rank]) {
			return chartData[rank][chartData[rank].length-1].points
		} else {
			return "???"
		}
	}
}

function GetEstimate(rank,en) {
	if (en) {
		if (en_predictionChartData[rank]) {
			var currentEstimate = 0
			if (rank>20 && moment().diff(moment(en_chartData[rank][en_chartData[rank].length-1].date),'hours')>0.5) {
				for (var i=en_predictionChartData[rank].length-1;i>=0;i--) {
					if (moment(en_predictionChartData[rank][i].x).isAfter(moment())) {
						currentEstimate=en_predictionChartData[rank][i].y
					} else {
						break;
					}
				}
			
				return currentEstimate
			} else {
				if (rank>20) {
					return GetRank(rank,en)
				} else {
					return "---"
				}
			}
		} else {
			return "???"
		}	
	} else {
		if (predictionChartData[rank]) {
			var currentEstimate = 0
			if (rank>20 && moment().diff(moment(chartData[rank][chartData[rank].length-1].date),'hours')>0.5) {
				for (var i=predictionChartData[rank].length-1;i>=0;i--) {
					if (moment(predictionChartData[rank][i].x).isAfter(moment())) {
						currentEstimate=predictionChartData[rank][i].y
					} else {
						break;
					}
				}
			
				return currentEstimate
			} else {
				if (rank>20) {
					return GetRank(rank)
				} else {
					return "---"
				}
			}
		} else {
			return "???"
		}
	}
}

function GetTime(rank,en) {
	if (en) {
		if (en_chartData[rank]) {
			return moment(en_chartData[rank][en_chartData[rank].length-1].date).fromNow()
		} else {
			return ""
		}
	} else {
		if (chartData[rank]) {
			return moment(chartData[rank][chartData[rank].length-1].date).fromNow()
		} else {
			return ""
		}
	}
}
function GetUpdateColor(rank,en) {
	if (en) {
		if (en_chartData[rank]) {
			return "rgba(255,"+Math.max(255-moment().diff(moment(en_chartData[rank][en_chartData[rank].length-1].date),'hours')*3,0)+","+Math.max(255-moment().diff(moment(en_chartData[rank][en_chartData[rank].length-1].date),'hours')*3,0)+",1)"
		} else {
			return "" 
		}
	} else {
		if (chartData[rank]) {
			return "rgba(255,"+Math.max(255-moment().diff(moment(chartData[rank][chartData[rank].length-1].date),'hours')*3,0)+","+Math.max(255-moment().diff(moment(chartData[rank][chartData[rank].length-1].date),'hours')*3,0)+",1)"
		} else {
			return "" 
		}
	}
}

var tableValues={}
var en_tableValues={}

app.get('/eventdata',function(req,res){
	var eventinfo = []
	db.query('select * from '+(req.query.en?"en_":"")+'event order by id desc limit 1')
	.then((data)=>{
		eventinfo = data.rows;
		if (!req.query.event) {
			return db.query('select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from '+(req.query.en?"en_":"")+'eventdata where eventid=$1 order by rank,date desc)t order by rank,date desc;',[moment(eventinfo[0].startdate).isBefore(moment())?eventinfo[0].eventid:eventinfo[0].eventid-1])
		} else {
			
		}
	})
	.then((data)=>{
		var finaldata = data.rows
		var tiers= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,50,100,500,1000,2000,5000,10000,20000,30000,50000]
		for (t of tiers) {
			//console.log(t)
			//if (finaldata[String(t)]===undefined) {finaldata[String(t)]={"rank":t,"eventid":eventinfo[0].eventid,"name":"","description":"","date":eventinfo[0].startdate,"points":0}}
			var found=false
			for (i in finaldata) {
				//console.log(finaldata[i].rank)
				if (finaldata[i].rank===t) {
					found=true
					break;
				}
			}
			if (!found) {
				finaldata=[...finaldata,{"rank":t,"eventid":eventinfo[0].eventid,"name":"","description":"","date":eventinfo[0].startdate,"points":0}]
			}
		}
		res.status(200).json(finaldata)
	})
	.catch((err)=>{
		res.status(500).send(err.message)
	})
})

var rankings = {
1:"Maho",
2:"Shinobu",
3:"Muni",
4:"Rei",
5:"Yuka",
6:"Kyoko",
7:"Esoran",
8:"Rinku",
9:"Ibuki",
10:"Esora",
11:"Noa",
12:"Saki",
13:"Towa",
14:"Rika",
15:"Aoi",
16:"Kurumi",
17:"Saori",
18:"Hiiro",
19:"Michiru",
20:"Tsubaki"
}

var lastRankingUpdate=moment()

var notPlaying=[
"Dalia","Marika","Nyochio","Nagisa","Miyu","Haruna","Miiko","Airi","Mana","Shano","Touka"
]

function RunRankingUpdate() {
	if (moment().diff(lastRankingUpdate,'minutes')>=1) {
		for (var i=0;i<20;i++) {
			//Possibility to switch two positions.
			var swap=false
			if (i==0) {
				if (Math.random()<=0.01) {
					swap=true;
				}
			} else 
			if (Math.random()<=0.05){
				swap=true;
			}
			if (swap) {
				if (i<19) {
					var previousName=rankings[i+1]
					var newName=rankings[i+2]
					rankings[i+1]=newName
					rankings[i+2]=previousName
				} else {
					//Bring in a new name, swap out the old.
					var previousName=rankings[i+1]
					var newRandomSlot=Math.floor(Math.random()*notPlaying.length)
					var newName=notPlaying[newRandomSlot]
					rankings[i+1]=newName
					notPlaying[newRandomSlot]=previousName
				}
			}
		}
		lastRankingUpdate=moment()
	}
}

app.get('/eventdata/t50',function(req,res){
	var eventinfo = []
	db.query('select * from '+(req.query.en?"en_":"")+'event order by id desc limit 1')
	.then((data)=>{
		eventinfo = data.rows;
		return db.query('select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from '+(req.query.en?"en_":"")+'eventdata where rank>20 and eventid=$1 order by rank,date desc)t order by rank,date desc;',[moment(eventinfo[0].rank_end).isBefore(moment())?eventinfo[0].eventid:eventinfo[0].eventid-1])
	})
	.then((data)=>{
		return res.status(200).json(data.rows)
	})
	.catch((err)=>{
		res.status(500).send(err.message)
	})
})

app.get('/eventdata/t20',function(req,res){
	var eventinfo = []
	var eventinfo_en = []
	if (req.query.date&&req.query.rank) {
		db.query('select * from '+(req.query.en?"en_":"")+'eventdata where date<=$1 and rank=$2 and eventid=$3 order by date desc limit 1;',[req.query.date,req.query.rank,req.query.eventid])
		.then((data)=>{
			res.status(200).json(data.rows)
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else 
	if (req.query.luminous) {
		db.query("select * from "+(req.query.en?"en_":"")+"eventdata where (date>='2021-02-17 23:36:16.383+00' and date<'2021-02-19 15:35:16.716+00' and rank=12) or (date>='2021-02-19 15:35:16.716+00' and rank=11) and eventid=10 order by id asc;")
		.then((data)=>{
			res.status(200).json(data.rows)
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else
	if (req.query.all&&req.query.event) {
		db.query('select * from (select lag(points) over (partition by rank order by date asc)-points difference,rank,eventid,date,name,points from '+(req.query.en?"en_":"")+'eventdata where eventid=$1 order by date asc)t',[req.query.event])
		.then((data)=>{
			res.status(200).json(data.rows)
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else 
	if (req.query.tier&&req.query.event) {
		db.query('select * from (select lag(points) over (partition by rank order by date asc)-points difference,rank,eventid,date,name,points from '+(req.query.en?"en_":"")+'eventdata where eventid=$1 and rank=$2 order by date desc)t',[req.query.event,req.query.tier])
		.then((data)=>{
			res.status(200).json(data.rows)
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else 
	if (req.query.chart){
		
		function RandomQuestion() {
			var value = Math.random()
			if (value<=0.7) {
				return "???"
			} else 
			if (value<=0.9) {
				return "Miyu"
			} else 
			if (value<=0.95) {
				return "Muni"
			} else {
				return "MuniMuni"
			}
		}
		if (req.query.event||moment().diff(lastCachedDate,'minutes')>=1||(req.query.force&&moment().diff(lastCachedDate,'seconds')>=10)) {
			chartData={}
			predictionChartData={}
			diffData=[]
			db.query('select * from '+(req.query.en?"en_":"")+'event order by id desc limit 1')
			.then((data)=>{
				eventinfo = data.rows;
				return db.query('select * from (select lag(points) over (partition by rank order by date asc)-points difference,rank,eventid,date,name,points from '+(req.query.en?"en_":"")+'eventdata where eventid=$1 order by date asc)t',[(req.query.event)?req.query.event:moment(eventinfo[0].rank_end).isBefore(moment())?eventinfo[0].eventid:eventinfo[0].eventid-1])
			})
			.then((data)=>{
				if (data&&data.rows&&data.rows.length>0) {
					data.rows.map((obj)=>{
						if (req.query.en) {
							if (en_chartData[obj.rank]) {en_chartData[obj.rank]=[...en_chartData[obj.rank],obj]} else {en_chartData[obj.rank]=[obj]}
						} else {
							if (chartData[obj.rank]) {chartData[obj.rank]=[...chartData[obj.rank],obj]} else {chartData[obj.rank]=[obj]}
						}
						})
					SetupPredictionModel()
					var tiers= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,50,100,500,1000,2000,5000,10000,20000,30000,50000]
					if (req.query.en) {
						for (t of tiers) {
							CreatePrediction(1,t,req.query.en)
							var est = GetEstimate(t,req.query.en)
							var temprate = 0
							if (en_chartData[t]) {
								temprate=(t<=20)?(en_chartData[t])?Math.ceil(GetRate(t,req.query.en)):undefined:Math.ceil(GetRank(t,req.query.en)/(moment(en_chartData[t][en_chartData[t].length-1].date).diff(EVENTSTART_en,'minutes')/60))
							}
							var tempname="";
							if (en_chartData[t]&&en_chartData[t][en_chartData[t].length-1]&&en_chartData[t][en_chartData[t].length-1].name) {
								tempname=en_chartData[t][en_chartData[t].length-1].name
							}
							var tempdesc="";
							if (en_chartData[t]&&en_chartData[t][en_chartData[t].length-1]&&en_chartData[t][en_chartData[t].length-1].description) {
								tempdesc=en_chartData[t][en_chartData[t].length-1].description
							}
							en_tableValues[t]={
								points:GetRank(t,req.query.en),
								lastUpdate:GetTime(t,req.query.en),
								lastUpdateColor:GetUpdateColor(t,req.query.en),
								rate:temprate?temprate:0,
								count:GetPointCount(t,req.query.en),
								name:tempname,
								description:tempdesc,
								estimate:Number.isInteger(est)?Math.ceil(est):est,
								prediction:(en_predictionChartData[t]&&moment().isBefore(EVENTEND_en))?en_predictionChartData[t][en_predictionChartData[t].length-1].y:RandomQuestion()
							}
						}
						lastCachedDate=moment()
						res.status(200).send({predictionData:en_predictionChartData,statistics:tableValues})
					} else {
						for (t of tiers) {
							CreatePrediction(1,t,req.query.en)
							var est = GetEstimate(t,req.query.en)
							var temprate = 0
							if (chartData[t]) {
								temprate=(t<=20)?(chartData[t])?Math.ceil(GetRate(t)):undefined:Math.ceil(GetRank(t)/(moment(chartData[t][chartData[t].length-1].date).diff(EVENTSTART,'minutes')/60))
							}
							var tempname="";
							if (chartData[t]&&chartData[t][chartData[t].length-1]&&chartData[t][chartData[t].length-1].name) {
								tempname=chartData[t][chartData[t].length-1].name
							}
							var tempdesc="";
							if (chartData[t]&&chartData[t][chartData[t].length-1]&&chartData[t][chartData[t].length-1].description) {
								tempdesc=chartData[t][chartData[t].length-1].description
							}
							tableValues[t]={
								points:GetRank(t),
								lastUpdate:GetTime(t),
								lastUpdateColor:GetUpdateColor(t),
								rate:temprate?temprate:0,
								count:GetPointCount(t),
								name:tempname,
								description:tempdesc,
								estimate:Number.isInteger(est)?Math.ceil(est):est,
								prediction:(predictionChartData[t]&&moment().isBefore(EVENTEND))?predictionChartData[t][predictionChartData[t].length-1].y:RandomQuestion()
							}
						}
						lastCachedDate=moment()
						res.status(200).send({predictionData:predictionChartData,statistics:tableValues})

					}
				} else {
					if (req.query.en) {
						res.status(200).send({predictionData:en_predictionChartData,statistics:en_tableValues})
					} else {
						res.status(200).send({predictionData:predictionChartData,statistics:tableValues})
					}
				}
			})
			.catch((err)=>{
				res.status(500).send(err.message)
			})
		} else {
					if (req.query.en) {
				res.status(200).send({predictionData:en_predictionChartData,statistics:en_tableValues})
					} else {
				res.status(200).send({predictionData:predictionChartData,statistics:tableValues})
					}
		}
	} else {
		db.query('select * from event order by id desc limit 1')
		.then((data)=>{
			eventinfo = data.rows;
			return db.query('select distinct on (rank) rank,eventid,date,name,description,points,difference from (select lead(points) over (partition by rank order by rank,date desc)-points difference,* from '+(req.query.en?"en_":"")+'eventdata where rank<=20 and eventid=$1 order by rank,date desc)t order by rank,date desc;',[moment(eventinfo[0].rank_end).isBefore(moment())?eventinfo[0].eventid:eventinfo[0].eventid-1])
		})
		.then((data)=>{
			var finaldata = data.rows
			var tiers= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
			//RunRankingUpdate()
			for (t of tiers) {
			//console.log(t)
			//if (finaldata[String(t)]===undefined) {finaldata[String(t)]={"rank":t,"eventid":eventinfo[0].eventid,"name":"","description":"","date":eventinfo[0].startdate,"points":0}}
			var found=false
			for (i in finaldata) {
				//console.log(finaldata[i].rank)
				if (finaldata[i].rank===t) {
					found=true
					var temprate = (chartData[t])?Math.ceil(GetRate(t)):undefined
					if (!temprate) {
						finaldata[i].rate="???"
					} else {
						finaldata[i].rate=temprate
					}
					//finaldata[i].name="Muni";
					/*if (rankings[t]) {
						finaldata[i].name=rankings[t]
					}*/
					break;
				}
			}
			if (!found) {
				finaldata=[...finaldata,{"rate":0,"rank":t,"eventid":eventinfo[0].eventid,"name":"","description":"","date":eventinfo[0].startdate,"points":0}]
			}
		}
			if (req.query.maxspeed) {
				res.status(200).json([...finaldata,{maxspeed:MAXSPEED}])
			} else {
				res.status(200).json(finaldata)
			}	
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	}
})

app.get('/cans',function(req,res){
	db.query('select (select count(*) from cans where can=true) as cans,(select count(*) from cans where can=false) as notcan;')
.then((data)=>{res.status(200).send(data.rows[0])})
	.catch((err)=>{res.status(500).send(err.message)})
})

app.get('/ev',function(req,res){
	if (req.query.all) {
				db.query('select * from '+(req.query.en?"en_":"")+'event order by id desc;')
	.then((data)=>{res.status(200).send(data.rows)})
		.catch((err)=>{res.status(500).send(err.message)})
	} else {
		db.query('select * from '+(req.query.en?"en_":"")+'event order by id desc limit 1;')
	.then((data)=>{res.status(200).send(data.rows[0])})
		.catch((err)=>{res.status(500).send(err.message)})
	}
})

app.post('/cans',function(req,res){
	if (req.body&&(req.body.cans!==undefined&&req.body.cans!==null)) {
		db.query('insert into cans(date,can) values($1,$2)',[moment(),req.body.cans])
		.then((data)=>{res.status(200).send("Done!")})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.post('/streamkill/:id',function (req,res){
	if (req.body&&req.body.username&&req.body.authentication_token) {
		GetUserLoginAllowed(req.body.username.trim(),req.body.authentication_token.trim())
		.then((data)=>{
			if (data.rows.length>0) {
				exec("kill $(cat ../divabotguardian/processes/"+Number(req.params.id)+".ffmpeg)|wc -l",(err,out,stderr)=>{
					if (err) {
						res.status(500).send(`${err.message}`);
						return;
					}
					if (stderr) {
						res.status(500).send(`${stderr}`);
						return;
					}
					res.status(200).send(`${out}`);
				})
			} else {
				res.status(400).send("Failed to authenticate")
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	} else {
		res.status(400).send("Invalid credentials!")
	}
})

app.get('/streamdata/:id',function (req,res){
	db.query("select twitch_name from users where id=$1",[req.params.id])
	.then((data)=>{
		return twitchStreams.get(data.rows[0].twitch_name)
	})
	.then(function(streams) {
		if (streams.length>0) {
			var streamchoice = undefined
			for (var i=0;i<streams.length;i++) {
				if (streams[i].quality.includes("720p")) {
					streamchoice = streams[i]
					break;
				}
			}
			if (streamchoice===undefined) {
				streamchoice = streams[0];
			}
			res.status(200).send(streamchoice.url)
		} else {
			res.status(400).send("Not online!")
		}
	})
	.catch((err)=>{
		res.status(500).send(err.message)
	})
})

app.get('/eventchart',function (req,res){
	const myChart = new QuickChart();
	myChart
	  .setConfig({
		type: 'bar',
		data: { labels: ['Hello world', 'Foo bar'], datasets: [{ label: 'Foo', data: [1, 2] }] },
	  })
	  .setWidth(300)
	  .setHeight(150);

	// You can send the URL to someone...
	const chartImageUrl = myChart.getUrl();
	res.status(200).send('<img src="'+chartImageUrl+'">')
})



var process_images = []
var processPromises = []
var largestId = 0
var filterId = 0
var MAX_INDEX = 12 //To prevent being rate-limited.

function Process(data,ind){
	for (var i in data.data.statuses) {
		var tweet = data.data.statuses[i]
		if (tweet.source && tweet.source.includes("Nintendo Switch Share")||tweet.source.includes("PlayStation®Network")) {
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
	if (data.data.search_metadata.next_results && ind<MAX_INDEX) {
		return axios.get('https://api.twitter.com/1.1/search/tweets.json'+data.data.search_metadata.next_results, {
			headers: {
			/*BEARER*/	Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
		}})
		.then((data)=>{
			//console.log("Going to next: "+(ind+1))
			return Process(data,ind+1)})
	}
	return "Done!";
}

app.use('/files',express.static('files',{
 maxAge: 86400000 * 30
}))

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
/*setInterval(
()=>{
	twitchStreams.get('smallant')
		.then(function(streams) {
			//console.log(streams)
			if (streams.length>0) {
				db.query("update streams set stream=$1 where id=1",[streams[0].url]);
			}
		})
		.catch((err)=>{
			console.log(err.message)
		})
},5000)*/

/*
setInterval(
()=>{
	function addToQueue(uploadData) {
		if (uploadData.tries===undefined||uploadData.tries===null) {
			uploadData.tries=1;
		} else {
			uploadData.tries+=1;
		}
		if (uploadData.tries<5) {
			console.log("Failed to upload. Added back to queue. Tries: "+uploadData.tries+" / "+JSON.stringify(uploadData))
			db.query("insert into uploadedplays(filename,userid,submissiondate,id,playid,tries) values($1,$2,$3,$4,$5,$6);",
			[uploadData.filename,uploadData.userid,uploadData.submissiondate,uploadData.id,uploadData.playid,uploadData.tries])
		}
	}
	var uploadData=undefined,user=undefined,auth=undefined,playData;
	db.query("select * from uploadedplays where tries is null or tries>=0 order by submissiondate asc limit 1")
	.then((data)=>{
		if (data.rows.length>0) {
			uploadData=data.rows[0];
			//console.log(uploadData)
			return db.query("select username,authentication_token from users where id=$1",[uploadData.userid])
		}
	})
	.then((data)=>{
		if (uploadData && data.rows.length>0) {
			user=data.rows[0].username
			auth=data.rows[0].authentication_token
			if (uploadData.tries!==undefined&&uploadData.tries!==null) {
				return db.query("update uploadedplays set tries=$2 where id=$1",[uploadData.id,(uploadData.tries*-1)])
			} else {
				return db.query("update uploadedplays set tries=-1 where id=$1",[uploadData.id])
			}
		}
	})
	.then((data)=>{
		if (uploadData) {
			//console.log(data.data)
			return axios.post("http://projectdivar.com/image",
			{url:uploadData.filename,user:user,auth:auth})
		}
	})
	.then((data)=>{
		if (uploadData) {
			if (data.data==="Invalid parameters!") {
				throw new Error("Invalid parameters while trying to submit play!")
			}
		}
	})
	.catch((err)=>{
		if (uploadData) {
			addToQueue(uploadData)
		}
	})
}
,1000)
*/

//setInterval(()=>{db.query("select * from twitter_bot limit 1")
//.then((data)=>{
//	largestId=filterId=data.rows[0].lastpost;
//	//console.log("Filter Id: "+filterId);
//	/*return axios.get('https://api.twitter.com/1.1/search/tweets.json?q=%23mega39s', {
//		headers: {
//			Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
//		}
//	})*/
//	return axios.get('https://api.twitter.com/1.1/search/tweets.json?q=%23divarbot', {
//		headers: {
//			Authorization: 'Bearer '+process.env.TWITTER_BEARER  //the token is a variable which holds the token
//		}
//	})
//})
//.then((data)=>{
//	//console.log(data.data.statuses)
//	//console.log(data.data)
//	//data.data.s
//	//console.log("Reading Twitter Data...")
//	return Process(data,0);
//})
//.then((data)=>{
//	//console.log(process_images)
//	var promisesDone=0;
//	process_images.forEach((obj)=>{
//	if (filterId<obj.id) {
//		if (largestId<obj.id) {largestId=obj.id}
//		processPromises.push(new Promise((resolve,reject)=>{
//		console.log("Process Twitter Post: "+obj.id);	
//		return db.query("select id from users where twitter=$1",[obj.user])
//		.then((data)=>{
//			if (data.rows.length>0) {
//				console.log("Process new play for User id "+data.rows[0].id+"...")
//				return db.query("insert into uploadedplays values($1,$2,$3)",[obj.image,data.rows[0].id,new Date()])
//				.then(()=>{resolve("Done!")})
//			} else {
//				reject("Not associated with an Id!")
//			}
//		})
//		.catch((err)=>{console.log(err.message);reject("Failed!")})}))
//	}
//})
////setTimeout(()=>{console.dir(processPromises, {'maxArrayLength': null})},2000)
//return Promise.allSettled(processPromises)
//})
//.then((data)=>{
//	//console.log(largestId)
//	return db.query("update twitter_bot set lastpost=$1 returning *",[largestId])
//})
//.catch((err)=>{console.log(err.message)})
//},60000)

setInterval(()=>{
	axios.get("http://www.projectdivar.com/eventdata/t20?chart=true&force=true")
},20000)

CreateDynamicEndpoints()