"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LoginForm_module_css_1 = __importDefault(
  require("./LoginForm/LoginForm.module.css")
);
const ui_1 = require("@/shared/ui");
const LoginForm = () => {
  return (0, jsx_runtime_1.jsxs)("label", {
    className: LoginForm_module_css_1.default.searchInput,
    htmlFor: "search",
    children: [
      (0, jsx_runtime_1.jsx)(ui_1.SvgIcon, {
        className: LoginForm_module_css_1.default.headerIcon,
        name: "search",
        size: 25,
      }),
      (0, jsx_runtime_1.jsx)("input", {
        id: "search",
        type: "text",
        placeholder: "Search For Musics, Artists, ...",
        className: LoginForm_module_css_1.default.input,
      }),
    ],
  });
};
exports.LoginForm = LoginForm;
