
class Wheel

  Vis.Wheel = Wheel

  constructor:( @stream ) ->
    @numChoices = 0
    @maxChoices = 4

  ready:(  pane, spec, data ) ->
    @spec = spec
    Util.noop( pane, data )

  create:( pane, spec, divId, url, scale=1.0 ) ->

    @spec   = spec
    @url    = url
    @width  = pane.geo.w
    @height = pane.geo.h
    @radius = Math.min( @width, @height ) * scale / 2
    @xx     = d3.scaleLinear().range([ 0, 2*Math.PI ] )
    @yy     = d3.scalePow().exponent(1.3).domain([0, 1]).range([0, @radius]) # 1.3
    @formatNumber = d3.format(",d")
    @padding = 5
    @duration = 300
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
      @root.sum(  (d) -> ( d.chosen = 'false'; if d.children? then 0 else 1 ) )

      @nodes = @partition(@root).descendants()
      @path  = @vis.selectAll("path")
        .data( @nodes )
        .enter().append("path")
        .attr( "id", (d, i) -> ( if d? then "path-" + i else "path-" + i ) )
        .attr(  "d", @arc )
        .attr(  "fill-rule", "evenodd")
        .style( "fill",   (d) => @fill(d.data)  )
        .on( "click",     (d) => @magnifyChoice( d ) )
        .on( "mouseover", (d) => @magnifyHover(  d, 'mouseover' ) )
        .on( "mouseout",  (d) => @magnifyHover(  d, 'mouseout'  ) )
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
      .on( "click",     (d) => @magnifyChoice( d              ) )
      .on( "mouseover", (d) => @magnifyHover(  d, 'mouseover' ) )
      .on( "mouseout",  (d) => @magnifyHover(  d, 'mouseout'  ) )
      .style("font-size", "9pt")
      .style('fill-opacity', 1)
      #style('fill',       (d) => if @brightness( d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
      .style('fill', '#000000' )
      .style('font-weight', 'bold' )
      .attr('text-anchor', (d) => if @xx( @xc(d) ) > Math.PI then 'end' else 'start' )
      .attr('dy', '.2em').attr('transform', (d) => @textTransform(d) )

    angle = (d) => @xx( @xc(d) ) * 180 / Math.PI
    xem   = (d) -> if angle(d) <= 180 then '1em' else '-1em'

    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).text( (d) -> if d.depth then d.data.name.split(' ')[0] else '' )
    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).attr('dy', '1em')
      .text( (d) -> if d.depth? and d.data.name? then d.data.name.split(' ')[1] or '' else '' )
    @textEnter.append("title").text( (d) -> d.data.name )
    return

  choiceElem:( elem, eventType, x0, y0, x1, y1 ) =>

    status = true
    op = 'normal'
    if eventType is 'choice'
      elem.chosen = if elem.chosen then false           else true
      addDel      = if elem.chosen then UI.AddChoice    else UI.DelChoice
      if elem.chosen and @numChoices >= @maxChoices
        alert( "You can only make #{@maxChoices} choices for Flavor" )
        return false
      @numChoices = if elem.chosen then @numChoices + 1 else @numChoices - 1
      choice      = UI.select( @spec.name, 'Wheel', addDel, elem.data.name )
      @stream.publish( 'Choice', choice )
      op = if elem.chosen        then 'magnify' else 'normal'
    else if eventType is 'child'
      op = if elem.parent.chosen then 'magnify' else 'child'
    else
      op = 'normal'

    if op is 'magnify' or op is 'child'
      elem.m0 = x0
      elem.m1 = x1
      elem.n0 = y0
      elem.n1 = y1
    else if op is 'child'
      elem.m0 = x0
      elem.m1 = x1
      elem.n0 = y0
      elem.n1 = y1
    else
      elem.m0 = undefined
      elem.m1 = undefined
      elem.n0 = undefined
      elem.n1 = undefined

    status

  hoverElem:( elem, eventType, x0, y0, x1, y1 ) ->

    status = true
    op = 'normal'
    if eventType is 'mouseover'
      op = if elem.parent.chosen then 'child' else 'magnify'
    else if eventType is 'mouseout'
      op = if elem.parent.chosen then 'child' else 'normal'
    else
      op = 'normal'

    if op is 'magnify'
      elem.m0 = x0
      elem.m1 = x1
      elem.n0 = y0
      elem.n1 = y1
    else if op is 'child'
      elem.m0 = x0
      elem.m1 = x1
      elem.n0 = y0
      elem.n1 = y1
    else
      elem.m0 = undefined
      elem.m1 = undefined
      elem.n0 = undefined
      elem.n1 = undefined

    status

  magnifyChoice:( d ) =>
    
    if d.children? and not d.children.children?
      console.log( 'magnifyChoice', d.data.name )
      y0 = d.y0
      y1 = d.y0 + (d.y1-d.y0) * 1.3
      status = @choiceElem( d, 'choice', d.x0, y0, d.x1, y1 )
      y0 = if d.chosen then y1 else d.y1
      y1 = y0 + d.y1 - d.y0
      d.children.forEach( (child) =>
        @choiceElem( child, 'child', child?.x0, y0, child?.x1, y1 ) )
      return if not status
      @vis.selectAll('path').data( @nodes )
        .filter( (e) => @inBranch( d, e ) )
        .transition()
        .duration(@duration)
        .attr(  "d", @arc )
      @vis.selectAll('text').data( @nodes )
        .filter( (e) => @inBranch( d, e ) )
        .transition()
        .duration(@duration)
        .attr( "transform", (t) => @textTransform(t) )
        .style("font-size", (t) => if @sameNode( t, d ) and t.m0? then '15pt' else '9pt' )
      return

  magnifyHover:( d, eventType ) =>
    return if true
    parent = d.parent
    if parent? and parent.children? and not d.children?
      #console.log( 'magnifyHover', d.data.name,  parent.data.name )
      n  = parent.children.length
      x0 = parent.children[0  ].x0
      x1 = parent.children[n-1].x1
      dd = (d.x1-d.x0) * 2
      ds = (x1-x0-dd) / (n-1)
      x1 = x0
      y0 = d.y0
      parent.children.forEach( (sibling) =>
        same = @sameNode( d, sibling )
        x1 = if same then x1+dd       else x1+ds
        y1 = if same then d.y1+(d.y1-d.y0)*0.9 else d.y1
        et = if same then eventType else 'child'
        @hoverElem( sibling, et, x0, y0, x1, y1 )
        x0 = x1 )
      @vis.selectAll('path').data( @nodes )
        .filter( (p) => @sameNode( p?.parent, parent ) )
        .transition()
        .duration(@duration)
        .attr(  "d", @arc )
      @vis.selectAll('text').data( @nodes )
        .filter( (t) => @sameNode( t?.parent, parent ) )
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