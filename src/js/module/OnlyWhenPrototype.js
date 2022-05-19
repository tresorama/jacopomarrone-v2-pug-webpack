import PrototypeGUIItem from "@jacopomarrone/fu-prototype-gui";


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Add Prototype GUI Panel
export default class PrototypeView {
  constructor() {
    const count = (num) => num + 1;
    const initial = (num) => num;
    const initialRandom = (min, max) => getRandomInt(min, max);
    this.addSelectToPanel("Visual", count(20), "variation--", initial(20));
    this.addSelectToPanel("Box Hover", count(5), "hover-fx--", initial(0));
    this.addSelectToPanel("Box Hover B", count(1), "hover-fx-b--", initial(1));
    this.hidePanel();
  }

  addSelectToPanel(label, optionCount, classPrefix, initialOption) {
    const options = [...Array(optionCount)].map((_, i) => [`${i}`, `${classPrefix}${i}`]);
    new PrototypeGUIItem({
      label,
      type: "select",
      select: {
        options,
        onChange: (value) => {
          // get target el
          const el = document.body;

          //remove other options eventually active
          options.forEach(([label, className]) => {
            className && el.classList.remove(className);
          });

          // add selected one
          value && el.classList.add(value);
        },
        initialOption,
      },
    });
  }
  hidePanel() {
    document.body.insertAdjacentHTML('beforeend', `
    <style>
      .prototype-gui {
        display: none;
      }
    </style>`);
  }
}

