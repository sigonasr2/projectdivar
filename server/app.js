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

  var db = 
  new Pool({
	user: 'postgres',
	password: '',
	host: 'postgres',
	database: 'ngsplanner',
	port: 5432,
  })
  
  var db2 = 
  new Pool({
	user: 'postgres',
	password: '',
	host: 'postgres',
	database: 'ngsplanner2',
	port: 5432,
  })
  
  var db3 = 
  new Pool({
	user: 'postgres',
	password: '',
	host: 'postgres',
	database: '',
	port: 5432,
  })
  
  var db4 = 
  new Pool({
	user: 'postgres',
	password: '',
	host: 'postgres',
	database: 'postgres',
	port: 5432,
  })
  
  const PREFIX="/ngsplanner"
  
  const ENDPOINTDATA=[
	{
		endpoint:"class",
		requiredfields:["name"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"class_level_data",
		requiredfields:["class_id","level","hp","atk","def","name"],
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
		optionalfields:["popularity","editors_choice","icon","special_name"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"weapon_type",
		requiredfields:["name","dmg_type"],
		optionalfields:["icon","shorthand"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"photon_art",
		requiredfields:["name","weapon_type_id","potency","dps"],
		optionalfields:["power_distribution","pp","frames","icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"armor",
		requiredfields:["name","rarity","level_req","def"],
		optionalfields:["hp","pp","mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","all_down_res","burn_res","freeze_res","blind_res","shock_res","panic_res","poison_res","battle_power_value","pb_gauge_build","icon","popularity","editors_choice"],
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
		requiredfields:["potential_id","level","name"],
		optionalfields:["mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","all_down_res","burn_res","freeze_res","blind_res","shock_res","panic_res","poison_res","battle_power_value","pb_gauge_build","description"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"builds",
		requiredfields:["users_id","creator","build_name","class1","created_on","last_modified","data"],
		optionalfields:["class2","likes","editors_choice"],
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
		requiredfields:["skill_id","level","name"],
		optionalfields:["variance","mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","popularity","editors_choice"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"class_skill",
		requiredfields:["name","class_id"],
		optionalfields:["icon","description"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"class_skill_data",
		requiredfields:["name","class_skill_id","level"],
		optionalfields:["dependency","effect","duration","cooldown","damage_taken","pa_potency","conditional_buff","pp_recovery","property","all_damage_buff","active_pp_recovery","status_ailment_accum","status_ailment_duration","pp_consumption","max_hp_decrease","natural_pp_recovery","added_pp","pb_gauge_fortification"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"augment",
		requiredfields:["augment_type_id","name"],
		optionalfields:["variance","hp","pp","mel_dmg","rng_dmg","tec_dmg","crit_rate","crit_dmg","pp_cost_reduction","active_pp_recovery","natural_pp_recovery","dmg_res","affix_success_rate","all_down_res","burn_res","freeze_res","blind_res","shock_res","panic_res","poison_res","battle_power_value","pb_gauge_build","popularity","editors_choice"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"augment_type",
		requiredfields:["name"],
		optionalfields:["icon"],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"enemy_data",
		requiredfields:["level","def","atk"],
		optionalfields:[],
		excludedfields:[] //Fields to not output in GET.
	},
	{
		endpoint:"food",
		requiredfields:["name"],
		optionalfields:["potency","pp","dmg_res","hp","pp_consumption","pp_recovery","weak_point_dmg","hp_recovery","popularity","editors_choice"],
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
		requiredfields:["username","email","created_on","roles_id"],
		optionalfields:["avatar","editors_choice"],
		excludedfields:["password_hash"] //Fields to not output in GET.
	},
	{
		endpoint:"database_audit",
		requiredfields:["action","table_name","row_name","row_id","new_value","date","users_id"],
		optionalfields:["old_value"],
		excludedfields:[] //Fields to not output in GET.
	}
]

const MAXATTEMPTS=5
const LOCKOUTTIME=60000
var failedattempts=0
var lockedTime=new Date().getTime()-LOCKOUTTIME //Starts unlocked

for (var test of ["","/test"]) {

	app.post(PREFIX+test+"/passwordcheck",(req,res)=>{
		db4.query('select * from password where password=$1',[req.body.pass])
		.then((data)=>{
			if (data.rows.length>0) {
				res.status(200).json({verified:true})
			} else {
				var msg="Could not authenticate!";res.status(500).send(msg);throw msg
			}
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	})
	app.get(PREFIX+test+"/databases",(req,res)=>{
		db4.query('select * from password where password=$1',[req.query.pass])
		.then((data)=>{
			if (data.rows.length>0) {
				return db.query('select * from pg_database where datname like \'ngsplanner%\' order by datname desc limit 100')	
			} else {
				var msg="Could not authenticate!";res.status(500).send(msg);throw msg
			}
		})
		.then((data)=>{
			res.status(200).json(data.rows)
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	})

	app.post(PREFIX+test+"/databases/restorefrombackup",(req,res)=>{
		if (req.body.database) {
			db4.query('select * from password where password=$1',[req.body.pass])
			.then((data)=>{
				if (data.rows.length>0) {
					return db3.query('select * from pg_database where datname=$1',[req.body.database])
				} else {
					var msg="Could not authenticate!";res.status(500).send(msg);throw msg
				}
			})
			.then((data)=>{
				if (data.rows.length>0) {
					db.end(()=>{})
					return db3.query('select pg_terminate_backend (pid) from pg_stat_activity where pg_stat_activity.datname=\'ngsplanner\'')
				} else {
					var msg="Could not find requested database "+req.body.database;res.status(500).send(msg);throw msg
				}
			})
			.then(()=>{
				return db3.query('drop database ngsplanner') 
			})
			.then(()=>{
				return db3.query('create database ngsplanner with template '+req.body.database)
			})
			.then(()=>{
				db = new Pool({
				  user: 'postgres',
				  password: '',
				  host: 'postgres',
				  database: 'ngsplanner',
				  port: 5432,
				})
				res.status(200).send("Done!")
			})
			.catch((err)=>{
				console.log(err.message)
				res.status(500).send(err.message)
			})
		} else {
			res.status(500).send("Invalid data!")
		}
	})
	app.post(PREFIX+test+"/databases/testtolive",(req,res)=>{
		db4.query('select * from password where password=$1',[req.body.pass])
		.then((data)=>{
			if (data.rows.length>0) {
				db.end(()=>{})
				db2.end(()=>{})
				return db3.query('select pg_terminate_backend (pid) from pg_stat_activity where pg_stat_activity.datname=\'ngsplanner\' or pg_stat_activity.datname=\'ngsplanner2\'')
			} else {
				var msg="Could not authenticate!";res.status(500).send(msg);throw msg
			}
		})
		.then(()=>{
			return db3.query('drop database ngsplanner')
		})
		.then(()=>{
			return db3.query('create database ngsplanner with template ngsplanner2')
		})
		.then(()=>{
			db = new Pool({
			  user: 'postgres',
			  password: '',
			  host: 'postgres',
			  database: 'ngsplanner',
			  port: 5432,
			})
			db2 = new Pool({
			  user: 'postgres',
			  password: '',
			  host: 'postgres',
			  database: 'ngsplanner2',
			  port: 5432,
			})
			res.status(200).send("Done!")
		})
		.catch((err)=>{
			console.log(err.message)
			res.status(500).send(err.message)
		})
	})

	app.post(PREFIX+test+"/databases/livetotest",(req,res)=>{
		db4.query('select * from password where password=$1',[req.body.pass])
		.then((data)=>{
			if (data.rows.length>0) {
				db.end(()=>{})
				db2.end(()=>{})
				return db3.query('select pg_terminate_backend (pid) from pg_stat_activity where pg_stat_activity.datname=\'ngsplanner\' or pg_stat_activity.datname=\'ngsplanner2\'')
			} else {
				var msg="Could not authenticate!";res.status(500).send(msg);throw msg
			}
		})
		.then(()=>{
			return db3.query('drop database ngsplanner2')
		})
		.then(()=>{
			return db3.query('create database ngsplanner2 with template ngsplanner')
		})
		.then(()=>{
			db = new Pool({
			  user: 'postgres',
			  password: '',
			  host: 'postgres',
			  database: 'ngsplanner',
			  port: 5432,
			})
			db2 = new Pool({
			  user: 'postgres',
			  password: '',
			  host: 'postgres',
			  database: 'ngsplanner2',
			  port: 5432, 
			})
			res.status(200).send("Done!")
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	})

	app.post(PREFIX+test+"/databases/backup",(req,res)=>{
		db4.query('select * from password where password=$1',[req.body.pass])
		.then((data)=>{
			if (data.rows.length>0) {
				db.end(()=>{})
				var date = new Date()
				return db3.query('select pg_terminate_backend (pid) from pg_stat_activity where pg_stat_activity.datname=\'ngsplanner\'')
			} else {
				var msg="Could not authenticate!";res.status(500).send(msg);throw msg
			}
		})
		.then(()=>{
			return db3.query('create database ngsplanner'+String(date.getFullYear()).padStart(4,'0')+String(date.getMonth()).padStart(2,'0')+String(date.getDate()).padStart(2,'0')+String(date.getHours()).padStart(2,'0')+String(date.getMinutes()).padStart(2,'0')+String(date.getSeconds()).padStart(2,'0')+' with template ngsplanner')
		})
		.then(()=>{
			db = new Pool({
			  user: 'postgres',
			  password: '',
			  host: 'postgres',
			  database: 'ngsplanner',
			  port: 5432,
			})
			res.status(200).send("Done!")
		})
		.catch((err)=>{
			res.status(500).send(err.message)
		})
	})
}

function CreateDynamicEndpoints() {
	ENDPOINTDATA.forEach((endpoint)=>{
		app.get(PREFIX+"/"+endpoint.endpoint,(req,res)=>{
				db4.query('select * from password where password=$1',[req.query.pass])
				.then((data)=>{
					if (data.rows.length>0) {
						if (endpoint.requiredfields.includes("name")) {
							db.query('select distinct on (name) name,* from '+endpoint.endpoint+' order by name,id desc')
							.then((data)=>{
								res.status(200).json({fields:data.fields,rows:data.rows})
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						} else {
							db.query('select * from '+endpoint.endpoint+" order by id desc")
							.then((data)=>{
								res.status(200).json({fields:data.fields,rows:data.rows})
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
					} else {
						res.status(500).send("Could not authenticate!")
					}
				})
			})
			
			app.post(PREFIX+"/"+endpoint.endpoint,async(req,res)=>{
				db4.query('select * from password where password=$1',[req.body.pass])
				.then(async(data)=>{
					if (data.rows.length>0) {
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
						var requiresInsert=true
						if (endpoint.requiredfields.includes("name")) {
							await db.query('update '+endpoint.endpoint+' set '+all_filled_fields.map((field,i)=>{
							if (!field.includes("_id")) {return field+"=$"+(i+1)}else{
								if (Number.isNaN(Number(req.body[field]))) {return field+"=(select id from "+field.replace("_id","")+" where name=$"+(i+1)+")"} else {return field+"=$"+(i+1)}
							}}).join(",")+' where name=$'+(all_filled_fields.length+1)+' returning *',[...all_filled_fields.map((field)=>req.body[field]),req.body["name"]])
							.then((data)=>{
								if (data.rows.length===0) {
									requiresInsert=true
								} else {
									requiresInsert=false
									res.status(200).json(data.rows)
								}
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
						if (requiresInsert) {
							db.query('insert into '+endpoint.endpoint+"("+all_filled_fields.join(',')+") values("+all_filled_fields.map((field,i)=>{
								if (!field.includes("_id")) {return "$"+(i+1)}else{
									if (Number.isNaN(Number(req.body[field]))) {return "(select id from "+field.replace("_id","")+" where name=$"+(i+1)+")"} else {return "$"+(i+1)}
								}}).join(",")+") returning *",all_filled_fields.map((field)=>req.body[field]))
							.then((data)=>{
								res.status(200).json(data.rows)
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}app.post(PREFIX+"/"+endpoint.endpoint,async(req,res)=>{
				db4.query('select * from password where password=$1',[req.body.pass])
				.then(async(data)=>{
					if (data.rows.length>0) {
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
						var requiresInsert=true
						if (endpoint.requiredfields.includes("name")) {
							await db.query('update '+endpoint.endpoint+' set '+all_filled_fields.map((field,i)=>{
							if (!field.includes("_id")) {return field+"=$"+(i+1)}else{
								if (Number.isNaN(Number(req.body[field]))) {return field+"=(select id from "+field.replace("_id","")+" where name=$"+(i+1)+")"} else {return field+"=$"+(i+1)}
							}}).join(",")+' where name=$'+(all_filled_fields.length+1)+' returning *',[...all_filled_fields.map((field)=>req.body[field]),req.body["name"]])
							.then((data)=>{
								if (data.rows.length===0) {
									requiresInsert=true
								} else {
									requiresInsert=false
									res.status(200).json(data.rows)
								}
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
						if (requiresInsert) {
							db.query('insert into '+endpoint.endpoint+"("+all_filled_fields.join(',')+") values("+all_filled_fields.map((field,i)=>{
								if (!field.includes("_id")) {return "$"+(i+1)}else{
									if (Number.isNaN(Number(req.body[field]))) {return "(select id from "+field.replace("_id","")+" where name=$"+(i+1)+")"} else {return "$"+(i+1)}
								}}).join(",")+") returning *",all_filled_fields.map((field)=>req.body[field]))
							.then((data)=>{
								res.status(200).json(data.rows)
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
					} else {
						res.status(500).send("Could not authenticate!")
					}
				})
			})
					} else {
						res.status(500).send("Could not authenticate!")
					}
				})
			})
			
			app.patch(PREFIX+"/"+endpoint.endpoint,(req,res)=>{
				if (req.body.id) {
					db4.query('select * from password where password=$1',[req.body.pass])
					.then((data)=>{
						if (data.rows.length>0) {
							var combinedfields = [...endpoint.requiredfields,...endpoint.optionalfields,...endpoint.excludedfields]
							//console.log(combinedfields)
							var all_filled_fields=combinedfields.filter((field)=>(field in req.body))
							
							return db.query('update '+endpoint.endpoint+' set '+all_filled_fields.map((field,i)=>field+"=$"+(i+1)).join(",")+" where id=$"+(all_filled_fields.length+1)+" returning *",[...all_filled_fields.map((field)=>req.body[field]),req.body.id])
						} else {
							var msg="Could not authenticate!";res.status(500).send(msg);throw msg
						}
					})
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
			
			app.delete(PREFIX+"/"+endpoint.endpoint,(req,res)=>{
				if (req.body.id) {
					db4.query('select * from password where password=$1',[req.body.pass])
					.then((data)=>{
						if (data.rows.length>0) {
							return db.query('delete from '+endpoint.endpoint+'  where id=$1 returning *',[req.body.id])
						} else {
							var msg="Could not authenticate!";res.status(500).send(msg);throw msg
						}
					})
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
			
			app.get(PREFIX+"/test/"+endpoint.endpoint,(req,res)=>{
				db4.query('select * from password where password=$1',[req.query.pass])
				.then((data)=>{
					if (data.rows.length>0) {
						if (endpoint.requiredfields.includes("name")) {
							db2.query('select distinct on (name) name,* from '+endpoint.endpoint+' order by name,id desc')
							.then((data)=>{
								res.status(200).json({fields:data.fields,rows:data.rows})
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						} else {
							db2.query('select * from '+endpoint.endpoint+" order by id desc")
							.then((data)=>{
								res.status(200).json({fields:data.fields,rows:data.rows})
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
					} else {
						res.status(500).send("Could not authenticate!")
					}
				})
			})
			
			app.post(PREFIX+"/test/"+endpoint.endpoint,async(req,res)=>{
				db4.query('select * from password where password=$1',[req.body.pass])
				.then(async(data)=>{
					if (data.rows.length>0) {
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
						var requiresInsert=true
						if (endpoint.requiredfields.includes("name")) {
							await db2.query('update '+endpoint.endpoint+' set '+all_filled_fields.map((field,i)=>field+"=$"+(i+1)).join(",")+' where name=$'+(all_filled_fields.length+1)+' returning *',[...all_filled_fields.map((field)=>req.body[field]),req.body["name"]])
							.then((data)=>{
								if (data.rows.length===0) {
									requiresInsert=true
								} else {
									requiresInsert=false
									res.status(200).json(data.rows)
								}
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
						if (requiresInsert) {
							db2.query('insert into '+endpoint.endpoint+"("+all_filled_fields.join(',')+") values("+all_filled_fields.map((field,i)=>"$"+(i+1)).join(",")+") returning *",all_filled_fields.map((field)=>req.body[field]))
							.then((data)=>{
								res.status(200).json(data.rows)
							})
							.catch((err)=>{
								res.status(500).send(err.message)
							})
						}
					} else {
						res.status(500).send("Could not authenticate!")
					}
				})
			})
			
			app.patch(PREFIX+"/test/"+endpoint.endpoint,(req,res)=>{
				if (req.body.id) {
					db4.query('select * from password where password=$1',[req.body.pass])
					.then((data)=>{
						if (data.rows.length>0) {
							var combinedfields = [...endpoint.requiredfields,...endpoint.optionalfields,...endpoint.excludedfields]
							//console.log(combinedfields)
							var all_filled_fields=combinedfields.filter((field)=>(field in req.body))
							
							return db2.query('update '+endpoint.endpoint+' set '+all_filled_fields.map((field,i)=>field+"=$"+(i+1)).join(",")+" where id=$"+(all_filled_fields.length+1)+" returning *",[...all_filled_fields.map((field)=>req.body[field]),req.body.id])
						} else {
							var msg="Could not authenticate!";res.status(500).send(msg);throw msg
						}
					})
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
			
			app.delete(PREFIX+"/test/"+endpoint.endpoint,(req,res)=>{
				if (req.body.id) {
					db4.query('select * from password where password=$1',[req.body.pass])
					.then((data)=>{
						if (data.rows.length>0) {
							return db2.query('delete from '+endpoint.endpoint+'  where id=$1 returning *',[req.body.id])
						} else {
							var msg="Could not authenticate!";res.status(500).send(msg);throw msg
						}
					})
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

function CleanUp(arr,vals){
	return arr.map((arrVal)=>{
		vals.forEach((val)=>{
			arrVal[val]=undefined
		})
		return arrVal
	})
}

app.get(PREFIX+'/data',async(req,res)=>{
	var finalresult = {}
	var promises = []
	for (var endpoint of ENDPOINTDATA) {
		if (endpoint.requiredfields.includes("name")) {
			await db.query('select * from (select distinct on (name) name,* from '+endpoint.endpoint+' order by name,id desc)t order by id asc')
			.then((data)=>{
				finalresult[endpoint.endpoint]={}
				data.rows.forEach((val)=>{finalresult[endpoint.endpoint][val.name]=val})
			})
		} else {
			await db.query('select * from '+endpoint.endpoint+" order by id desc")
			.then((data)=>{
				finalresult[endpoint.endpoint]=data.rows
			})
		}
	}
	res.status(200).json(finalresult)
})

app.get(PREFIX+'/test/data',async(req,res)=>{
	var finalresult = {}
	var promises = []
	for (var endpoint of ENDPOINTDATA) {
		if (endpoint.requiredfields.includes("name")) {
			await db2.query('select distinct on (name) name,* from '+endpoint.endpoint+' order by name,id desc')
			.then((data)=>{
				finalresult[endpoint.endpoint]={}
				data.rows.forEach((val)=>{finalresult[endpoint.endpoint][val.name]=val})
			})
		} else {
			await db2.query('select * from '+endpoint.endpoint+" order by id desc")
			.then((data)=>{
				finalresult[endpoint.endpoint]=data.rows
			})
		}
	}
	res.status(200).json(finalresult)
})

app.get(PREFIX+'/dataid',async(req,res)=>{
	var finalresult = {}
	var promises = []
	for (var endpoint of ENDPOINTDATA) {
		await db.query('select * from '+endpoint.endpoint+' order by id asc')
		.then((data)=>{
			finalresult[endpoint.endpoint]={}
			data.rows.forEach((val)=>{finalresult[endpoint.endpoint][val.id]=val})
		})
	}
	res.status(200).json(finalresult)
})

app.get(PREFIX+'/test/dataid',async(req,res)=>{
	var finalresult = {}
	var promises = []
	for (var endpoint of ENDPOINTDATA) {
		await db2.query('select * from '+endpoint.endpoint+' order by id asc')
		.then((data)=>{
			finalresult[endpoint.endpoint]={}
			data.rows.forEach((val)=>{finalresult[endpoint.endpoint][val.id]=val})
		})
	}
	res.status(200).json(finalresult)
})

//Generates our table schema:
ENDPOINTDATA.forEach((endpoint)=>{
	console.log(endpoint.endpoint+":\n\t"+endpoint.requiredfields.join('\t')+(endpoint.optionalfields.length>0?"\t":"")+endpoint.optionalfields.join("\t"))
})

CreateDynamicEndpoints()