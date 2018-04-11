import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Summary;

Summary = class Summary {
  constructor(stream, ui) {
    this.onChoice = this.onChoice.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Summary', this);
  }

  readyPane() {
    this.$pane = Dom.tree(this.stream, this.spec, 6, 13);
    this.subscribe();
    return this.$pane;
  }

  readyView() {
    var src;
    src = "img/summary/Summary.jpg";
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Summary</h1>`);
    this.$view.append(`  ${Dom.image(0, 10, 100, 90, src, 150)}`);
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
    if (study == null) {
      return;
    }
    htmlId = UI.getHtmlId(choice.name, 'Choice', choice.study);
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

export default Summary;
