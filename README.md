# with-grouped-events-hoc
Get child as the first argument in events emitted by children, chache children's event handlers (in WeakMaps) to avoid superfluous renders.

## Why
Consider this example:
- we have a parent (list) component that renders an array of child (list item) components.
- each child component emits events that we want to handle in the component that renders the parent.

The most common approach is this:
```
const Child = props => (
  <div onClick={props.onEvent}>
    {props.name}
  </div>
);

class Parent extends React.Component {
  render() {
    const { childs, onChildEvent } = this.props;
    return (
      <div>
        {
          childs.map(child => {
            const onEvent = evt => onChildEvent(child, evt);
            return (
              <Child name={child} onEvent={onEvent} />
            );
        }
      </div>
    );
  }
}
```

One issue with this approach is that `onEvent` passed to each child is a new function on each parent's render (because it is defined in render) so it leads to unneeded DOM updates. This issue can be bypassed but it requires a lot of extra work.

There is also another problem - scalability. Now imagine that now you need to write a component that renders a list of parents and passes `onParentsChildEvent` to each child that should be called with `parent, child, event` arguments. You'd have to pass a tricky function to `Parent` to avoid changing its code. What if you need even deeper nesting?

## How
Handlers that need grouping are stored in weak maps so they are not recreated on each render but taken from the map instead.
Usage steps:
1. import `withGroupedEvents`.
2. create enhancer - pass array of prop names (events) that need grouping into `withGroupedEvents` (this will replace the listed props with wrappers that handle the maps in the parent component).
3. enhance the parent (list) component with the `withGroupedEvents` enhancer.
4. when passing onEvent prop to children call it with the child as a single argument (this call will create a record in the weak map or get one from the map if it already exists).

Note that the value that you pass to the onEvent call in step 4 will be used as a key in the weak map - primitives are not valid WeakMap keys. This is one restriction of this module, in the future the code can be rewritten to use regular Maps if this proves to be necessary.

### Complete example:
- There is a `Party` component that renders a list of `Family` components.
- Each `Family` (identical to `Parent` from the first example) renders a list of `Child` components.
- Each `Child` can emit an event, when it does so in handler function we need to know which child and from which fammily it was.

```
import React from 'react';
import ReactDOM from 'react-dom';
import withGroupedEvents from 'with-grouped-events-hoc'; // 1.

const Child = props => (
  <div onClick={props.onEvent}>
    {props.name}
  </div>
);

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
            onEvent={onChildEvent(child)} // 4.
          />
        ))}
      </div>
    );
  }
}
const enhance = withGroupedEvents(['onChildEvent']); // 2.
const FamilyWithGroupedEvents = enhance(Family); // 3.

class Party extends React.Component {
  render() {
    const { families, onChildEvent } = this.props;
    return (
      <div>
        {families.map(fam => (
          <FamilyWithGroupedEvents
            parents={fam.parents}
            childs={fam.children}
            onChildEvent={onChildEvent(fam)} // 4.
          />
        ))}
      </div>
    );
  }
}
const PartyWithGroupedEvents = withGroupedEvents(['onChildEvent'])(Party); // 2. and 3.

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
function handleChildEventAtAParty(family, child, event) { // 5.
  console.log(`child ${child.name} from family of ${family.parents} clicked at ${event.clientY}`);
}

class App extends React.Component {
  render() {
    return (
      <div>
        <PartyWithGroupedEvents
          families={families}
          onChildEvent={handleChildEventAtAParty}
        />
      </div>
    );
  }
};

ReactDOM.render(<App />, document.querySelector('#container'));
```

## Contribute
The source code is just about 100 lines, feel free to check it out and propose/implement improvements or other approaches.
