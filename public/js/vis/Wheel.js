(function() {
  var Wheel;

  Wheel = (function() {
    class Wheel {
      constructor() {
        this.click = this.click.bind(this);
        this.isParentOf = this.isParentOf.bind(this);
        this.fill = this.fill.bind(this);
        this.doText = this.doText.bind(this);
      }

      ready(pane, spec, data) {
        return Util.noop(pane, spec, data);
      }

      create(pane, spec, divId, url) {
        Util.noop(pane, spec);
        this.url = url;
        this.width = pane.geo.w;
        this.height = pane.geo.h;
        this.radius = Math.min(this.width, this.height) / 2;
        this.xx = d3.scaleLinear().range([0, 2 * Math.PI]);
        //yy     = d3.scaleSqrt()  .range([ 0, @radius   ] )
        this.yy = d3.scalePow().exponent(1.3).domain([0, 1]).range([0, this.radius]);
        this.formatNumber = d3.format(",d");
        this.padding = 5;
        this.duration = 1000;
        this.div = d3.select('#' + divId);
        this.vis = this.div.append("svg").attr("width", this.width + this.padding * 2).attr("height", this.height + this.padding * 2).append("g").attr("transform", "translate(" + [this.width / 2 + this.padding, this.height / 2 + this.padding] + ")");
        this.partition = d3.partition();
        this.arc = d3.arc().startAngle((d) => {
          return Math.max(0, Math.min(2 * Math.PI, this.xx(d.x0)));
        }).endAngle((d) => {
          return Math.max(0, Math.min(2 * Math.PI, this.xx(d.x1)));
        }).innerRadius((d) => {
          return Math.max(0, this.yy(d.y0));
        }).outerRadius((d) => {
          return Math.max(0, this.yy(d.y1));
        });
        return d3.json(this.url, (error, json) => {
          var nodes, root;
          if (error) {
            throw error;
          }
          root = d3.hierarchy(json);
          root.sum(function(d) {
            if (d.value != null) {
              return d.value;
            } else {
              return 1;
            }
          });
          nodes = this.partition(root).descendants();
          //console.log( 'nodes', nodes )
          this.vis.selectAll("path").data(nodes).enter().append("path").attr("id", function(d, i) {
            if (d != null) {
              return "path-" + i;
            } else {
              return "path-" + i;
            }
          }).attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", (d) => {
            return this.fill(d.data);
          }).on("click", this.click).append("title").text((d) => {
            return d.data.name + "\n" + this.formatNumber(d.value);
          });
          this.doText(nodes);
          return d3.select(self.frameElement).style("height", this.height + "px");
        });
      }

      click(d) {
        return this.vis.transition().duration(this.duration).tween("scale", () => {
          var xd, yd, yr;
          xd = d3.interpolate(this.xx.domain(), [d.x0, d.x1]);
          yd = d3.interpolate(this.yy.domain(), [d.y0, 1]);
          yr = d3.interpolate(this.yy.range(), [(d.y0 != null ? 20 : 0), this.radius]);
          return (t) => {
            this.xx.domain(xd(t));
            return this.yy.domain(yd(t)).range(yr(t));
          };
        }).selectAll("path").attrTween("d", (d) => {
          return () => {
            return this.arc(d);
          };
        });
      }

      // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
      brightness(rgb) {
        return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
      }

      isParentOf(p, c) {
        if (p === c) {
          return true;
        }
        if (p.children) {
          return p.children.some((d) => {
            return this.isParentOf(d, c);
          });
        }
        return false;
      }

      fill(d) {
        var a, b, colours;
        //console.log( 'fill', d, d.data )
        if (d.fill != null) {
          return d.fill;
        } else if (d.colour) {
          return d.colour;
        } else if (d.children) {
          colours = d.children.map(this.fill);
          a = d3.hsl(colours[0]);
          b = d3.hsl(colours[1]);
          // L*a*b* might be better here...
          return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
        } else {
          return '#666666';
        }
      }

      doText(nodes) {
        this.text = this.vis.selectAll('text').data(nodes);
        //.on('click', @click)
        this.textEnter = this.text.enter().append('text').style('fill-opacity', 1).style('fill', (d) => {
          if (this.brightness(d3.rgb(this.fill(d.data))) < 125) {
            return '#eee';
          } else {
            return '#000';
          }
        }).attr('text-anchor', (d) => {
          if (this.xx((d.x0 + d.x1) / 2) > Math.PI) {
            return 'end';
          } else {
            return 'start';
          }
        }).attr('dy', '.2em').attr('transform', (d) => {
          var angle, multiline, rotate;
          multiline = (d.data.name || '').split(' ').length > 1;
          angle = this.xx((d.x0 + d.x1) / 2) * 180 / Math.PI - 90;
          rotate = angle + (multiline ? -.5 : 0);
          return 'rotate(' + rotate + ')translate(' + this.yy(d.y0) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
        });
        this.textEnter.append('tspan').attr('x', 0).text((d) => {
          if (d.depth) {
            return d.data.name.split(' ')[0];
          } else {
            return '';
          }
        });
        this.textEnter.append('tspan').attr('x', 0).attr('dy', '1em').text((d) => {
          if ((d.depth != null) && (d.data.name != null)) {
            return d.data.name.split(' ')[1] || '';
          } else {
            return '';
          }
        });
      }

    };

    Vis.Wheel = Wheel;

    return Wheel;

  }).call(this);

}).call(this);
