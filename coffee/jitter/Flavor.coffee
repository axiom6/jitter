
import UI    from '../ui/UI.js'

import Dom   from '../ui/Dom.js'
import Vis   from '../vis/Vis.js'
import Wheel from '../vis/Wheel.js'

export default class Flavor

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Flavor', @ )
    @wheel = new Wheel( @stream )
    @srcLg = "img/logo/JitterBoxHead.png"
    @srcRx = "img/logo/JitterBoxRx.png"
    @srcRy = "img/logo/JitterBoxRy.png"

  readyPane:() ->
    url   = "json/flavor.choice.json"
    scale = 1.3
    divId = UI.getHtmlId( "Wheel", @pane.name )
    $p = @pane.$
    #p.append( """     #{Dom.image( 0, 0,100, 10,@srcLg,15,"","24px") }""" )
    #p.append( """     #{Dom.image(-4, 0, 15, 10,@srcRy,30,"","24px") }""" )
    #p.append( """     #{Dom.image(75, 0, 15, 10,@srcRx,30,"","24px") }""" )
    $w =    $( """<div #{Dom.panel( 0, 5,100, 95)} id="#{divId}"></div>""" )
    #w.css( { "background-image":"url(img/flavor/jitterPourOverBg.png)" } )
    #w.css( { "background-color":"#8d6566" } )
    @wheel.ready( @pane, @spec, $w.get(0), url, scale )
    window.addEventListener("resize", @resize );
    $w

  resize:() =>
    @pane.geo = @pane.geom()
    @wheel.resize()

  readyView:() ->
    src = "img/flavor/Flavor.png"
    @$view.append( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( """<h1  #{Dom.label(0, 0,100, 10)}>Flavor</h1>""" )
    @$view.append( """     #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view




