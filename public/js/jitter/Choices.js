(function() {
  var Choices;

  Choices = (function() {
    class Choices {
      constructor(stream) {
        this.onChoice = this.onChoice.bind(this);
        this.stream = stream;
      }

      overview(pane, spec) {
        Util.noop(pane, spec);
      }

      ready(pane, spec) {
        this.spec = spec;
        Jitter.tree(pane, spec, 6, 13);
        this.subscribe();
      }

      create(pane, spec) {
        Util.noop(pane, spec);
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
