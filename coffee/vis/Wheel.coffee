
class Wheel

  Vis.Wheel = Wheel

  constructor:( @stream ) ->
    @numChoices = 0
    @maxChoices = 4

  create:(  pane, spec, data ) ->

    @spec = spec
    Util.noop( pane, data )

  resize:() ->
    w  = @pane.geo.w
    h  = @pane.geo.h
    sx = w  / @width
    sy = h  / @height
    sc = Math.min( sx, sy )
    xc = w/2
    yc = h/2
    @svg.attr( "width", w ).attr( "height", h )
    @g.transition().attr("transform", """translate(#{xc},#{yc}) scale(#{sc})""" )
    return

  ready:( pane, spec, divId, url, scale=1.0 ) ->

    @spec   = spec
    @pane   = pane
    @url    = url
    @width  = pane.geo.w
    @height = pane.geo.h
    @radius = Math.min( @width, @height ) * scale / 2
    @xx     = d3.scaleLinear().range([ 0, 2*Math.PI ] )
    @yy     = d3.scalePow().exponent(1.3).domain([0, 1]).range([0, @radius]) # 1.3
    @formatNumber = d3.format(",d")
    @padding = 0
    @duration = 300
    @div  = d3.select( '#' + divId )
    @$div = $(         '#' + divId )

    w  = @width
    h  = @height
    xc = @width/2
    yc = @height/2
    @svg = @div.append("svg")
      .attr("width",   w )
      .attr("height",  h )
    @g = @svg.append("g")
      .attr("transform", """translate(#{xc},#{yc}) scale(1,1)""")
    @g.append("text").text("Flavor")
      .attr( 'x', -32 )
      .attr( 'y',  12 )
      .style('fill', 'white' )
      .style("font-size", "3vmin" )

    @partition = d3.partition()

    @arc = d3.arc()
      .startAngle(  (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x0(d) ))))
      .endAngle(    (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x1(d) ))))
      .innerRadius( (d) => Math.max( 0, @yy(@y0(d)) ) )
      .outerRadius( (d) => Math.max( 0, @yy(@y1(d)) ) )

    d3.json @url, (error, json ) =>
      throw error if error
      @root = d3.hierarchy(json)
      @root.sum(  (d) -> ( d.chosen = false; d.hide = not d.children?; if d.children? then 0 else 1 ) )

      @nodes = @partition(@root).descendants()
      @path  = @g.selectAll("path")
        .data( @nodes )
        .enter().append("path")
        .attr( "id", (d, i) -> ( if d? then "path-" + i else "path-" + i ) )
        .attr(  "d", @arc )
        .attr(  "fill-rule", "evenodd")
        .style( "fill",    (d) => @fill(d.data)  )
        .style( "display", (d) -> if d.data.hide then "none" else "block" )
        .on( "click",      (d) => @magnify( d, 'click'     ) )
        .on( "mouseover",  (d) => @magnify( d, 'mouseover' ) )
        .on( "mouseout",   (d) => @magnify( d, 'mouseout'  ) )
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

  inBranch:( branch, elem ) ->
    return true if  branch?.data.name is elem?.data.name
    for child in branch?.children
      return true if child?.data.name is elem?.data.name
    return false

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
    else if d.children
      colours = d.children.map(@fill)
      a = d3.hsl(colours[0])
      b = d3.hsl(colours[1])
      # L*a*b* might be better here...
      d3.hsl (a.h + b.h) / 2, a.s * 1.2, a.l / 1.2
    else
      '#666666'

  doText:( nodes ) =>

    @text = @g.selectAll('text').data(nodes)

    @textEnter = @text.enter().append('text')
      .on( "click",       (d) => @magnify( d, 'click'     ) )
      .on( "mouseover",   (d) => @magnify( d, 'mouseover' ) )
      .on( "mouseout",    (d) => @magnify( d, 'mouseout'  ) )
      .style("font-size", (t) => @fontSize( t ) )
      .style('fill-opacity', 1)
      #style('fill',       (d) => if @brightness( d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
      .style('fill', '#000000' )
      .style('font-weight', 'bold' )
      .style( "display",   (d) -> if d.data.hide then "none" else "block" )
      .attr('text-anchor', (d) => if @xx( @xc(d) ) > Math.PI then 'end' else 'start' )
      .attr('dy', '.2em').attr('transform', (d) => @textTransform(d) )

    angle = (d) => @xx( @xc(d) ) * 180 / Math.PI
    xem   = (d) -> if angle(d) <= 180 then '1em' else '-1em'

    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).text( (d) -> if d.depth then d.data.name.split(' ')[0] else '' )
    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).attr('dy', '1em')
      .text( (d) -> if d.depth? and d.data.name? then d.data.name.split(' ')[1] or '' else '' )
    @textEnter.append("title").text( (d) -> d.data.name )
    return

  magnify:( d, eventType ) =>
    
    if true # d.data['can']?
      #console.log( 'magnify', d.data.name )
      y0 = d.y0
      y1 = d.y0 + (d.y1-d.y0) * 1.3
      resize = @doChoice( d, eventType, d.x0, y0, d.x1, y1 )
      y0 = if resize is UI.AddChoice or 'mouseover' then y1 else d.y1
      y1 = y0 + d.y1 - d.y0
      return if resize is 'none'
      d.children.forEach( (child) =>
        child?.data.hide = not ( d.chosen or eventType is 'mouseover' )
        @resizeElem( child, resize, child?.x0, y0, child?.x1, y1 ) )
      @g.selectAll('path').data( @nodes )
        .filter( (e) => @inBranch( d, e ) )
        .transition()
        .duration(@duration)
        .style( "display", (d) -> if d.data.hide then "none" else "block" )
        .attr(  "d", @arc )
      @g.selectAll('text').data( @nodes )
        .filter( (e) => @inBranch( d, e ) )
        .transition()
        .duration(@duration)
        .attr( "transform", (t) => @textTransform(t) )
        .style("font-size", (t) => @fontSize( t, d ) )
        .style( "display", (d) -> if d.data.hide then "none" else "block" )
    return

  fontSize:( t, d=null ) =>
    if d? and @sameNode( t, d ) and t.m0?
      '2.2vmin'
    else
      if t.children? then '1.9vmin' else '1.7vmin'

  fontSizePt:( t, d=null ) =>
    if d? and @sameNode( t, d ) and t.m0?
      '16pt'
    else
      if t.children? then '14pt' else '12pt'

  doChoice:( d, eventType, x0, y0, x1, y1 ) =>
    resize = 'none'
    if eventType is 'click'
      resize = @chooseElem( d )
      @resizeElem( d, resize, x0, y0, x1, y1 )
    else if not d.chosen
      resize = eventType
      @resizeElem( d, resize, x0, y0, x1, y1 )
    resize = 'none' if d.chosen and eventType is 'mouseout'
    resize

  chooseElem:( elem ) =>
    elem.chosen = if elem.chosen then false           else true
    addDel      = if elem.chosen then UI.AddChoice    else UI.DelChoice
    if elem.chosen and @numChoices >= @maxChoices
      alert( "You can only make #{@maxChoices} choices for Flavor" )
      elem.chosen = false
      return 'none'
    @numChoices = if elem.chosen then @numChoices + 1 else @numChoices - 1
    choice      = UI.select( @spec.name, 'Wheel', addDel, elem.data.name )
    @stream.publish( 'Choice', choice )
    addDel

  resizeElem:( elem, resize, x0, y0, x1, y1 ) ->
    if resize is UI.AddChoice or resize is 'mouseover'
      elem.m0 = x0
      elem.m1 = x1
      elem.n0 = y0
      elem.n1 = y1
      elem.data.hide = false
    else if resize is UI.DelChoice or resize is 'mouseout'
      elem.m0 = undefined
      elem.m1 = undefined
      elem.n0 = undefined
      elem.n1 = undefined
      elem.data.hide = if resize is 'mouseout' and not elem.data.children? then true else false
    else
      Util.noop()
    return

  textTransform:( d ) =>
    multiline = (d.data.name or '').split(' ').length > 1
    angle  = @xx( @xc(d) ) * 180 / Math.PI - 90
    rotate = angle + (if multiline then -.5 else 0)
    'rotate(' + rotate + ')translate(' + @yy(@y0(d)) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')'

  zoomTween:( d ) =>
    @svg.transition()
      .duration(@duration)
      .tween( "scale", () =>
        xd = d3.interpolate( @xx.domain(), [ @x0(d), @x1(d)] )
        yd = d3.interpolate( @yy.domain(), [ @y0(d), 1] )
        yr = d3.interpolate( @yy.range(),  [ (if d.y0? then 20 else 0), @radius ] )
        (t) => ( @xx.domain(xd(t)); @yy.domain(yd(t)).range(yr(t)) ) )
    .selectAll("path")
      .attrTween( "d", (d) => ( () => @arc(d) ) )