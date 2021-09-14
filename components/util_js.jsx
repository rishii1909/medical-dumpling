"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtml = exports.renderNode = exports.getDescendants = exports.getNodeById = void 0;
var lodash_1 = require("lodash");
var react_1 = require("react");
var server_1 = require("react-dom/server");
var Resolver_1 = require("./Resolver");
var RESOLVERS = Resolver_1.Resolvers;
exports.getNodeById = function (nodes, id) {
    // console.log('returning getNodeByID');
    return lodash_1.find(nodes, function (node) { return node.id === id; });
};
var deserializeNodes = function (nodes, id, sorted) {
    if (id === void 0) { id = "ROOT"; }
    if (sorted === void 0) { sorted = []; }
    var node = nodes[id]
    if (!node) {
        var node = JSON.parse(nodes)[id]
        console.log("Error : Could not find node " + id);
    }
    sorted.push(__assign({ id: id }, node));
    lodash_1.each(node.nodes, function (n) {
        sorted.push.apply(sorted, deserializeNodes(nodes, n));
    });
    // console.log("SORTED", sorted)
    return sorted;
};
function getDescendants(nodes, id, deep, includeOnly) {
    if (deep === void 0) { deep = false; }
    function appendChildNode(id, descendants, depth) {
        if (descendants === void 0) { descendants = []; }
        if (depth === void 0) { depth = 0; }
        if (deep || (!deep && depth === 0)) {
            var node = exports.getNodeById(nodes, id);
            if (!node) {
                return descendants;
            }
            if (includeOnly !== "childNodes") {
                // Include linkedNodes if any
                var linkedNodes = node.linkedNodes;
                lodash_1.each(linkedNodes, function (nodeId) {
                    descendants.push(nodeId);
                    descendants = appendChildNode(nodeId, descendants, depth + 1);
                });
            }
            if (includeOnly !== "linkedNodes") {
                var childNodes = node.nodes;
                lodash_1.each(childNodes, function (nodeId) {
                    descendants.push(nodeId);
                    descendants = appendChildNode(nodeId, descendants, depth + 1);
                });
            }
            return descendants;
        }
        return descendants;
    }
    return lodash_1.compact(lodash_1.map(appendChildNode(id), function (nid) { return exports.getNodeById(nodes, nid); }));
}
exports.getDescendants = getDescendants;
exports.renderNode = function (nodes, resolver, nodeId) {
    var node = exports.getNodeById(nodes, nodeId);
    if (!node) {
        throw new Error("Could not find node with id " + nodeId);
    }
    var resolvedComponent = lodash_1.get(resolver, node.type.resolvedName);
    var descendants = getDescendants(nodes, nodeId);
    var children = lodash_1.map(descendants, function (descendant) {
        // console.log('returning children', descendant.id);
        return exports.renderNode(nodes, resolver, descendant.id);
    });
    if (!resolvedComponent) {
        // console.log("resolvedComponent failed for",node)
        resolvedComponent = node.type
    }else{
        // console.log("resolvedComponent success",node.props)
    }
    // console.log("RENDER NODE OUTPUT", node, resolvedComponent, children)
    return react_1.createElement(resolvedComponent, __assign(__assign({}, node.props), { isSSR: true, id: nodeId }), children);
};
var renderNodesToJSX = function (nodes, resolver, nodeId) {
    return exports.renderNode(nodes, resolver, nodeId);
};
exports.generateHtml = function (craftJsNodes) {
    var nodes = deserializeNodes(craftJsNodes);
    var jsx = renderNodesToJSX(nodes, RESOLVERS, "ROOT");
    return(jsx);
    var body = server_1.renderToStaticMarkup(<div>{ jsx }</div>);
    console.log("GENERATED BODY : ", body)
    var html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charSet="UTF-8" />
        </head>
        <body>
          ${body}
        </body>
      </html>
    `;
    return html;
};
