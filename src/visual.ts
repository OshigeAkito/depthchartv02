
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import DataView = powerbi.DataView;
import DataViewTableRow = powerbi.DataViewTableRow;
import PrimitiveValue = powerbi.PrimitiveValue;
import { dataViewObjects } from "powerbi-visuals-utils-dataviewutils";
import { dataViewObject } from "powerbi-visuals-utils-dataviewutils";


import * as d3 from "d3";
import * as d3select from 'd3-selection';

import { VisualSettings } from "./settings";
import { axisLeft, descending } from "d3";
import { MAX_VALUE } from "powerbi-visuals-utils-typeutils/lib/double";
import { dataRoleHelper } from "powerbi-visuals-utils-dataviewutils";

import { logExceptions } from "./debugger"


interface verticalLine {
    xscale: number,
    measure1?: number,
    measure2?: number,
    measure3?: number,
    measure4?: number,
}

export class Visual implements IVisual {

    private settings: VisualSettings;
    private container: d3.Selection<HTMLDivElement, any, HTMLDivElement, any>;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
     
            this.container = d3select.select(options.element)
                .append('div')
                    .attr('class', 'divparent') 
    }

    private extractDataRoleData(vals: powerbi.DataViewCategoryColumn[], datarole: string) {
        let table = {}
        let tableData = Object.keys(vals).filter(v => vals[v].source.roles[datarole])
        for (let v of tableData) {
            const data = vals[v]
            for (let roleIndex of data.source["rolesIndex"][datarole]) {
                table[roleIndex] = data.values
            }
        }
        return table
    }

    private extractData(options: VisualUpdateOptions) {
        const index = options.dataViews[0].categorical.categories
        const group = this.extractDataRoleData(index, "columns")
        const tablevalues = this.extractDataRoleData(index, "tablevalues")
        // const measure1 = this.extractDataRoleData(index, "measure1")
        // const measure2 = this.extractDataRoleData(index, "measure2")
        // const measure3 = this.extractDataRoleData(index, "measure3")   
    }

    @logExceptions()
    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            this.container.selectAll('*').remove();
                ;
    
            let dataViews = options.dataViews;    
            console.log('Test 1: Valid data view...');
            if (!dataViews
                || !dataViews[0]
                || !dataViews[0].table
                || !dataViews[0].table.rows
                || !dataViews[0].table.columns
                || !dataViews[0].categorical
                || !dataViews[0].categorical.categories
                || !dataViews[0].categorical.values
                || !dataViews[0].metadata
            ) {
                console.log('Test 1 FAILED. No data to draw table.');
                return;
            }
        
            let table = dataViews[0].table;
            let categorical = dataViews[0].categorical;

            let test_data: verticalLine[] = categorical.categories[0].values.map(
                (category, idx) => { 

                    const x_value = {
                        xscale: <number> category
                    }

                    const field_name = categorical.values.map(x => Object.keys(x.source.roles)).flat()
                    const map_y = categorical.values.map(x => x.values[idx])
                    const y_value = field_name.map((name , idx) => ({[name]: map_y[idx]}))

                    // return{
                    //     x_value,
                    //     y_value
                    // }
                        for( let i = 0; i <= y_value.length; i++){
                            Object.assign(x_value, y_value[i])
                        } 

                    return x_value
                }
            );

            test_data = Object.values(test_data).sort((first,second) => {
                return first.xscale - second.xscale;
            });
            
        //    console.log(test_data)


            // let data: verticalLine[] = categorical.categories[0].values.map(
            //     (category, idx) => { 

            //         return{ 
            //             xscale: <Date> category,
            //             measure1: <number> categorical.values[0].values[idx],
            //             measure2:<number> categorical.values[1].values[idx],
            //             measure3: <number> categorical.values[2].values[idx],
            //             measure4: <number> categorical.values[3].values[idx],
            //         }
            //     }
            // );

            // console.log(data)
        
            var stackBar = this.container
                .append('div')
                    .attr('class', 'stackBar')
                .append('svg')
                    .attr('width',  parseInt(d3.select(".stackBar").style("width")))
                    .attr('height', '100%');
                
             var tablebase = this.container
                .append('table')

            var tHead = tablebase
                .append('tHead')
                .append('tr')

            table.columns.forEach(
                (col) => {
                    tHead
                        .append('th')
                            .text(col.displayName);
                }
            )

            table.rows.forEach(
                (row) => {
                    let tRow = tablebase
                        .append('tr');
                    row.forEach(
                        (col) => {
                            tRow
                                .append('td')
                                    .text(col.toString());
                        }
                    )
                }
            );

            var headerHeight = parseInt(d3.select("table th, tfoot td").style("padding-top")) + 
                parseInt(d3.select("table th, tfoot td").style("padding-bottom")) + 
                parseInt(d3.select("table th").style("font-size")) +
                12 ;

            var margin = {top: 30, right: 23, bottom: 30, left: 25},
            width = options.viewport.width - margin.left - margin.right,
            height = parseInt(d3.select("table").style("height"));

            stackBar.append('rect')
                    .attr('class', 'rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('height', headerHeight - 12)
                    .attr('width', width)

            stackBar.append('text')
                .attr('class', 'label')
                .attr("x", '33%')
                .attr("y", headerHeight / 2)
                    .text('Well Name')

            stackBar.append('g')
                .attr('transform',
                    'translate(' + margin.left + ',' + headerHeight + ')');

            // var subgroups =  categorical.categories[1].values
                // subgroups = dataViewObject.getValue(d3.selectAll(subgroups), "displayName")
            // console.log(subgroups)

            // var groups = d3.map(datastack, function(d){return(d.group)}).keys()

            // var xstack = d3.scaleBand()
            //     .domain(d3.extent(datastack, function(d) { return d.group; }))
            //     .range([0, width])
            //     .padding(0.2)
                
            // stackBar.append("g")
            //     .attr("transform", "translate(0," + height + ")")
            //     .call(d3.axisBottom(xstack).tickSizeOuter(0));

            // var ystack = d3.scaleLinear()
            //     .domain([0, 60])
            //     .range([ height, 0 ]);

            //     stackBar.append("g")
            //     .call(d3.axisLeft(ystack));

            // var color = d3.scaleOrdinal()
            //     .domain(subgroups)
            //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
            
            // var stackedData = d3.stack()
            //     .keys(subgroups)
            //     (data)

            var svgbody = this.container
                .append('div')
                    .attr('class', 'gcontainer')

            // var x = d3.scaleTime()
            //     .domain(d3.extent(data, function(d) { return d.xscale; }))
            //     .range([ 0, height]);

            // var x = d3.scaleBand()
            //     .rangeRound([0, height]);

            // x.domain(test_data.map(function(d) { return d.xscale}))

            var x = d3.scaleLinear()
                .domain([0, d3.max(test_data, function(d) { return +d.xscale; })])
                .range([0, height]);
            

            // console.log( d3.max(test_data, function(d) { return +d.xscale; }))
            console.log( test_data)

            var svgticks1label = categorical.values[0].source.displayName;
            var svgticks2label = categorical.values[1].source.displayName;
            var svgticks3label = categorical.values[2].source.displayName;
            var svgticks4label = categorical.values[3].source.displayName;

            var svg = svgbody
                .append('span')
                    .attr('class', 'gcontainer left')
                .append('svg')
                    .attr('width',  parseInt(d3.select(".left").style("width")))
                    .attr('height', height)
                        
            svg.append('rect')
                .attr('class', 'rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', headerHeight - 12)
                .attr('width', width)
   
            var porpotionySvg =  parseInt(d3.select(".left").style("width")) - margin.right
                  
            var svgY = d3.scaleLinear()
                .domain([0, d3.max(test_data, function(d) { return +d.measure1; })])    
                .range([ 0, porpotionySvg - margin.right]);

            var svgYSecond = d3.scaleLinear()
                .domain([0, d3.max(test_data, function(d) { return +d.measure2; })])
                .range([ 0, porpotionySvg - margin.right]);

            var svgticks1 = svg
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left  + ',' + headerHeight * .85 + ')')
            
            svgticks1.append('g')
                    .call(d3.axisTop(svgY)
                        .ticks(1, ".4n")
                    )
                .append("text") 
                    .attr('class', 'label')
                    .attr('x', porpotionySvg * .43)
                    .attr('y', -25)
                    .text(svgticks1label);
                
            svgticks1.select(".domain")
                .attr("stroke","#E04836")
                .attr('stroke-dasharray', 4)
                .attr("stroke-width","2");

            var svgticks2 =  svg
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight * 0.60 + ')');

            svgticks2.append('g')    
                .attr('class', 'axis')      
                .call(d3.axisTop(svgYSecond).ticks(2, ".4n"))
            .append("text") 
                .attr('class', 'label')
                .attr('x', porpotionySvg * .43)
                .attr('y', -25)
                .text(svgticks2label);

            svgticks2.select(".domain")
                .attr("stroke","#008080")
                .attr("stroke-width","2");

            var svggraph = svg
            .append('g')
                .attr('transform',
                    'translate(' + margin.left + ',' + headerHeight + ')');

            var xticks = svggraph.append('g')
                .call(d3.axisLeft(x).tickSize(-200));

            xticks.select(".domain")
                .attr("stroke","white");

            svggraph.append('path')
                .datum(test_data)
                    .attr('fill', 'none')
                    .attr('stroke', 'red')
                    .attr('stroke-dasharray', 4)
                    .attr('d', d3.line<verticalLine>()
                        .y(function(d) { return x(d.xscale) })
                        .x(function(d) { return svgY(d.measure1) })
                    );
            
            svggraph.append('path')
                .datum(test_data)
                    .attr('fill', 'none')
                    .attr('stroke', '#008080')
                    .attr('stroke-width', 1.5)
                    .attr('d', d3.line<verticalLine>()
                        .y(function(d) { return x(d.xscale) })
                        .x(function(d) { return svgYSecond(d.measure2) })
                    );
            
            /////////////// SVGSecond /////////////////
            var svgSecond = svgbody
                .append('span')
                    .attr('class', 'gcontainer middle')   
                .append('svg')
                    .attr('width',  parseInt(d3.select(".middle").style("width")))
                    .attr('height', height)

            svgSecond.append('rect')
                .attr('class', 'rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', headerHeight - 12)
                .attr('width', width)
            
            var porpotionySvgSecond =  parseInt(d3.select(".middle").style("width")) - margin.right
            
            var svgSecondY = d3.scaleLinear()
                .domain([0, d3.max(test_data, function(d) { return +d.measure3; })])
                .range([ 0, porpotionySvgSecond - margin.right]);

            var svgSecondticks1 = svgSecond
                 .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight * .85  + ')');

            svgSecondticks1.append('g')
                .call(d3.axisTop(svgSecondY).ticks(1))
                .append("text") 
                    .attr('class', 'label')
                    .attr('x', porpotionySvgSecond * .43)
                    .attr('y', -25)
                    .text(svgticks3label);

            svgSecondticks1.select(".domain")
                .attr("stroke","black")
                .attr("stroke-width","2");

            var svggraph = svgSecond
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight + ')');
                
            svggraph.append('path')
                .datum(test_data)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1.5)
                    .attr('d', d3.line<verticalLine>()
                        .y(function(d) { return x(d.xscale) })
                        .x(function(d) { return svgSecondY(d.measure3) })
                    );
            
            /////////////// SVGThird /////////////////

            var svgThird = svgbody
                .append('span')
                    .attr('class', 'gcontainer middle2')    
                .append('svg')
                    .attr('width', parseInt(d3.select(".middle2").style("width")) )
                    .attr('height', height);

            svgThird.append('rect')
                    .attr('class', 'rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('height', headerHeight - 12)
                    .attr('width', width);

            var porpotionySvgThird =  parseInt(d3.select(".middle2").style("width")) - margin.right

            var svgThirdY = d3.scaleLinear()
                .domain([0, d3.max(test_data, function(d) { return +d.measure4; })])
                .range([ 0, porpotionySvgThird - margin.right]);

            var svgThirdtick1 = svgThird
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight * .85 + ')');                

            svgThirdtick1.append('g')
                .call(d3.axisTop(svgThirdY).ticks(2))
            .append("text") 
                .attr('class', 'label')
                .attr('x', porpotionySvgThird * .43)
                .attr('y', -25)
                .text(svgticks4label);

            svgThirdtick1.select(".domain")
                .attr("stroke","blue")
                .attr("stroke-width","2");

            var svggraph = svgThird
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight + ')');

            svggraph.append('path')
                .datum(test_data)
                    .attr('fill', 'none')
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 1.5)
                    .attr('d', d3.line<verticalLine>()
                        .y(function(d) { return x(d.xscale) })
                        .x(function(d) { return svgThirdY(d.measure4) })
                    );
            
            /////////////// SVGFourth /////////////////

            var svgFourth = svgbody
                .append('span')
                    .attr('class', 'gcontainer right')    
                .append('svg')
                    .attr('width', parseInt(d3.select(".right").style("width")) )
                    .attr('height', height);

            svgFourth.append('rect')
                .attr('class', 'rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', headerHeight - 12)
                .attr('width', width);

            var porpotionySvgfourth =  parseInt(d3.select(".right").style("width")) - margin.right

            var svgFourthY = d3.scaleLinear()
                .domain([0, d3.max(test_data, function(d) { return +d.measure4; })])
                .range([ 0, porpotionySvgfourth - margin.right]);

            var svgFourthtick1 = svgFourth
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight * .85 + ')');                

            svgFourthtick1.append('g')
                .call(d3.axisTop(svgFourthY).ticks(2))
            .append("text") 
                .attr('class', 'label')
                .attr('x', porpotionySvgfourth * .43)
                .attr('y', -25)
                .text(svgticks4label);

            svgFourthtick1.select(".domain")
                .attr("stroke","blue")
                .attr("stroke-width","2");

            var svggraph = svgFourth
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + headerHeight + ')');

            svggraph.append('path')
                .datum(test_data)
                    .attr('fill', 'none')
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 1.5)
                    .attr('d', d3.line<verticalLine>()
                        .y(function(d) { return x(d.xscale) })
                        .x(function(d) { return svgThirdY(d.measure4) })
                    );
    }



//     private clear(): void {
//         tableBase.update(initialState);
//     }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}