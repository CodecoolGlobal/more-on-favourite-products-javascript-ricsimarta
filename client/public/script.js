import { products } from '/data.js';


const divElement = function (content){
  return `<div>${content}</div>`;
}

const loadEvent = function() {

  // Write your JavaScript code after this line
  console.log(products[0]);

  
  // Write your JavaScript code before this line

}

window.addEventListener("load", loadEvent);
