(function() {
  var Choices;

  Choices = (function() {
    class Choices {
      constructor(stream, ui) {
        this.onChoice = this.onChoice.bind(this);
        this.stream = stream;
        this.ui = ui;
        this.ui.addContent('Choices', this);
      }

      readyPane() {
        this.$pane = UI.Dom.tree(this.stream, this.spec, 6, 13);
        this.subscribe();
        return this.$pane;
      }

      readyView() {
        var src;
        src = "img/choices/Choices.jpg";
        this.$view = $(`<div ${UI.Dom.panel(0, 0, 100, 100)}></div>`);
        this.$view.append(`<h1 ${UI.Dom.label(0, 0, 100, 10)}>Choices</h1>`);
        this.$view.append(`  ${UI.Dom.image(0, 10, 100, 90, src, 150)}`);
        return this.$view;
      }

      subscribe() {
        this.stream.subscribe('Choice', (choice) => {
          return this.onChoice(choice);
        });
      }

      onChoice(choice) {
        var htmlId, study, value;
        //console.log( 'Choice', choice )
        study = this.spec[choice.name];
        htmlId = Util.getHtmlId(choice.name, 'Choice', choice.study);
        value = choice.value != null ? ":" + choice.value : "";
        if (choice.intent === UI.AddChoice) {
          if (study.num < study.max) {
            study.num++;
            study.$e.append(`<div id="${htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">${choice.study + value}</div>`);
          } else {
            if (choice.$click != null) {
              choice.$click.css({
                color: "white"
              });
            }
            alert(`You can only make ${study.max} choices for ${choice.name}`);
          }
        } else {
          study.num--;
          study.$e.find('#' + htmlId).remove();
        }
      }

    };

    Jitter.Choices = Choices;

    return Choices;

  }).call(this);

}).call(this);
