import {BasicChart} from './BasicChart';

export class chapter4 extends BasicChart{
    constructor(data){
        super(data);
        let eases = [
            'linear',
            'poly(4)',
            'quad',
            'cubic',
            'sin',
            'exp',
            'circle',
            'ealastic(10, -5)',
            'back(0.5)',
            'bounce',
            'cubic-in',
            'cubic-out',
            'cubic-in-out',
            'cubic-out-in'
        ];
        let y = d3.scale.ordinal().domain(eases).rangeBands([50, 500]);

        eases.forEach((ease)=>
        {
            let transition = this.svg.append('circle')
                .attr({cx: 130, cy: y(ease), r: y.rangeBand() / 2 - 5})
                .transition()
                .delay(400)
                .duration(1500)
                .attr('cx',400);

            if(ease.indexOf('(')>-1) {
                let args = ease.match(/[0-9]+/g),
                    type = ease.match(/^[a-z]+/);
                transition.ease(type, args[0], args[1]);
            }else {
                transition.ease(ease);
            }

            this.svg.append('text')
                .text(ease)
                .attr({x: 10, y: y(ease)+5});
        });
    }
}

export class Spirograph extends BasicChart{
    constructor(data){
        super(data);

        var chart = this.chart;
        let position = function(t){
            let a=80,
                b=1,
                c=1,
                d=80;
            return {
                x: Math.cos(a*t) - Math.pow(Math.cos(b*t), 3),
                y: Math.sin(c*t) - Math.pow(Math.sin(d*t), 3),
            }
        };

        let tScale = d3.scale.linear()
                .domain([500, 25000])
                .range([0, 2*Math.PI]),
            x = d3.scale.linear().domain([-2, 2]).range([100, this.width-100]),
            y = d3.scale.linear().domain([-2, 2]).range([this.height-100, 100]);
        console.log(chart);
        let brush = chart.append('circle')
            .attr({r:4}),
            previous = position(0);

        let step = function(time){
            if(time>tScale.domain()[1]){
                return true;
            }
            let t=tScale(time),
                pos=position(t);

            brush.attr({cx:x(pos.x), cy:y(pos.y)});


            chart.append('line')
                .attr({x1: x(previous.x),
                    y1: y(previous.y),
                    x2: x(pos.x),
                    y2: y(pos.y),
                    stroke: 'steelblue',
                    'stroke-width': 1.3});

            previous = pos;
        };

        let timer = d3.timer(step, 500);
    }
}