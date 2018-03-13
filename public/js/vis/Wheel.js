(function() {
  var Wheel;

  Wheel = (function() {
    class Wheel {
      constructor() {
        this.xc = this.xc.bind(this);
        this.yc = this.yc.bind(this);
        this.isParentOf = this.isParentOf.bind(this);
        this.fill = this.fill.bind(this);
        this.doText = this.doText.bind(this);
        this.magnify = this.magnify.bind(this);
        this.textTransform = this.textTransform.bind(this);
        this.zoomTween = this.zoomTween.bind(this);
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
          return Math.max(0, this.yy(this.y0(d)));
        }).outerRadius((d) => {
          return Math.max(0, this.yy(this.y1(d)));
        });
        d3.json(this.url, (error, json) => {
          if (error) {
            throw error;
          }
          this.root = d3.hierarchy(json);
          this.root.sum(function(d) {
            d.selected = 'false';
            if (d.children != null) {
              return 0;
            } else {
              return 1;
            }
          });
          this.nodes = this.partition(this.root).descendants();
          this.path = this.vis.selectAll("path").data(this.nodes).enter().append("path").attr("id", function(d, i) {
            if (d != null) {
              return "path-" + i;
            } else {
              return "path-" + i;
            }
          }).attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", (d) => {
            return this.fill(d.data);
          }).on("click", (d) => {
            return this.magnify(d, 'click');
          }).on("mouseover", (d) => {
            return this.magnify(d, 'mouseover');
          }).on("mouseout", (d) => {
            return this.magnify(d, 'mouseout');
          }).append("title").text(function(d) {
            return d.data.name;
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

      y0(d) {
        if (d.n0 != null) {
          return d.n0;
        } else {
          return d.y0;
        }
      }

      y1(d) {
        if (d.n1 != null) {
          return d.n1;
        } else {
          return d.y1;
        }
      }

      xc(d) {
        return (this.x0(d) + this.x1(d)) / 2;
      }

      yc(d) {
        return (this.y0(d) + this.y1(d)) / 2;
      }

      sameNode(a, b) {
        return (a != null ? a.data.name : void 0) === (b != null ? b.data.name : void 0);
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
        this.textEnter = this.text.enter().append('text').on("click", (d) => {
          return this.magnify(d, 'click');
        }).on("mouseover", (d) => {
          return this.magnify(d, 'mouseover');
        }).on("mouseout", (d) => {
          return this.magnify(d, 'mouseout');
        }).style("font-size", "9pt").style('fill-opacity', 1).style('fill', (d) => {
          if (this.brightness(d3.rgb(this.fill(d.data))) < 125) {
            return '#eee';
          } else {
            return '#000';
          }
        }).attr('text-anchor', (d) => {
          if (this.xx(this.xc(d)) > Math.PI) {
            return 'end';
          } else {
            return 'start';
          }
        }).attr('dy', '.2em').attr('transform', (d) => {
          return this.textTransform(d);
        });
        angle = (d) => {
          return this.xx(this.xc(d)) * 180 / Math.PI;
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
        this.textEnter.append("title").text(function(d) {
          return d.data.name;
        });
      }

      onClick(d) {
        return this.magnify(d, 'click');
      }

      onMouseover(d) {
        return this.magnify(d, 'mouseover');
      }

      onMouseout(d) {
        return this.magnify(d, 'mouseout');
      }

      magnifySibling(sibling, eventType, x0, y0, x1, y1) {
        var op;
        op = eventType === 'click' ? (sibling.selected = sibling.selected ? false : true, sibling.selected ? 'magnify' : 'normal') : eventType === 'mouseover' ? 'magnify' : eventType === 'mouseout' ? sibling.selected ? 'magnify' : 'normal' : void 0;
        if (op === 'magnify') {
          sibling.m0 = x0;
          sibling.m1 = x1;
          sibling.n0 = y0;
          sibling.n1 = y1;
        } else {
          sibling.m0 = void 0;
          sibling.m1 = void 0;
          sibling.n0 = void 0;
          sibling.n1 = void 0;
        }
        return sibling;
      }

      magnify(d, eventType) {
        var dd, ds, n, parent, x0, x1, y0;
        parent = d.parent;
        if ((parent != null) && (parent.children != null) && (d.children == null)) {
          console.log('magnify', d.data.name, parent.data.name);
          n = parent.children.length;
          x0 = parent.children[0].x0;
          x1 = parent.children[n - 1].x1;
          dd = (d.x1 - d.x0) * 2;
          ds = (x1 - x0 - dd) / (n - 1);
          x1 = x0;
          y0 = d.y0;
          parent.children.forEach((sibling) => {
            var y1;
            x1 = this.sameNode(d, sibling) ? x1 + dd : x1 + ds;
            y1 = this.sameNode(d, sibling) ? d.y1 + (d.y1 - d.y0) * 0.9 : d.y1;
            sibling = this.magnifySibling(sibling, eventType, x0, y0, x1, y1);
            return x0 = x1;
          });
          this.vis.selectAll('path').data(this.nodes).filter((p) => {
            return this.sameNode(p.parent, parent);
          }).transition().duration(this.duration).attr("d", this.arc);
          this.vis.selectAll('text').data(this.nodes).filter((t) => {
            return this.sameNode(t.parent, parent);
          }).transition().duration(this.duration).attr("transform", (t) => {
            return this.textTransform(t);
          }).style("font-size", (t) => {
            if (this.sameNode(t, d) && (t.m0 != null)) {
              return '15pt';
            } else {
              return '9pt';
            }
          });
        }
      }

      textTransform(d) {
        var angle, multiline, rotate;
        multiline = (d.data.name || '').split(' ').length > 1;
        angle = this.xx(this.xc(d)) * 180 / Math.PI - 90;
        rotate = angle + (multiline ? -.5 : 0);
        return 'rotate(' + rotate + ')translate(' + this.yy(this.y0(d)) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
      }

      zoomTween(d) {
        return this.vis.transition().duration(this.duration).tween("scale", () => {
          var xd, yd, yr;
          xd = d3.interpolate(this.xx.domain(), [this.x0(d), this.x1(d)]);
          yd = d3.interpolate(this.yy.domain(), [this.y0(d), 1]);
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
