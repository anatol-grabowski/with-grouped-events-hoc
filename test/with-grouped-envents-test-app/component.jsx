import React from 'react';
import ReactDOM from 'react-dom';
import withGroupedEvents from '../..';

const Child = props => (
  <div onClick={props.onEvent}>
    {props.name}
  </div>
);

class Parent extends React.Component {
  render() {
    const { childs, onChildEvent } = this.props;
    return (
      <div style={{border: 'solid black 2px'}}>
        {
          childs.map(child => <Child name={child} onEvent={evt => onChildEvent(child, evt)} />)
        }
      </div>
    );
  }
}

const childs = ['John', 'Bob', 'Alice'];
function handleChildEvent(child, event) {
  console.log(`child ${child} event ${event}`);
}

const families = [
  {
    parents: 'Boney & Klyde',
    children: [{ name: 'John'}, {name: 'Bob'}, {name: 'Alice'}],
  },
  {
    parents: 'God',
    children: [{ name: 'Jesus'}, { name: '<username>'}],
  },
];
function handleChildEventAtAParty(family, child, event) {
  console.log(`child ${child.name} from family of ${family.parents} is at ${event.clientY}`);
}

class Family extends React.Component {
  render() {
    const { parents, childs, onChildEvent } = this.props;
    return (
      <div style={{border: 'solid black 2px'}}>
        <div style={{fontWeight: 'bold'}}>
          {parents}
        </div>
        {childs.map(child => (
          <Child
            name={child.name}
            onEvent={onChildEvent(child)}
          />
        ))}
      </div>
    );
  }
}
const FamilyWithGroupedEvents = withGroupedEvents(['onChildEvent'])(Family);

class Party extends React.Component {
  render() {
    const { families, onChildEvent } = this.props;
    return (
      <div>
        {families.map(fam => (
          <FamilyWithGroupedEvents
            parents={fam.parents}
            childs={fam.children}
            onChildEvent={onChildEvent(fam)}
          />
        ))}
      </div>
    );
  }
}
const PartyWithGroupedEvents = withGroupedEvents(['onChildEvent'])(Party);

class App extends React.Component {
  render() {
    return (
      <div>
        <div style={{height: '300px'}}>
          <Parent
            childs={childs}
            onChildEvent={handleChildEvent}
          />
        </div>
        <div style={{height: '300px'}}>
          <PartyWithGroupedEvents
            families={families}
            onChildEvent={handleChildEventAtAParty}
          />
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.querySelector('#container'));
