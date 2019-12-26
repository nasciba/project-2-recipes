const mjml2html = require('mjml');

// function templateExample (message){
//   return htmlOutput = mjml2html(`
//   <mjml>
//     <mj-body>
//       <mj-section>
//         <mj-column>
//           <mj-text>
//             ${message}
//           </mj-text>
//         </mj-column>
//       </mj-section>
//     </mj-body>
//   </mjml>
// `);
// }

function templateExample (message){
  return htmlOutput = mjml2html(`
  <mjml>
  <mj-body>
    <mj-raw>
      <!-- Company Header -->
    </mj-raw>
    <mj-section background-color="#f0f0f0">
      <mj-column>
        <mj-text font-style="italic" font-size="20px" color="#626262">Ratatouille</mj-text>
      </mj-column>
    </mj-section>
    <mj-raw>
      <!-- Image Header -->
    </mj-raw>
    <mj-section background-url="https://addapinch.com/wp-content/uploads/2014/08/ratatouille-recipe-DSC_4650-2.jpg" background-size="cover" background-repeat="no-repeat">
      <mj-column width="600px">
        <mj-text align="center" color="#fff" font-size="40px" font-family="Helvetica Neue"></mj-text>
        
      </mj-column>
    </mj-section>
    <mj-raw>
      <!-- Intro text -->
    </mj-raw>
    <mj-section background-color="#fafafa">
      <mj-column width="400px">
        <mj-text font-style="italic" font-size="20px" font-family="Helvetica Neue" color="#626262">Welcome to Ratatouille Recipes</mj-text>
        <mj-text color="#525252">Thank you for registering to Ratatouille. To find out our amazing recipes, please confirm your registration clicking on the buttom bellow.</mj-text>
        <mj-button background-color="#F45E43" href="${message}">Confirm your registration</mj-button>
      </mj-column>
    </mj-section>
    <mj-raw>
      <!-- Side image -->
    </mj-raw>
    <mj-section background-color="white">
      <mj-raw>
        <!-- Left image -->
      </mj-raw>
      <mj-column>
        <mj-image width="200px" src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"></mj-image>
      </mj-column>
      <mj-raw>
        <!-- right paragraph -->
      </mj-raw>
      <mj-column>
        <mj-text font-style="italic" font-size="20px" font-family="Helvetica Neue" color="#626262">Find amazing recipes</mj-text>
        <mj-text color="#525252">Explore hundreds of recipes and feel free to use your imagination to create your own.</mj-text>
      </mj-column>
    </mj-section>
    <mj-raw>
      <!-- Icons -->
    </mj-raw>
    <mj-section background-color="#fbfbfb">
      <mj-column>
        <mj-image width="100px" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/food-388-234282.png"></mj-image>
      </mj-column>
      <mj-column>
        <mj-image width="100px" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/fast-food-44-795941.png"></mj-image>
      </mj-column>
      <mj-column>
        <mj-image width="100px" src="https://cdn3.iconfinder.com/data/icons/food-155/100/Healthy_food_2-512.png"></mj-image>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);
}




module.exports = templateExample;