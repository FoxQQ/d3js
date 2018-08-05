//console.log('chapter1');
//require('./chapter1.js');

///////////////chapter 2
//import ch2,{garbage} from './chapter2.js';

//garbage();
//ch2();

///////////////chapter 3
//import 'babel-polyfill';
//import ch3 from './chapter3.js';
//ch3();

///////////////chapter 4
//EASES
import {chapter4, Spirograph, PrisonPopulationChart, InteractivePrisonChart} from "./chapter4";
//new chapter4();
//new Spirograph();
//new PrisonPopulationChart('./data/uk_prison_data_1900-2015.csv');
new InteractivePrisonChart('./data/uk_prison_data_1900-2015.csv');