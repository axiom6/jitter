
class Pane

  UI.Pane = Pane

  constructor:( @ui, @stream, @view, @spec ) ->
    @spec.pane   = @
    @cells       = @spec.cells
    [j,m,i,n]    = UI.jmin(@cells)
    [@left,@top,@width,@height] = @view.position(j,m,i,n,@spec)
    @name        = @spec.name
    @classPrefix = if Util.isStr(@spec.css) then @spec.css else 'ui-pane'
    @$           = UI.$empty
    @wscale      = @view.wscale
    @hscale      = @view.hscale
    @margin      = @view.margin
    @speed       = @view.speed
    @page        = null # set by UI.Page.ready()
    @geo         = null # reset by geom() when onSelect() dispatches to page

  ready:() ->
    @htmlId = @ui.htmlId( @name, 'Pane' )
    @$      = $( @createHtml() )
    @view.$view.append( @$ )
    @hide()
    @adjacentPanes()
    select = UI.select( @name, 'Pane', UI.SelectPane )
    @reset(select)
    @show()

  geom:() ->
    [j,m,i,n] = UI.jmin(@spec.cells)
    [wp,hp]   = @view.positionpx( j,m,i,n, @spec ) # Pane size in AllPage usually 3x3 View
    wi        = @$.innerWidth()
    hi        = @$.innerHeight()
    w  = Math.max( wi, wp ) # wp from positionpx
    h  = Math.max( hi, hp ) # hp from positionpx
    wv = @view.wPanes()
    hv = @view.hPanes()
    r  = Math.min( w, h ) * 0.2  # Use for hexagons
    x0 = w * 0.5
    y0 = h * 0.5
    sx = w/wp
    sy = h/hp
    s  = Math.min( sx, sy )
    ex = wv*0.9 < w and w < wv*1.1
    geo = { w:w, h:h, wi:wi, hi:hi, wp:wp, hp:hp, wv:wv, hv:hv, r:r, x0:x0, y0:y0, sx:sx, sy:sy, s:s, ex:ex }
    #Util.log( 'Pane.geom()', geo )
    geo

  show:()  -> @$.show()
  hide:()  -> @$.hide()

  pc:(v) -> @view.pc(v)
  xs:(x) -> @view.xs(x)
  ys:(y) -> @view.ys(y)

  xcenter:( left, width,  w, scale=1.0, dx=0 ) -> scale * ( left + 0.5*width   - 11            + dx/@wscale )
  xcente2:( left, width,  w, scale=1.0, dx=0 ) -> scale * ( left + 0.5*width   - 0.5*w/@wscale + dx/@wscale )
  ycenter:( top,  height, h, scale=1.0, dy=0 ) -> scale * ( top  + 0.5*height  - 0.5*h/@hscale + dy/@hscale )
  right:(   left, width,  w, scale=1.0, dx=0 ) -> scale * ( left + width       - 0.5*w/@wscale + dx/@wscale )
  bottom:(  top,  height, h, scale=1.0, dy=0 ) -> scale * ( top  + height      - 0.5*h/@hscale + dy/@hscale )

  north:(  top,  height, h, scale=1.0, dy=0 ) -> scale * ( top           - h + dy/@hscale )
  south:(  top,  height, h, scale=1.0, dy=0 ) -> scale * ( top  + height     + dy/@hscale )
  east:(   left, width,  w, scale=1.0, dx=0 ) -> scale * ( left + width      + dx/@wscale )
  west:(   left, width,  w, scale=1.0, dx=0 ) -> scale * ( left          - w + dx/@wscale )

  adjacentPanes:() ->
    [jp,mp,ip,np] = UI.jmin(@cells)
    [@northPane,@southPane,@eastPane,@westPane] = [@view.emptyPane,@view.emptyPane,@view.emptyPane,@view.emptyPane]
    for pane in @view.panes
      [j,m,i,n] = UI.jmin(pane.cells)
      @northPane = pane if j is jp and m is mp and i is ip-n
      @southPane = pane if j is jp and m is mp and i is ip+np
      @westPane  = pane if i is ip and n is np and j is jp-m
      @eastPane  = pane if i is ip and n is np and j is jp+mp
    return

  createHtml:() ->
    """<div id="#{@htmlId}" class="#{@classPrefix}"></div>"""

  reset:( select ) ->
    @$.css( { left:@xs(@left), top:@ys(@top), width:@xs(@width), height:@ys(@height) } )
    @onSelect( select )
    return

  css:(  left, top, width, height, select ) ->
    @$.css( { left:@pc(left), top:@pc(top), width:@pc(width), height:@pc(height) } )
    @onSelect( select )
    return

  animate:( left, top, width, height, select, aniLinks=false, callback=null ) ->
    @$.show().animate( { left:@pc(left), top:@pc(top), width:@pc(width), height:@pc(height) }, @view.speed, () => @animateCall(callback,select) )
    return

  animateCall:( callback, select ) =>
    @onSelect( select )
    callback(@) if callback?
    return

  onSelect:( select ) ->
    @geo = @geom()
    @page.onSelect( @, select ) if @page?
    return
