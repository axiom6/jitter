
class Wheel

  constructor:( @publish, @opacity ) ->
    @showAllLeaves = false
    @radiusFactorChoice = 1.3
    @radiusFactorChild  = 1.0
    @d3 = window['d3']

  resize:() ->
    geom = @pane.geom()
    w  = geom.w
    h  = geom.h
    sx = w  / @width
    sy = h  / @height
    sc = Math.min( sx, sy )
    xc = w/2
    yc = h/2
    @svg.attr( "width", w ).attr( "height", h )
    @g.transition().attr("transform", """translate(#{xc},#{yc}) scale(#{sc})""" )
    return

  ready:( pane, spec, elem, url, scale=1.0 ) ->

    @spec   = spec
    @pane   = pane
    @url    = url
    @json   = {}
    geom    = @pane.geom()
    @width  = geom.w
    @height = geom.h
    @radius = Math.min( @width, @height ) * scale / 2
    @xx     = @d3.scaleLinear().range([ 0, 2*Math.PI ] )
    @yy     = @d3.scalePow().exponent(1.3).domain([0, 1]).range([0, @radius]) # 1.3
    # @formatNumber = @d3.format(",d")
    @padding = 0
    @duration = 300
    @lookup = {}

    div = @d3.select( elem )

    w  = @width
    h  = @height
    xc = @width/2
    yc = @height/2
    @svg = div.append("svg")
      .attr("width",   w )
      .attr("height",  h )
    @g = @svg.append("g")
      .attr("transform", """translate(#{xc},#{yc}) scale(1,1)""")
    @g.append("text").text("Flavor")
      .attr( 'x', -32 )
      .attr( 'y',  12 )
      .style('fill', 'black' )
      .style("font-size", "3vmin" )

    @partition = @d3.partition()

    @arc = @d3.arc()
      .startAngle(  (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x0(d) ))))
      .endAngle(    (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x1(d) ))))
      .innerRadius( (d) => Math.max( 0, @yy(@y0(d)) ) )
      .outerRadius( (d) => Math.max( 0, @yy(@y1(d)) ) )

    @d3.json( @url ).then ( json ) =>

      @json = json
      @root = @d3.hierarchy(json)
      @root.sum(  (d) => ( d.chosen = false; d.hide = @isLeaf(d); if @isBranch(d) then 0 else 1 ) )
      @nodes = @partition(@root).descendants()
      @adjustRadius( @root )

      @path  = @g.selectAll("path")
        .data( @nodes )
        .enter().append("path")
        .attr( "id", (d, i) -> ( if d? then "path-" + i else "path-" + i ) )
        .attr(  "d", @arc )
        .attr(  "fill-rule", "evenodd")
        .style( "fill",    (d) => @fill(d)  )
        .style( "opacity", @opacity )
        .style( "stroke",       'black' )
        .style( "stroke-width", '2' )
        .style( "display", (d) -> if d.data.hide then "none" else "block" )
        .on( "click",      (d) => @onEvent( d, 'click'     ) )
        .on( "mouseover",  (d) => @onEvent( d, 'mouseover' ) )
        .on( "mouseout",   (d) => @onEvent( d, 'mouseout'  ) )
        #append("title").text( (d) -> d.data.name )

      @doText( @nodes )

    @d3.select( self.frameElement).style( "height", @height + "px" )
    return

  adjustRadius:( d ) =>
    @lookup[d.data.name] = d
    sc = if d['data'].scale? then d['data'].scale
    else if not d.children?  then 0.8
    else                          1.0
    dy   = ( d.y1 - d.y0 ) * sc
    d.y0 = d.parent.y1 if d.parent?
    d.y1 = d.y0 + dy
    if d.children?
      d.children.forEach (child) =>
        @adjustRadius( child )
    return

  x0:(d) ->  if d.m0? then d.m0 else d.x0
  x1:(d) ->  if d.m1? then d.m1 else d.x1
  y0:(d) ->  if d.n0? then d.n0 else d.y0
  y1:(d) ->  if d.n1? then d.n1 else d.y1
  xc:(d) => (@x0(d)+@x1(d))/2
  yc:(d) => (@y0(d)+@y1(d))/2

  sameNode:( a, b ) ->
    a?.data.name is b?.data.name

  inBranch:( branch, elem ) ->
    return true if  branch?.data.name is elem?.data.name
    if branch.children?
      for child in branch?.children
        return true if child?.data.name is elem?.data.name
    return false

  isBranch:( d ) ->
    d.children?

  isLeaf:( d ) ->
    not d.children?

  isParentOf:( p, c ) =>
    if p == c
      return true
    if p.children
      return p.children.some( (d) => @isParentOf( d, c ) )
    false

  # http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
  # brightness:( rgb ) ->
  #   rgb.r * .299 + rgb.g * .587 + rgb.b * .114

  fill:(d) =>
    # console.log( 'fill', d )
    if d.data.fill? and d.children?
      d.data.fill
    else if  d.data.fill? and not d.children? and d.parent?  and d.parent.data.fill?
      d.parent.data.fill
    else if d.children?
      colours = d.children.map(@fill)
      a = @d3.hsl(colours[0])
      b = @d3.hsl(colours[1])
      # L*a*b* might be better here...
      @d3.hsl (a.h + b.h) / 2, a.s * 1.2, a.l / 1.2
    else
      '#666666'

  doText:( nodes ) =>

    @text = @g.selectAll('text').data(nodes)

    @textEnter = @text.enter().append('text')
      .on( "click",       (d) => @onEvent( d, 'click'     ) )
      .on( "mouseover",   (d) => @onEvent( d, 'mouseover' ) )
      .on( "mouseout",    (d) => @onEvent( d, 'mouseout'  ) )
      .style("font-size", (t) => @fontSize( t ) )
      .style('opacity', 1 )
      #style('fill',       (d) => if @brightness( @d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
      .style('fill', '#000000' )
      .style('font-weight', 900 )
      .style( "display",   (d) -> if d.data.hide then "none" else "block" )
      .attr('text-anchor', (d) => if @xx( @xc(d) ) > Math.PI then 'end' else 'start' )
      .attr('dy', '.2em').attr('transform', (d) => @textTransform(d) )

    angle = (d) => @xx( @xc(d) ) * 180 / Math.PI
    xem   = (d) -> if angle(d) <= 180 then '1em' else '-1em'

    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).text( (d) -> if d.depth then d.data.name.split(' ')[0] else '' )
    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).attr('dy', '1em')
      .text( (d) -> if d.depth? and d.data.name? then d.data.name.split(' ')[1] or '' else '' )
    #textEnter.append("title").text( (d) -> d.data.name )
    return

  # eventType is click mouseover mouseout AddChoice DelChoice
  onEvent:( d, eventType ) =>
    @displayAllLeaves() if eventType is 'click' and not d.parent?
    return if not d.data['can']?
    #console.log( 'onEvent', d ) if eventType is 'click'
    py0    = d.y0
    py1    = d.y0 + (d.y1-d.y0) * @radiusFactorChoice
    resize = @doChoiceResize( d, eventType, d.x0, py0, d.x1, py1 )
    cy0    = if resize then py1 else d.y1
    if d.children?
      d.children.forEach( (child) =>
        child?.data.hide = resize
        cy1 = cy0 + (child['y1']-child['y0']) * @radiusFactorChild
        @resizeElem( child, resize, child['x0'], cy0, child['x1'], cy1 ) )
    @g.selectAll('path').data( @nodes )
      .filter( (e) => @inBranch( d, e ) )
      .transition()
      .duration(@duration)
      .style( "display", (d) -> if d.data.hide then "none" else "block" )
      #style( "stroke",        "black" )
      #style( "stroke-width", "0.2vim" )
      .attr(  "d", @arc )
    @g.selectAll('text').data( @nodes )
      .filter( (e) => @inBranch( d, e ) )
      .transition()
      .duration(@duration)
      .attr( "transform", (t) => @textTransform(t) )
      .style("font-size", (t) => @fontSize( t, d ) )
      .style( "display",  (d) -> if d.data.hide then "none" else "block" )
    return

  fontSize:( t, d=null ) =>
    if d? and @sameNode( t, d ) and t.m0?
      '1.5em'
    else
      if t.children? then '1.1em' else '0.9em'

  fontSizeVMin:( t, d=null ) =>
    if d? and @sameNode( t, d ) and t.m0?
      '2.2vmin'
    else
      if t.children? then '1.8vmin' else '1.7vmin'

  # eventType is click mouseover mouseout AddChoice DelChoice
  doChoiceResize:( elem, eventType, x0, y0, x1, y1 ) =>
    resizeChild = true
    if eventType is 'click'
      elem.chosen = not elem.chosen
      @resizeElem( elem, elem.chosen, x0, y0, x1, y1 )
      # This publish function is supplied to the constructor
      # elem.chosen is true/false for add/del
      # elem.data.name is the flavor
      @publish( elem.chosen, elem.data.name, @getRoastValue(elem.data.name) )
      resizeChild = elem.chosen
    else if eventType is 'AddChoice' or eventType is 'DelChoice'
      elem.chosen = eventType is 'AddChoice'
      @resizeElem( elem, elem.chosen, x0, y0, x1, y1 )
      resizeChild = elem.chosen
    # Mouse event do not affect chosen elements
    else if not elem.chosen and ( eventType is 'mouseover' or eventType is 'mouseout' )
      resizeChild = eventType is 'mouseover'
      @resizeElem( elem, resizeChild, x0, y0, x1, y1 )
    #console.log( "Wheel.doChoiceResize()", { flavor:elem.data.name, eventType:eventType, resizeChild:resizeChild } )
    resizeChild

  resizeElem:( elem, resize, x0, y0, x1, y1 ) ->
    if resize
      elem.m0 = x0
      elem.m1 = x1
      elem.n0 = y0
      elem.n1 = y1
      elem.data.hide = false
    else
      elem.m0 = undefined
      elem.m1 = undefined
      elem.n0 = undefined
      elem.n1 = undefined
      elem.data.hide = if not (elem.data.children? or @showAllLeaves) then true else false
    return

  textTransform:( d ) =>
    multiline = (d.data.name or '').split(' ').length > 1
    angle  = @xx( @xc(d) ) * 180 / Math.PI - 90
    rotate = angle + (if multiline then -.5 else 0)
    'rotate(' + rotate + ')translate(' + @yy(@y0(d)) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')'

  displayAllLeaves:() =>
    @showAllLeaves = not @showAllLeaves
    @g.selectAll("path")
      .style( "display", (d) => if @isLeaf(d) and not @showAllLeaves and not d.parent.chosen then "none" else "block" )
    @g.selectAll('text')
      .style( "display", (d) => if @isLeaf(d) and not @showAllLeaves and not d.parent.chosen then "none" else "block" )
    return

  zoomTween:( d ) =>
    @svg.transition()
      .duration(@duration)
      .tween( "scale", () =>
        xd = @d3.interpolate( @xx.domain(), [ @x0(d), @x1(d)] )
        yd = @d3.interpolate( @yy.domain(), [ @y0(d), 1] )
        yr = @d3.interpolate( @yy.range(),  [ (if d.y0? then 20 else 0), @radius ] )
        (t) => ( @xx.domain(xd(t)); @yy.domain(yd(t)).range(yr(t)) ) )
    .selectAll("path")
      .attrTween( "d", (d) => ( () => @arc(d) ) )
    return

  getFlavor:( data, name, match ) ->
    if data.children?
      for flavor in data.children
        return flavor  if match(flavor)
        child = @getFlavor( flavor, name, match )
        return child if child?
    null

  getRoastValue:( name ) ->
    match  = (flavor) -> ( flavor.name is name )
    flavor = @getFlavor( @json, name, match )
    #console.log( 'Wheel.getRoastValue()', { name:name, flavor:flavor } )
    value = if flavor? then ( flavor.roast[0]+flavor.roast[1] ) * 0.5 else -1
    value

  getFlavorName:( roast ) ->
    match  = (flavor) -> ( flavor.roast? and flavor.roast[0] <= roast and roast <= flavor.roast[1] )
    flavor = @getFlavor( @json, roast, match )
    console.log( 'Wheel.getFlavorName()', { roast:roast, flavor:flavor } )
    if flavor then flavor.name else ""

export default Wheel