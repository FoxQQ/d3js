import {BasicChart} from "./BasicChart";

export class BasicBarChart extends BasicChart {
    constructor(data){
        super(data);
        this.pub_var = 'nice';
        //var oder let nopub_var ='notnice';
        let x = d3.scale.ordinal()
            .rangeRoundBands([this.margin.left, this.width-this.margin.right],0.1);
        let y =d3.scale.linear()
            .range([this.height,this.margin.bottom]);

        x.domain(data.map((d) => {return d.name;})); // function(d){} === (d) => {}
        y.domain([0,d3.max(data,(d) => {return d.population;})]);

        let xAxis = d3.svg.axis().scale(x).orient('bottom');
        let yAxis = d3.svg.axis().scale(y).orient('left');

        //axis
        this.chart.append('g')
            .attr('class','axis')
            .attr('transform',`translate(0,${this.height})`)
            .call(xAxis);

        this.chart.append('g')
            .attr('class','axis')
            .attr('transform',`translate(${this.margin.left},0)`)
            .call(yAxis);

        this.chart.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d)=>{return x(d.name)})
            .attr('width', x.rangeBand())
            .attr('y', ()=>{return y(this.margin.bottom);})
            .attr('height', 10)
            .transition()
            .delay((d,i)=>{return i*20;})
            .duration(800)
            .attr('y',(d)=>{return y(d.population);})
            .attr('height',(d)=>{return this.height-y(d.population)});
         //console.log(this.margin.bottom);

    }
}
