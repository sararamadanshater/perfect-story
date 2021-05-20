let express = require('express');
let multer = require('multer');
let ejs = require('ejs');
let path = require('path');
let dateFormat = require("dateformat");
//let fs = require("fs");
let bodyParser = require("body-parser");
let mysql = require("mysql");
let fileUpload = require('express-fileupload')
////////////////////////////////////////////////intilaization//////////////////////////////////////////////////////////////////////////
let app = express();
let jsonParser=bodyParser.json();
// let products = [];

app.set('view engine' , 'ejs');
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '0175471031',
	database : 'shopping'
});
// var connection = mysql.createConnection({
// 	host     : 'sql11.freemysqlhosting.net',
// 	user     : 'sql11394372',
// 	password : '5K3AbsS6NY',
// 	database : 'sql11394372'
// });
// /////////////////////////////////////////////variables////////////////////////////////////////////////////
let message = "logged out";
let user_id = 0;
let user_name = "";
let admin_id = 0 ;
let admin_message = "logged out";
let admin_name = "";
////////////////////////////////////////////////storage////////////////////////////////////////////////////

connection.connect(function(err)
{
    if(err)
    {
        console.log(err);
    }
 console.log("connected!");
});
global.db = connection;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/uploaded/images/")
      },
    filename : function(req ,file,cb){
   cb(null , file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
 

});
const uploaded = multer({
    storage:storage

}).single('myImg')


// function saveData(){
//     fs.writeFile("products.json",JSON.stringify(products),function(err)
//     {
//         console.log("errorrrrrrr");

//     })
// }

// fs.readFile("products.json",function(err,data){
//     if(data){
//        products = JSON.parse(data);
//     }
// })
/////////////////////////////////////////////////////////// start code///////////////////////////////////////////////////////////
app.get("",function(req,res)
{
    //res.sendFile(__dirname+"/projecttest.html");

    //res.render("product.ejs",{data:result})
     res.render("home.ejs",{message:message , userName:user_name})
})
app.post("/add" ,jsonParser,  function(req , res)
{
    
  //  products.push(req.body);
//  console.log("12345555555555")
 console.log(req.body)
 let post = req.body;
 let name = post.name;
 let description = post.desc;
 let price = post.Price;
 let file = req.files.myImg;
 let image = file.name;
 let catogey = post.Category;
 
 file.mv("./uploaded/images/products/" +  file.name , function(err)
 {

})
//  console.log(name);
//  console.log(description);
//  console.log(post)
//  console.log(image);
//  console.log(price);
   var sql = "insert into productsList(product_Name , product_description ,image , product_price ,category ) values ('"+name+"' , '"+description+"' ,'"+image+"' , '"+price+"' , '"+catogey+"')";
   connection.query(sql , function(err , result)
   {
       if(err) {
           console.log(err)
       }
       console.log("added")
       if(admin_id!=0 &&admin_message=="logged")
       {
           let sql = "select * from admins where id = '"+admin_id+"' ";
           connection.query(sql , function(err , result)
           {
            
            res.render("projecttest.ejs" , {data:result , message:"added"}); 
   
               
           })
       
       }
       else{
        res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
       }
   } )
    
  
    
})
app.get("/show", function(req,res)
{ 
    let id = req.param('id');
    console.log(id);
    let sql = "select * from productsList where `id`='"+id+"'";
    
    connection.query(sql , function(err , result)
    {
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("show");
      // res.send(result);
      res.render("product.ejs",{data:result , userName:user_name , message:message})
    } )

})
app.get("/addproducttocart" , function(req ,res)
{
    let id = req.param('id');
    if(user_id!=0 && message=="logged")
{

    let sql = "insert into cart (user_id , product_id) values('"+user_id+"' ,'"+id+"')";
    connection.query(sql , function(err , result)
    {
        let sql = "select * from productsList";
    
    connection.query(sql , function(err , result)
    {
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("show");
     // res.send(result);
      res.render("products.ejs",{data:result , message:message , userName:user_name})
    } )
        
    }) 
} 
else{
    res.render("login.ejs",{result:"" , message:message , userName:user_name})
}
   
})
app.get("/showall", function(req,res)
{ 
    
    let sql = "select * from productsList";
    
    connection.query(sql , function(err , result)
    {
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("show");
     // res.send(result);
      res.render("products.ejs",{data:result , message:message , userName:user_name})
    } )

})
app.get("/userlogin" , function(req,res)
{
    res.render("login.ejs",{result:"" , message:message , userName:user_name})
})
app.get("/reister" , function(req,res)
{
    res.render("register.ejs" , {result:"" , message:message ,userName:user_name})
})
app.get("/signup" , function(req,res)
{
    
    res.render("register.ejs" , {result:"" , message:message , userName:user_name})
})
app.post("/login" , jsonParser , function(req,res)
{
   let post = req.body;
   let userName = post.username;
   let password = post.password;
   let sql = "select * from users where user_name = '"+userName+"' and password ='"+password+"'";
   connection.query(sql,function(err,result){
       if(result!="")
       {
           message= "logged";
           user_id= result[0].id;
           user_name = result[0].user_name;

        res.render("home.ejs", {message:message , userName : user_name});
           
       }
       else
       {
           res.render("login.ejs" , {result:"failed" , message:message , userName:user_name});
        
       }
   })

})
app.post("/signup" , jsonParser,function(req,res)
{
let post = req.body;
let name = post.username;
let password  = post.password;
let confpass = post.confirmpassword;
let email = post.email;
if(password==confpass)
{
    message="logged";
    
    res.render("login.ejs" ,{message:message , userName:user_name , result : ""} )
    let sql = "insert into users (user_name , email , password) values('"+name+"' , '"+email+"' , '"+password+"') ";
    connection.query(sql,function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        
    })
}
else
{
    res.render("register.ejs" , {result:"faild" , message:message ,userName:user_name})
}

})
app.get("/login" , function(req,res)
{
    res.render("login.ejs" , {result:"" , message:message , userName:user_name})
})
app.get("/adminlogin" , function(req , res)
{
    res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
}) 
app.post("/adminloginsend" , function(req , res)
{
    let post = req.body;
    let name = post.username;
    let password = post.password;
    // res.send(name + password);
   let sql = "select * from admins where name='"+name+"' and password='"+password+"' ";
   connection.query(sql,function(err,result)
   {
      if(result!="")
      {
          admin_id = result[0].id;
          admin_name=result[0].name;
          admin_message= "logged";
         //console.log(admin_name);
    let products = "select count(id) as count from productsList"  ;  
    connection.query(products , function(err,prousuctList)
    {
        let clients = "select count(id) as users from users";
        connection.query(clients,function(err,clients)
        {
            let orders = "select count(id) as count from orders where status='waiting'";
            connection.query(orders , function(err , orderscount)
            {
            
                res.render("admindashboard.ejs" , {data : result , products : prousuctList , clients: clients , order :orderscount})

            })

           
        })
       
    }) }
    else{
        res.render("adminlogin" , {message:message , result:"failed" , userName:user_name})
    }
     
   })
})
/////////////////////////////////////////////// for check reasons only//////////////////////////////////////
app.get("/adminloginsend" , function(req , res)
{
   if(admin_id!=0 &&admin_message=="logged")
   {
       let sql = "select * from admins where id = '"+admin_id+"' ";
       connection.query(sql , function(err , result)
       {
        let products = "select count(id) as count from productsList"  ;  
    
        connection.query(products , function(err,prousuctList)
        {
            let clients = "select count(id) as users from users";
            connection.query(clients,function(err,clients)
            {
               
            let orders = "select count(id) as count from orders where status='waiting'";
            connection.query(orders , function(err , orderscount)
            {
            
                res.render("admindashboard.ejs" , {data : result , products : prousuctList , clients: clients , order :orderscount})

            })
            })
           
        })
           
       })
   
   }
   else{
    res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
   }
})
   app.get("/addnewproduct",function(req , res)
   {
    if(admin_id!=0 &&admin_message=="logged")
    {
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , result)
        {
         
         res.render("projecttest.ejs" , {data:result , message :""}); 

            
        })
    
    }
    else{
     res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
    }
})

app.get("/orders" , function(req , res)
{
    if(admin_id!=0 &&admin_message=="logged")
    {
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , result) 
        {

            let order = "select * from orders where status='waiting'";
            connection.query(order , function(err , orderresult)
            {
                res.render("orders.ejs" , {data:result , order : orderresult});
            })
            
         
         

            
        })
    
    }
    else{
     res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
    }



    
})

            
   
// app.get("/header",function(req,res)
// {
//     res.render("header.ejs" , {message:message})
// })
app.get("/home",function(req , res)
{
    res.render("home.ejs" , {message:message , userName:user_name})   
})
app.get("/userlogout",function(req , res)
{
    message="logged out";
    user_id=0;
    user_name="";
    res.render("home.ejs", {message:message , userName:user_name});
})
app.get("/cart" , function(req , res)
{
    let sql = "select p.*  from productsList p, cart c where c.product_id = p.id and c.user_id = '"+user_id+"'"
    connection.query(sql, function(err  , result)
    {
       res.render("usercart.ejs", {data:result , message:message , userName:user_name})
    })

})
app.get("/deleteroductfromcart",function(req,res)
{
    let id = req.param('id');
    let sql = "delete from cart where product_id = '"+id+"'";
    connection.query(sql , function(err , result)
    {

        let sql = "select p.*  from productsList p, cart c where c.product_id = p.id and c.user_id = '"+user_id+"'"
        connection.query(sql, function(err  , result)
        {
           res.render("usercart.ejs", {data:result , message:message , userName:user_name})
        })
    })
})
app.get("/adminlogout" , function(req , res)
{
    admin_id=0;
    admin_name = "";
    admin_message = "logged out";
    res.render("home.ejs", {message:message , userName:user_name});

})
app.get("/editProfile" , function(req , res)
{
    let sql = "select * from users where id ='"+user_id+"'";
    connection.query(sql , function(err , result)
    {
        //   console.log(result[0].id)
        //   console.log(result[0].user_name)
        //   console.log(result[0].profile_pic)
        //   console.log(result[0].email)
        //   console.log(result[0].city)
        //   console.log(result[0].address)
        //   console.log(result[0].tel)
        //   console.log(result[0].mobile)
        //   console.log(result[0].password)
        res.render("editCustomerAccount.ejs", {message:message , userName:user_name , data : result , response : ""});

    })
  
   
})
app.post("/edited", jsonParser, function(req , res)
{
  
    post = req.body;
    console.log(req.body);
  editedusername = post.userName;
  editedemail =post.email;
  editedtel = post.tel;
editedmob = post.mob;
editedaddress = post.address;
editedcity = post.city;
editedpassword = post.password;
editedconfpassowrd = post.confpassword;
let selectresult ;
let sql = "select * from users where id ='"+user_id+"'";
if(editedconfpassowrd == editedpassword)
{
    connection.query(sql , function(err , selectresult)
    {
        
            let sql = "update users set user_name ='"+editedusername+"' , email = '"+editedemail+"' , city = '"+editedcity+"' , address='"+editedaddress+"' ,tel ='"+editedtel+"' , mobile ='"+editedmob+"' ,password = '"+editedpassword+"' where id ='"+user_id+"'"
            connection.query(sql,function(err , result)
            {
                console.log(err);
                res.send({success:"done"})
               
            })
         
            
        })
}else
{
    res.send({failed:"failed"})
}

})
app.get("/buyproductfromcart" , function(req,res)
{
  let productid =  req.param('id');
  let sql = " select distinct p.*  ,p.product_price as sum from productsList p , cart c where c.user_id = '"+user_id+"' and p.id = c.product_id and c.product_id = '"+productid+"'";
  connection.query(sql , function(err , result)
  {
    res.render("cart.ejs", {message:message , userName:user_name , data:result });
  })
})
app.get("/buyall", function(req , res)
{
    let sql = "select p.*  from productsList p, cart c where c.product_id = p.id and c.user_id = '"+user_id+"'"
    connection.query(sql , function(err , result)
    {
      res.render("cart.ejs", {message:message , userName:user_name , data:result });
      for(let i = 0 ; i< result.length ; i++)
      {
            console.log(result[i]);
      }
    })
} )
app.get("/checkout" ,jsonParser, function(req , res)
{
   // res.render("checkout.ejs", {message:message , userName:user_name });
let post = req.query;
let username = post.firstname ;
let email = post.email;
let address = post.address;
let cardnumber = post.cardnumber;
let now = new Date();
let date = dateFormat(now, "mm/dd/yyyy");
let sql = "select p.*  from productsList p, cart c where c.product_id = p.id and c.user_id = '"+user_id+"'"
connection.query(sql , function(err , products)
{
   
    for(let i = 0 ; i< products.length ; i++)
    {
        let sql = "insert into orders (user_name , email , address , card_number , date , product_price , product_id) values ('"+username+"' , '"+email+"' , '"+address+"' , '"+cardnumber+"' , '"+date+"' , '"+products[i].product_price+"' , '"+products[i].id+"')"
        connection.query(sql , function(err , result)
        {
            let sql = "delete from cart where product_id = '"+products[i].id+"' and user_id ='"+user_id+"' "
            connection.query(sql , function(err , result)
            {
                  console.log(err);
              
            })
          
        })
        
        
    }
    res.render("done.ejs", {data:products , message:message , userName:user_name})
})

console.log(date);
})

app.get("/accepted" , function(req , res)
{
      let orderID = req.param('id');
    let sql = "update orders set status='shipped' where id ='"+orderID+"'";
    connection.query(sql , function(err,result)
    {
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , adminresult) 
        {
            let order = "select * from orders where status='waiting'";
            connection.query(order , function(err , orderresult)
            {
              
                // res.render("orders.ejs" , {data : adminresult , order : orderresult});
                res.send({success:"done"})
            })      
        })
   
    })
})
app.get("/canceled" , function(req , res)
{
    let orderID = req.param('id');
    console.log(orderID);
    let sql = "update orders set status='canceled' where id ='"+orderID+"'";
    connection.query(sql , function(err,canceledresult)
    {    
    if(admin_id!=0 &&admin_message=="logged")
    {
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , result) 
        {
            let order = "select * from orders where status='waiting'";
            connection.query(order , function(err , orderresult)
            {
                res.send({success:"done"})
            })
            
        })
    
    }
    else{
     res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
    }
    })
})
app.get("/doneorders" , function(req , res)
{
    
    if(admin_id!=0 &&admin_message=="logged")
    {
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , result) 
        {

            let order = "select * from orders where status = 'shipped'";
            connection.query(order , function(err , orderresult)
            {
                res.render("doneorders.ejs" , {data:result , order : orderresult});
            })
         
        
        })
    
    }
    else{
     res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
    }


})
app.get("/updateproduct" , function(req , res)
{
    if(admin_id!=0 &&admin_message=="logged")
    {
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , result) 
        {

            let order = "select * from productsList ";
            connection.query(order , function(err , orderresult)
            {
                console.log(err);
                res.render("updateproduct.ejs" , {data:result , order : orderresult});
            })
            
        })
    
    }
    else{
     res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
    }

})
app.get("/delete" , function(req , res)
{
      let orderID = req.param('id');
    let sql = "delete from productsList where id = '"+orderID+"'";
    connection.query(sql , function(err,result)
    {
        console.log(err);
        let sql = "select * from admins where id = '"+admin_id+"' ";
        connection.query(sql , function(err , adminresult) 
        {
            let order = "select * from orders where status='waiting'";
            connection.query(order , function(err , orderresult)
            {
              
                // res.render("orders.ejs" , {data : adminresult , order : orderresult});
                res.send({success:"done"})
            })      
        })
   
    })
})
app.get("/editproduct" , function(req , res)
{
    let  productID = req.param('id');
  
        let details = "select * from productsList where id = '"+productID+"'";
        connection.query(details, function(err , product)
        {
            if(admin_id!=0 &&admin_message=="logged")
            {
                let sql = "select * from admins where id = '"+admin_id+"' ";
                connection.query(sql , function(err , result)
                {
                 console.log(result);
                 res.render("editproduct" , {admin:result , message:"" , data:product}); 
        
                    
                })
            
            }
            else{
             res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
            }
        })
  

})

app.post("/updatedproduct" ,jsonParser, function(req , res)
{
    let productId = req.param('id');
    let post = req.body;
    let name = post.name;
    let description = post.desc;
    let price = post.Price;
    let file = req.files.myImg;
    let image = file.name;
    let catogey = post.Category;
    
    file.mv("./uploaded/images/products/" +  file.name , function(err)
    {
   
   })
   console.log(name);
    console.log(description);
    console.log(post)
    console.log(image);
    console.log(price);
    
    let sql = "update productsList set product_name = '"+name+"' , category = '"+catogey+"' , product_description = '"+description+"' , image = '"+image+"' , product_price ='"+price+"' where id = '"+productId+"'"
   connection.query(sql , function(err , result)
   {
    let details = "select * from productsList where id = '"+productId+"'";
    connection.query(details, function(err , product)
    {
        if(admin_id!=0 &&admin_message=="logged")
        {
            let sql = "select * from admins where id = '"+admin_id+"' ";
            connection.query(sql , function(err , result)
            {
             console.log(result);
             res.render("editproduct" , {admin:result , message:"added" , data:product}); 
    
                
            })
        
        }
        else{
         res.render("adminlogin.ejs" , {message:message , result:"" , userName:user_name})
        }
    })






   })
   
})
app.get("/clothes" , function(req , res)
{
let cat = req.param('cat');
console.log(cat);
let sql ="select * from productsList where category = 'Clothes' ";
connection.query(sql , function(err , result)
{
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("filter");
   
      res.render("filterproducts.ejs",{data:result , message:message , userName:user_name})
    } )
   

})
app.get("/cosmatics" , function(req , res)
{
let cat = req.param('cat');
console.log(cat);
let sql ="select * from productsList where category = 'Cosmatics' ";
connection.query(sql , function(err , result)
{
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("filter");
   
      res.render("filterproducts.ejs",{data:result , message:message , userName:user_name})
    } )
   

})
app.get("/electronics" , function(req , res)
{
let cat = req.param('cat');
console.log(cat);
let sql ="select * from productsList where category = 'Electronics' ";
connection.query(sql , function(err , result)
{
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("filter");
   
      res.render("filterproducts.ejs",{data:result , message:message , userName:user_name})
    } )
   

})
app.get("/shoes" , function(req , res)
{
let cat = req.param('cat');
console.log(cat);
let sql ="select * from productsList where category = 'shoes' ";
connection.query(sql , function(err , result)
{
        console.log(result);
        if(err) {
            console.log(err)
        }
       console.log("filter");
   
      res.render("filterproducts.ejs",{data:result , message:message , userName:user_name})
    } )
   

})
app.listen(8000);