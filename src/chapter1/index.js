import {BasicBarChart} from "./BasicBarChart";
let css = require('./index.css');

let jdata = require('./data/chapter1.json');
console.log(jdata);
function poplen(obj){
    return obj.population.length;
}

let totalNumbers =jdata.filter(poplen)
    .map((obj) => {
            return {
                name: obj.name,
                population: Number(obj.population[0].value)
            }; //map method creat a new array with the results of calling func for ervery arrayelem
        }      //calls the function in order foreach elem
    );
console.log(totalNumbers);
var myChart=new BasicBarChart(totalNumbers);
myChart.pub_var="vong der niceheit";
console.log(myChart.pub_var);
