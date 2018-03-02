
class Jitter

  #module.exports = Jitter

  @init = () ->

    Util.ready ->
      subjects = ['Select','Content','Connect','Test','Plane','About','Slide','Image',
        'Cursor','Navigate','Settings','Submit','Toggle']
      stream   = new Util.Stream( subjects )
      ui       = new UI( stream )
      Util.noop( ui )
      return

    return