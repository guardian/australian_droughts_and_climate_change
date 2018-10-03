import template from '../../templates/lite.html'
import * as d3 from 'd3'
import { $, $$, round, numberWithCommas, wait, getDimensions } from '../modules/util'
import Ractive from 'ractive'
import '../modules/raf'
import share from '../modules/share'

Ractive.DEBUG = false;



export class Climate {

	constructor() {

		var self = this

	    this.screenWidth = window.innerWidth;

	    this.screenHeight = window.innerHeight;

	    this.loadData()

	}

	loadData() {

		var self = this

		var files = ["https://interactive.guim.co.uk/docsdata/1Z6G0Hfrb2_YQmFyfXkXe0epHIBZrES2KpaqGmItHTgU.json"];
		
		var promises = [];

		files.forEach(function(url, index) {

		    promises.push(d3.json(url))

		});

		Promise.all(promises).then(function(values) {

		    self.database = values[1].sheets

		    self.ractivate()

		});

	}

    ractivate() {

        var self = this

        this.ractive = new Ractive({
            el: '#climate_interactive',
            data: self.settings,
            template: template
        })

        this.setup()

        this.ractive.on( 'social', function ( context, channel ) {

            var title = "The new normal? How climate change is making droughts worse" ;

            var params = (channel==='facebook') ? 'fb' : 'tw' ;

            var message = 'The new normal? How climate change is making droughts worse.'

            let sharegeneral = share(title, "http://theguardian.com/environment/ng-interactive/2018/oct/03/the-new-normal-how-climate-change-is-making-droughts-worse", 'https://media.guim.co.uk/5f26d0bb63fc4eb96b20a5ec97f047a95d7456a7/0_0_1000_600/1000.jpg', '', '#TheNewNormal', message);

            sharegeneral(channel);

        });

        this.resize()

    }

    resize() {

        var self = this

        // Detect when a user has stopped resizing the browser window and trigger the appropriate action

        window.addEventListener("resize", function() {

            clearTimeout(document.body.data)

            document.body.data = setTimeout( function() { 


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

	    var margintop = 10

		var marginAnomolies = { top: margintop, right: 5, bottom: 0, left: 5 }

		var xScale = widthAnomolies

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

	}

}