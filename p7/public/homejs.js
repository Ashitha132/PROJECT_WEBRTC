
    const button = document.querySelector('#create-btn');
    const button2= document.getElementById('join');
   

button2.addEventListener('click', () => {
    let url=document.getElementById('my').value;
    alert(url);
    window.location.replace(url);

});



    button.href=`/room/${uuid.v4()}`






    
