(function() {
  var Wheel;

  Wheel = (function() {
    class Wheel {
      constructor() {
        this.click = this.click.bind(this);
        // Interpolate the scales!
        this.arcTween = this.arcTween.bind(this);
        this.maxY = this.maxY.bind(this);
        this.isParentOf = this.isParentOf.bind(this);
        this.colour = this.colour.bind(this);
      }

      ready(pane, spec, data) {
        return Util.noop(pane, spec, data);
      }

      create(pane, spec, divId, url) {
        Util.noop(pane, spec);
        this.url = url;
        this.width = 1330;
        this.height = 660;
        this.radius = Math.min(this.width, this.height) / 2;
        this.xx = d3.scale.linear().range([0, 2 * Math.PI]);
        this.yy = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, this.radius]);
        this.padding = 5;
        this.duration = 1000;
        this.div = d3.select('#' + divId);
        this.vis = this.div.append("svg").attr("width", this.width + this.padding * 2).attr("height", this.height + this.padding * 2).append("g").attr("transform", "translate(" + [this.width / 2 + this.padding, this.height / 2 + this.padding] + ")");
        this.partition = d3.layout.partition().sort(null).value(function(d) {
          return 5.8 - d.depth;
        });
        this.arc = d3.svg.arc().startAngle((d) => {
          return Math.max(0, Math.min(2 * Math.PI, this.xx(d.x)));
        }).endAngle((d) => {
          return Math.max(0, Math.min(2 * Math.PI, this.xx(d.x + d.dx)));
        }).innerRadius((d) => {
          return Math.max(0, d.y != null ? this.yy(d.y) : d.y);
        }).outerRadius((d) => {
          return Math.max(0, this.yy(d.y + d.dy));
        });
        return d3.json(this.url, (error, json) => {
          this.nodes = this.partition.nodes({
            children: json
          });
          this.path = this.vis.selectAll('path').data(this.nodes);
          this.path.enter().append("path").attr("id", function(d, i) {
            return "path-" + i;
          }).attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", this.colour);
          //.on("click",   @click  )
          this.text = this.vis.selectAll('text').data(this.nodes);
          //.on('click', @click)
          this.textEnter = this.text.enter().append('text').style('fill-opacity', 1).style('fill', (d) => {
            if (this.brightness(d3.rgb(this.colour(d))) < 125) {
              return '#eee';
            } else {
              return '#000';
            }
          }).attr('text-anchor', (d) => {
            if (this.xx(d.x + d.dx / 2) > Math.PI) {
              return 'end';
            } else {
              return 'start';
            }
          }).attr('dy', '.2em').attr('transform', (d) => {
            var angle, multiline, rotate;
            multiline = (d.name || '').split(' ').length > 1;
            angle = this.xx(d.x + d.dx / 2) * 180 / Math.PI - 90;
            rotate = angle + (multiline ? -.5 : 0);
            return 'rotate(' + rotate + ')translate(' + this.yy(d.y) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
          });
          this.textEnter.append('tspan').attr('x', 0).text((d) => {
            if (d.depth) {
              return d.name.split(' ')[0];
            } else {
              return '';
            }
          });
          this.textEnter.append('tspan').attr('x', 0).attr('dy', '1em').text((d) => {
            if ((d.depth != null) && (d.name != null)) {
              return d.name.split(' ')[1] || '';
            } else {
              return '';
            }
          });
        });
      }

      click(d) {
        this.path.transition().duration(this.duration).attrTween('d', this.arcTween(d));
        // Somewhat of a hack as we rely on arcTween updating the scales.
        this.text.style('visibility', (e) => {
          if (this.isParentOf(d, e)) {
            return null;
          } else {
            return d3.select(this.text).style('visibility');
          }
        }).transition().duration(this.duration).attrTween('text-anchor', function(d) {
          return () => {
            if (this.xx(d.x + d.dx / 2) > Math.PI) {
              return 'end';
            } else {
              return 'start';
            }
          };
        }).attrTween('transform', (d) => {
          var multiline;
          multiline = (d.name || '').split(' ').length > 1;
          return () => {
            var angle, rotate;
            angle = this.xx(d.x + d.dx / 2) * 180 / Math.PI - 90;
            rotate = angle + (multiline ? -.5 : 0);
            return 'rotate(' + rotate + ')translate(' + this.yy(d.y) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
          };
        }).style('fill-opacity', (e) => {
          if (this.isParentOf(d, e)) {
            return 1;
          } else {
            return 1e-6;
          }
        }).each('end', (e) => {
          return d3.select(this.text).style('visibility', this.isParentOf(d, e) ? null : 'hidden');
        });
      }

      arcTween(d) {
        var ifdy, my, xd, yd, yr;
        my = this.maxY(d);
        ifdy = function(v) {
          if (v != null) {
            return 20;
          } else {
            return 0;
          }
        };
        xd = d3.interpolate(this.xx.domain(), [d.x, d.x + d.dx]);
        yd = d3.interpolate(this.yy.domain(), [d.y, my]);
        yr = d3.interpolate(this.yy.range(), [ifdy(d.y), this.radius]);
        return (d) => {
          return (t) => {
            this.xx.domain(xd(t));
            this.yy.domain(yd(t)).range(yr(t));
            return this.arc(d);
          };
        };
      }

      maxY(d) {
        if (d.children) {
          return Math.max.apply(Math, d.children.map(this.maxY));
        } else {
          return d.y + d.dy;
        }
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

      colour(d) {
        var a, b, colours;
        if (d.fill != null) {
          return d.fill;
        } else if (d.colour) {
          return d.colour;
        } else if (d.children) {
          colours = d.children.map(this.colour);
          a = d3.hsl(colours[0]);
          b = d3.hsl(colours[1]);
          // L*a*b* might be better here...
          return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
        } else {
          return '#fff';
        }
      }

    };

    Vis.Wheel = Wheel;

    return Wheel;

  }).call(this);

}).call(this);
