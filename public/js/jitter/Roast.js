(function() {
  var Roast;

  Roast = (function() {
    class Roast {
      constructor(stream) {
        this.doClick = this.doClick.bind(this);
        this.stream = stream;
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/roast/Coffee-Bean-Roast-Ready.jpg";
        $e = $(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.label(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.image(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        var $i, src;
        this.spec = spec;
        src = "img/roast/RoastsBig.png";
        pane.$.append(`<div   ${Jitter.panel(0, 0, 100, 100)}></div>`);
        pane.$.append(`<div ${Jitter.label(3, 42, 10, 16)}>${spec.name}</div>`);
        $i = $(`${this.image(16, 8, 75, 78, src, 15)}`);
        $i.append(`<div ${Jitter.label(3, 82, 16, 10, "roast")}>Light</div>`);
        $i.append(`<div ${Jitter.label(24, 82, 16, 10, "roast")}>Medium Light</div>`);
        $i.append(`<div ${Jitter.label(42, 82, 16, 10, "roast")}>Medium</div>`);
        $i.append(`<div ${Jitter.label(66, 82, 16, 10, "roast")}>Medium Dark</div>`);
        $i.append(`<div ${Jitter.label(86, 82, 16, 10, "roast")}>Dark</div>`);
        pane.$.append($i);
        pane.$.append("</div></div>");
        $(".roast").on('click', (event) => {
          return this.doClick(event);
        });
      }

      doClick(event) {
        var $e, addDel, choice, color, key, name, study;
        $e = $(event.target);
        name = $e.text();
        key = name.replace(" ", "");
        study = this.spec[key];
        study.chosen = !((study.chosen != null) || study.chosen) ? true : false;
        addDel = study.chosen ? UI.AddChoice : UI.DelChoice;
        color = study.chosen ? Jitter.choiceColor : Jitter.basisColor;
        $e.css({
          color: color
        });
        choice = UI.select('Roast', 'Jitter', addDel, name);
        choice.$click = $e;
        Jitter.stream.publish('Choice', choice);
      }

      image(x, y, w, h, src, mh) { // max-height:#{mh}vmin;
        var htm, klass;
        klass = src != null ? "image" : "texts";
        htm = `<div class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
        htm += "<div style=\"display:table-cell; vertical-align:middle;\">";
        if (src != null) {
          htm += `<img style="display:block; margin-left:auto; margin-right:auto;  width:100%; max-height:${mh}vmin; border-radius:24px;" src="${src}"/>`;
        }
        return htm;
      }

      create(pane, spec) {
        var $e, src;
        pane.$.append(`<h1>${spec.name}</h1>`);
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        src = "img/roast/FiveRoasts.jpeg";
        $e.append(`<img ${Jitter.img(src)}/>`);
        //$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
        pane.$.append($e);
      }

    };

    Jitter.Roast = Roast;

    return Roast;

  }).call(this);

}).call(this);
