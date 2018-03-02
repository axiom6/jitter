
class Jitter

  #module.exports = Jitter

  @init = () ->

    Util.ready ->
      subjects = ['Select','Content','Connect','Test','Plane','About','Slide','Image',
        'Cursor','Navigate','Settings','Submit','Toggle']
      stream   = new Util.Stream( subjects )
      page     = new UI.Page( stream )
      ui       = new UI(      stream, page )
      Util.noop( ui )
      return

    return