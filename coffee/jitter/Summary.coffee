
import Util from '../util/Util.js'
import UI   from '../ui/UI.js'
import Dom  from '../ui/Dom.js'
import Base from '../ui/Base.js'

class Summary extends Base

  constructor:( stream, ui, name ) ->
    super(      stream, ui, name )
    @btns = {}
    @flavors = []

  ready:( cname ) =>
    Util.noop( cname )
    @$pane = Dom.tree( @stream, @spec, 'Summary', @, 6, 13 )
    @subscribe()
    @$pane

  subscribe:() ->
    @stream.subscribe( 'Region', @name, (region) => @onRegion(region) ) if @name is "Summarym"
    @stream.subscribe( 'Choice', @name, (choice) => @onChoice(choice) )
    return

  onRegion:( region ) =>
    for flavor in @flavors
      choice = UI.toTopic( "Flavor", 'Summary', UI.DelChoice, flavor )
      @onChoice( choice )
    if region? and  region.flavors?
      for flavor in region.flavors
        choice = UI.toTopic( "Flavor", 'Summary', UI.AddChoice, flavor )
        @onChoice( choice )
      @flavors = region.flavors

  onChoice:( choice ) =>
    specStudy  = @spec[choice.name]
    return if not specStudy?
    console.info( 'Summary.onChoice()', choice ) if @stream.isInfo('Choice') and @name is "Summaryp"
    htmlId = Util.getHtmlId( choice.name, 'Choice',  choice.study )
    $e = @btns[choice.name].$e
    if choice.intent is UI.AddChoice
      $e.append("""<div id="#{htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">#{Util.toName(choice.study)}</div>""" )
    else
      $e.find('#'+htmlId).remove()
    return

export default Summary