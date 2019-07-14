function flip() {
    $('.card').toggleClass('flipped');
}


var imagearray = ["../../public/images/c1.png", "../../public/images/c2.png","../../public/images/c3.png", "../../public/images/c4.png", 
                 "../../public/images/c5.png", "../../public/images/c6.png", "../../public/images/c7.png", "../../public/images/c8.png" , 
                 "../../public/images/c9.png", "../../public/images/c10.png", "../../public/images/c11.png", "../../public/images/c12.png", 
                 "../../public/images/c13.png", "../../public/images/c14.png", "../../public/images/c15.png", "../../public/images/c16.png", 
                 "../../public/images/c17.png", "../../public/images/c18.png", "../../public/images/c19.png", "../../public/images/c20.png"];

function changeImage()
{
if(imagearray.length != 0){
    var element=document.getElementById('cardImage');
    var x = Math.floor((Math.random() * imagearray.length));
    console.log(x);




      element.src=imagearray[x];
    imagearray.splice(x, 1);  
        console.log(imagearray);
}
    else{
         var element=document.getElementById('cardImage');
        element.src="../../public/images/end.jpg"
    }
}
