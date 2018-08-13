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

export class PrisonPopulationChart extends BasicChart {
    constructor(path){
        super();

        this.margin.left = 50;
        let d3 = require('d3');

        let p = new Promise((res, rej) => {
           d3.csv(path, (err, data) => err ? rej(err):res(data));
        });

        require('./index.css');

        this.x = d3.scale.ordinal().rangeBands([this.margin.left, this.width], 0.1);

        p.then((data)=>{
            this.data=data;
            this.drawChart();
        });
        return p;
    }

    drawChart(){
        let data = this.data;
        console.log(this.data);
        data = data.filter((d)=>
            d.year >= d3.min(data, (d)=>d.year) && d.year <=d3.max(data, (d)=>d.year));

        this.y = d3.scale.linear()
            .range([this.height, this.margin.bottom]);

        this.x.domain(data.map((d)=>d.year));
        this.y.domain([0, d3.max(data, (d) => Number(d.total))]);

        //AXIS
        this.xAxis = d3.svg.axis().scale(this.x).orient('bottom')
            .tickValues(this.x.domain().filter((d,i) => !(i % 5)));
        this.yAxis = d3.svg.axis().scale(this.y).orient('left');

        this.chart.append('g')
            .classed('axis x', true)
            .attr('transform', `translate(0, ${this.height})`)
            .call(this.xAxis);
        this.chart.append('g')
            .classed('axis y', true)
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(this.yAxis);

        this.bars = this.chart.append('g').classed('bars',true)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .style('x', (d) => {
                let x = this.x(d.year);
                return x;
            })
            .attr('fill-opacity',(d)=> {
                let x = this.x(d.year);
                return x>=this.margin.left?1:0.0;
            })
            .style('y', () => this.y(0))
            .style('width', this.x.rangeBand())
            .style('height', 0);
        //CSS ANIMATION
        setTimeout(()=>{
            this.bars.classed('bar', true)
                .style('height', (d) => this.height - this.y(+d.total))
                .style('y', (d) => this.y(+d.total))
        }, 1000);
    }
}

export class InteractivePrisonChart extends PrisonPopulationChart{
    constructor(path){
        let p = super(path);
        let currentobj = this;

        this.scenes = require('./data/prison_scenes');

        this.scenes.forEach(
            (v, i) =>  v.cb = this['loadScene' + i].bind(this));//.bind(this));
        p.then(()=>this.addUIElements());
        console.log(this.scenes);
        this.height =window.innerHeight*2/3;
        this.chart.attr('height', this.height);
        this.svg.attr('height', this.height + 100);
        this.margin.right = 10;
        this.margin.bottom = 10;
    }

    loadScene0(){
        this.clearSelected().then(()=>this.updateChart());
        this.words.html('');
    }
    loadScene1(){
        let scene = this.scenes[1];
        this.clearSelected().then(()=>{
            this.updateChart(this.data.filter((d)=>
                d3.range(scene.domain[0], scene.domain[1]).indexOf(Number(d.year)) >-1
            ))
                .then(() => this.selectBars(d3.range(1914, 1918)));
        });
        this.words.html(scene.copy);
    }
    loadScene2(){
        let scene = this.scenes[2];
        this.clearSelected().then(()=>{
            this.updateChart(this.data.filter((d)=>
                d3.range(scene.domain[0], scene.domain[1]).indexOf(Number(d.year)) >-1
            ))
                .then(() => this.selectBars(d3.range(1939, 1945)));
        });
        this.words.html(scene.copy);
    }
    loadScene3(){
        let scene = this.scenes[3];
        this.clearSelected().then(
            ()=>this.updateChart(this.data.filter((d)=>
                d3.range(scene.domain[0], scene.domain[1]).indexOf(Number(d.year)) >-1)));
        this.words.html(scene.copy);
    }
    loadScene4(){
        let scene = this.scenes[4];
        this.clearSelected().then(()=>{
            this.updateChart(this.data.filter((d)=>
                d3.range(scene.domain[0], scene.domain[1]).indexOf(Number(d.year)) >-1
                ))
                .then(() => this.selectBars([1993]));
        });
        this.words.html(scene.copy);
    }

    clearSelected(){
        return new Promise((res,rej)=>
        {
            d3.selectAll('.selected').classed('selected', false);
            res();
        })
    }

    selectBars(years){
        this.bars.filter((d)=>years.indexOf(
            Number(d.year))>-1).classed('selected', true);
    }

    updateChart(data = this.data){
        return new Promise((res, rej) => {
           let bars = this.chart.selectAll('.bar').data(data);

           this.x.domain(data.map((d)=>d.year));
           this.y.domain([0, d3.max(data, (d)=> Number(d.total))]);

           this.chart.selectAll('.axis.x').call(
               d3.svg.axis().scale(this.x).orient('bottom')
                   .tickValues(this.x.domain().filter((d,i)=>!(i%6))));
           this.chart.selectAll('.axis.y')
               .call(this.yAxis);

           bars.style('x', (d)=>this.x(d.year))
               .style('width', this.x.rangeBand())
               .style('height', (d)=>this.height-this.y(+d.total))
               .style('y', (d)=>this.y(+d.total));
           bars.enter().append('rect')
               .style('x', (d)=>this.x(d.year))
               .style('width', this.x.rangeBand())
               .style('height', (d)=>this.height-this.y(+d.total))
               .style('y', (d)=>this.y(+d.total))
               .classed('bar', true);
           bars.exit().remove()

            res();

        });
    }

    addUIElements(){
        this.buttons =d3.select('#chart')
            .append('div')
            .classed('buttons', true)
            .selectAll('.button')
            .data(this.scenes).enter().append('button')
            .classed('scene', true)
            .text((d) => d.label)
            .on('click', (d) => d.cb())
            .on('touchstart', (d) => d.cb());

        this.words = d3.select('#chart').append('div');
        this.words.append('words', true);
    }
}

export class DraggablePrisonChart extends InteractivePrisonChart {
    constructor(path) {
        let p = super(path);
        this.x.rangeBands([this.margin.left, this.width * 14])
    }

    addUIElements() {
        let bars = d3.select('.bars').on
        ('transitionend', () => {
                let dragContainer = this.chart.append('rect')
                    .classed('bar-container', true)
                    .attr('width', bars.node().getBBox().width)
                    .attr('height', bars.node().getBBox().height)
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('fill-opacity', 0);

                let drag = d3.behavior.drag().on('drag', ()=>{
                   let barsTransform = d3.transform(bars.attr('transform'));

                   let xAxisTransform = d3.transform(d3.select('.axis.x').attr('transform'));
                   bars.attr('transform',
                       `translate(${barsTransform.translate[0] + d3.event.dx}, 0)`);
                   let allBars = d3.selectAll('.bar');
                   allBars.attr('fill-opacity',(d, i) =>{
                        
                       return this.x(d.year)+barsTransform.translate[0]>=this.margin.left?1:0;

                   });

                    //each((d, i)=>console.log(this.x(d.year), i));

                  // bars.attr('fill-opacity',this.x>50?0.9:0.1);

                   d3.select('.axis.x').attr('transform',
                        `translate(${xAxisTransform.translate[0] + d3.event.dx},
                                    ${xAxisTransform.translate[1]})`)
                });
                dragContainer.call(drag);
            }


        );
    }
}

export class BrushPrisonChart extends InteractivePrisonChart{
    constructor(path){
        super(path);
    }
    addUIElements(){
        this.chart.append('g')
            .classed('brush', true)
            .call(d3.svg.brush().x(this.x).y(this.y)
                .on('brushstart', this.brushstart.bind(this))
                .on('brush', this.brushmove.bind(this))
                .on('brushend', this.brushend.bind(this)));
    }
    brushstart(){
        //let n = new Date().getTime();
        //console.log(n,':',d3.event.target.extent());
    }
    brushmove() {
        let e = d3.event.target.extent();
        //let n = new Date().getTime();
        //console.log(n,':',e);
        d3.selectAll('.bar').classed('selected', (d) =>
            e[0][0] <= this.x(d.year)
            && this.x(d.year) <= e[1][0]
        );
    }
    brush(){}
    brushend(){
        let selected = d3.selectAll('.selected');
        // Clear brush object
        d3.event.target.clear();
        d3.select('g.brush').call(d3.event.target);
        // Zoom to selection
        let first = selected[0][0];
        let last = selected[0][selected.size() - 1]
        let startYear = d3.select(first).data()[0].year;
        let endYear = d3.select(last).data()[0].year;
        this.clearSelected().then(() => {
            this.updateChart(this.data.filter((d) =>
                d3.range(startYear, endYear).indexOf(Number(d.year)) > -1));
        });
        let hitbox = this.svg
            .append('rect')
            .classed('hitbox', true)
            .attr('width', this.svg.attr('width'))
            .attr('height', this.svg.attr('height'))
            .attr('fill-opacity', 0);
        hitbox.on('contextmenu', this.rightclick.bind(this));
    }
    rightclick(){
        this.updateChart();
        this.addUIElements();
    }
}