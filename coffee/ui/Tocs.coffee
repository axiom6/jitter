
import Util    from '../util/Util.js'
import UI      from '../ui/UI.js'

export default class Tocs

  Tocs.MaxTocLevel  = 12

  constructor:( @ui, @stream, @practices ) ->
    [@specs,@stack] = @createTocsSpecs( @practices )
    #@logSpecs()
    @htmlIdApp   = @ui.getHtmlId('Tocs','')
    @classPrefix = if Util.isStr(@practices.css) then @practices.css else 'tocs'
    @last        = @specs[0]
    @speed       = 400

  createTocsSpecs:( practices ) ->
    spec0     = { level:0, name:"Beg" }
    stack     = new Array(Tocs.MaxTocLevel)
    stack[0]  = spec0
    specs     = []
    specs.push( spec0 )
    for own keyPrac, practice of practices
      pracToc  = if practice['toc']? then practice['toc'] else true
      hasChild = if keyPrac is "Overview" then false else pracToc
      @enrichSpec( keyPrac, practice, specs, 1, spec0, hasChild,  true )
      for own keyStudy, study of practice when hasChild and UI.isChild(keyStudy)
        practice.hasChild = true
        @enrichSpec( keyStudy, study, specs, 2, practice, false, false )
    specN = { level:0, name:"End" }
    specs.push( specN )
    [specs,stack]

  logSpecs:() ->
    for spec in @specs
      console.log( 'UI.Tocs.spec', Util.indent(spec.level*2), spec.name, spec.hasChild )
    return

  enrichSpec:( key, spec, specs, level, parent, hasChild, isRow ) ->
    spec.level    = level
    spec.parent   = parent
    spec.name     = if spec.name? then spec.name else key  # Need to learn why this is needed
    spec.on       = false
    spec.hasChild = hasChild
    spec.isRow    = isRow
    specs.push( spec )
    return

  ready:() ->
    @$tocs = $( @html() )
    @$tocp = $('#'+@htmlIdApp)
    @$tocp.append( @$tocs )
    for spec in @specs when spec.level > 0
      spec.$elem       = if spec.hasChild then $('#'+spec.ulId) else $('#'+spec.liId)
      spec.$li         = $('#'+spec.liId )
      select           = @toSelect( spec )
      @stream.publish( 'Select', select, spec.$li, 'click', spec.liId  )
    @subscribe()
    return

  toSelect:( spec ) ->
    if spec.level is 2 # Study
      UI.select(  spec.parent.name, 'Tocs', UI.SelectStudy, spec.parent[spec.name] )
    else               # Practice and everything else for now
      intent = UI.SelectPane
      intent = UI.SelectView if spec.name is 'Overview'
      UI.select(  spec.name, 'Tocs', intent )

  subscribe:() ->
    @stream.subscribe( 'Select', (select) => @onSelect(select) )
    return

  htmlId:( spec, ext = '' ) ->
    suffix = if spec.parent? then ext + spec.parent.name else ext
    UI.htmlId( spec.name, 'Tocs', suffix )

  getSpec:( select, issueError=true ) ->
    for spec in @specs
      return spec if spec.name is select.name
    console.error( 'UI.Tocs.getSpec(id) spec null for select', select ) if issueError and @nameNotOk(select.name)
    null

  nameNotOk:( name ) ->
    okNames = ['None','Embrace','Innovate','Encourage','Overview','Technique']
    for okName in okNames
      return false if name is okName
    true

  html:() ->
    @specs[0].ulId = @htmlId(@specs[0],'UL')
    htm  = """<ul class="#{@classPrefix}ul0" id="#{@specs[0].ulId}">"""
    for i in [1...@specs.length]
      htm += @process( i  )
    htm

  show:() ->
    @$tocs.show()
    return

  hide:() ->
    @$tocs.hide()
    return

  process:( i ) ->
    htm  = ""
    prev = @specs[i-1]
    spec = @specs[i]
    if  spec.level >= prev.level
      htm += @htmlBeg( spec )
      @stack[spec.level] = spec
    else
      for level in [prev.level..spec.level]
        htm += @htmlEnd(  @stack[level] ) if @stack[level]?
      htm += @htmlBeg(  spec ) if i < @specs.length-1
    htm

  htmlBeg:( spec ) ->
    spec.liId = @htmlId(spec,'LI')
    spec.ulId = @htmlId(spec,'UL')
    #console.log( 'UI.Tocs htmlBeg()', spec.id, spec.liId, spec.ulId )
    htm  = """<li class="#{@classPrefix}li#{spec.level}" id="#{spec.liId}" >"""
    htm += """#{@htmIconName(spec)}"""
    htm += """<ul class="#{@classPrefix}ul#{spec.level}" id="#{spec.ulId}">""" if spec.hasChild
    htm

  htmIconName:( spec ) ->
    htm  = """<div style="display:table;">"""
    htm += """<i class="fa #{spec.icon} fa-lg"></i>""" if spec.icon
    htm += """<span style="display:table-cell; vertical-align:middle; padding-left:12px;">#{Util.toName(spec.name)}</span>"""
    htm += """</div>"""

  htmlEnd:( spec ) ->
    if spec.level == 0    then """</ul>"""
    else if spec.hasChild then """</ul></li>"""
    else                       """</li>"""

  onSelect:( select ) ->
    UI.verifySelect( select, 'Tocs' )
    #return if @ui.notInPlane()
    spec = @getSpec( select, true ) # spec null ok not all Tocs available for views
    @update( spec ) if spec?
    return

  update:( spec ) ->
    @stack[spec.level] = spec
    for level in  [spec.level..2] by -1  # Build stack to turn on spec levels
      @stack[level-1] =  @stack[level].parent
    last = @last
    for level in [@last.level..1] by -1  # Turn off items that are different or below level
      @reveal( last ) if last.name isnt @stack[level].name or level > spec.level
      last = last.parent
    for level in [1..spec.level]  by  1  # Turn  on  items in the spec stack
      @reveal( @stack[level] ) if not @stack[level].on
    @last = spec
    return

  reveal:( spec ) ->
    spec.on = not spec.on
    return if spec.level == 0
    if spec.hasChild
      spec.$elem.toggle(@speed)
    else
      spec.$elem.css( color: if spec.on then '#FFFF00' else '#FFFFFF' )
    return
