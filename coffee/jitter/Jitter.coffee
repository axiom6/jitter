
class Jitter

  @init = () ->
    Util.ready ->
      subjects = ['Select','Choice']
      stream   = new Util.Stream( subjects )
      ui       = new UI( stream )
      jitter   = new Jitter( stream, ui )
      Util.noop( jitter  )
      return
    return

  constructor:( @stream, @ui ) ->
    @flavor  = new Jitter.Flavor(  @stream, @ui )
    @choices = new Jitter.Choices( @stream, @ui )
    @roast   = new Jitter.Roast(   @stream, @ui )
    @drink   = new Jitter.Drink(   @stream, @ui )
    @body    = new Jitter.Body(    @stream, @ui )
    @brew    = new Jitter.Brew(    @stream, @ui )

