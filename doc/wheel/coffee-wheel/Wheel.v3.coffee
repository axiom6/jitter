
class Wheel

  Vis.Wheel = Wheel

  constructor:() ->

  ready:(  pane, spec, data ) ->
    Util.noop( pane, spec, data )

  create:( pane, spec, divId, url ) ->

    Util.noop( pane, spec )
    @url   = url
    @width = 1330
    @height = 660
    @radius = Math.min(@width, @height) / 2
    @xx = d3.scale.linear().range([0,2 * Math.PI])
    @yy = d3.scale.pow().exponent(1.3).domain([0,1]).range([0,@radius])
    @padding = 5
    @duration = 1000
    @div = d3.select('#' + divId )

    @vis = @div.append("svg")
      .attr("width", @width + @padding * 2)
      .attr("height", @height + @padding * 2)
      .append("g")
      .attr("transform", "translate(" + [ @width/2+@padding, @height/2+@padding] + ")")

    @partition = d3.layout.partition()
      .sort(null)
      .value( (d) -> 5.8 - d.depth )

    @arc = d3.svg.arc()
      .startAngle(  (d) => Math.max( 0, Math.min(2 * Math.PI, @xx(d.x))) )
      .endAngle(    (d) => Math.max( 0, Math.min(2 * Math.PI, @xx(d.x + d.dx))) )
      .innerRadius( (d) => Math.max( 0, if d.y? then @yy(d.y) else d.y) )
      .outerRadius( (d) => Math.max( 0, @yy(d.y + d.dy) ) )

    d3.json @url, (error, json) =>
      @nodes = @partition.nodes( children: json )
      @path  = @vis.selectAll('path').data(@nodes)
      @path.enter().append("path")
        .attr("id", (d, i) -> return "path-" + i )
        .attr("d", @arc)
        .attr("fill-rule", "evenodd")
        .style("fill", @colour )
        #.on("click",   @click  )

      @text = @vis.selectAll('text').data(@nodes)

      @textEnter = @text.enter().append('text').style('fill-opacity', 1)
        #.on('click', @click)
        .style('fill',       (d) => if @brightness( d3.rgb( @colour(d) ) ) < 125 then '#eee' else '#000' )
        .attr('text-anchor', (d) => if @xx(d.x + d.dx / 2) > Math.PI then 'end' else 'start' )
        .attr('dy', '.2em').attr('transform', (d) =>
          multiline = (d.name or '').split(' ').length > 1
          angle  = @xx(d.x + d.dx / 2) * 180 / Math.PI - 90
          rotate = angle + (if multiline then -.5 else 0)
          'rotate(' + rotate + ')translate(' + @yy(d.y) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')' )

      @textEnter.append('tspan').attr('x', 0).text( (d) => if d.depth then d.name.split(' ')[0] else '' )
      @textEnter.append('tspan').attr('x', 0).attr('dy', '1em')
        .text( (d) => if d.depth? and d.name? then d.name.split(' ')[1] or '' else '' )
      return

  click:(d) =>
    @path.transition().duration( @duration ).attrTween(  'd', @arcTween(d) )
    # Somewhat of a hack as we rely on arcTween updating the scales.
    @text.style('visibility', (e) => if @isParentOf(d, e) then null else d3.select(@text).style('visibility') )
      .transition().duration( @duration).attrTween('text-anchor', (d) ->
        () => if @xx(d.x + d.dx / 2) > Math.PI then 'end' else 'start' )
      .attrTween('transform', (d) =>
        multiline = (d.name or '').split(' ').length > 1
        () =>
          angle = @xx(d.x + d.dx / 2) * 180 / Math.PI - 90
          rotate = angle + (if multiline then -.5 else 0)
          'rotate(' + rotate + ')translate(' + @yy(d.y) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')' )
      .style('fill-opacity', (e) => if @isParentOf(d, e) then 1 else 1e-6 )
      .each( 'end', (e) => d3.select(@text).style 'visibility', if @isParentOf(d, e) then null else 'hidden' )
    return

  # Interpolate the scales!
  arcTween:(d) =>
    my   = @maxY(d)
    ifdy = (v) -> if v? then 20 else 0
    xd = d3.interpolate( @xx.domain(), [ d.x, d.x + d.dx] )
    yd = d3.interpolate( @yy.domain(), [ d.y, my] )
    yr = d3.interpolate( @yy.range(),  [ ifdy(d.y), @radius ] )
    (d) =>
      (t) =>
        @xx.domain( xd(t) )
        @yy.domain( yd(t)).range( yr(t) )
        @arc( d )

  maxY:(d) =>
    if d.children then Math.max.apply(Math, d.children.map(@maxY)) else d.y + d.dy

  # http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
  brightness:( rgb ) ->
    rgb.r * .299 + rgb.g * .587 + rgb.b * .114

  isParentOf:( p, c ) =>
    if p == c
      return true
    if p.children
      return p.children.some( (d) => @isParentOf( d, c ) )
    false

  colour:(d) =>
    if d.fill?
       d.fill
    else if d.colour
      d.colour
    else if d.children
      colours = d.children.map(@colour)
      a = d3.hsl(colours[0])
      b = d3.hsl(colours[1])
      # L*a*b* might be better here...
      d3.hsl (a.h + b.h) / 2, a.s * 1.2, a.l / 1.2
    else
      '#fff'