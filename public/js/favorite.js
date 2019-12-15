
window.addEventListener('load', () => {
    document.querySelectorAll('.like-i').forEach(btn => {      
      
      btn.onclick = function(e) {
        // console.log(e.currentTarget.nextElementSibling);
        e.currentTarget.classList.toggle("press", 1000);
        e.currentTarget.nextElementSibling.classList.toggle("press", 1000);
        let recipeId = e.currentTarget.getAttribute('recipeId')
        console.log(recipeId);

        axios.post(`/favorite/${recipeId}`).then(res => {
            if(res.data){
              console.log(res.data);
              
            }else{
              console.log(res.data);
              window.location.href = '/login';
            }
            
      })
      }     

      
    });

    // document.getElementById("like-i").addEventListener('click', function (event) {
    //   console.log('clicado');
    //   $( "like-i,like-span" ).toggleClass( "press", 1000 );
    // });

});