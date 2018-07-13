let d3 = require('d3');

export class TableBuilder{
    constructor(url){
        this.load(url);
        this.table = d3.select('body')
            .append('table')
            .attr('class','table');
        this.tabelHeader = this.table.append('thead');
        this.tableBody = this.table.append('tbody');
    }

    load(url){
        d3.csv(url,  (data)=>{
            this.data = data;
            this.redraw();
        })
    }

    redraw(){
        let nested = d3.nest()
            .key(d=> d['Raw_Guest_List'])
            .entries(this.data);
        console.log(nested);
        this.data = nested.map(d => {
           let earliest = d.values.sort((a,b)=>d3.ascending(a.YEAR,b.YEAR)).shift();
           //console.log(earliest);
           let obj_ ={
               name : d.key,
               category: earliest.Group,
               'earliest appearance':earliest.YEAR
           };

           return obj_;
        });

        this.rows = this.tableBody.selectAll('tr').data(this.data);
        this.rows.enter().append('tr');
        this.rows.exit().remove();

        this.rows.selectAll('td')
            .data((d) => d3.values(d))
            .enter()
            .append('td')
            .text((d) => d);

        //this.tableBody.selectAll('tr')
        //    .sort((a,b)=>d3.ascending(a.Group,b.Group));

    }

}


//OLD CLASS USED FOR LIVE MANIPULATION IN BROWSER
/*
export class TableBuilder{
    constructor(rows){
        var d3 = require('d3');
        this.header = rows.shift(); //removes first item in an array - > the header row
        this.data = rows;
        var table = d3.select('body')
            .append('table')
            .attr('class','table');
        //console.log(this.header);
        //console.log(this.data);
        let tableHeader = table.append('thead').append('tr')

        this.header.forEach((value => {
            tableHeader.append('th').text(value);
        }));

        let tableBody = table.append('tbody');

        this.data.forEach((row)=>{
           let tr = tableBody.append('tr');

           row.forEach((value)=>{
               tr.append('td').text(value);
           });
        });

        return table;
    }
}*/