
`import Util    from '../util/Util.js'`
`import UI      from '../ui/UI.js'`
`import Pane    from '../ui/Pane.js'`

class Pack extends Pane

  constructor:( ui, stream, view, spec, @panes ) ->
    super(      ui, stream, view, spec )
    @margin   = @view.margin
    @icon     = @spec.icon
    @css      = if Util.isStr(@spec.css) then @spec.css else 'ui-pack'
    @$        = UI.$empty

  id:( name, ext ) ->
    @ui.htmlId( name+'Pack', ext )

  ready:() ->
    @htmlId = @id( @name, 'Pack' )
    @$icon = @createIcon()
    @view.$view.append( @$icon )
    select = UI.select( @name, 'Pack', @spec.intent )
    @stream.publish( 'Select', select, @$icon, 'click' )

  @show:() ->
    super.show()
    pane .show() for pane in @panes

  @hide:() ->
    super.hide()
    pane .hide() for pane in @panes

  createIcon:() ->
    htm   = @htmIconName( @spec )
    $icon = $(htm)
    [left,top,width,height] = @positionIcon( @spec )
    $icon.css( { left:@xs(left), top:@ys(top), width:@pc(width), height:@pc(height) } )
    $icon

  htmIconName:( spec ) ->
    htm  = """<div  id="#{@id(spec.name,'Icon')}" class="#{@css}-icon" style="display:table; font-size:1.2em;">"""
    htm += """<i class="fa #{spec.icon} fa-lg"></i>""" if spec.icon
    htm += if spec.css is 'ikw-col' then @htmColName(spec) else @htmRowName(spec)
    htm += """</div>"""

  htmColName:( spec ) ->
    """<span style="display:table-cell; vertical-align:middle; padding-left:12px;">#{Util.toName(spec.name)}</span>"""

  htmRowName:( spec ) ->
    """<div style="display:table-cell; vertical-align:middle; padding-left:12px;">#{Util.toName(spec.name)}</div>"""

  positionIcon:( spec ) ->
    w = if spec.w? then spec.w*@wscale*0.5 else 100*@wscale*0.5 # Calulation does not make sense but it works
    #Util.log( 'Pack.positionIcon', @left, @width, w, @xcenter( @left, @width, w ) ) if spec.intent is ub.SelectCol
    switch spec.intent
      when UI.SelectRow   then [-10, @ycenter( @top, @height, @margin.west ),     12,  @margin.west ]
      when UI.SelectCol   then [@xcenter( @left, @width, w ), 0,  @margin.north, @margin.north ]
      when UI.SelectPack then [@xcenter( @left, @width, w ), 0,  @margin.north, @margin.north ]
      else @positionPackIcon()

  positionPack:() ->
    [left,top,width,height] = @view.positionPack( @cells, @spec )
    @$.css( { left:@xs(left), top:@ys(top), width:@xs(width), height:@ys(height) } ) # , 'background-color':fill } )

  positionPackIcon:() ->
    [left,top,width,height] = @view.positionPack( @cells, @spec )
    [left+20,top+20,20,20]

  animateIcon:( $icon ) ->
    [left,top,width,height] = @positionIcon()
    $icon.animate( { left:@xs(left), top:@ys(top), width:@pc(width), height:@pc(height) } )

  unionPanes:( ) ->
    gpanes = []
    [jg,mg,ig,ng] = UI.jmin(@cells)
    for pane in @view.panes
      [jp,mp,ip,np] = UI.jmin(pane.cells)
      gpanes.push(pane) if jg <= jp and jp+mp <= jg+mg and ig <= ip and ip+np <= ig+ng
    gpanes

  # Not used
  fillPanes:() ->
    fill = if @spec['hsv']? then Vis.toRgbHsvStr( @spec['hsv'] ) else "#888888"
    for pane in @panes
      pane.$.css( { 'background-color':fill } )
    return

  animate:( left, top, width, height, parent=null, callback=null ) ->
    @$.animate( { left:@pc(left), top:@pc(top), width:@pc(width), height:@pc(height) }, @speed, () => callback(@) if callback? )
    return

`export default Pack`