
class Jitter

  @init = () ->

    Util.ready ->
      subjects = ['Select']
      stream   = new Util.Stream( subjects )
      page     = new Jitter.Page( stream )
      ui       = new UI(          stream, page )
      Util.noop( ui )
      return

    return

  #   "Overview": { "name":"Overview", "cells":[1,36,1,24], "toc":false, "pane":false },

  @abs:( x, y, w, h ) ->
    """style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center; font-size:24px; color:white;" """

  @abi:( x, y, w, h, src, mh, label="" ) ->
    htm  = """<div     style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">"""
    htm += """<div   style="display:table-cell; vertical-align:middle;">"""
    htm += """<img style="display:block; margin-left:auto; margin-right:auto; max-height:#{mh}px;" src="#{src}"/>""" if src?
    htm += """<div style="color:white; font-size:14px; padding-top:6px; line-height:16px">#{label}</div>"""  if Util.isStr(label)
    htm += """</div></div>"""
    htm

  @rel:( x, y, w, h ) ->
    """style="position:relative; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center;" """

  @img:( src ) ->
    """<div style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="#{src}"/></div>"""

  @txt:( ) ->
    """style="color:white; text-align:center;"  """

  @horz:( pane, spec, imgDir, hpc=1.00, x0=0, y0=0 ) ->
    th = if spec.name is 'Roast' then 18 else 13  # A hack
    $e  = $( """<div   #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append(  """<h2 #{Jitter.abs(0,th, 10, 90)}>#{spec.name}</h2>""" )
    where = (key) -> UI.isChild(key)
    array = Util.toArray( spec, where, 'id')
    n  =  array.length
    i  =   0
    x  =  x0
    y  =  y0
    dx = (100-x0) / n
    for i in [0...n]
      src = if array[i].icon? then imgDir + array[i].icon else null
      $e.append( """#{Jitter.abi(x,y,dx,100*hpc,src,65*hpc,array[i].name)}"""  )
      x =   x + dx
    pane.$.append( $e )
    return

  @vert:( pane, spec, imgDir, hpc=1.00, x0=0, y0=0 ) ->
    $e = $( """<div   #{Jitter.rel(0,0,100,100)}></div>""" )
    $e.append( """<h2 #{Jitter.abs(0,0,100, 10)}>#{spec.name}</h2>""" )
    where = (key) -> UI.isChild(key)
    array = Util.toArray( spec, where, 'id')
    n  =  array.length
    i  =  0
    x  = x0
    y  = y0
    dy = (100-y0-5) / n
    for i in [0...n]
      src = if array[i].icon? then imgDir + array[i].icon else null
      $e.append( """#{Jitter.abi(x,y,100,dy*hpc,src,65*hpc,array[i].name)}"""  )
      y =   y + dy
    pane.$.append( $e )
    return