"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const LoginPage_module_css_1 = __importDefault(
  require("./LoginPage/LoginPage.module.css")
);
const ui_1 = require("@/shared/ui");
const link_1 = __importDefault(require("next/link"));
const LoginPage = () => {
  return (
    // TODO: переделать на RegisterPage
    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, {
      children: [
        (0, jsx_runtime_1.jsx)("h1", {
          className: LoginPage_module_css_1.default.loginTitle,
          children: "Sign Up",
        }),
        (0, jsx_runtime_1.jsxs)("form", {
          className: LoginPage_module_css_1.default.loginForm,
          action: "",
          children: [
            (0, jsx_runtime_1.jsxs)("div", {
              className: LoginPage_module_css_1.default.loginFormItem,
              children: [
                (0, jsx_runtime_1.jsx)("label", {
                  className: LoginPage_module_css_1.default.loginLabel,
                  htmlFor: "name",
                  children: "Full name",
                }),
                (0, jsx_runtime_1.jsx)("input", {
                  placeholder: "Enter Your Name",
                  className: LoginPage_module_css_1.default.loginInput,
                  type: "text",
                  id: "name",
                }),
              ],
            }),
            (0, jsx_runtime_1.jsxs)("div", {
              className: LoginPage_module_css_1.default.loginFormItem,
              children: [
                (0, jsx_runtime_1.jsx)("label", {
                  className: LoginPage_module_css_1.default.loginLabel,
                  htmlFor: "mail",
                  children: "E-Mail",
                }),
                (0, jsx_runtime_1.jsx)("input", {
                  placeholder: "Enter Your E-Mail",
                  className: LoginPage_module_css_1.default.loginInput,
                  type: "text",
                  id: "mail",
                }),
              ],
            }),
            (0, jsx_runtime_1.jsxs)("div", {
              className: LoginPage_module_css_1.default.loginFormItem,
              children: [
                (0, jsx_runtime_1.jsx)("label", {
                  className: LoginPage_module_css_1.default.loginLabel,
                  htmlFor: "name",
                  children: "Password",
                }),
                (0, jsx_runtime_1.jsx)("input", {
                  className: LoginPage_module_css_1.default.loginInput,
                  type: "text",
                }),
              ],
            }),
            (0, jsx_runtime_1.jsxs)("div", {
              className: LoginPage_module_css_1.default.loginFormItem,
              children: [
                (0, jsx_runtime_1.jsx)("label", {
                  className: LoginPage_module_css_1.default.loginLabel,
                  htmlFor: "name",
                  children: "Role",
                }),
                (0, jsx_runtime_1.jsx)("input", {
                  className: LoginPage_module_css_1.default.loginInput,
                  type: "text",
                }),
              ],
            }),
            (0, jsx_runtime_1.jsx)(ui_1.PinkButton, {
              className: LoginPage_module_css_1.default.loginBtn,
              children: "Register",
            }),
            (0, jsx_runtime_1.jsxs)("span", {
              className: LoginPage_module_css_1.default.loginText,
              children: [
                "Already have an account?",
                " ",
                (0, jsx_runtime_1.jsx)(link_1.default, {
                  className: LoginPage_module_css_1.default.loginLink,
                  href: "/public",
                  children: "Log in",
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
};
exports.LoginPage = LoginPage;
