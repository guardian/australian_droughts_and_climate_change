import * as d3 from 'd3'
import { Toolbelt } from './toolbelt'
import { $, $$, round, numberWithCommas, wait, getDimensions } from '../modules/util'
import chroma from 'chroma-js'
import * as topojson from "topojson" //npm install topojson --no-bin-links
import '../modules/raf'
import smoothscroll from 'smoothscroll-polyfill';
import { videoPlayer } from '../modules/video'

smoothscroll.polyfill();

export class Climate {

	constructor() {

	    this.screenWidth = window.innerWidth;

	    this.screenHeight = window.innerHeight;

		this.latitude = -28.5

		this.longitude = 133

		this.position = -1

		this.path = '<%= path %>/assets/'

		videoPlayer.init()

		this.smallScreen = this.screenTest()

		//var scale = chroma.scale(['red' , 'yellow', 'green', 'blue']).domain([min, max], 10, 'log');

		this.triggers = [{
			"file" : null,
			"topic" : "Control vizualization position",
			"v1" : "trigger_add_sticky_viz",
			"v2" : "trigger_remove_sticky_viz",
			"v3" : "trigger_remove_sticky_viz",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : false
		},{
			"file" : "<%= path %>/assets/maps/graze",
			"topic" : "Map of farmland",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : ['#f6d787' , '#c7d799'],
			"key" : ["Crop growing areas","Irrigated pastures for grazing"],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/no-graze",
			"topic" : "Map of farmland and native vegetation used for grazing",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : ['#f6d787' , '#c7d799', '#ffbce8'],
			"key" : ["Crop growing areas","Irrigated pastures for grazing","Native vegetation for grazing"],
			"rewind" : true
		},{
			"file" : null,
			"topic" : "Specer",
			"v1" : false,
			"v2" : false,
			"v3" : false,
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : false
		},{
			"file" : "<%= path %>/assets/maps/2013",
			"topic" : "Map of rainfall deficiency 2013",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/2014",
			"topic" : "Map of rainfall deficiency 2014",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/2015",
			"topic" : "Map of rainfall deficiency 2015",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/2016",
			"topic" : "Map of rainfall deficiency 2016",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/2017",
			"topic" : "Map of rainfall deficiency 2017",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/2018",
			"topic" : "Map of rainfall deficiency 2018",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : "<%= path %>/assets/maps/soil",
			"topic" : "Map of soil moisture",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_image_map",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : null,
			"topic" : "Reset",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_hide",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : false
		},{
			"file" : "settlement",
			"topic" : "The Settlement drought (1790-1793)",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_draught_maps",
			"v4" : false,
			"position" : 0,
			"colours" : ['#475ca8','#8183be','#d3d4ea','white','#e9c3bd', '#df7f7f', '#dc4145'],
			"key" : ['highest on record', 'very much above average', 'above average', 'average', 'below average', 'very much below average', 'lowest on record'],
			"rewind" : true
		},{
			"file" : "sturts",
			"topic" : "Sturt's drought (1809-1830)",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_draught_maps",
			"v4" : false,
			"position" : 0,
			"colours" : ['#475ca8','#8183be','#d3d4ea','white','#e9c3bd', '#df7f7f', '#dc4145'],
			"key" : ['highest on record', 'very much above average', 'above average', 'average', 'below average', 'very much below average', 'lowest on record'],
			"rewind" : false
		},{
			"file" : "great",
			"topic" : "The Great drought (1809-1814)",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_draught_maps",
			"v4" : false,
			"position" : 0,
			"colours" : ['#475ca8','#8183be','#d3d4ea','white','#e9c3bd', '#df7f7f', '#dc4145'],
			"key" : ['highest on record', 'very much above average', 'above average', 'average', 'below average', 'very much below average', 'lowest on record'],
			"rewind" : true
		},{
			"file" : "goyderline",
			"topic" : "The Goyder line drought (1861-1866)",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_draught_maps",
			"v4" : false,
			"position" : 0,
			"colours" : ['#475ca8','#8183be','#d3d4ea','white','#e9c3bd', '#df7f7f', '#dc4145'],
			"key" : ['highest on record', 'very much above average', 'above average', 'average', 'below average', 'very much below average', 'lowest on record'],
			"rewind" : true
		},{
			"file" : "federation",
			"topic" : "Federation drought (1895-1903)",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_draught_maps",
			"v4" : false,
			"position" : 0,
			"colours" : ['#475ca8','#8183be','#d3d4ea','white','#e9c3bd', '#df7f7f', '#dc4145'],
			"key" : ['highest on record', 'very much above average', 'above average', 'average', 'below average', 'very much below average', 'lowest on record'],
			"rewind" : true
		},{
			"file" : null,
			"topic" : "Trigger timeline",
			"v1" : "trigger_add_sticky_timeline",
			"v2" : "trigger_remove_sticky_timeline",
			"v3" : false,
			"v4" : false,
			"position" : 0,
			"colours" : ['#f6d787' , '#c7d799', '#ffbce8'],
			"key" : [],
			"rewind" : false
		},{
			"file" : null,
			"topic" : "Reset",
			"v1" : false,
			"v2" : "trigger_timeline_close",
			"v3" : "trigger_timeline_open",
			"v4" : "trigger_timeline_open",
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : false
		},{
			"file" : "drought",
			"topic" : "Map showing where drought will increase",
			"v1" : false,
			"v2" : false,
			"v3" : false,
			"v4" : "trigger_vector_map",
			"position" : 0,
			"colours" : ['white', '#f49d75', '#c12c38'],
			"key" : [],
			"rewind" : true
		},{
			"file" : "drought",
			"topic" : "Map showing where drought will increase",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_vector_map",
			"v4" : false,
			"position" : 0,
			"colours" : ['white', '#f49d75', '#c12c38'],
			"key" : [],
			"rewind" : true
		},{
			"file" : "rainfall",
			"topic" : "Map showing where rainfall will decrease",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_vector_map",
			"v4" : false,
			"position" : 0,
			"colours" : ['white', '#f49d75', '#c12c38'],
			"key" : [],
			"rewind" : true
		},{
			"file" : "temperature",
			"topic" : "Map shoiwng where temperature will increase",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_vector_map",
			"v4" : false,
			"position" : 0,
			"colours" : ['#c12c38','#c12c38'],
			"key" : [],
			"rewind" : true
		},{
			"file" : null,
			"topic" : "Reset",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_hide",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : true
		},{
			"file" : null,
			"topic" : "Reset",
			"v1" : false,
			"v2" : false,
			"v3" : "trigger_hide",
			"v4" : false,
			"position" : 0,
			"colours" : [],
			"key" : [],
			"rewind" : false
		}]

		this.loadData()

	}

	loadData() {

		var self = this

		this.scrollTo($("#app"))

		this.resize()

		var files = ["<%= path %>/assets/json/NRM_clusters.json","<%= path %>/assets/json/NRM_sub_clusters.json","<%= path %>/assets/json/anomolies.json","<%= path %>/assets/json/temp.json","https://interactive.guim.co.uk/docsdata/1Z6G0Hfrb2_YQmFyfXkXe0epHIBZrES2KpaqGmItHTgU.json"];
		
		var promises = [];

		files.forEach(function(url, index) {

		    promises.push(d3.json(url))

		});

		Promise.all(promises).then(function(values) {

		    self.NRM_clusters = values[0]

		    self.NRM_sub_clusters = values[1]

		    self.anomolies = values[2]

		    for (var i = 0; i < self.anomolies.length; i++) {

		    	self.anomolies[i].year = self.anomolies[i].year.toString().slice(0, 4)

		    }

		    self.temp = values[3]

		    for (var i = 0; i < self.temp.length; i++) {

		    	self.temp[i].year = self.temp[i].year.toString().slice(0, 4)

		    }

		    self.database = values[4].sheets

		    self.setup()

		});

	}

    screenTest() {

        return (window.innerWidth < 740) ? true : false ;

    }

    resize() {

        var self = this

        // Detect when a user has stopped resizing the browser window and trigger the appropriate action

        window.addEventListener("resize", function() {

            clearTimeout(document.body.data)

            document.body.data = setTimeout( function() { 

                var now = (window.innerWidth < 740) ? true : false ;

                if ( now != self.smallScreen ) {

                    //self.resizeReset(now);
                    
                    //(now) ? self.removeCanvas() : self.createCanvas();
                }

                self.smallScreenn = now

            }, 200);

        });

    }

	setup() {

		var self = this

	    d3.selection.prototype.moveToFront = function() {  
	      return this.each(function(){
	        this.parentNode.appendChild(this);
	      });
	    };

	    d3.selection.prototype.moveToBack = function() {  
	        return this.each(function() { 
	            var firstChild = this.parentNode.firstChild; 
	            if (firstChild) { 
	                this.parentNode.insertBefore(this, firstChild); 
	            } 
	        });
	    };

		// Set up the anomolies chart

		var unit = getDimensions($("#anomolies_block"))[0] / 6

	    var widthAnomolies = getDimensions($("#anomolies_block"))[0]

	    var heightAnomolies = widthAnomolies * 4 ;

	    var margintop = (self.smallScreen) ? 10 : 80 ;

		var marginAnomolies = { top: margintop, right: 5, bottom: 0, left: 5 }

		var xScale = (self.smallScreen) ? widthAnomolies : unit * 4 ;

		this.xScale = d3.scaleLinear()
			.range([0, xScale -10]);

		this.yScale = d3.scaleBand()
			.rangeRound([0, heightAnomolies])
			.paddingInner(0.1);

		this.xScale.domain([-250, 250]);

		this.yScale.domain(self.anomolies.map(function(d) { return d.year; }));

		var xAxis = d3.axisBottom().scale(self.xScale)

		var yAxis = d3.axisLeft().scale(self.yScale)

		var svgAnomolies = d3.select("#anomolies_block")
			.append("svg")
			.attr("width", widthAnomolies)
			.attr("height", heightAnomolies + marginAnomolies.top + marginAnomolies.bottom)
			.append("g")
			.attr("id","timeline")
			.attr("transform", "translate(" + marginAnomolies.left + "," + marginAnomolies.top + ")");

		svgAnomolies.selectAll(".bar")
			.data(self.anomolies)
			.enter()
			.append("rect")
			.attr("class", function(d) { return "bar anomolies--" + (d.rainfall < 0 ? "negative" : "positive"); })
			.attr("x", function(d) { return self.xScale(Math.min(0, d.rainfall)); })
			.attr("y", function(d) { return self.yScale(d.year); })
			.attr("width", function(d) { return Math.abs(self.xScale(d.rainfall) - self.xScale(0)); })
			.attr("height", self.yScale.bandwidth())

		svgAnomolies.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightAnomolies + ")")  
			.call(xAxis);

		svgAnomolies.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0,0)")  
			.call(xAxis);

		var dashed = [ -250, -200, -150, -100, -50, 50, 100, 150, 200, 250 ]

		for (var i = 0; i < dashed.length; i++) {

			svgAnomolies.append("line")
				.attr("x1", self.xScale(dashed[i]))
				.attr("y1", 0)
				.attr("x2", self.xScale(dashed[i]))
				.attr("y2", heightAnomolies)
				.attr("stroke-width", 1)
				.attr("stroke", "lightgrey")
				.attr("stroke-dasharray", "2")
			
		}

		// Federation Drought (1895–1903) 
		var drought1 = svgAnomolies.append("rect")
		.attr("x", 0)
		.attr("y", self.yScale(1900))
		.attr("width", widthAnomolies)
		.attr("height", self.yScale(1904) - self.yScale(1900))
		.attr("fill", "#ff8c00")
		.attr("opacity", 0.1)

		drought1.moveToBack();

		svgAnomolies.append("text")
			        .attr("x", (unit * 4) + 20)             
			        .attr("y", self.yScale(1900) + 20)
			        .attr("class", "drought_labels")
			        .attr("text-anchor", "left")  
			        .text("Federation Drought (1895–1903)");  

		// World War II (1935–1945) 
		var drought2 = svgAnomolies.append("rect")
		.attr("x", 0)
		.attr("y", self.yScale(1935))
		.attr("width", widthAnomolies)
		.attr("height", self.yScale(1946) - self.yScale(1935))
		.attr("fill", "#ff8c00")
		.attr("opacity", 0.1)

		drought2.moveToBack();

		svgAnomolies.append("text")
			        .attr("x", (unit * 4) + 20)             
			        .attr("y", self.yScale(1935) + 20)
			        .attr("class", "drought_labels")
			        .attr("text-anchor", "left")  
			        .text("World War II Drought (1935–1945)");  

		// Millennium Drought (1997–2009) 
		var drought3 = svgAnomolies.append("rect")
		.attr("x", 0)
		.attr("y", self.yScale(1997))
		.attr("width", widthAnomolies)
		.attr("height", self.yScale(2010) - self.yScale(1997))
		.attr("fill", "#ff8c00")
		.attr("opacity", 0.1)

		drought3.moveToBack();

		svgAnomolies.append("text")
			        .attr("x", (unit * 4) + 20)             
			        .attr("y", self.yScale(1997) + 20)
			        .attr("class", "drought_labels")
			        .attr("text-anchor", "left")  
			        .text("Millennium Drought (1997–2009)");  

		var tickNegative = svgAnomolies.append("g")
							.attr("class", "y axis")
							.attr("transform", "translate(" + self.xScale(0) + ",0)")
							.call(yAxis)
								.selectAll(".tick")
								.filter(function(d, i) { return self.anomolies[i].rainfall < 0; });

		tickNegative.select("line")
		  .attr("x2", 6);

		tickNegative.select("text")
		  .attr("x", 9)
		  .style("text-anchor", "start");

		function type(d) {
			d.rainfall = +d.rainfall;
			return d;
		}

		// Add canvas above timeline to display the arrows of time
		this.createCanvas()

		// Set up the Temp chart

	    var widthTemp = getDimensions($("#temp_block"))[0]

	    var heightTemp = widthAnomolies * 4

		var marginTemp = { top: 0, right: 5, bottom: 0, left: 5 }

		var xWidthScale = d3.scaleLinear()
			.range([0, widthTemp - 15]);

		var yWidthScale = d3.scaleBand()
			.rangeRound([0, heightTemp])
			.paddingInner(0.1);

		xWidthScale.domain([-1.4, 1.4]);

		yWidthScale.domain(self.temp.map(function(d) { return d.year; }));

		var xWidthAxis = d3.axisBottom().scale(xWidthScale)

		var yWidthAxis = d3.axisLeft().scale(yWidthScale)

		var svgTemp = d3.select("#temp_block")
			.append("svg")
			.attr("width", widthTemp)
			.attr("height", heightTemp + marginTemp.top + marginTemp.bottom)
			.append("g")
			.attr("transform", "translate(" + marginTemp.left + "," + marginTemp.top + ")");

		svgTemp.selectAll(".bar")
			.data(self.temp)
			.enter()
			.append("rect")
			.attr("class", function(d) { return "bar bar--" + (d.temp < 0 ? "negative" : "positive"); })
			.attr("x", function(d) { return xWidthScale(Math.min(0, d.temp)); })
			.attr("y", function(d) { return yWidthScale(d.year); })
			.attr("width", function(d) { return Math.abs(xWidthScale(d.temp) - xWidthScale(0)); })
			.attr("height", yWidthScale.bandwidth())

		svgTemp.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightTemp + ")")  
			.call(xWidthAxis);

		svgTemp.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0,0)")  
			.call(xWidthAxis);

		var dashedTemp = [ -1.4, -1.2, -1, -0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4 ]

		for (var i = 0; i < dashedTemp.length; i++) {

			svgTemp.append("line")
				.attr("x1", xWidthScale(dashedTemp[i]))
				.attr("y1", 0)
				.attr("x2", xWidthScale(dashedTemp[i]))
				.attr("y2", heightTemp)
				.attr("stroke-width", 1)
				.attr("stroke", "lightgrey")
				.attr("stroke-dasharray", "2")
			
		}

		var tickNegativeTemp = svgTemp.append("g")
							.attr("class", "y axis")
							.attr("transform", "translate(" + xWidthScale(0) + ",0)")
							.call(yWidthAxis)
								.selectAll(".tick")
								.filter(function(d, i) { return self.temp[i].temp < 0; });

		tickNegativeTemp.select("line")
		  .attr("x2", 4);

		tickNegativeTemp.select("text")
		  .attr("x", 4)
		  .style("text-anchor", "start");


		// Set up the map

	    var widthMap = document.querySelector("#map").getBoundingClientRect().width
	    
	    var heightMap = widthMap

	    var marginMap = {top: 0, right: 0, bottom: 0, left:0}

	    var projection = d3.geoMercator()
	                    .center([self.longitude, self.latitude])
	                    .scale(widthMap * 1.15)
	                    .translate([widthMap / 2, heightMap / 2])

	    var pathMap = d3.geoPath().projection(projection);

	    var svgMap = d3.select("#map").append("svg")
		            .attr("width", widthMap)
		            .attr("height", heightMap)
		            .attr("overflow", "hidden")

		this.NRM_clusters_boundaries = svgMap.append("g")
			.selectAll("path")
			.data(topojson.feature(self.NRM_clusters, self.NRM_clusters.objects.NRM_clusters).features)
			.enter().append("path")
			  .attr("d", pathMap)
			  .style("opacity", 0)
			  .style("stroke-width","1")
			  .style("stroke","darkgrey")


		this.NRM_sub_clusters_boundaries = svgMap.append("g")
			.selectAll("path")
			.data(topojson.feature(self.NRM_sub_clusters, self.NRM_sub_clusters.objects.NRM_sub_clusters).features)
			.enter().append("path")
			  .attr("d", pathMap)
			  .style("opacity", 0)
			  .style("stroke-width","1")
			  .style("stroke","darkgrey")

		d3.select("#map")
				.append('div')
				.attr("class", "chart_titles")
				.style('position','absolute')
				.style('top', "20px")
				.style('left', "0px")
				.style('width', (widthMap) + "px")
				.style('min-height', 100 + "px")

		d3.select("#map")
			.append('div')
				.attr("class", "keybox")
				.style('position','absolute')
				.style('top', ( (heightMap / 100 * 90) - 250 ) + "px")
				.style('left', "0px")
				.style('width', (widthMap / 100 * 60) + "px")
				.style('min-height', 100 + "px")

		this.trigger_image_map(1)

		var triggers = document.getElementsByClassName("trigger");

		for (var i = 0; i < triggers.length; i++) {
			triggers[i].innerHTML = self.triggers[i].topic
		}

		videoPlayer.initScroll()

		this.renderLoop()

	}

    cancelAFrame() {

        var self = this
            
        if (self.requestAnimationFrame) {
           window.cancelAnimationFrame(self.requestAnimationFrame);
           self.requestAnimationFrame = undefined;
        }

    }

    createCanvas() {

        var self = this

        var canvas = document.createElement('canvas');
        canvas.id = "arrow_of_time";
        canvas.width = getDimensions($("#anomolies_block"))[0]
        canvas.height = d3.select("#timeline").node().getBoundingClientRect().height + 80//getDimensions($("#anomolies_block"))[1]
        this.canvas_container = document.getElementById("canvas_container"); 
        this.canvas_container.appendChild(canvas)
        this.canvas = document.getElementById("arrow_of_time");
        this.ctx= this.canvas.getContext("2d");

    }

    removeCanvas() {

        var self = this

        // Remove render iframe
        if (self.requestAnimationFrame) {
           window.cancelAnimationFrame(self.requestAnimationFrame);
           self.requestAnimationFrame = undefined;
        }

        // Remove canvas
        d3.select("#arrow_of_time").remove()

        console.log("The canvas has been removed")

    }

    renderBoxes(year, y) {

    	var self = this

    	if (self.smallScreen) {

    		let width = d3.select("#timeline").node().getBoundingClientRect().width

			this.ctx.beginPath();
			this.ctx.moveTo(0,self.yScale(year)+15);
			this.ctx.lineTo(width,self.yScale(year)+15);
			this.ctx.stroke();


    	} else {

	    	var originY = self.yScale(year) + 90
	    	var originX = self.xScale(40)
	    	var destY = y + 310
	    	var destX = originX + 420

			//  Draw Curve
			this.ctx.beginPath();
			this.ctx.moveTo(originX,originY);
			this.ctx.quadraticCurveTo(destX, originY, destX, destY);
			this.ctx.stroke();

    	}


   

    }

    renderLoop() {

        var self = this

        this.requestAnimationFrame = requestAnimationFrame( function() {

        	var pageYOffset = window.pageYOffset ;

        	self.forward = (pageYOffset > self.pageYOffset) ? true : false ;

        	self.pageYOffset = pageYOffset ;

            var triggers = document.getElementsByClassName("trigger");

            var zone = window.innerHeight / 100 * 20

            for (var i = 0; i < triggers.length; i++) {

                var elementTop = window.pageYOffset + triggers[i].getBoundingClientRect().top

                var elementTBottom = window.pageYOffset + triggers[i].getBoundingClientRect().bottom

                let target = self.triggers[i]

                if (elementTop > (window.pageYOffset - zone) && elementTBottom < ( window.pageYOffset + window.innerHeight + zone) ) {

                	// Watch the bottom of the viewport for stuff that is just entering the viewport

                	if (elementTop > (window.pageYOffset + window.innerHeight - zone) && elementTop < ( window.pageYOffset + window.innerHeight) ) {

                		// Position 3

	                	if (target.position != 3) {

	                		target.position = 3

	                		// console.log("Forward: " + self.forward)

	                		if (target.v3 && self.forward) {

	                			self[target.v3](i);
	    
	                		}

	                	}              	

	               	}

                	// Watch the bottom of the viewport for stuff that is just outside the viewport

                	if (elementTop > (window.pageYOffset + window.innerHeight) && elementTop < ( window.pageYOffset + window.innerHeight + zone) ) {

                		// Position 4

	                	if (target.position != 4) {

	                		target.position = 4

	                		if (target.v4 && self.forward) {

	                			self[target.v4](i);

	                		}

	                		if (!self.forward && i > 0) {

	                			if (self.triggers[i-1].v3 && self.triggers[i-1].rewind ) {

	                				self[self.triggers[i-1].v3](i - 1);

	                			}
	                			
	                		}

	                	}

	               	}


	               	// Watch the top of the viewport for stuff just leaving the viewport

                	if (elementTBottom > (window.pageYOffset - zone) && elementTBottom < ( window.pageYOffset) ) {

                		// Position 1

	                	if (target.position != 1) {

	                		target.position = 1

	                		if (target.v1) {

	                			self[target.v1](i);

	                		}

	                	}

	               	}

	               	// Watch the top of the viewport for stuff just leaving the viewport

                	if (elementTBottom > (window.pageYOffset) && elementTBottom < ( window.pageYOffset + zone) ) {

                		// Position 2

	                	if (target.position != 2) {

	                		target.position = 2

	                		if (target.v2) {

	                			self[target.v2](i);

	                		}

	                	}

	               	}  

                }

            }

			var timelineHeight = d3.select("#timeline").node().getBoundingClientRect().height - 70 //getDimensions($("#anomolies_block"))[1] - zone

			var pixelsPerYear = timelineHeight / 140

            var timelineTop = window.pageYOffset + $("#anomolies_block").getBoundingClientRect().top

            var timelineBottom = timelineTop + timelineHeight

        	if (window.pageYOffset > timelineTop && ( window.pageYOffset + window.innerHeight) < ( timelineBottom + (window.innerHeight) )) {

        		var timescale = Math.floor( ( window.pageYOffset - timelineTop ) / pixelsPerYear)

        		var currentYear = timescale + 1900

        		if (self.currentYear != currentYear && currentYear < 2018) {
        			self.currentYear = currentYear
        			$("#timeline_map").style.display = "block"
        			$("#timeline_map").style.backgroundImage = "url('" + self.path + "timeline/" + currentYear + ".jpg')";
        			$("#timeline_year").innerHTML = currentYear;
        			self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        			self.renderBoxes(currentYear, (window.pageYOffset - timelineTop))
        		}

        		if (currentYear > 2018) {
        			$("#timeline_map").style.display = "none"
        			self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        		}

           	}

            self.renderLoop()

        })

    }

	trigger_add_sticky_viz(id) {

		var element = $('.vizualization');

		element.classList.add("graph-scroll-fixed");

	}

	trigger_remove_sticky_viz(id) {

		var element = $('.vizualization');

		element.classList.remove("graph-scroll-fixed");

	}

	trigger_draught_maps(id) {

		var self = this

		$("#image_inside").style.display = "none"

		var targets = self.triggers[id].file

		function clean(string) {

		    var txt = string.trim().toLowerCase()

		    txt = txt.replace(/[^a-zA-Z\d\s:]/gi, '')

		    txt = txt.replace(/\s\s+/g, ' ');

		    return txt

		}

		function colouriser(label) {

			var cluster = self.database[targets].find( (item) => {

			    return clean(item.cluster) === clean(label)

			});

			var index = self.triggers[id].key.findIndex( (item) => {

			    return item === cluster.decile;

			});

			return self.triggers[id].colours[index]

		}

		var html = "<ul><li><strong>Key</strong></li>" ;

		for (var i = 0; i < self.triggers[id].key.length; i++) {

			html += '<li><div style="background-color:' + self.triggers[id].colours[i] + '"></div>' + self.triggers[id].key[i] + "</li>"
			
		}

		html += "<ul>"

		$('.keybox').innerHTML = html

		this.NRM_clusters_boundaries.style("fill", function(d) { return colouriser(d.properties.label)})

		this.NRM_clusters_boundaries.style("opacity", 1)

		$('.chart_titles').innerHTML = self.triggers[id].topic

	}

	trigger_add_sticky_timeline(id) {

		console.log("Now add_sticky_timeline")

		$('.anomolies_header').classList.add("graph-scroll-fixed");

		$('#timeline_map').classList.add("timeline-scroll-fixed");

		$('.keybox').innerHTML = ""

		$('.chart_titles').innerHTML = ""

	}

	trigger_remove_sticky_timeline(id) {

		var self = this

		$('.anomolies_header').classList.remove("graph-scroll-fixed");

		$("#timeline_map").style.display = "none"

		self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

	}

	trigger_map_add_sticky_timeline(id) {

		$('#timeline_map').classList.add("timeline-scroll-fixed");

		this.NRM_clusters_boundaries.style("opacity", 0)
	}

	trigger_map_remove_sticky_timeline(id) {
		
		$('#timeline_map').classList.remove("timeline-scroll-fixed");

	}

	trigger_timeline_open(id) {

		this.NRM_clusters_boundaries.style("opacity", 0)

		$('#timeline_map').classList.add("timeline-scroll-fixed");

		$('.anomolies_header').classList.add("graph-scroll-fixed");

	}

	trigger_timeline_close(id) {

		console.log("Closing timeline")

		this.NRM_clusters_boundaries.style("opacity", 1)

		$('#timeline_map').classList.remove("timeline-scroll-fixed");

		$('.anomolies_header').classList.remove("graph-scroll-fixed");

	}

	trigger_image_map(id) {

		var self = this

		this.NRM_sub_clusters_boundaries.style("opacity", 0)

		this.NRM_clusters_boundaries.style("opacity", 0)

		$("#image_inside").style.display = "block"

		$("#image_inside").style.backgroundImage = "url('" + self.triggers[id].file + ".jpg')";

		var html = ""

		if (self.triggers[id].key.length > 0) {

			html += "<ul><li><strong>Key</strong></li>" ;

			for (var i = 0; i < self.triggers[id].key.length; i++) {

				html += '<li><div style="background-color:' + self.triggers[id].colours[i] + '"></div>' + self.triggers[id].key[i] + "</li>"

			}

			html += "<ul>"

		}

		$('.keybox').innerHTML = html

		$('.chart_titles').innerHTML = self.triggers[id].topic

	}

	trigger_vector_map(id) {

		var self = this

		$("#image_inside").style.display = "none"

		var targets = self.triggers[id].file

		for (var i = 0; i < self.database.climate.length; i++) {

			(self.triggers[id].key.indexOf(self.database.climate[i][targets + "_category"]) === -1) ? self.triggers[id].key.push(self.database.climate[i][targets + "_category"]) : "" ;
			
		}

		function clean(string) {

		    var txt = string.trim().toLowerCase()

		    txt = txt.replace(/[^a-zA-Z\d\s:]/gi, '')

		    txt = txt.replace(/\s\s+/g, ' ');

		    return txt

		}

		function colouriser(label) {

			var cluster = self.database.climate.find( (item) => {

			    return clean(item.sub_cluster) === clean(label)

			});

			var index = self.triggers[id].key.findIndex( (item) => {

			    return item === cluster[targets + "_category"];

			});

			return self.triggers[id].colours[index]

		}

		var html = "<ul><li><strong>Key</strong></li>" ;

		for (var i = 0; i < self.triggers[id].key.length; i++) {

			html += '<li><div style="background-color:' + self.triggers[id].colours[i] + '"></div>' + self.triggers[id].key[i] + "</li>"

		}

		html += "<ul>"

		$('.keybox').innerHTML = html

		this.NRM_sub_clusters_boundaries.style("fill", function(d) { return colouriser(d.properties.label)})

		this.NRM_sub_clusters_boundaries.style("opacity", 1)

		$('.chart_titles').innerHTML = self.triggers[id].topic


	}

	trigger_hide(id) {

		this.NRM_sub_clusters_boundaries.style("opacity", 0)

		this.NRM_clusters_boundaries.style("opacity", 0)

		$("#timeline_map").style.display = "none"

		$("#image_inside").style.display = "none"

		$('.chart_titles').innerHTML = ""

		$('.keybox').innerHTML = ""

	}

    scrollTo(element) {

        var self = this

        setTimeout(function() {

            var elementTop = window.pageYOffset + element.getBoundingClientRect().top

            window.scroll({
              top: elementTop,
              behavior: "smooth"
            });

        }, 400);

    }
}