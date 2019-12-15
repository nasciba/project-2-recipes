
window.addEventListener('load', () => {
    document.querySelectorAll('.fav').forEach(btn => {
      
      btn.onclick = function(e) {
        let recipeId = e.currentTarget.getAttribute('recipeId')
        console.log(recipeId);

        axios.post(`/favorite/${recipeId}`).then(res => {
            if(res.data){
              console.log(res.data);
            }else{
              console.log(res.data);
              // window.location.href = '/login';
            }
            
      })
      }     

      
    });

});