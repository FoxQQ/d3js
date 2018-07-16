import {TableBuilder} from "./table-builder";
import {BasicChart} from "./BasicChart";

let d3 = require('d3');



function arcExamples(){
    let arc = d3.svg.arc();
    let chart = new BasicChart();

    let svg = chart.svg;

    svg.append('path')
        .attr('d', arc({
            outerRadius:100,
            innerRadius:50,
            startAngle: Math.PI*0.25,
            endAngle: Math.PI * -0.25
        }))
        .attr('transform',`translate(${chart.width/2},${chart.height/2})`)
        .attr('fill','lightslategrey');
}
export default function() {
    let chart = new BasicChart();
    let svg = chart.svg;

    let rings = 15,
        slices = 20;
    let colors = d3.scale.category20b();
    let angle = d3.scale.linear()
        .domain([0,slices])
        .range([0,2 * Math.PI]);

    let arc = d3.svg.arc()
        .innerRadius((d)=> 10 + (d * 50/rings))
        .outerRadius((d)=> 40 + (d*50/rings))
        .startAngle((d,i,j)=>angle(i))
        .endAngle((d,i,j)=>angle(j+1));

    let shade = {
        darker: (d, j) => d3.rgb(colors(j)).darker(d/rings),
        brighter: (d, j) => d3.rgb(colors(j)).brighter(d/rings)
    };

    [
        [100, 100, shade.darker],
        [300, 100, shade.brighter]
    ].forEach(function (conf) {
        svg.append('g')
            .attr('transform', `translate(${conf[0]}, ${conf[1]})`)
            .selectAll('g')
            .data(colors.range())
            .enter()
            .append('g')
            .selectAll('path')
            .data((d) => d3.range(0, rings))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i, j) => conf[2](d, j));
    });
}
export function axisDemo(){
        require('./index.css');
        let chart = new BasicChart();
        let svg = chart.svg;
        let x = d3.scale.linear()
            .domain([0,100])
            .range([chart.margin.left,chart.width-chart.margin.right]);
        let axis = d3.svg.axis()
            .scale(x);


        let axes = [
            d3.svg.axis().scale(x).orient('right'),
            d3.svg.axis().scale(x).ticks(5),
            d3.svg.axis().scale(x).tickSubdivide(8).tickSize(5,10,10),
            d3.svg.axis().scale(x).tickValues([0,20,50,70,100])
                .tickFormat((d,i)=>['a', 'e', 'i', 'o', 'u'][i]).orient('top')
        ];

        axes.forEach(function (axis,i){
            let a = svg.append('g')
                .attr('transform',`translate(0,${i*50+chart.margin.top})`)
                .data(d3.range(0,100))
                .classed('axis',true)
                .classed('dotted', i%2==0)
                .call(axis);


        });
}

export function funWithPath()
{

    let chart = new BasicChart();
    let svg = chart.svg;
    let g = svg.append('g')
        .attr('transform',`translate(${chart.width/2},${chart.height/2})`);
    /*
    g.selectAll('path')
        .data([{
            source: {
                radius: 50,
                startAngle: -Math.PI*0.9,
                endAngle: -Math.PI*0.1
            },
            target: {
                radius: 50,
                startAngle: Math.PI*0.1,
                endAngle: Math.PI*0.9}
        }])
        .enter()
        .append('path')
        .attr('d', d3.svg.chord());
    */
    let  data= d3.zip(d3.range(0,12),d3.shuffle(d3.range(0,12)));
    console.log(data);
    let chord = d3.svg.chord()
        .source((d)=>d[0])
        .target((d)=>d[1])
        .radius(100)
        .startAngle((d)=> -2*Math.PI * (1/data.length) * d)
        .endAngle((d) => -2*Math.PI/data.length*((d-1)%data.length));
    g.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', chord)
        .attr('fill', (d,i) => `rgb(${i*5},${i*20},${5*i})`)
        .attr('stroke','black');

    let g4 = svg.append('g')
        .attr('transform', `translate(${30},${chart.height/2})`);
    let moustache = [
        {source: {x: 0, y: 0}, target: {x: 100, y: 100}},
        {source: {x: 100, y: 100}, target: {x: 250, y: 120}},

    ];

    g4.selectAll('path')
        .data(moustache)
        .enter()
        .append('path')
        .attr('d', d3.svg.diagonal())
        .attr({stroke:'black', fill: 'none'});
}

function svgPathSymbolsArea()
{
    let chart = new BasicChart();
    let svg = chart.svg;

    let sine = d3.range(0,10);


    sine = sine.map((d)=>([d*Math.PI/2,Math.sin(d*Math.PI/2)]));


    let xScale = d3.scale.linear()
        .range([chart.margin.left,chart.width-chart.margin.right])
        .domain(d3.extent(sine,(d)=>d[0]));

    let yScale = d3.scale.linear()
        .range([chart.height-chart.margin.bottom,chart.margin.top])
        .domain([-1,1]);

    svg.selectAll('circle')
        .data(sine)
        .enter()
        .append('circle')
        .attr({
            cx:(d)=>xScale(d[0]),
            cy:(d)=>yScale(d[1]),
            r:3
        });


    let line =d3.svg.line()
        .x((d)=>xScale(d[0]))
        .y((d)=>yScale(d[1]));

    let g = svg.append('g');


    g.append('path')
        .datum(sine)
        .attr('d', line)
        .attr({
            stroke:'steelblue',
            'stroke-width':2,
            fill:'none'
        });

    g.append('path')
        .datum(sine)
        .attr('d', line.interpolate('step-before'))
        .attr({
            stroke:'black',
            'stroke-width':1,
            fill:'none'
        });

    g.append('path')
        .datum(sine)
        .attr('d', line.interpolate('monotone'))
        .attr({
            stroke:'green',
            'stroke-width':3,
            fill:'none'
        });
    g.append('path')
        .datum(sine)
        .attr('d', line.interpolate('bundle'))
        .attr({
            stroke:'red',
            'stroke-width':1,
            fill:'none'
        });

    g.append('path')
        .datum(sine)
        .attr('d', line.interpolate('basis-closed'))
        .attr({
            stroke:'yellow',
            'stroke-width':1,
            fill:'none'
        });

    let g2 = svg.append('g');
    let area = d3.svg.area()
        .x((d)=>xScale(d[0]))
        .y0(chart.height)
        .y1((d)=>yScale(d[1]))
        .interpolate('monotone');

    g2.append('path')
        .datum(sine)
        .attr('d',area)
        .attr({
            fill:'steelblue',
            'fill-opacity':0.3
        });



    let symbols = d3.svg.symbol()
        .type((d)=>d[1]>0?'triangle-down':'triangle-up')
        .size((d,i)=>i%2?0:64);

    g2.selectAll('path')
        .data(sine)
        .enter()
        .append('path')
        .attr('d', symbols)
        .attr({
            stroke:'steelblue', 'stroke-width':2, fill:'white'
        })
        .on('mouseover',()=>{

            let c =d3.event.target;
            c.setAttribute('fill','red');

        })
        .on('mouseout',()=>{

            let c =d3.event.target;
            c.setAttribute('fill','white');

        })
        .attr('transform',(d)=>`translate(${xScale(d[0])},${yScale(d[1])})`);
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