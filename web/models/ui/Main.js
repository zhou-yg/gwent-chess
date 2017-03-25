
class Main {

  constructor(){

    const m = this.html();
    document.body.appendChild(m);

    this.el = m;
    this.top = m.children[0];
    this.bottom = m.children[0];
  }

  html () {
    const div = document.createElement('div');
    div.className = 'main';
    const top = document.createElement('div');
    top.className = 'main__top'

    const hr = document.createElement('div');
    hr.className = 'main__hr';

    const bottom = document.createElement('div');
    bottom.className = 'main__bottom';

    div.appendChild(top);
    div.appendChild(hr);
    div.appendChild(bottom);

    return div;
  }
}

export default Main;
