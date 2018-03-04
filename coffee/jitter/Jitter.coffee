
class Jitter

  #module.exports = Jitter

  @init = () ->

    Util.ready ->
      subjects = ['Select','Content','Connect','Test','Plane','About','Slide','Image',
        'Cursor','Navigate','Settings','Submit','Toggle']
      stream   = new Util.Stream( subjects )
      page     = new Jitter.Page( stream )
      ui       = new UI(          stream, page )
      Util.noop( ui )
      return

    return

  @abs:( x, y, w, h ) ->
    """style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center; font-size:24px;" """

  @abi:( x, y, w, h, src, mh, label="" ) ->
    htm = """<div     style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">
         <div   style="display:table-cell; vertical-align:middle;">
           <img style="display:block; margin-left:auto; margin-right:auto; max-height:#{mh}px;" src="#{src}"/>"""
    htm += """<div style="color:white; font-size:20px; padding-top:4px;">#{label}</div>"""  if Util.isStr(label)
    htm += """</div></div>"""
    htm

  @rel:( x, y, w, h ) ->
    """style="position:relative; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center;" """

  @img:( src ) ->
    """<div style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="#{src}"/></div>"""

  @txt:( ) ->
    """style="color:white; text-align:center;"  """