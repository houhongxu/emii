"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepAliveContext = exports.useKeepaliveOutlets = exports.KeepAliveLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// 通过路由进行keepalive
// 组件级别可以使用库 react-activation，但是是hack实现，有react兼容问题
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const KeepAliveContext = (0, react_1.createContext)({
    keepalivePaths: [],
    keepaliveElementsRef: { current: {} },
    dropByPath: () => { },
});
exports.KeepAliveContext = KeepAliveContext;
/**
 * 为子组件提供KeepAliveContext
 */
const KeepAliveLayout = (props) => {
    // rest包含children子组件
    const { keepalivePaths } = props, rest = __rest(props, ["keepalivePaths"]);
    const keepaliveElementsRef = (0, react_1.useRef)({});
    function dropByPath(path) {
        keepaliveElementsRef.current[path] = null;
    }
    return ((0, jsx_runtime_1.jsx)(KeepAliveContext.Provider, Object.assign({ value: { keepalivePaths, keepaliveElementsRef, dropByPath } }, rest)));
};
exports.KeepAliveLayout = KeepAliveLayout;
/**
 * 获取keepalive后的react组件
 */
const useKeepaliveOutlets = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const element = (0, react_router_dom_1.useOutlet)();
    const { keepalivePaths, keepaliveElementsRef } = (0, react_1.useContext)(KeepAliveContext);
    const isKeep = isKeepPath(keepalivePaths, location.pathname);
    // 每次访问react组件将react组件存入keepaliveElementsRef
    if (isKeep) {
        keepaliveElementsRef.current[location.pathname] = element;
    }
    // keepalive组件，遍历keepaliveElementsRef中的组件，将与路由匹配的那个组件渲染显示，其他渲染hidden
    // 非keepalive组件，直接正常渲染
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [Object.entries(keepaliveElementsRef.current).map(([pathname, element]) => ((0, jsx_runtime_1.jsx)("div", { hidden: !(0, react_router_dom_1.matchPath)(location.pathname, pathname), style: {
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden auto',
                }, className: "rumtime-keep-alive-layout", children: element }, pathname))), (0, jsx_runtime_1.jsx)("div", { hidden: isKeep, style: {
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden auto',
                }, className: "rumtime-keep-alive-layout-no", children: !isKeep && element })] }));
};
exports.useKeepaliveOutlets = useKeepaliveOutlets;
const isKeepPath = (keepalivePaths, path) => {
    let isKeep = false;
    keepalivePaths.map((item) => {
        if (item instanceof RegExp && item.test(path)) {
            isKeep = true;
        }
        if (typeof item === 'string' &&
            (item.toLowerCase() === path || item === path)) {
            isKeep = true;
        }
    });
    return isKeep;
};
