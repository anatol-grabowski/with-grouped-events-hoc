# with-grouped-events-hoc
Get child as the first argument in events emitted by children,
chache children's event handlers (in WeakMaps) to avoid superfluous renders.

## Why
Consider this example: you have a list of
```
class Parent extends React.Component {
  render() {
    const { childs } = this.props;
    const { handleChildEvent } = this;
    return (
      <div>
        {
          childs.map(child => <Child onEvent{evt => handleChildEvent(child, evt)} />)
        }
      </div>
    );
  }
}

function Child(props) {
  return (
    <div onClick={props.onClick} />
  );
}
```
Extra children renders occur if the following pattern is used in the Parent's render:
 * They happen because `onEvent` handler is a new function every time.
 *
 * USAGE EXAMPLE:
 * ```
 *   const List = ({onItemEvent, items}) => (
 *     <div>
 *       {items.map(item => <Item key={item.id} onEvent={onItemEvent(item)} {...item} />)}
 *     </div>
 *   )
 *   export default withGroupedEvents(['onItemEvent'])(List)
 * ```
 * Now `List` will emit `onItemEvent` with `item` in the first argument, then original `onEvent` arguments
 */
