async function edit()
{
    console.log("editttttttttttttttttttt")
    let user = 
    {
        userName : editedUserName.value,
        email: email.value ,
        tel: tel.value,
        mob : mob.value ,
        address : address.value ,
        city : validationCustom04.value,
        password : pass.value,
        confpassword : confpass.value

    }
     let res = await   fetch("/edited" ,    {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        let resjson = await res.json();
            if(resjson.success)
            {
                console.log("succed");
               
                alert("Your profile Edited successfully ");
            }
            else
            { 
                alert("your password and confirmation must be The same");
            }         
        
}
async function accepted(id)
{
   
     let res = await   fetch("/accepted?id="+id ,    {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
          
        })
        let resjson = await res.json();
            if(resjson.success)
            {
                console.log("succed");
                console.log(id);
               
                alert("order accepted ");
                window.location.reload();
            }
            else
            { console.log("error")

            }

            
        
}
async function cancel(id)
{
   
     let res = await   fetch("/canceled?id="+id ,    {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
          
        })
        let resjson = await res.json();
            if(resjson.success)
            {
                console.log("succed");
                console.log(id);
               
                alert("order deleted ");
                window.location.reload();
            }
            else
            { console.log("error")

            }

            
        
}
async function Delete(id)
{
   
     let res = await   fetch("/delete?id="+id ,    {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
          
        })
        let resjson = await res.json();
            if(resjson.success)
            {
                console.log("succed");
                console.log(id);
               
                alert("product deleted ");
                window.location.reload();
            }
            else
            { console.log("error")

            }

            
        
}
async function Edit(id)
{
   
     let res = await   fetch("/editproduct?id="+id ,    {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
          
        })
       

            
        
}