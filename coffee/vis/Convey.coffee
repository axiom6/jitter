
`import Util    from '../util/Util.js'`
`import Vis     from '../vis/Vis.js'`

class Convey

  constructor:( @defs, @g, @x, @y, @w, @h ) ->
    @uom = ''
    @nw = 24
    @np =  0
    @showLabel  = false
    @gradientX( @defs, 'WhiteBlack', 'white', 'black' )
    @gc = @g.append("g")

  doData:( graph ) =>
    @sankey             = @createSankey()
    @graph              = @sankey( graph )
    [@linkSvg,@nodeSvg] = @doSankey( @sankey, @graph  )
    return

  createSankey:() ->
    sankey = d3.sankey().nodeWidth(@nw).nodePadding(@np).extent([[@x,@y],[@x+@w,@y+@h]])
    sankey.link  = @sankeyLink
    sankey

  sankeyLink:(d) =>
    curvature = .5
    x0 = d.source.x1
    x1 = d.target.x0
    xi = d3.interpolateNumber( x0, x1 )
    x2 = xi(curvature)
    x3 = xi(1 - curvature)
    y0 = d.y0
    y1 = d.y1 + 0.1 # 0.1 prevents a pure horizontal line that did not respond to color gradients
    'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1

  doSankey:( sankey, graph ) ->
    sankey.nodes(graph.nodes).links(graph.links)
    #console.log( 'Node', node ) for node in graph.nodes
    linkSvg = @doLinks( graph )
    nodeSvg = @doNodes( graph )
    [linkSvg,nodeSvg]

  # .attr( "stroke", "url(#WhiteBlack)" ).attr( "fill","none")#
  doLinks:( graph ) ->
    gLinks = @gc.append("svg:g")
    for d in graph.links
      #console.log( 'Convey.doLinks() d', d )
      id = d.source.name+d.target.name
      @gradientX( @defs, id, d.source.color, d.target.color )
      gLink = gLinks.append("svg:g").attr( "stroke", "url(##{id})" ).attr( "fill","none")
      gLink.append("svg:path") #.attr("class", "link")
       .attr("d", @sankey.link(d) )
       .style("stroke-width", 1 )
       #sort( (a, b) -> (b.y1-b.y0) - (a.y1-a.y0) )
       .append("title").text( d.source.name + " → " + d.target.name )
    gLinks

  doNodes:( graph ) ->
    node = @gc.append("g").selectAll(".node")
      .data(graph.nodes).enter()
      .append("g").attr("class", "node")
      .attr("transform", (d) -> Vis.translate( d.x0,  d.y0 ) )
    node.append("rect").attr("height", (d) ->  d.y1 - d.y0 )
      .attr("width", @sankey.nodeWidth())
      .attr("fill",   (d) => d.color )
      .append("title").text( (d) => d.name )  #  + "\n" + d.value
    if @showLabel
      node.append("text").attr("x", -6).attr("y", (d) -> ( d.y1 - d.y0 ) / 2 )
        .attr("dy", ".35em").attr("text-anchor", "end")
        .text( (d) -> d.name )
        .filter((d) => d['x'] < @w / 2 )
        .attr("x", 6 + @sankey.nodeWidth())
        .attr( "text-anchor", "start" )
    node

  gradientX:( defs, id, color1, color2 ) ->
    grad = defs.append("svg:linearGradient")
    grad.attr("id", id ).attr("y1","0%").attr("y2","0%").attr("x1","0%").attr("x2","100%")
    grad.append("svg:stop").attr("offset", "10%").attr("stop-color", color1 )
    grad.append("svg:stop").attr("offset", "90%").attr("stop-color", color2 )
    return

`export default Convey`