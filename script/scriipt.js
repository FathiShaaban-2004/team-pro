// الاسئلة الشائعة
let text=document.getElementById("check");
let botton=document.getElementById("btn");
if(text && botton){
    text.addEventListener('change', function(){
//   لو علمت على الشيك بوكس الزرار يشتغل
botton.disabled =! text.checked;
    });
       botton.addEventListener('click', function(){
        const message =document.getElementById("successmessage");
        if(message){
            message.style.display ='block';
        }
    });
}

// كود سياسة الخصوصية
let question =document.querySelectorAll('.aske');
question.forEach(function(fqe){
    fqe.addEventListener('click',function(){
        let check=this.classList.contains('active');
        question.forEach(function(test){
            test.classList.remove('active');
        });
        if(check==false){
            this.classList.add('active');
        }
    });
} );


/*=================humburger menu======================*/
let menu = document.getElementById("menu");
let nav = document.getElementById("nav");

menu.onclick = function () {
  nav.style.display = nav.style.display === "block" ? "none" : "block";
};







