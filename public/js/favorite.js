
window.addEventListener('load', () => {
    document.querySelectorAll('.like-i').forEach(btn => {      
      
      btn.onclick = function(e) {
        if(e.currentTarget.classList.value == 'like-i'){
          e.currentTarget.classList.toggle("press", 1000);
          e.currentTarget.nextElementSibling.classList.toggle("press", 1000);
        }else{
          e.currentTarget.classList.remove("press", 1000);
        }
        
        let recipeId = e.currentTarget.getAttribute('recipeId')
        console.log(recipeId);

        axios.post(`/favorite/${recipeId}`).then(res => {
            if(res.data){
              console.log(res.data);
              
            }else{
              console.log(res.data);
              window.location.href = '/login';
            }
            
        });
      }     

      
    });

    if(document.getElementById('profile')){
      document.getElementById('profile').addEventListener('mouseover', (e) =>{
        // console.log('passei aqui! ', e.currentTarget);
        e.currentTarget.nextElementSibling.classList.remove('hidden-section');
      });
  
      document.getElementById('profile-info').addEventListener('mouseout', (e) =>{
        console.log(e.currentTarget.nextElementSibling);
        e.currentTarget.classList.toggle('hidden-section');
      });

      document.getElementById('profile').addEventListener('mouseout', (e) =>{
        console.log(e.currentTarget.nextElementSibling);
        e.currentTarget.nextElementSibling.classList.toggle('hidden-section');
      })

      
    }
    

    // document.getElementById("like-i").addEventListener('click', function (event) {
    //   console.log('clicado');
    //   $( "like-i,like-span" ).toggleClass( "press", 1000 );
    // });
   

});