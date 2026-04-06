/**
 * Custom snapshot serializer to handle React elements without fiber timing data
 * Formats React elements as clean JSX (e.g., <ComponentName />) instead of
 * expanded DOM or internal fiber structures
 */

const reactTransitionalElementSymbol = Symbol.for('react.transitional.element');
const reactClassicElementSymbol = Symbol.for('react.element');

module.exports = {
  test(value) {
    // Handle both direct React elements and our wrapper objects
    if (value && typeof value === 'object') {
      // Check for both transitional and classic React elements
      if (value.$$typeof === reactTransitionalElementSymbol || value.$$typeof === reactClassicElementSymbol) {
        return true;
      }
      if (value.$$reactElement &&
          (value.$$reactElement.$$typeof === reactTransitionalElementSymbol ||
           value.$$reactElement.$$typeof === reactClassicElementSymbol)) {
        return true;
      }
    }
    return false;
  },

  serialize(value, config, indentation, depth, refs, printer) {
    // Unwrap if this is our wrapper object
    const element = value.$$reactElement || value;
    const { type, props } = element;

    // Get component name - handle various React component types
    let componentName = 'Unknown';

    if (typeof type === 'string') {
      // DOM element (e.g., 'div', 'span')
      componentName = type;
    } else if (type && typeof type === 'symbol') {
      // Built-in React types (Fragment, Suspense, etc.)
      const symbolString = type.toString();

      if (type === Symbol.for('react.fragment')) {
        componentName = 'React.Fragment';
      } else if (type === Symbol.for('react.suspense')) {
        componentName = 'React.Suspense';
      } else if (type === Symbol.for('react.profiler')) {
        componentName = 'React.Profiler';
      } else if (type === Symbol.for('react.strict_mode')) {
        componentName = 'React.StrictMode';
      } else if (type === Symbol.for('react.suspense_list')) {
        componentName = 'React.SuspenseList';
      } else {
        // Extract name from symbol if possible
        componentName = symbolString.replace('Symbol(react.', 'React.').replace(')', '');
      }
    } else if (type && typeof type === 'object') {
      // React.forwardRef, React.memo, etc. (wrapped components)
      // Check $$typeof to determine the wrapper type
      const typeSymbol = type.$$typeof;

      if (typeSymbol === Symbol.for('react.forward_ref')) {
        // forwardRef: name is in type.render or type.displayName
        componentName = type.displayName || type.render?.displayName || type.render?.name || 'ForwardRef';
      } else if (typeSymbol === Symbol.for('react.memo')) {
        // memo: name is in type.type or type.displayName
        componentName = type.displayName || type.type?.displayName || type.type?.name || 'Memo';
      } else if (typeSymbol === Symbol.for('react.lazy')) {
        componentName = 'Lazy';
      } else if (typeSymbol === Symbol.for('react.context')) {
        componentName = type.displayName || 'Context.Provider';
      } else if (typeSymbol === Symbol.for('react.consumer')) {
        componentName = type.displayName || 'Context.Consumer';
      } else if (typeSymbol === Symbol.for('react.provider')) {
        componentName = type.displayName || 'Context.Provider';
      } else {
        // Other object types
        componentName = type.displayName || type.name || 'Unknown';
      }
    } else if (typeof type === 'function') {
      // Regular function component or class component
      componentName = type.displayName || type.name || 'Unknown';
    }

    // Serialize props (excluding children and internal React props)
    const propsToSerialize = {};
    if (props) {
      Object.keys(props).forEach(key => {
        if (key !== 'children' && !key.startsWith('_')) {
          propsToSerialize[key] = props[key];
        }
      });
    }

    const hasProps = Object.keys(propsToSerialize).length > 0;
    const hasChildren = props && props.children != null;

    // Format as JSX
    if (!hasProps && !hasChildren) {
      return `<${componentName} />`;
    }

    let result = `<${componentName}`;

    // Add props
    if (hasProps) {
      result += Object.keys(propsToSerialize)
        .map(key => {
          const value = propsToSerialize[key];
          if (typeof value === 'string') {
            return `\n  ${key}="${value}"`;
          } else if (typeof value === 'boolean' && value) {
            return `\n  ${key}`;
          } else {
            return `\n  ${key}={${printer(value, config, indentation + '  ', depth + 1, refs)}}`;
          }
        })
        .join('');
    }

    if (hasChildren) {
      result += hasProps ? '\n' : '';
      result += '>';

      // Serialize children
      const children = Array.isArray(props.children) ? props.children : [props.children];
      children.forEach(child => {
        if (child != null) {
          result += `\n  ${printer(child, config, indentation + '  ', depth + 1, refs)}`;
        }
      });

      result += `\n</${componentName}>`;
    } else {
      result += hasProps ? '\n' : '';
      result += ' />';
    }

    return result;
  }
};
