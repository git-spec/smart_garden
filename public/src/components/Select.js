import React, {Component} from 'react';

class Select extends Component {
  constructor(props) {
    super(props);
    const {title} = this.props;

    this.state = {
      isListOpen: false,
      headerTitle: title
    };
  }

  /**
  * Toggle view of select-list.
  * @param {Boolean} prevSate previous state.
  * @return {Boolean} current state.
  */
  toggleList = () => {
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen
    }))
  }
  
  /**
  * Show selected item of select-list in header, close list and activate props-function as callback.
  * @param {String} item list item.
  * @return {String} selected item.
  */
  selectItem = (item) => {
    const {resetThenSet} = this.props;
  
    this.setState({
      headerTitle: item.title,
      isListOpen: false,
    }, () => resetThenSet(item.id, item.key));
  }

  /**
  * Set title of selected item to header-title if item changed.
  * @param {String} nextProps current state of props.
  * @return {String} current state of header-title.
  */
  static getDerivedStateFromProps(nextProps) {
    const {list, title} = nextProps;
    const selectedItem = list.filter((item) => item.selected);
  
    if (selectedItem.length) {
      return {
        headerTitle: selectedItem[0].title,
      };
    };
    return {headerTitle: title};
  }

  close = () => {
    this.setState({
      isListOpen: false,
    });
  }

  componentDidUpdate() {
    const {isListOpen} = this.state;
  
    setTimeout(() => {
      if(isListOpen){
        window.addEventListener('click', this.close);
      }
      else{
        window.removeEventListener('click', this.close);
      };
    }, 0);
  }

  render() {
    const {isListOpen, headerTitle} = this.state;
    const {list} = this.props;

    return (
      <div className="select-wrapper">
        <button
          type="button"
          className="select-header btn"
          onClick={this.toggleList}
        >
          <div className="select-header-title d-flex align-items-center">
            {headerTitle}
            <div className={"d-inline ml-2 " + (isListOpen ? "up" : "down")}>
              <span className="color-3"></span><span className="color-3"></span>
            </div>
          </div>
        </button>
        {isListOpen && (
          <div role="list" className="select-list">
            {list.map((item) => (
              <button
                type="button"
                className="select-list-item btn"
                key={item.id}
                onClick={() => this.selectItem(item)}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Select;