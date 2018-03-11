(function() {
  var Wheel;

  Wheel = (function() {
    class Wheel {
      constructor() {
        this.isParentOf = this.isParentOf.bind(this);
        this.fill = this.fill.bind(this);
        this.doText = this.doText.bind(this);
        // Distort the specified node to 80% of its parent.
        this.magnify = this.magnify.bind(this);
        this.zoomTween = this.zoomTween.bind(this);
        this.zoom = this.zoom.bind(this);
      }

      ready(pane, spec, data) {
        return Util.noop(pane, spec, data);
      }

      create(pane, spec, divId, url, scale = 1.0) {
        Util.noop(spec);
        this.url = url;
        this.width = pane.geo.w;
        this.height = pane.geo.h;
        this.radius = Math.min(this.width, this.height) * scale / 2;
        this.xx = d3.scaleLinear().range([0, 2 * Math.PI]);
        //yy     = d3.scaleSqrt()  .range([ 0, @radius   ] )
        this.yy = d3.scalePow().exponent(1.3).domain([0, 1]).range([
          0,
          this.radius // 1.3
        ]);
        this.formatNumber = d3.format(",d");
        this.padding = 5;
        this.duration = 1000;
        this.div = d3.select('#' + divId);
        this.vis = this.div.append("svg").attr("width", this.width + this.padding * 2).attr("height", this.height + this.padding * 2).append("g").attr("transform", "translate(" + [this.width / 2 + this.padding, this.height / 2 + this.padding] + ")");
        this.partition = d3.partition();
        this.arc = d3.arc().startAngle((d) => {
          return Math.max(0, Math.min(2 * Math.PI, this.xx(this.x0(d))));
        }).endAngle((d) => {
          return Math.max(0, Math.min(2 * Math.PI, this.xx(this.x1(d))));
        }).innerRadius((d) => {
          return Math.max(0, this.yy(d.y0));
        }).outerRadius((d) => {
          return Math.max(0, this.yy(d.y1));
        });
        d3.json(this.url, (error, json) => {
          if (error) {
            throw error;
          }
          this.root = d3.hierarchy(json);
          this.root.sum(function(d) {
            if (d.children != null) {
              return 0;
            } else {
              return 1;
            }
          });
          this.nodes = this.partition(this.root).descendants();
          //console.log( 'nodes', @nodes )
          this.path = this.vis.selectAll("path").data(this.nodes).enter().append("path").attr("id", function(d, i) {
            if (d != null) {
              return "path-" + i;
            } else {
              return "path-" + i;
            }
          }).attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", (d) => {
            return this.fill(d.data);
          }).on("click", this.zoomTween).append("title").text((d) => {
            return d.data.name + "\n" + this.formatNumber(d.value);
          });
          return this.doText(this.nodes);
        });
        return d3.select(self.frameElement).style("height", this.height + "px");
      }

      x0(d) {
        if (d.m0 != null) {
          return d.m0;
        } else {
          return d.x0;
        }
      }

      x1(d) {
        if (d.m1 != null) {
          return d.m1;
        } else {
          return d.x1;
        }
      }

      sameNode(a, b) {
        return a.data.name === b.data.name;
      }

      click(d) {
        return console.log('click', d.data.name, parent.data.name);
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
        var angle, xem;
        this.text = this.vis.selectAll('text').data(nodes);
        this.textEnter = this.text.enter().append('text').style('fill-opacity', 1).on('click', this.zoomTween).style('fill', (d) => {
          if (this.brightness(d3.rgb(this.fill(d.data))) < 125) {
            return '#eee';
          } else {
            return '#000';
          }
        }).attr('text-anchor', (d) => {
          if (this.xx((this.x0(d) + this.x1(d)) / 2) > Math.PI) {
            return 'end';
          } else {
            return 'start';
          }
        }).attr('dy', '.2em').attr('transform', (d) => {
          var angle, multiline, rotate;
          multiline = (d.data.name || '').split(' ').length > 1;
          angle = this.xx((this.x0(d) + this.x1(d)) / 2) * 180 / Math.PI - 90;
          rotate = angle + (multiline ? -.5 : 0);
          return 'rotate(' + rotate + ')translate(' + this.yy(d.y0) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
        });
        angle = (d) => {
          return this.xx((this.x0(d) + this.x1(d)) / 2) * 180 / Math.PI;
        };
        xem = function(d) {
          if (angle(d) <= 180) {
            return '1em';
          } else {
            return '-1em';
          }
        };
        this.textEnter.append('tspan').attr('x', function(d) {
          return xem(d);
        }).text(function(d) {
          if (d.depth) {
            return d.data.name.split(' ')[0];
          } else {
            return '';
          }
        });
        this.textEnter.append('tspan').attr('x', function(d) {
          return xem(d);
        }).attr('dy', '1em').text(function(d) {
          if ((d.depth != null) && (d.data.name != null)) {
            return d.data.name.split(' ')[1] || '';
          } else {
            return '';
          }
        });
      }

      magnify(d) {
        var dd, ds, n, parent, rd, x0, x1;
        parent = d.parent;
        console.log('magnify', d.data.name, parent.data.name);
        if ((parent != null) && (parent.children != null)) {
          n = parent.children.length;
          x0 = parent.children[0].x0;
          x1 = parent.children[n - 1].x1;
          rd = 0.5;
          dd = (x1 - x0) * rd;
          ds = (x1 - x0) * (1.0 - rd) / n;
          //console.log( 'magnify parent', { name:parent.data.name, x0:x0, x1:x1, dd:dd, ds:ds } )
          parent.children.forEach((sibling) => {
            x1 += this.sameNode(d, sibling) ? dd : ds;
            sibling.m0 = x0;
            sibling.m1 = x1;
            //console.log( 'magnify sibling', { name:sibling.data.name, m0:sibling.x0, m1:sibling.x1, x0:sibling.m0, x1:sibling.m1 } )
            return x0 = x1;
          });
        }
        this.vis.selectAll('path').transition().duration(this.duration).attr("d", this.arc); //.data(parent.children)
        this.doText(this.nodes);
      }

      zoomTween(d) {
        return this.vis.transition().duration(this.duration).tween("scale", () => {
          var xd, yd, yr;
          xd = d3.interpolate(this.xx.domain(), [this.x0(d), this.x1(d)]);
          yd = d3.interpolate(this.yy.domain(), [d.y0, 1]);
          yr = d3.interpolate(this.yy.range(), [(d.y0 != null ? 20 : 0), this.radius]);
          return (t) => {
            this.xx.domain(xd(t));
            return this.yy.domain(yd(t)).range(yr(t));
          };
        //attrTween( "d", (a) => ( () => if a.data.name is d.data.name then @arc(a) ) )
        }).selectAll("path").attrTween("d", (a) => {
          return () => {
            return this.arc(a);
          };
        });
      }

      zoom(d) {
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

    };

    Vis.Wheel = Wheel;

    return Wheel;

  }).call(this);

}).call(this);
