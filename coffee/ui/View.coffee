`import Util  from '../util/Util.js'`
`import UI    from '../ui/UI.js'`
`import Pane  from '../ui/Pane.js'`
`import Pack from '../ui/Pack.js'`

class View

  constructor:( @ui, @stream, @specs ) ->
    @speed          = 400
    @$view          = UI.$empty
    @margin         = UI.margin
    @ncol           = UI.ncol
    @nrow           = UI.nrow
    @classPrefix    = if Util.isStr(@specs.css) then @spec.css else 'ui-view'
    [@wpane,@hpane,@wview,@hview,@wscale,@hscale] = @percents( @nrow, @ncol, @margin )
    [@packs,@panes] = if UI.hasPack then @createPacks(@specs) else @createPanes(@specs)
    @sizeCallback   = null
    @paneCallback   = null
    @lastPaneName   = ''
    @$empty         = UI.$empty # Empty jQuery singleton for intialization
    @allCells       = [ 1, @ncol, 1, @nrow ]

  ready:() ->
    parent = $('#'+@ui.getHtmlId('View') ) # parent is outside of planes
    htmlId = @ui.htmlId( 'View','Plane' )
    @$view = $( """<div id="#{htmlId}" class="#{@classPrefix}"></div>""" )
    parent.append( @$view )
    pane.ready()  for pane  in @panes
    @subscribe()
    return

  subscribe:() ->
    @stream.subscribe( 'Select', 'View', (select) => @onSelect(select) )

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

  isRow:( specPanePack ) -> specPanePack.css is 'ikw-row'
  isCol:( specPanePack ) -> specPanePack.css is 'ikw-col'

  positionUnionPane:( unionCells, paneCells, spec, xscale=1.0, yscale=1.0 ) ->
    [ju,mu,iu,nu] = @jmin( unionCells )
    [jp,mp,ip,np] = @jmin(  paneCells )
    @position( (jp-ju)*@ncol/mu, mp*@ncol/mu, (ip-iu)*@nrow/nu, np*@nrow/nu, spec, xscale, yscale )

  positionPack:( packCells, spec, xscale=1.0, yscale=1.0 ) ->
    [j,m,i,n] = @jmin( packCells )
    @position( j,m,i,n, spec, xscale, yscale )

  positionPane:( paneCells, spec, xscale=1.0, yscale=1.0 ) ->
    [j,m,i,n] = @jmin( paneCells )
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
    for pane  in @panes
      pane.intent = select.intent
      pane.reset( select )
    return

  resize:() =>
    saveId  = @lastPaneName
    @lastPaneName = ''
    @onSelect( UI.select( saveId, 'View', UI.SelectPane ) )
    @lastPaneName  = saveId
    return

  hide:() ->
    @$view.hide()
    return

  show:() ->
    @$view.show()
    return

  hideAll:( name='None' ) ->
    pane. hide() for pane  in @panes when pane.name isnt name
    @$view.hide()
    return

  showAll:() ->
    @$view.hide()
    #@reset( @selectView )
    pane.  show() for pane  in @panes
    @$view.show( @speed, () => @sizeCallback(@) if @sizeCallback )
    return

  onSelect:( select ) ->
    UI.verifySelect( select, 'View' )
    name    = select.name
    intent  = select.intent
    switch intent
      when UI.SelectView  then @expandAllPanes( select )
      when UI.SelectPack  then @expandPack(     select, @getPane(name) )
      when UI.SelectPane  then @expandPane(     select, @getPane(name) )
      when UI.SelectStudy then @expandStudy(    select, @getPane(name) )
      else console.error( 'UI.View.onSelect() name not processed for intent', name, select )
    return

  expandAllPanes:( select ) ->
    @hideAll()
    @reset( select )
    @showAll()

  expandPack:( select, pack, callback=null ) ->
    @hideAll('Interact')
    if  pack.panes?
      for pane in pack.panes
        pane.show()
        #left,top,width,height] = @positionUnionPane( pack.cells, pane.cells, pane.spec, @wscale, @hscale )
        [left,top,width,height] = @positionPane( pane.cells, pane.spec, @wscale, @hscale )
        pane.intent = select.intent
        pane.animate( left, top, width, height, select, true, callback )
    else
      console.error( 'View.expandPack pack.panes null' )
    @show()
    @lastPaneName  = 'None'
    return

  expandPane:( select, pane,  callback=null ) ->
    paneCallback = if callback? then callback else @paneCallback
    pane = @getPane( pane, false ) # don't issue errors
    return unless pane?
    @hideAll()
    pane.resetStudiesDir( true )
    pane.show()
    pane.intent = select.intent
    pane.animate( @margin.west, @margin.north, 100*@wview, 100*@hview, select, true, paneCallback )
    @show()
    @lastPaneName   = pane.name
    return

  expandStudy:(   select, pane,  callback=null ) ->
    @expandPane(  select, pane,  callback )
    console.info( 'View.expandStudy()', { study:select.study } ) if @stream.isInfo('Select')
    return unless select.study?
    pane.resetStudiesDir( false )                  # Hide all studies
    pane.resetStudyDir(   true,  true, select.study.dir ) # Expand selected
    return

  getPane:( key, issueError=true  ) ->
    return key if Util.isObj(key)
    for pane in @panes
      return pane if pane.name is key
    for pack in @packs
      return pack if pack.name is key
    console.error( 'UI.View.getPane() null for key ', key ) if issueError
    null

  createPanes:( specs ) ->
    panes = []
    for own pkey, pspec of specs when UI.isChild(pkey)
      pane = new Pane( @ui, @stream, @, pspec )
      panes.push( pane )
    if UI.hasPack then panes else [[],panes]

  createPacks:( specs ) ->
    packs   = []
    panes   = []
    interact = new Pane( @ui, @stream, @, specs['Interact'] )
    panes.push( interact )
    specs['Interact'].pane = interact
    for own gkey, gspec of specs when UI.isChild(gkey)
      gpanes = @createPanes( gspec )
      pack = new Pack( @ui, @stream, @, gspec, gpanes )
      packs.push( pack )
      Array.prototype.push.apply( panes, gpanes )
    [packs,panes]

  paneInUnion:( paneCells, unionCells ) ->
    [jp,mp,ip,np] = @jmin(  paneCells )
    [ju,mu,iu,nu] = @jmin( unionCells )
    ju <= jp and jp+mp <= ju+mu and iu <= ip and ip+np <= iu+nu

  expandCells:( unionCells, allCells ) ->  # Not Implemented
    [ju,mu,iu,nu] = @jmin( unionCells )
    [ja,ma,ia,na] = @jmin(   allCells )
    [ (ju-ja)*ma/mu, ma, (iu-ia)*na/nu, na ]

  jmin:( cells ) ->
    Util.trace('UI.jmin') if not cells?
    [ cells[0]-1,cells[1],cells[2]-1,cells[3] ]

  toCells:( jmin ) ->
    [ jmin[0]+1,jmin[1],jmin[2]+1,jmin[3] ]

  unionCells:( cells1, cells2 ) ->
    [j1,m1,i1,n1] = UI.jmin( cells1 )
    [j2,m2,i2,n2] = UI.jmin( cells2 )
    [ Math.min(j1,j2)+1, Math.max(j1+m1,j2+m2)-Math.min(j1,j2), Math.min(i1,i2)+1, Math.max(i1+n1,i2+n2)-Math.min(i1,i2) ]

  intersectCells:( cells1, cells2 ) ->
    [j1,m1,i1,n1] = UI.jmin( cells1 )
    [j2,m2,i2,n2] = UI.jmin( cells2 )
    [ Math.max(j1,j2)+1, Math.min(j1+m1,j2+m2), Math.max(i1,i2)+1, Math.min(i1+n1,i2+n2) ]

`export default View`