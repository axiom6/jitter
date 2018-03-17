
class View

  UI.View = View

  constructor:( @ui, @stream, @practices ) ->
    @speed       = 400
    @$view       = UI.$empty
    @margin      = UI.margin
    @ncol        = UI.ncol
    @nrow        = UI.nrow
    @classPrefix = if Util.isStr(@practices.css) then @spec.css else 'ui-view'
    [@wpane,@hpane,@wview,@hview,@wscale,@hscale] = @percents( @nrow, @ncol, @margin )
    @panes     = @createPanes( @practices )
    @sizeCallback  = null
    @paneCallback  = null
    @lastPaneName  = ''
    @emptyPane     = UI.$empty
    @allCells = [ 1, @ncol, 1, @nrow ]
    @select   = UI.select( "Overview", "View", UI.SelectOverview )

  ready:() ->
    parent = $('#'+@ui.getHtmlId('View') ) # parent is outside of planes
    htmlId = @ui.htmlId( 'View','Plane' )
    html   = $( """<div id="#{htmlId}" class="#{@classPrefix}"></div>""" )
    parent.append( html )
    @$view = parent.find('#'+htmlId )
    pane.ready()  for pane  in @panes
    @subscribe()
    return

  subscribe:() ->
    @stream.subscribe( 'Select', (select) => @onSelect(select) )

  percents:( nrow, ncol, margin ) ->
    wpane  = 100 / ncol
    hpane  = 100 / nrow
    wview  = 1.0 - ( margin.west   + margin.east  ) / 100
    hview  = 1.0 - ( margin.north  + margin.south ) / 100
    wscale = 1.0 - ( margin.west  + (ncol-1) * margin.width  + margin.east  ) / 100  # Scaling factor for panes once all
    hscale = 1.0 - ( margin.north + (nrow-1) * margin.height + margin.south ) / 100  # margins gutters are accounted for
    [wpane,hpane,wview,hview,wscale,hscale]

  pc:(v) -> v.toString() + if v isnt 0 then '%' else ''
  xs:(x) -> @pc( x * @wscale )
  ys:(y) -> @pc( y * @hscale )

  left:(j)    -> j * @wpane
  top:(i)     -> i * @hpane
  width:(m)   -> m * @wpane + (m-1) * @margin.width  / @wscale
  height:(n)  -> n * @hpane + (n-1) * @margin.height / @hscale

  widthpx:()  -> @$view.innerWidth()    # Use @viewp because
  heightpx:() -> @$view.innerHeight()   # Use @viewp because @$view

  wPanes:()   -> @wview * @widthpx()
  hPanes:()   -> @hview * @heightpx()

  north:(  top,  height, h, scale=1.0, dy=0 ) -> scale * ( top           - h + dy/@hscale )
  south:(  top,  height, h, scale=1.0, dy=0 ) -> scale * ( top  + height     + dy/@hscale )
  east:(   left, width,  w, scale=1.0, dx=0 ) -> scale * ( left + width      + dx/@wscale )
  west:(   left, width,  w, scale=1.0, dx=0 ) -> scale * ( left          - w + dx/@wscale )

  isRow:( specPaneGroup ) -> specPaneGroup.css is 'ikw-row'
  isCol:( specPaneGroup ) -> specPaneGroup.css is 'ikw-col'

  jmin:( cells ) -> UI.jmin( cells )

  positionUnionPane:( unionCells, paneCells, spec, xscale=1.0, yscale=1.0 ) ->
    [ju,mu,iu,nu] = UI.jmin( unionCells )
    [jp,mp,ip,np] = UI.jmin(  paneCells )
    @position( (jp-ju)*@ncol/mu, mp*@ncol/mu, (ip-iu)*@nrow/nu, np*@nrow/nu, spec, xscale, yscale )

  positionGroup:( groupCells, spec, xscale=1.0, yscale=1.0 ) ->
    [j,m,i,n] = UI.jmin( groupCells )
    @position( j,m,i,n, spec, xscale, yscale )

  position:( j,m,i,n, spec, xscale=1.0, yscale=1.0 ) ->
    wStudy = if spec.name? then @margin.wStudy else 0
    hStudy = if spec.name? then @margin.hStudy else 0
    left   = xscale * ( @left(j)   + ( wStudy + @margin.west  + j * @margin.width  ) / @wscale )
    top    = yscale * ( @top(i)    + ( hStudy + @margin.north + i * @margin.height ) / @hscale )
    width  = xscale * ( @width(m)  -   wStudy * 2 / @wscale )
    height = yscale * ( @height(n) -   hStudy * 2 / @hscale )
    [left,top,width,height]

  positionpx:( j,m,i,n, spec ) ->
    [left,top,width,height] = @position( j,m,i,n, spec, @wscale, @hscale )
    [width*@widthpx()/100, height*@heightpx()/100]

  reset:( select ) ->
    @select.name   = select.name
    @select.intent = select.intent
    pane.reset(@select) for pane  in @panes
    return

  resize:() =>
    saveId  = @lastPaneName
    @lastPaneName = ''
    @onSelect( UI.select( saveId, 'View', UI.SelectPractice ) )
    @lastPaneName  = saveId
    return

  hide:() ->
    @$view.hide()
    return

  show:() ->
    @$view.show()
    return

  hideAll:() ->
    pane. hide() for pane  in @panes
    @$view.hide()
    return

  showAll:() ->
    @$view.hide()
    @reset( @select )
    pane.  show() for pane  in @panes
    @$view.show( @speed, () => @sizeCallback(@) if @sizeCallback )
    return

  onSelect:( select ) ->
    UI.verifySelect( select, 'View' )
    name    = select.name
    intent  = select.intent
    @select = select
    switch intent
      when UI.SelectReady     then @expandAllPanes()
      when UI.SelectOverview  then @expandAllPanes()
      when UI.SelectPractice  then @expandPane( @getPaneOrGroup(name) )
      when UI.SelectStudy     then @expandPane( @getPaneOrGroup(name) )
      else Util.error( 'UI.View.onSelect() name not processed for intent', name, select )
    return

  expandAllPanes:() ->
    @hideAll()
    @reset( @select )
    @showAll()

  expandPane:( pane,  callback=null ) ->  # , study=null
    paneCallback = if callback? then callback else @paneCallback
    pane = @getPaneOrGroup( pane, false ) # don't issue errors
    return unless pane?
    @hideAll()
    pane.show()
    pane.animate( @margin.west, @margin.north, 100*@wview, 100*@hview, @select, true, paneCallback )
    @show()
    @lastPaneName   = pane.name
    return

  getPaneOrGroup:( keyOrPane, issueError=true  ) ->
    return keyOrPane if not keyOrPane? or Util.isObj(keyOrPane)
    key =  keyOrPane
    for pane in @panes
      return pane if pane.name is key
    if @groups?
      for group in @groups
        return group if group.name is key
    Util.error( 'UI.View.getPaneOrGroup() null for key ', key ) if issueError
    @emptyPane

  createPanes:( practices ) ->
    panes = []
    for own keyPractice, practice of practices when practice.pane
      pane = new UI.Pane( @ui, @stream, @, practice )
      panes.push( pane )
      practice.pane = pane
      # @createStudyPanes( practice, panes )
    panes

  paneInUnion:( paneCells, unionCells ) ->
    [jp,mp,ip,np] = UI.jmin(  paneCells )
    [ju,mu,iu,nu] = UI.jmin( unionCells )
    ju <= jp and jp+mp <= ju+mu and iu <= ip and ip+np <= iu+nu

  expandCells:( unionCells, allCells ) ->  # Not Implemented
    [ju,mu,iu,nu] = UI.jmin( unionCells )
    [ja,ma,ia,na] = UI.jmin(   allCells )
    [ (ju-ja)*ma/mu, ma, (iu-ia)*na/nu, na ]
