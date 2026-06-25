const cl= console.log;

const BASE_URL = `https://jsonplaceholder.typicode.com`
const COMMENTS_URL = `${BASE_URL}/comments`


                   
const postContainer= document.getElementById('postContainer');
const formId= document.getElementById('formId')
const nameControl = document.getElementById('name')
const emailControl = document.getElementById('email')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')


function tooltip(){
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

}



function snackBar(msg,icon){

    Swal.fire({
        title : msg,
        icon: icon,
        timer:3000
    })
}




function createcards(arr){

    let result='';

    arr.forEach( comment =>{

        result += `
        <div class="col-md-3 mb-3" id="${comment.id}">
            <div class="card h-100">
                <div class="card-header" data-toggle="tooltip" data-placement="top" title="${comment.name}">
                    <h3>${comment.name}</h3>
                    <p>${comment.email}</p>
                    
            

                </div>
                <div class="card-body">
                    <p>${comment.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onClick="onEdit(this)" class="btn btn-outline-primary">Edit</button>
                    <button onClick="onRemove(this)" class="btn btn-outline-danger">Remove</button>

                </div>
            </div>
        </div>
        
        
        `
    })
    postContainer.innerHTML= result;
    tooltip()

}

function fetchComments(){

    let xhr= new XMLHttpRequest()
    xhr.open('GET', COMMENTS_URL, true)
    xhr.send(null)
    xhr.onload= function(){
        if(xhr.status >=200 && xhr.status <= 299){
            let commenstArr = JSON.parse(xhr.response)
            createcards(commenstArr)
        }
    }



}
fetchComments()

function onSubmit(eve){
    eve.preventDefault()

    let obj={
        name: nameControl.value ,
        email: emailControl.value ,
        body: bodyControl. value ,
        userId: userIdControl. value
    }
    cl(obj)

    let xhr = new XMLHttpRequest()
    xhr.open('POST', COMMENTS_URL, true)
    xhr.send(JSON.stringify(obj))
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res=JSON.parse(xhr.response)

            let col= document.createElement('div')
            col.className= "col-md-3 mb-3"
            col.id= res.id
            col.innerHTML= `
             <div class="card h-100">
                <div class="card-header" data-toggle="tooltip" data-placement="top" title="${obj.name}">
                    <h3>${obj.name}</h3>
                    <p>${obj.email}</p>
                    
            

                </div>
                <div class="card-body">
                    <p>${obj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onClick="onEdit(this)" class="btn btn-outline-primary">Edit</button>
                    <button onClick="onRemove(this)" class="btn btn-outline-danger">Remove</button>

                </div>
            </div>
            
            `
postContainer.prepend(col)
tooltip()
formId.reset()
snackBar(`Comment Added successfully`, `success`)

        }else{

            snackBar(`something went wrong`, `error`)

        }
    }
}

function onEdit(ele){
    let EDIT_ID = ele.closest('.col-md-3').id
    localStorage.setItem('EDIT_ID', EDIT_ID)

    let EDIT_URL = `${BASE_URL}/comments/${EDIT_ID}`

let xhr= new XMLHttpRequest()
xhr.open('GET', EDIT_URL)
xhr.send()
xhr.onload= function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let EDIT_OBJ= JSON.parse(xhr.response)
        cl(EDIT_OBJ)

           nameControl.value =EDIT_OBJ.name,
         emailControl.value =EDIT_OBJ.email,
         bodyControl. value =EDIT_OBJ.body,
         userIdControl. value= EDIT_OBJ.userId

         addbtn.classList.add('d-none')
         updatebtn.classList.remove('d-none')

         formId.scrollIntoView({
            behavior: 'smooth',
            block: "start"
         })



    }else{

    }
}

}

function onupdt(){
    let UPDATE_ID = localStorage.getItem('EDIT_ID')

    let UPDATE_OBJ ={
  name: nameControl.value ,
        email: emailControl.value ,
        body: bodyControl. value ,
        userId: userIdControl. value,
        id: UPDATE_ID


    }


    let UPDATE_URL= `${BASE_URL}/comments/${UPDATE_ID}`

let xhr= new XMLHttpRequest()
xhr.open("PATCH", UPDATE_URL)
xhr.send(JSON.stringify(UPDATE_OBJ))
xhr.onload=function(){
    if(xhr.status >= 200 && xhr.status <= 299){

        let res= JSON.parse(xhr.response)

        let col= document.getElementById(UPDATE_ID)
        let h3= col.querySelector('.card-header h3')
        let p= col.querySelector('.card-header p')

        
        let para = col.querySelector('.card-body p')

        h3.innerHTML= UPDATE_OBJ.name,
        para.innerHTML= UPDATE_OBJ.body,
        p.innerHTML= UPDATE_OBJ.email

        
         addbtn.classList.add('d-none')
         updatebtn.classList.remove('d-none')
         formId.reset()

snackBar(`blog updated successfully`, `success`)

col.scrollIntoView({
    behavior: "smooth",
    block:'center'
})

col.classList.add('highlight-card')
setTimeout(()=>{
    col.classList.remove('highlight-card')
}, 4000)


    }else{
        snackBar(`something went wrong`, `error`)

    }
}

}


function onRemove(ele){

Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let REMOVE_ID= ele.closest('.col-md-3').id
    let REMOVE_URL = `${BASE_URL}/comments/${REMOVE_ID}`


    spinner.classList.remove('d-none')

    let xhr= new XMLHttpRequest()
    xhr.open('DELETE', REMOVE_URL)
    xhr.send()
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            ele.closest('.col-md-3').remove()
        
        }
            snackBar(`the post with id ${REMOVE_ID} REMOVE successfully`, `success`)

    spinner.classList.add('d-none')

    }
  }else{
        snackBar(`something went wrong`, `error`)
    spinner.classList.add('d-none')

  }


})

}





formId.addEventListener('submit', onSubmit)
updatebtn.addEventListener('click', onupdt)