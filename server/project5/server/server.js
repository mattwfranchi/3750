// MATT FRANCHI // PROJECT 5 // CPSC 3750

const crypto = require('crypto'); 

//some webserver libs
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('basic-auth');

//promisification
const bluebird = require('bluebird');

//database connector
const redis = require('redis');
//make redis use promises
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//create db client
const client = redis.createClient();

const port = process.env.NODE_PORT || 3000;

//make sure client connects correctly.
client.on("error", function (err) {
    console.log("Error in redis client.on: " + err);
});

const setUser = function(userObj){
	return client.hmsetAsync("user:"+userObj.id, userObj ).then(function(){
		console.log('Successfully created (or overwrote) user '+userObj.id);
	}).catch(function(err){
		console.error("WARNING: errored while attempting to create tester user account");
	});

}

//make sure the test user credentials exist
const userObj = {
	salt: new Date().toString(),
	id: 'teacher'
};
userObj.hash = crypto.createHash('sha256').update('testing'+userObj.salt).digest('base64');
//this is a terrible way to do setUser
//I'm not waiting for the promise to resolve before continuing
//I'm just hoping it finishes before the first request comes in attempting to authenticate
setUser(userObj);


//start setting up webserver
const app = express();

//decode request body using json
app.use(bodyParser.json());

//allow the API to be loaded from an application running on a different host/port
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header('Access-Control-Expose-Headers', 'X-Total-Count');
		res.header('Access-Control-Allow-Methods', "PUT, DELETE, POST, GET, HEAD");
        next();
});

//protect our API
app.use(function(req,res,next){
	switch(req.method){
		case "GET":
		case "POST":
		case "PUT":
		case "DELETE":
			//extract the given credentials from the request
			const creds = auth(req);
			console.log(req);
			
			//look up userObj using creds.name
			//TODO use creds.name to lookup the user object in the DB
			//use the userObj.salt and the creds.pass to generate a hash
			//compare the hash, if they match call next() and do not use res object
			//to send anything to client
			//if they dont or DB doesn't have the user or there's any other error use the res object 
			//to return a 401 status code
			console.log("About to start1 Protect Our API Code")
			//console.log(req)
			
			client.hgetallAsync("user:"+creds.name).then(function(value,err){
				//console.log(value)
				//console.log(err)
				test_hash = crypto.createHash('sha256').update(creds.pass+value.salt).digest('base64')
				//console.log(test_hash)
				//console.log(value.hash)
				
				if(value.hash == test_hash)
				{
					console.log('hashes match')
					next();	
				}
				else
				{
					console.log('error occurred')
					res.status(401).send()	;
				}
			}).catch(function(err){
				console.error(err);
			});
			
			break;
		default:
			//maybe an options check or something
			next();
			break;
	}
});

//this takes a set of items and filters, sorts and paginates the items.
//it gets it's commands from queryArgs and returns a new set of items
const filterSortPaginate = (type, queryArgs, items) =>{
	let keys;
	console.log(queryArgs)

	//create an array of filterable/sortable keys
	if(type == 'student'){
		keys = ['id','name'];
	}else{
		keys = ['id','student_id','type','max','grade'];
	}


	//applied to each item in items
	//returning true keeps item
	//TODO: fill out the filterer function
	const filterer = (item) =>{
		//loop through keys defined in above scope
			//if this key exists in queryArgs
			//and it's value doesnt match whats's on the item
			//don't keep the item (return false)
		
		for(const key of keys)
		{
			if(queryArgs.hasOwnProperty(key))
			{
				sliced_val = item[key].slice(0,queryArgs[key].length);	
				
				if(sliced_val.toUpperCase() != queryArgs[key].toUpperCase()) { return false; }
			}
			
		}
		
		return true; 
		
			
		//else return true
	};

	//apply above function using Array.filterer
	items = items.filter(filterer);
	console.log('items after filter:',items)

	//always sort, default to sorting on id
	if(!queryArgs._sort){
		queryArgs._sort = 'id';
	}
	//make sure the column can be sorted
	let direction = 1;
	if(!queryArgs._order){
		queryArgs._order = 'asc';
	}
	if(queryArgs._order.toLowerCase() == 'desc'){
		direction = -1;
	}

	//comparator...given 2 items returns which one is greater
	//used to sort items
	//written to use queryArgs._sort as the key when comparing
	//TODO fill out the sorter function
	
	// DONE? Tentatively
	const sorter = (a,b)=>{
		//Note direction and queryArgs are available to us in the above scope
		let comp = 0;
		if(a[queryArgs._sort] > b[queryArgs._sort])
			{
				
				comp = 1; 
			}
		else if(a[queryArgs._sort] < b[queryArgs._sort])
			{
				comp = -1;	
			}
		else
			{
				comp = 0;
			}
		//compare a[queryArgs._sort] (case insensitive) to the same in b
		//save a variable with 1 if a is greater than b, -1 if less and 0 if equal
		
		//multiply by direction to reverse order and return the variable
		return (direction * comp);
	};

	//use apply the above comparator using Array.sort
	items.sort(sorter);
	console.log('items after sort:',items)
	//if we need to paginate
	// TENTATIVELY DONE
	if(queryArgs._start || queryArgs._end || queryArgs._limit){
		//TODO: fill out this if statement
		//define a start and end variable
		//start defaults to 0, end defaults to # of items
		//if queryArgs._start is set, save into start
		start = queryArgs._start ? queryArgs._start : 0;
		//if queryArgs._end is set save it into end
		end = queryArgs._end ? queryArgs._end : items.length;
		//	else if queryArgs._limit is set, save end as start+_limit
		end = queryArgs._limit? start+queryArgs._limit : end;
		//save over items with items.slice(start,end)
		items = items.slice(start,end);

	}
	//console.log(queryArgs)
	console.log('items after pagination:',items)
	return items;
};


// TENATIVELY DONE
app.get('/students/:id',function(req,res){
	//TODO
	//Hint use hgetallAsync
	client.hgetallAsync("student:"+req.params.id).then(function(value,err) {
		console.log(value)
		console.log(err)
		res.status(200).json({"id":value.id, "name":value.name, "_ref": req.path})
	}).catch(function(err) {
		console.log(err)
		res.status(404).send()
	})
	
	

});


app.get('/students',function(req,res){
	//TODO fill out the function
	//Hint: use smembersAsync, then an array of promises from hgetallAsync and 
	//Promise.all to consolidate responses and filter sort paginate and return them
	client.smembersAsync("students").then(function(set) {
		const promises = []
		let students = []
		console.log(set)
		for(const student of set){
			promises.push(
				client.hgetallAsync("student:"+student).then(function(s) {
					students.push(s)
				})
			);
		}
		
		Promise.all(promises).then(function() {
			type = "student"
			//console.log(students)
			students = filterSortPaginate(type,req.query,students)
			res.status(200).set('X-Total-Count',students.length).json(students)
		});
	});
});


// TENTATIVELY DONE
app.post('/students',function(req,res){
	//TODO
	//Hint: use saddAsync and hmsetAsync
	client.sismemberAsync("students",req.body.id).then(function(exists) {
		if(exists)
	   	{
			console.log("student already exists")
		   	res.status(400).send()
	   	}
		else
		{
			client.hmsetAsync("student:"+req.body.id, "name", req.body.name, "id", req.body.id).then(function() {
				client.saddAsync("students",req.body.id).then(function() {
					res.status(200).json({"_ref": req.path+"/"+req.body.id, "id":req.body.id});
				}).catch(function(err) {
					console.log(err)
					res.status(400).send()
					});
			}).catch(function(err) {
				console.log(err)
				res.status(400).send()
			});	
		}
			
	}).catch(function(err) {
		console.log(err)
		res.status(400).send()
	})
				
});

// TENTATIVELY DONE
app.delete('/students/:id',function(req,res){
	//TODO
	//Hint use a Promise.all of delAsync and sremAsync
	client.sismemberAsync("students",req.params.id).then(function(exists) {
		if(exists) 
		{
			client.sremAsync("students",req.params.id).then(function() {
				client.delAsync("student:"+req.params.id).then(function()  {
					res.status(200).json({"id":req.params.id})
				}).catch(function(err) {
					console.log(err)
					res.status(400).send()
					})
			}).catch(function(err) {
				console.log(err)
				res.status(400).send()
				})
		}
		else
		{
			res.status(404).send()
		}
	})
	
	
	
			 
});


// TENTATIVELY DONE
app.put('/students/:id',function(req,res){
	//TODO
	//Hint: use client.hexistsAsync and HsetAsync
	
	client.hexistsAsync("student:"+req.params.id,"id").then(function(exists) {
		if(exists)
		{
			if(req.body.hasOwnProperty("id") || !req.body.name)
			{
			res.status(400).send()
			}
			else
			{
			
			client.hsetAsync("student:"+req.params.id,"name",req.body.name).then(function() {
				console.log('Successfully update the name of '+req.params.id);
				res.status(200).json({"name": req.body.id})	
			}).catch(function(err){
				console.log(err)
				res.status(400).send()
			})
			
			}
		}
		else
			{
				res.status(404).send()
			}
	}).catch(function(err){
		console.log(err)
		res.status(400).send()
	});


});

app.post('/grades',function(req,res){
	//TODO
	//Hint use incrAsync and hmsetAsync
	client.incrAsync("grades").then(function(counter) {
		client.hmsetAsync("grade:"+counter, "student_id", req.body.student_id, "type", req.body.type, "max", req.body.max, "grade", req.body.grade, "id", counter)
		.then(function() {
			res.status(200).json({"_ref": req.path+"/"+String(counter), "id": String(counter)})
		}).catch(function(err) {
			console.log(err)
			res.status(400).send()
		});
	}).catch(function(err) {
		console.log(err)
		res.status(400).send()
	});

});

app.get('/grades/:id',function(req,res){
	//TODO
	//Hint use hgetallAsync
	client.hgetallAsync("grade:"+req.params.id).then(function(value) {
		res.status(200).send(value);
	}).catch(function(err) {
		console.log(err)
		res.status(400).send();
	});
});
app.put('/grades/:id',function(req,res){
	//TODO
	//Hint use hexistsAsyncand hmsetAsync
	
	
	client.hexistsAsync("grade:"+req.params.id, "grade").then(function(exists) {
		if(exists)
		{
			client.hgetallAsync("grade:"+req.params.id).then(function(value) {
				for(const key in req.body)
				{
					value[key] = req.body[key];
				}
				
				client.hmsetAsync("grade:"+req.params.id, "student_id", value.student_id, "type", value.type, "max", value.max, "grade", value.grade, "id", value.id).then(function() {
					res.status(200).send()
				}).catch(function(err) {
					res.status(400).send()
				})
			})
		}
		else
		{
			res.status(404).send()
		}
	})

});
app.delete('/grades/:id',function(req,res){
	//TODO
	//Hint use delAsync .....duh
	client.delAsync("grade:"+req.params.id).then(function(keysRemoved) {
		const code = keysRemoved > 0? 200 : 404;
		res.status(code).send()
	}).catch(function(err) {
		res.status(400).send()
	})
});

app.get('/grades',function(req,res){
	//TODO
	//Hint use getAsync, hgetallAsync
	//and consolidate with Promise.all to filter, sort, paginate
	client.getAsync("grades").then(function(numGrades) {
		const promises = []
		let grades = []
		console.log(numGrades)
		for(let n = 1; n <= numGrades; n ++){
			promises.push(
				client.hgetallAsync("grade:"+n).then(function(s) {
					if(s != null) { console.log("grade encountered"); grades.push(s); } 
					else { console.log ("deleted grade encountered")}
				})
			);
		}
		
		Promise.all(promises).then(function() {
			type = "grade"
			console.log(grades)
			grades = filterSortPaginate(type,req.query,grades)
			res.status(200).set('X-Total-Count',grades.length).json(grades)
		});
		
	});
	

});


app.delete('/db',function(req,res){
	client.flushallAsync().then(function(){
		//make sure the test user credentials exist
		const userObj = {
			salt: new Date().toString(),
			id: 'teacher'
		};
		userObj.hash = crypto.createHash('sha256').update('testing'+userObj.salt).digest('base64');
		//this is a terrible way to do setUser
		//I'm not waiting for the promise to resolve before continuing
		//I'm just hoping it finishes before the first request comes in attempting to authenticate
		setUser(userObj).then(()=>{
			res.sendStatus(200);
		});
	}).catch(function(err){
		res.status(500).json({error: err});
	});
});

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
