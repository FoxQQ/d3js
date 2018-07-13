import {TableBuilder} from "./table-builder";
import {BasicChart} from "./BasicChart";

let d3 = require('d3');

export default function(){
    let svg = new BasicChart().chart;

    let g = svg[0][0];
    console.log(g);

    let w=g.getAttribute('width'),h=g.getAttribute('height');

    svg.append('rect')
        .attr({
            x:0,
            'width':w,
            y:0,
            'height':h,
            'fill':'rgb(100,100,100)'
        });
    svg.append('text')
        .text('A picture')
        .attr({
            x:10,
            y:100,
            'text-anchor':'start', //in relation to x,y - start, end , mittdle
            'fill':'green',
        });
    svg.append('line')
        .attr({
            x1:10,
            y1:10,
            x2:100,
            y2:100,
            stroke:'blue',
            'stroke-width':3
        });
}

export function renderDailyShowGuestTable() {
    let url='https://cdn.rawgit.com/fivethirtyeight/data/master/daily-show-guests/daily_show_guests.csv';
    let table =new TableBuilder(url);
}