import * as helper from './helper';
import {BasicChart} from "../../learning-d3/src/BasicChart";
let d3 = require('d3');

export class PoliticalDonorChart extends BasicChart{
    constructor(chartType, ...args){
        super();
        require('./chapter5.css');

        let p = new Promise((res, rej)=>{
            d3.csv('./data/uk_political_donors.csv', (err, data) => err ? rej(err):res(data));
        });

        p.then((data)=>{
           this.data = data;
           this[chartType].call(this, ...args);
        });

        return p;
    }
}