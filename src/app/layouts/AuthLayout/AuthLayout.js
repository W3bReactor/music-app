"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const AuthLayout_module_css_1 = __importDefault(require("./AuthLayout.module.css"));
const AuthLayout = ({ children }) => {
    return ((0, jsx_runtime_1.jsx)("section", { className: AuthLayout_module_css_1.default.page, children: (0, jsx_runtime_1.jsx)("div", { className: AuthLayout_module_css_1.default.card, children: children }) }));
};
exports.AuthLayout = AuthLayout;
