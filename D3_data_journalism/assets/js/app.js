function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("assets/data/data.csv").then(function(journData) {
        // parse data
        journData.forEach(function(data) {
          data.healthcare = +data.healthcare;
          data.poverty  = +data.poverty;
        });
        // create scales
        var xScale= d3.scaleLinear()
            .domain([d3.min(journData, d=>d.poverty)*0.9, 
            d3.max(journData, d => d.poverty)*1.1])
            .range([0, width]);
  
        var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(journData, d => d.healthcare)* 1.1])
          .range([height, 0]);
  
        // create axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yLinearScale);
  
        // append axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);
  
        chartGroup.append("g")
          .call(yAxis);
  
        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
          .data(journData)
          .enter()
          .append("circle")
          .attr("cx", d => xScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "12")
          .classed("stateCircle", true)
          .attr("opacity", "0.5")

        // append text
        chartGroup.selectAll("text")
            .data(journData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("dy",4)
            .attr("class", "stateText")
            .attr("text-anchor","middle")
            .attr("font-size","8px");

        

        // append a label for y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 -margin.left + 45)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")   
            .attr("class", "aText")
            .attr("fill"," #000")
            .text("Lacks Healthcare(%)");

        // append a label for x axis
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .attr("class", "aText")
            .text("In Poverty (%)");

        

    }).catch(function(error) {
        console.log(error);
    });
}
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  
