
`import Util from '../util/Util.js'`
`import UI   from '../ui/UI.js'`

class Spec

  constructor:( @ui, @stream, data ) ->
     @specs  = @createSpecs( data )
     @packs = []
     @panes  = []


  createSpecs:( data ) ->
    specs = {}
    for gkey, group of data when UI.isChild(gkey)
      group['name']   = gkey
      specs[gkey]     = group
      group.practices = {}
      for pkey, practice of group when UI.isChild(pkey)
        practice['name']      = pkey
        practice.studies      = {}
        group.practices[pkey] = practice
        delete group[pkey]
        for skey, study of practice  when UI.isChild(skey)
          study['name']          = skey
          study.topics           = {}
          practice.studies[skey] = study
          delete practice[skey]
          for tkey, topic of study  when UI.isChild(tkey)
            topic['name']      = tkey
            topic.items        = {}
            study.topics[tkey] = topic
            delete study[tkey]
            for ikey, item of topic when UI.isChild(ikey)
              item['name']       = ikey
              topic.items[ikey]  = item
              delete topic[ikey]
    specs

  packPanes:( key ) ->
    panes = []
    for    own gkey, group of @specs when @ui.isChild(gkey)
      if gkey is key
        for own pkey, prac of group  when @ui.isChild(pkey)
          panes.push( prac.pane )
        return panes
    panes

  packs:() ->
    panes = []
    for own gkey, group of @specs when @ui.isChild(gkey)
      panes.push( group.pane )
    panes

`export default Spec`
