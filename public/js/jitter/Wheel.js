var Wheel;

Wheel = class Wheel {
  constructor(publish, opacity) {
    this.adjustRadius = this.adjustRadius.bind(this);
    this.xc = this.xc.bind(this);
    this.yc = this.yc.bind(this);
    this.isParentOf = this.isParentOf.bind(this);
    // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
    // brightness:( rgb ) ->
    //   rgb.r * .299 + rgb.g * .587 + rgb.b * .114
    this.fill = this.fill.bind(this);
    this.doText = this.doText.bind(this);
    // eventType is click mouseover mouseout AddChoice DelChoice
    //textEnter.append("title").text( (d) -> d.data.name )
    this.onEvent = this.onEvent.bind(this);
    this.fontSize = this.fontSize.bind(this);
    this.fontSizeVMin = this.fontSizeVMin.bind(this);
    // eventType is click mouseover mouseout AddChoice DelChoice
    this.doChoiceResize = this.doChoiceResize.bind(this);
    this.textTransform = this.textTransform.bind(this);
    this.displayAllLeaves = this.displayAllLeaves.bind(this);
    this.zoomTween = this.zoomTween.bind(this);
    this.publish = publish;
    this.opacity = opacity;
    this.showAllLeaves = false;
    this.radiusFactorChoice = 1.3;
    this.radiusFactorChild = 1.0;
    this.d3 = window['d3'];
  }

  resize() {
    var geom, h, sc, sx, sy, w, xc, yc;
    geom = this.pane.geom();
    w = geom.w;
    h = geom.h;
    sx = w / this.width;
    sy = h / this.height;
    sc = Math.min(sx, sy);
    xc = w / 2;
    yc = h / 2;
    this.svg.attr("width", w).attr("height", h);
    this.g.transition().attr("transform", `translate(${xc},${yc}) scale(${sc})`);
  }

  ready(pane, spec, elem, url, scale = 1.0) {
    var div, geom, h, w, xc, yc;
    this.spec = spec;
    this.pane = pane;
    this.url = url;
    this.json = {};
    geom = this.pane.geom();
    this.width = geom.w;
    this.height = geom.h;
    this.radius = Math.min(this.width, this.height) * scale / 2;
    this.xx = this.d3.scaleLinear().range([0, 2 * Math.PI]);
    this.yy = this.d3.scalePow().exponent(1.3).domain([0, 1]).range([
      0,
      this.radius // 1.3
    ]);
    // @formatNumber = @d3.format(",d")
    this.padding = 0;
    this.duration = 300;
    this.lookup = {};
    div = this.d3.select(elem);
    w = this.width;
    h = this.height;
    xc = this.width / 2;
    yc = this.height / 2;
    this.svg = div.append("svg").attr("width", w).attr("height", h);
    this.g = this.svg.append("g").attr("transform", `translate(${xc},${yc}) scale(1,1)`);
    this.g.append("text").text("Flavor").attr('x', -32).attr('y', 12).style('fill', 'black').style("font-size", "3vmin");
    this.partition = this.d3.partition();
    this.arc = this.d3.arc().startAngle((d) => {
      return Math.max(0, Math.min(2 * Math.PI, this.xx(this.x0(d))));
    }).endAngle((d) => {
      return Math.max(0, Math.min(2 * Math.PI, this.xx(this.x1(d))));
    }).innerRadius((d) => {
      return Math.max(0, this.yy(this.y0(d)));
    }).outerRadius((d) => {
      return Math.max(0, this.yy(this.y1(d)));
    });
    this.d3.json(this.url).then((json) => {
      this.json = json;
      this.root = this.d3.hierarchy(json);
      this.root.sum((d) => {
        d.chosen = false;
        d.hide = this.isLeaf(d);
        if (this.isBranch(d)) {
          return 0;
        } else {
          return 1;
        }
      });
      this.nodes = this.partition(this.root).descendants();
      this.adjustRadius(this.root);
      this.path = this.g.selectAll("path").data(this.nodes).enter().append("path").attr("id", function(d, i) {
        if (d != null) {
          return "path-" + i;
        } else {
          return "path-" + i;
        }
      }).attr("d", this.arc).attr("fill-rule", "evenodd").style("fill", (d) => {
        return this.fill(d);
      }).style("opacity", this.opacity).style("stroke", 'black').style("stroke-width", '2').style("display", function(d) {
        if (d.data.hide) {
          return "none";
        } else {
          return "block";
        }
      }).on("click", (d) => {
        return this.onEvent(d, 'click');
      }).on("mouseover", (d) => {
        return this.onEvent(d, 'mouseover');
      }).on("mouseout", (d) => {
        return this.onEvent(d, 'mouseout');
      });
      //append("title").text( (d) -> d.data.name )
      return this.doText(this.nodes);
    });
    this.d3.select(self.frameElement).style("height", this.height + "px");
  }

  adjustRadius(d) {
    var dy, sc;
    this.lookup[d.data.name] = d;
    sc = d['data'].scale != null ? d['data'].scale : d.children == null ? 0.8 : 1.0;
    dy = (d.y1 - d.y0) * sc;
    if (d.parent != null) {
      d.y0 = d.parent.y1;
    }
    d.y1 = d.y0 + dy;
    if (d.children != null) {
      d.children.forEach((child) => {
        return this.adjustRadius(child);
      });
    }
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

  inBranch(branch, elem) {
    var child, j, len, ref;
    if ((branch != null ? branch.data.name : void 0) === (elem != null ? elem.data.name : void 0)) {
      return true;
    }
    if (branch.children != null) {
      ref = branch != null ? branch.children : void 0;
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        if ((child != null ? child.data.name : void 0) === (elem != null ? elem.data.name : void 0)) {
          return true;
        }
      }
    }
    return false;
  }

  isBranch(d) {
    return d.children != null;
  }

  isLeaf(d) {
    return d.children == null;
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
    // console.log( 'fill', d )
    if ((d.data.fill != null) && (d.children != null)) {
      return d.data.fill;
    } else if ((d.data.fill != null) && (d.children == null) && (d.parent != null) && (d.parent.data.fill != null)) {
      return d.parent.data.fill;
    } else if (d.children != null) {
      colours = d.children.map(this.fill);
      a = this.d3.hsl(colours[0]);
      b = this.d3.hsl(colours[1]);
      // L*a*b* might be better here...
      return this.d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
    } else {
      return '#666666';
    }
  }

  doText(nodes) {
    var angle, xem;
    this.text = this.g.selectAll('text').data(nodes);
    this.textEnter = this.text.enter().append('text').on("click", (d) => {
      return this.onEvent(d, 'click');
    }).on("mouseover", (d) => {
      return this.onEvent(d, 'mouseover');
    }).on("mouseout", (d) => {
      return this.onEvent(d, 'mouseout');
    }).style("font-size", (t) => {
      return this.fontSize(t);
    //style('fill',       (d) => if @brightness( @d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
    }).style('opacity', 1).style('fill', '#000000').style('font-weight', 900).style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
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
  }

  onEvent(d, eventType) {
    var cy0, py0, py1, resize;
    if (eventType === 'click' && (d.parent == null)) {
      this.displayAllLeaves();
    }
    if (d.data['can'] == null) {
      return;
    }
    //console.log( 'onEvent', d ) if eventType is 'click'
    py0 = d.y0;
    py1 = d.y0 + (d.y1 - d.y0) * this.radiusFactorChoice;
    resize = this.doChoiceResize(d, eventType, d.x0, py0, d.x1, py1);
    cy0 = resize ? py1 : d.y1;
    if (d.children != null) {
      d.children.forEach((child) => {
        var cy1;
        if (child != null) {
          child.data.hide = resize;
        }
        cy1 = cy0 + (child['y1'] - child['y0']) * this.radiusFactorChild;
        return this.resizeElem(child, resize, child['x0'], cy0, child['x1'], cy1);
      });
    }
    this.g.selectAll('path').data(this.nodes).filter((e) => {
      return this.inBranch(d, e);
    }).transition().duration(this.duration).style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
      }
    //style( "stroke",        "black" )
    //style( "stroke-width", "0.2vim" )
    }).attr("d", this.arc);
    this.g.selectAll('text').data(this.nodes).filter((e) => {
      return this.inBranch(d, e);
    }).transition().duration(this.duration).attr("transform", (t) => {
      return this.textTransform(t);
    }).style("font-size", (t) => {
      return this.fontSize(t, d);
    }).style("display", function(d) {
      if (d.data.hide) {
        return "none";
      } else {
        return "block";
      }
    });
  }

  fontSize(t, d = null) {
    if ((d != null) && this.sameNode(t, d) && (t.m0 != null)) {
      return '1.5em';
    } else {
      if (t.children != null) {
        return '1.1em';
      } else {
        return '0.9em';
      }
    }
  }

  fontSizeVMin(t, d = null) {
    if ((d != null) && this.sameNode(t, d) && (t.m0 != null)) {
      return '2.2vmin';
    } else {
      if (t.children != null) {
        return '1.8vmin';
      } else {
        return '1.7vmin';
      }
    }
  }

  doChoiceResize(elem, eventType, x0, y0, x1, y1) {
    var resizeChild;
    resizeChild = true;
    if (eventType === 'click') {
      elem.chosen = !elem.chosen;
      this.resizeElem(elem, elem.chosen, x0, y0, x1, y1);
      // This publish function is supplied to the constructor
      // elem.chosen is true/false for add/del
      // elem.data.name is the flavor
      this.publish(elem.chosen, elem.data.name, this.getRoastValue(elem.data.name));
      resizeChild = elem.chosen;
    } else if (eventType === 'AddChoice' || eventType === 'DelChoice') {
      elem.chosen = eventType === 'AddChoice';
      this.resizeElem(elem, elem.chosen, x0, y0, x1, y1);
      resizeChild = elem.chosen;
    // Mouse event do not affect chosen elements
    } else if (!elem.chosen && (eventType === 'mouseover' || eventType === 'mouseout')) {
      resizeChild = eventType === 'mouseover';
      this.resizeElem(elem, resizeChild, x0, y0, x1, y1);
    }
    //console.log( "Wheel.doChoiceResize()", { flavor:elem.data.name, eventType:eventType, resizeChild:resizeChild } )
    return resizeChild;
  }

  resizeElem(elem, resize, x0, y0, x1, y1) {
    if (resize) {
      elem.m0 = x0;
      elem.m1 = x1;
      elem.n0 = y0;
      elem.n1 = y1;
      elem.data.hide = false;
    } else {
      elem.m0 = void 0;
      elem.m1 = void 0;
      elem.n0 = void 0;
      elem.n1 = void 0;
      elem.data.hide = !((elem.data.children != null) || this.showAllLeaves) ? true : false;
    }
  }

  textTransform(d) {
    var angle, multiline, rotate;
    multiline = (d.data.name || '').split(' ').length > 1;
    angle = this.xx(this.xc(d)) * 180 / Math.PI - 90;
    rotate = angle + (multiline ? -.5 : 0);
    return 'rotate(' + rotate + ')translate(' + this.yy(this.y0(d)) + this.padding + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
  }

  displayAllLeaves() {
    this.showAllLeaves = !this.showAllLeaves;
    this.g.selectAll("path").style("display", (d) => {
      if (this.isLeaf(d) && !this.showAllLeaves && !d.parent.chosen) {
        return "none";
      } else {
        return "block";
      }
    });
    this.g.selectAll('text').style("display", (d) => {
      if (this.isLeaf(d) && !this.showAllLeaves && !d.parent.chosen) {
        return "none";
      } else {
        return "block";
      }
    });
  }

  zoomTween(d) {
    this.svg.transition().duration(this.duration).tween("scale", () => {
      var xd, yd, yr;
      xd = this.d3.interpolate(this.xx.domain(), [this.x0(d), this.x1(d)]);
      yd = this.d3.interpolate(this.yy.domain(), [this.y0(d), 1]);
      yr = this.d3.interpolate(this.yy.range(), [(d.y0 != null ? 20 : 0), this.radius]);
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

  getFlavor(data, name, match) {
    var child, flavor, j, len, ref;
    if (data.children != null) {
      ref = data.children;
      for (j = 0, len = ref.length; j < len; j++) {
        flavor = ref[j];
        if (match(flavor)) {
          return flavor;
        }
        child = this.getFlavor(flavor, name, match);
        if (child != null) {
          return child;
        }
      }
    }
    return null;
  }

  getRoastValue(name) {
    var flavor, match, value;
    match = function(flavor) {
      return flavor.name === name;
    };
    flavor = this.getFlavor(this.json, name, match);
    //console.log( 'Wheel.getRoastValue()', { name:name, flavor:flavor } )
    value = flavor != null ? (flavor.roast[0] + flavor.roast[1]) * 0.5 : -1;
    return value;
  }

  getFlavorName(roast) {
    var flavor, match;
    match = function(flavor) {
      return (flavor.roast != null) && flavor.roast[0] <= roast && roast <= flavor.roast[1];
    };
    flavor = this.getFlavor(this.json, roast, match);
    console.log('Wheel.getFlavorName()', {
      roast: roast,
      flavor: flavor
    });
    if (flavor) {
      return flavor.name;
    } else {
      return "";
    }
  }

};

export default Wheel;
