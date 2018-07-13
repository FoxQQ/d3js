export class BasicChart {
    constructor(data){
        var d3 = require('d3'); //require via node-js webpackage
        this.data = data;
        this.svg = d3.select('div#chart').append('svg');
        this.margin = {
            left: 60,
            top:60,
            right:60,
            bottom:60,
        };
        this.svg.attr('width',window.innerWidth);
        this.svg.attr('height',window.innerHeight);
        this.width=window.innerWidth - this.margin.left - this.margin.right;
        this.height=window.innerHeight -this.margin.top - this.margin.bottom;
        this.chart = this.svg.append('g')
            .attr('width',this.width)
            .attr('height',this.height)
            //.attr('transform','translate('+this.margin.left+','+this.margin.top+')');
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

    }
}