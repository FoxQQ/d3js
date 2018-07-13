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
}