
class Wheel

  Vis.Wheel = Wheel

  constructor:() ->

  ready:(  pane, spec, data ) ->
    Util.noop( pane, spec, data )

  create:( pane, spec, divId, url, scale=1.0 ) ->

    Util.noop( spec )
    @url    = url
    @width  = pane.geo.w
    @height = pane.geo.h
    @radius = Math.min( @width, @height ) * scale / 2
    @xx     = d3.scaleLinear().range([ 0, 2*Math.PI ] )
    @yy     = d3.scalePow().exponent(1.3).domain([0, 1]).range([0, @radius]) # 1.3
    @formatNumber = d3.format(",d")
    @padding = 5
    @duration = 1000
    @div = d3.select('#' + divId )

    @vis = @div.append("svg")
      .attr("width",  @width  + @padding * 2 )
      .attr("height", @height + @padding * 2 )
      .append("g")
      .attr("transform", "translate(" + [ @width/2+@padding, @height/2+@padding] + ")")

    @partition = d3.partition()

    @arc = d3.arc()
      .startAngle(  (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x0(d) ))))
      .endAngle(    (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x1(d) ))))
      .innerRadius( (d) => Math.max( 0, @yy(@y0(d)) ) )
      .outerRadius( (d) => Math.max( 0, @yy(@y1(d)) ) )

    d3.json @url, (error, json ) =>
      throw error if error
      @root = d3.hierarchy(json)
      @root.sum(  (d) -> ( d.selected = 'false'; if d.children? then 0 else 1 ) )

      @nodes = @partition(@root).descendants()
      @path  = @vis.selectAll("path")
        .data( @nodes )
        .enter().append("path")
        .attr( "id", (d, i) -> ( if d? then "path-" + i else "path-" + i ) )
        .attr(  "d", @arc )
        .attr(  "fill-rule", "evenodd")
        .style( "fill",   (d) => @fill(d.data)  )
        .on( "click",     (d) => @magnify( d, 'click'     ) )
        .on( "mouseover", (d) => @magnify( d, 'mouseover' ) )
        .on( "mouseout",  (d) => @magnify( d, 'mouseout'  ) )
        .append("title").text( (d) -> d.data.name )

      @doText( @nodes )

    d3.select( self.frameElement).style( "height", @height + "px" )

  x0:(d) -> if d.m0? then d.m0 else d.x0
  x1:(d) -> if d.m1? then d.m1 else d.x1
  y0:(d) -> if d.n0? then d.n0 else d.y0
  y1:(d) -> if d.n1? then d.n1 else d.y1
  xc:(d) => (@x0(d)+@x1(d))/2
  yc:(d) => (@y0(d)+@y1(d))/2

  sameNode:( a, b ) ->
    a?.data.name is b?.data.name

  click:(d) ->
    console.log( 'click', d.data.name,  parent.data.name )

  # http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
  brightness:( rgb ) ->
    rgb.r * .299 + rgb.g * .587 + rgb.b * .114

  isParentOf:( p, c ) =>
    if p == c
      return true
    if p.children
      return p.children.some( (d) => @isParentOf( d, c ) )
    false

  fill:(d) =>

    if d.fill?
      d.fill
    else if d.colour
      d.colour
    else if d.children
      colours = d.children.map(@fill)
      a = d3.hsl(colours[0])
      b = d3.hsl(colours[1])
      # L*a*b* might be better here...
      d3.hsl (a.h + b.h) / 2, a.s * 1.2, a.l / 1.2
    else
      '#666666'

  doText:( nodes ) =>

    @text = @vis.selectAll('text').data(nodes)

    @textEnter = @text.enter().append('text')
      .on( "click",     (d) => @magnify( d, 'click'     ) )
      .on( "mouseover", (d) => @magnify( d, 'mouseover' ) )
      .on( "mouseout",  (d) => @magnify( d, 'mouseout'  ) )
      .style("font-size", "9pt")
      .style('fill-opacity', 1)
      .style('fill',       (d) => if @brightness( d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
      .attr('text-anchor', (d) => if @xx( @xc(d) ) > Math.PI then 'end' else 'start' )
      .attr('dy', '.2em').attr('transform', (d) => @textTransform(d) )

    angle = (d) => @xx( @xc(d) ) * 180 / Math.PI
    xem   = (d) -> if angle(d) <= 180 then '1em' else '-1em'

    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).text( (d) -> if d.depth then d.data.name.split(' ')[0] else '' )
    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).attr('dy', '1em')
      .text( (d) -> if d.depth? and d.data.name? then d.data.name.split(' ')[1] or '' else '' )
    @textEnter.append("title").text( (d) -> d.data.name )
    return

  onClick:( d )     -> @magnify( d, 'click'     )
  onMouseover:( d ) -> @magnify( d, 'mouseover' )
  onMouseout:( d )  -> @magnify( d, 'mouseout'  )

  magnifySibling:( sibling, eventType, x0, y0, x1, y1 ) ->

    op = if eventType is 'click'
      sibling.selected = if sibling.selected then false else true
      if sibling.selected then 'magnify' else 'normal'
    else if eventType is 'mouseover'
      'magnify'
    else if eventType is 'mouseout'
      if sibling.selected then 'magnify' else 'normal'
    else

    if op is 'magnify'
      sibling.m0 = x0
      sibling.m1 = x1
      sibling.n0 = y0
      sibling.n1 = y1
    else
      sibling.m0 = undefined
      sibling.m1 = undefined
      sibling.n0 = undefined
      sibling.n1 = undefined

    sibling

  magnify:( d, eventType ) =>
    parent = d.parent
    if parent? and parent.children? and not d.children?
      console.log( 'magnify', d.data.name,  parent.data.name )
      n  = parent.children.length
      x0 = parent.children[0  ].x0
      x1 = parent.children[n-1].x1
      dd = (d.x1-d.x0) * 2
      ds = (x1-x0-dd) / (n-1)
      x1 = x0
      y0 = d.y0
      parent.children.forEach( (sibling) =>
        x1 = if @sameNode( d, sibling ) then x1+dd       else x1+ds
        y1 = if @sameNode( d, sibling ) then d.y1+(d.y1-d.y0)*0.9 else d.y1
        sibling = @magnifySibling( sibling, eventType, x0, y0, x1, y1 )
        x0 = x1 )
      @vis.selectAll('path').data( @nodes )
        .filter( (p) => @sameNode( p.parent, parent ) )
        .transition()
        .duration(@duration)
        .attr(  "d", @arc )
      @vis.selectAll('text').data( @nodes )
        .filter( (t) => @sameNode( t.parent, parent ) )
        .transition()
        .duration(@duration)
        .attr( "transform", (t) => @textTransform(t) )
        .style("font-size", (t) => if @sameNode( t, d ) and t.m0? then '15pt' else '9pt' )
      return

  textTransform:( d ) =>
    multiline = (d.data.name or '').split(' ').length > 1
    angle  = @xx( @xc(d) ) * 180 / Math.PI - 90
    rotate = angle + (if multiline then -.5 else 0)
    'rotate(' + rotate + ')translate(' + @yy(@y0(d)) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')'

  zoomTween:( d ) =>
    @vis.transition()
      .duration(@duration)
      .tween( "scale", () =>
        xd = d3.interpolate( @xx.domain(), [ @x0(d), @x1(d)] )
        yd = d3.interpolate( @yy.domain(), [ @y0(d), 1] )
        yr = d3.interpolate( @yy.range(),  [ (if d.y0? then 20 else 0), @radius ] )
        (t) => ( @xx.domain(xd(t)); @yy.domain(yd(t)).range(yr(t)) ) )
    .selectAll("path")
      .attrTween( "d", (d) => ( () => @arc(d) ) )