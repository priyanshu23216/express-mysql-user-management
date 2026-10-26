import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';
import methodOverride from 'method-override';
import  { faker }  from "@faker-js/faker";
import mySQL from "mysql2";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const connection = mySQL.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'USER',
  password : 'sentinels@@33##**9uh',
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride('_method'));

let getRadomUser = ()=>{
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
    faker.date.birthdate(),
    faker.date.past()
  ];
};


app.get( '/' , ( request , response )=>{
  console.log("request received");
  let q = "SELECT * FROM CUSTOMERS";
  connection.query( q , ( err , result )=>{
  if( err ){ 
    console.log("Error 404 Not Found" , err.message);
  }else{
    const count = result.length;
    response.render( "showUsers" , { result , count });
  }
});
});

app.get( '/register/data' , ( request , response ) =>{
  response.render( 'register' , { success : false});
});

app.post('/add/data' , ( request , response ) =>{
  const ID = request.body.ID;
  const userName = request.body.UserName;
  const email = request.body.Email;
  const password = request.body.password;
  const doB = request.body.DoB;
  const todayDate = request.body.todayDate;

  let q = `INSERT INTO CUSTOMERS ( ID , USERNAME , EMAIL , PASSWORD , BIRTH_DATE , REGISTERED_DATE ) VALUES ( ? , ? , ? , ? , ? , ?  )`;
  let data = [ ID , userName , email , password , doB , todayDate];
  connection.query( q , data ,( err , result)=>{
    if(err){
      if( err.code == 'ER_DUP_ENTRY'){
        response.status(409).render('register' ,{ success : false , error : 'This ID already exists! Please Create another ID'});
      }else{
        response.send(err);
      }
    }else{
      console.log(result);
      response.status( 200 ).render("/" ,{ success : true } );
    }
  });
});


app.listen( 3000 , ()=>{
  console.log("server is listening ");
});




 