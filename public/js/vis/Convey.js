import Util    from '../util/Util.js';
import Vis     from '../vis/Vis.js';
var Convey;

Convey = class Convey {
  constructor(defs1, g, x, y, w, h) {
    this.doData = this.doData.bind(this);
    this.sankeyLink = this.sankeyLink.bind(this);
    this.defs = defs1;
    this.g = g;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.uom = '';
    this.nw = 24;
    this.np = 0;
    this.showLabel = false;
    this.gradientX(this.defs, 'WhiteBlack', 'white', 'black');
    this.gc = this.g.append("g");
  }

  doData(graph) {
    this.sankey = this.createSankey();
    this.graph = this.sankey(graph);
    [this.linkSvg, this.nodeSvg] = this.doSankey(this.sankey, this.graph);
  }

  createSankey() {
    var sankey;
    sankey = d3.sankey().nodeWidth(this.nw).nodePadding(this.np).extent([[this.x, this.y], [this.x + this.w, this.y + this.h]]);
    sankey.link = this.sankeyLink;
    return sankey;
  }

  sankeyLink(d) {
    var curvature, x0, x1, x2, x3, xi, y0, y1;
    curvature = .5;
    x0 = d.source.x1;
    x1 = d.target.x0;
    xi = d3.interpolateNumber(x0, x1);
    x2 = xi(curvature);
    x3 = xi(1 - curvature);
    y0 = d.y0;
    y1 = d.y1 + 0.1; // 0.1 prevents a pure horizontal line that did not respond to color gradients
    return 'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1;
  }

  doSankey(sankey, graph) {
    var linkSvg, nodeSvg;
    sankey.nodes(graph.nodes).links(graph.links);
    //console.log( 'Node', node ) for node in graph.nodes
    linkSvg = this.doLinks(graph);
    nodeSvg = this.doNodes(graph);
    return [linkSvg, nodeSvg];
  }

  // .attr( "stroke", "url(#WhiteBlack)" ).attr( "fill","none")#
  doLinks(graph) {
    var d, gLink, gLinks, i, id, len, ref;
    gLinks = this.gc.append("svg:g");
    ref = graph.links;
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      //console.log( 'Convey.doLinks() d', d )
      id = d.source.name + d.target.name;
      this.gradientX(this.defs, id, d.source.color, d.target.color);
      gLink = gLinks.append("svg:g").attr("stroke", `url(#${id})`).attr("fill", "none");
      //sort( (a, b) -> (b.y1-b.y0) - (a.y1-a.y0) )
      gLink.append("svg:path").attr("d", this.sankey.link(d)).style("stroke-width", 1).append("title").text(d.source.name + " → " + d.target.name); //.attr("class", "link")
    }
    return gLinks;
  }

  doNodes(graph) {
    var node;
    node = this.gc.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
      return Vis.translate(d.x0, d.y0);
    });
    node.append("rect").attr("height", function(d) {
      return d.y1 - d.y0;
    }).attr("width", this.sankey.nodeWidth()).attr("fill", (d) => {
      return d.color;
    }).append("title").text((d) => {
      return d.name; //  + "\n" + d.value
    });
    if (this.showLabel) {
      node.append("text").attr("x", -6).attr("y", function(d) {
        return (d.y1 - d.y0) / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").text(function(d) {
        return d.name;
      }).filter((d) => {
        return d['x'] < this.w / 2;
      }).attr("x", 6 + this.sankey.nodeWidth()).attr("text-anchor", "start");
    }
    return node;
  }

  gradientX(defs, id, color1, color2) {
    var grad;
    grad = defs.append("svg:linearGradient");
    grad.attr("id", id).attr("y1", "0%").attr("y2", "0%").attr("x1", "0%").attr("x2", "100%");
    grad.append("svg:stop").attr("offset", "10%").attr("stop-color", color1);
    grad.append("svg:stop").attr("offset", "90%").attr("stop-color", color2);
  }

};

export default Convey;
