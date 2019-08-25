const { createMacro, MacroError } = require('babel-plugin-macros');
const pkgName = 'async-to-generator.macro';
const debug = require('debug')(pkgName);

const AsyncToGenerator = ({ references, state, babel }) => {
  debug('Initial state:', state);

  // Utilities to help with ast construction
  const t = babel.types;
  // Complete source code if file
  const { code } = state.file;
  const refKeys = Object.keys(references);
  const invalidRefKeys = refKeys.filter(key => key !== 'default');

  if (invalidRefKeys.length > 0) {
    throw new MacroError(
      `Invalid import from switch-expr.macro: ${invalidRefKeys.join(', ')}`
    );
  }

  const refs = references.default;

  // Print well formatted errors
  const failWith = (errCode, node, message) => {
    if (node.loc) console.log(codeFrameColumns(code, node.loc, { message }));
    const error = new Error(`ERR${errCode}: ${message}`);
    error.code = `ERR${errCode}`;
    throw error;
  };

  const processReference = nodePath => {
    let parentPath = nodePath.findParent(() => true);
    const refName = nodePath.node.name;
    if (
      !t.isCallExpression(parentPath.node) ||
      parentPath.node.callee !== nodePath.node
    )
      failWith(
        1,
        nodePath.node,
        `Expected ${refName} to be invoked as a function`
      );
    if (parentPath.node.arguments.length !== 1) {
      failWith(
        2,
        parentPath.node,
        `Expected ${refName} to be called with single argument`
      );
    }
    let target = parentPath.node.arguments[0];
    if (
      (!t.isFunctionExpression(target) &&
        !t.isArrowFunctionExpression(target)) ||
      !target.async
    ) {
      failWith(
        4,
        parentPath.node,
        `Expected ${refName} to be called with an async function defined inline`
      );
    }
    if (target.generator) {
      failWith(
        5,
        parentPath.node,
        `${pkgName} currently does not support async generators`
      );
    }

    parentPath.traverse({
      AwaitExpression(path) {
        path.type = 'YieldExpression';
      },
    });
    target.async = false;
    target.generator = true;
    if (t.isArrowFunctionExpression(target)) {
      target.type = 'FunctionExpression';
    }
    parentPath.replaceWith(target);
  };

  for (let i = 0; i < refs.length; i++) {
    const nodePath = refs[i];
    processReference(nodePath);
  }
};

module.exports = createMacro(AsyncToGenerator);
