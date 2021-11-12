// Data
const dataFile = './boston_311.csv';

// Dimensions
const WIDTH = 800;
const HEIGHT = 600;
const MARGIN = { TOP: 30, BOTTOM: 30, LEFT: 300, RIGHT: 30 };

// Set up canvas
const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  .append('g')
  .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// Parse data
d3.csv(dataFile).then((data) => {
  // Sort data
  const dataSorted = data.sort((a, b) =>
    d3.descending(Number(a.total_count), Number(b.total_count))
  );

  // Scales
  const max = d3.max(dataSorted, (d) => Number(d.total_count));
  const x = d3.scaleLinear().domain([0, max]).range([0, WIDTH]);

  const y = d3
    .scaleBand()
    .domain(dataSorted.map((d) => d.Name))
    .range([0, HEIGHT])
    .padding(0.15);

  const xAxisCall = d3.axisTop(x).ticks(6);
  svg.append('g').transition().duration(1000).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y);
  svg
    .append('g')
    .transition()
    .duration(1000)
    .attr('id', 'y-axis')
    .call(yAxisCall);

  // Mouse Event
  const mouseover = function (event, d) {
    d3.select(this).style('opacity', 1);
    d3.select('#tooltip')
      .style('left', event.pageX + 'px')
      .style('top', event.pageY + 'px')
      .html(`<p> Total 311 Request: ${d.total_count}</p>`);
    d3.select('#tooltip').classed('hidden', false);
  };

  const mouseout = function (d) {
    d3.select(this).style('opacity', 0.8);
    d3.select('#tooltip').classed('hidden', true);
  };

  // Rectangles
  const rects = svg.selectAll('rect').data(dataSorted);
  rects
    .enter()
    .append('rect')
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
    .attr('x', 0)
    .attr('y', (d) => y(d.Name))

    .attr('height', y.bandwidth)
    .attr('fill', 'teal')
    .style('opacity', 0.5)

    .transition()
    .duration(1000)
    .attr('width', (d) => x(d.total_count))
    .attr('fill', 'teal')
    .ease(d3.easeQuadIn)
    .style('opacity', 0.8)
    .delay(function (d, i) {
      return i * 40;
    });
});
