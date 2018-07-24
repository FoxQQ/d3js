let topojson = require('topojson');
let d3 = require('d3');
import {BasicChart} from "./BasicChart";

export class UlamSpiral extends BasicChart{
    constructor(data) {
        super(data);

        let dot = d3.svg.symbol().type('circle').size(3),
            center=400,
            l = 2,
            x = (x, l) => center + l*x,
            y = (y, l) => center + l*y;

        let primes = this.generatePrimes(500);
        console.log(primes);
        let sequence = this.generateSpiral(d3.max(primes))
            .filter((d)=>primes.indexOf(d['n']) > -1);
        console.log(sequence);

        this.chart.selectAll('path')
            .data(sequence)
            .enter()
            .append('path')
            .attr('transform',(d) => `translate(${ x(d['x'], l)}, ${y( d['y'], l)})`)
            .attr('d',dot);
        let scale= 8;
        let regions = d3.nest()
            .key((d) => Math.floor(d['x']/scale))
            .key((d) => Math.floor(d['y']/scale))
            .rollup((d) => d.length)
            .map(sequence);

        let values = d3.merge(d3.keys(regions).map((_x) => d3.values(regions[_x])));
        let median = d3.median(values),
            extent = d3.extent(values),
            shades = (extent[1]-extent[0])/2;

        d3.keys(regions).forEach((_x) => {
            d3.keys(regions[_x]).forEach((_y) => {
                let color,
                    red = '#e23c22',
                    green = '#497c36';
                if (regions[_x][_y] > median) {
                    color = d3.rgb(green).brighter(regions[_x][_y] / shades);
                } else {
                    color = d3.rgb(red).darker(regions[_x][_y] / shades);
                }
                this.chart.append('rect')
                    .attr({
                        x : x(_x, l * scale),
                        y : y(_y, l * scale),
                        width : l * scale,
                        height : l * scale
                    })
                    .style({fill : color, 'fill-opacity' : 0.9});
            });
        });
    }
    generateSpiral(n){
            let spiral = [],
                x=0, y=0,
                min = [0, 0],
                max = [0, 0],
                add = [0, 0],
                direction = 0,
                directions = {
                    up: [0, -1],
                    down: [0, 1],
                    left: [-1, 0],
                    right: [1, 0]
            };


            d3.range(1, n).forEach((i) => {
                spiral.push({x: x, y: y, n: i});
                add = directions[['up', 'left', 'down', 'right'][direction]];
                x += add[0], y += add[1];

                if (x < min[0]) {
                    direction = (direction + 1) % 4;
                    min[0] = x;
                }
                if (x > max[0]) {
                    direction = (direction + 1) % 4;
                    max[0] = x;
                }
                if (y < min[1]) {
                    direction = (direction + 1) % 4;
                    min[1] = y;
                }
                if (y > max[1]) {
                    direction = (direction + 1) % 4;
                    max[0] = y;
                }
            });

            return spiral;

    }
    generatePrimes(n){
        function* numbers(start){
            while(true){
                yield start++;
            }
        }

        function* primes(){
            var seq = numbers(2);
            var prime;

            while(true){
                prime = seq.next().value;

                yield prime;
                seq = filter(seq, prime);

            }
        }
        function* getPrimes(count, seq) {
            while(count){
                yield seq.next().value;
                count--;
            }
        }
        function* filter(seq, prime){
            for (var num of seq){
                if(num%prime !==0){
                    yield num;
                }
            }
        }
        let results=[];
        for(var prime of getPrimes(n, primes())){
            //console.log(prime);
            results.push(prime);
        }
        return results;

    }
}
class ScalesDemo extends BasicChart{
    constructor(data){
        super(data);
//        this.ordinal();
        this.quantative();
    }
    ordinal(){
        let data = d3.range(30);
        let colors = d3.scale.category20();
        /*for (let i=0;i<21;i++){
            console.log(i,' : ',colors(i));
            this.chart.append('circle')
                .attr({
                    cx:i*40,
                    cy:50,
                    r:20,
                })
                .attr('fill',colors(i));
        }*/
        let points = d3.scale.ordinal().domain(data).rangePoints([0, this.height], 1.0); //1.0 =padding zu rand von rand punkten
        let bands = d3.scale.ordinal().domain(data).rangeBands([0, this.width], 0.1);

        this.chart.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr({
                d: d3.svg.symbol().type('circle').size(50),
                transform: (d)=> `translate(${(this.width/2*1)},${points(d)})`
            })
            .style('fill',(d)=> colors(d));

        this.chart.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr({
                x: (d)=> bands(d),
                y: this.height/2,
                width: bands.rangeBand(),
                height:10
            })
            .style('fill',(d)=> colors(d));
    }

    quantative(){
        let weierstrass = (x) => {
            let a = 0.5,
                b = (1+3*Math.PI/2) / a;
            var x = d3.sum(d3.range(100).map((n) => {
                return Math.pow(a, n)*Math.cos(Math.pow(b, n)*Math.PI*x);
            }));

            return x;
        };
        console.log(d3.range(10).map((x)=>x*2));

        var data = d3.range(0, 10, 0.1).map(function (d) { return d/100; }),
            extent = d3.extent(data.map(weierstrass)),
            colors = d3.scale.category10(),
            x = d3.scale.linear().domain(d3.extent(data)).range([0, this.
                width]);

        let drawSingle = (line) => {
            return this.svg.append('path')
                .datum(data)
                .attr('d', line)
                .style({
                    'stroke-width':2,
                    fill: 'none',
                })
        };

        let linear = d3.scale.linear().domain(extent).range([this.height, 0]),
            line1 = d3.svg.line()
                .x(x)
                .y((d) => linear(weierstrass(d)));

        drawSingle(line1)
            .attr('transform', `translate(0, ${this.height / 16})`)
            .style('stroke', colors(0));


    }
}
export class GeoDemo extends BasicChart{
    constructor(data){
        super(data);
        let chart = this.chart;

        let projection = d3.geo.equirectangular()
            .center([8, 56])
            .scale(800);

        let p1 = new Promise((resolve, reject) => {
           d3.json('data/water.json', (err, data)=>{
               err ? reject(err): resolve(data);
            });
        });
    }
}

export default function(){
    console.log('geodata');
    var geo = new GeoDemo();
    //var spirale = new UlamSpiral();
    //var scales = new ScalesDemo();


}