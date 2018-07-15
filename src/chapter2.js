import {TableBuilder} from "./table-builder";
import {BasicChart} from "./BasicChart";

let d3 = require('d3');

export default function()
{
    let chart = new BasicChart();
    let svg = chart.svg;

    let sine = d3.range(1,10);
    console.log(sine);

    sine = sine.map((d)=>([d*Math.PI/2,Math.sin(d*Math.PI/2)]));
    console.log(sine);

    let xScale = d3.scale.linear()
        .range([0,chart.width])
        .domain([0, d3.max(sine)[0]]);

    let yScale = d3.scale.linear()
        .range([chart.height,0])
        .domain([-1,1]);

    svg.selectAll('circle')
        .data(sine)
        .enter()
        .append('circle')
        .attr({
            cx:(d)=>xScale(d[0]),
            cy:(d)=>yScale(d[1]),
            r:10
        });
    console.log(yScale(1));
}

export function garbage(){
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
    svg.append('rect')
        .attr({
            x:200,
            y:300,
            width:300,
            height:150,
            stroke:'green',
            fill:'white',
            rx:50,
            ry:30
        });

    svg.append('path')
        .attr({d: 'M 150 100 L 300 100 L 200  250 L 50 30 z',
            stroke: 'black',
            'stroke-width': 2,
            fill: 'red',
            'fill-opacity': 0.45});
}

export function renderDailyShowGuestTable() {
    let url='https://cdn.rawgit.com/fivethirtyeight/data/master/daily-show-guests/daily_show_guests.csv';
    let table =new TableBuilder(url);
}