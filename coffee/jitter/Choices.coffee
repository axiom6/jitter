
class Choices

  Jitter.Choices = Choices

  constructor:( @stream ) ->

  overview:(   pane, spec ) ->
    Util.noop( pane, spec )
    return

  ready:(    pane, spec ) ->
    @spec = spec
    Jitter.tree( pane, spec, 6, 13 )
    @subscribe()
    return

  create:(     pane, spec ) ->
    Util.noop( pane, spec )
    return

  subscribe:() ->
    @stream.subscribe( 'Choice', (choice) => @onChoice(choice) )
    return

  onChoice:( choice ) =>
    #console.log( 'Choice', choice )
    study  = @spec[choice.name]
    htmlId = Util.getHtmlId( choice.name, 'Choice',  choice.study )
    if choice.intent is UI.AddChoice
      if study.num < study.max
         study.num++
         study.$e.append("""<div id="#{htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">#{choice.study}</div>""" )
      else
        choice.$click.css( { color:"white" } ) if choice.$click?
        alert( "You can only make #{study.max} choices for #{choice.name}" )
    else
      study.num--
      study.$e.find('#'+htmlId).remove()
    return

