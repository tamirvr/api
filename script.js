const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
const knex = require('knex')


const db =knex({
  client: 'pg',
  connection: {
   connectionString : process.env.DATABASE_URL,
    ssl:true,
 }
});


db.select('*').from('users').then(data => {
	console.log(data);
});
/*
const knex = require('knex')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
*/

app.use(bodyParser.json());
app.use(cors());
const database = {
	users:[
	{
	id:'124',
	name:'john1',
	email:'john1@hotmail.com',
	password:'john1',
	entries:0,
	joined : new Date()
	},
	{
	id:'122',
	name:'john',
	email:'john@hotmail.com',
	password:'john',
	entries:0,
	joined: new Date()
	}
	],

	login :[
	{
	id:'987',
	hash:'',
	email:'john@gmail.com'
	}]


}

app.get('/',(req,res) =>{
	
	res.send("it is working");
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
    	const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    //.catch(err => res.status(400).json('wrong credentials'))
})


	
	/*
	database.users.push({
	id:'125',
	name: name,
	email: email,
	password:password,
	entries:'0',
	joined : new Date()
	})*/
	

	


	/*

bcrypt.compare("ass", '$2a$10$QYuHHKwcT/zyM3e2RVZK0.XNICB1AdZhgT2H6PyoM8SWRV2LVhBeq', function(err, res) {
    // res == true
    console.log('first guess', res);
});
bcrypt.compare("veggies", '$2a$10$QYuHHKwcT/zyM3e2RVZK0.XNICB1AdZhgT2H6PyoM8SWRV2LVhBeq', function(err, res) {
    // res = false
     console.log('firss22st guess', res);
});

	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password)
	{
		res.json('success');

	}
	else{
		res.status(400).json('error logging in')
	}


app.post('/register',(req, res)=>{
const {email,name,password} = req.body;


db('users').returning('*').insert({
	email:email,
	name:name,
	joined: new Date()
}).then(response => {
	res.json(response[0]);
})
.catch(err => res.status(400).json('unable to register'))
}) 
*/


app.get('/profile/:id' , (req, res)=>{
	const {id} = req.params;

	db.select('*').from('users').where({
		id: id})
	.then(user=>{
		if(user.length){
		res.json(user[0])	
		}
		else{
			res.status(400).json("not_ found")
		}
	})
	

	
	
	
	/*
	const {id} = req.params;

	db.select('*').from('users').where({
		id: id})
	.then(user=>{
		if(user.length){
		res.json(user[0])	
		}
		
	*/

})

app.put('/image' , (req, res)=>{
	const {id} = req.body;
	db('users').where('id', '=', id )
	.increment('entries',1).returning('entries').then (entries => {
		res.json(entries[0]);
	})
	.catch(err=>res.status(400).json('unable'))
})




app.listen( process.env.PORT||3000,()=> {
	console.log(`hihiihihi ${process.env.PORT}`);
})
