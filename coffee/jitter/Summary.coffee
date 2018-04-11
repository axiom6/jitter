
`import UI   from '../ui/UI.js'`
`import Dom  from '../ui/Dom.js'`

class Summary

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Summary', @ )

  readyPane:() ->
    @$pane = Dom.tree( @stream, @spec, 6, 13 )
    @subscribe()
    @$pane

  readyView:() ->
    src = "img/summary/Summary.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Summary</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view

  subscribe:() ->
    @stream.subscribe( 'Choice', (choice) => @onChoice(choice) )
    return

  onChoice:( choice ) =>
    #console.log( 'Choice', choice )
    study  = @spec[choice.name]
    return if not study?
    htmlId = UI.getHtmlId( choice.name, 'Choice',  choice.study )
    value  = if choice.value? then ":"+choice.value else ""
    if choice.intent is UI.AddChoice
      if study.num < study.max
         study.num++
         study.$e.append("""<div id="#{htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">#{choice.study+value}</div>""" )
      else
        choice.$click.css( { color:"white" } ) if choice.$click?
        alert( "You can only make #{study.max} choices for #{choice.name}" )
    else
      study.num--
      study.$e.find('#'+htmlId).remove()
    return

`export default Summary`