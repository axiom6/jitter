
class Wheel

  Vis.Wheel = Wheel

  constructor:() ->

  ready:(  pane, spec, data ) ->
    Util.noop( pane, spec, data )

  create:( pane, spec, divId, url ) ->

    Util.noop( pane, spec )
    @url    = url
    @width  = 1330
    @height = 660
    @radius = Math.min(@width, @height) / 2
    @xx     = d3.scaleLinear().range([ 0, 2*Math.PI ] )
    #yy     = d3.scaleSqrt()  .range([ 0, @radius   ] )
    @yy     = d3.scalePow().exponent(1.3).domain([0,1]).range([0,@radius])
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
      .startAngle(  (d) => Math.max( 0, Math.min(2 * Math.PI, @xx(d.x0))) )
      .endAngle(    (d) => Math.max( 0, Math.min(2 * Math.PI, @xx(d.x1))) )
      .innerRadius( (d) => Math.max( 0, @yy(d.y0) ) )
      .outerRadius( (d) => Math.max( 0, @yy(d.y1) ) )

    d3.json @url, (error, json ) =>
      throw error if error
      root = d3.hierarchy(json)
      root.sum(  (d) -> ( if d.value? then d.value else 1 ) )
      nodes = @partition(root).descendants()
      #console.log( 'nodes', nodes )
      @vis.selectAll("path")
          .data( nodes )
        .enter().append("path")
      .attr("id", (d,i) -> ( if d? then "path-" + i else "path-" + i ) )
          .attr( "d", @arc )
          .attr("fill-rule", "evenodd")
          .style( "fill",  (d) => @fill(d.data)  )
          .on(    "click", @click )
        .append("title")
          .text( (d) => d.data.name + "\n" + @formatNumber(d.value) )
      @doText( nodes )

      d3.select( self.frameElement).style( "height", @height + "px" )

  click:(d) =>
    @vis.transition()
      .duration(@duration)
      .tween( "scale", () =>
         xd = d3.interpolate( @xx.domain(), [ d.x0, d.x1] )
         yd = d3.interpolate( @yy.domain(), [ d.y0, 1] )
         yr = d3.interpolate( @yy.range(),  [ (if d.y0? then 20 else 0), @radius ] )
         (t) => ( @xx.domain(xd(t)); @yy.domain(yd(t)).range(yr(t)) ) )
    .selectAll("path")
      .attrTween( "d",  (d) => ( () => @arc(d) ) )

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
    #console.log( 'fill', d, d.data )
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

    @textEnter = @text.enter().append('text').style('fill-opacity', 1)
      #.on('click', @click)
      .style('fill',       (d) => if @brightness( d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
      .attr('text-anchor', (d) => if @xx( (d.x0+d.x1)/2 ) > Math.PI then 'end' else 'start' )
      .attr('dy', '.2em').attr('transform', (d) =>
        multiline = (d.data.name or '').split(' ').length > 1
        angle  = @xx( (d.x0+d.x1)/2 ) * 180 / Math.PI - 90
        rotate = angle + (if multiline then -.5 else 0)
        'rotate(' + rotate + ')translate(' + @yy(d.y0) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')' )

    @textEnter.append('tspan').attr('x', 0).text( (d) => if d.depth then d.data.name.split(' ')[0] else '' )
    @textEnter.append('tspan').attr('x', 0).attr('dy', '1em')
      .text( (d) => if d.depth? and d.data.name? then d.data.name.split(' ')[1] or '' else '' )
    return