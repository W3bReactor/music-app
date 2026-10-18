"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const RegisterPage_module_css_1 = __importDefault(
  require("./RegisterPage/RegisterPage.module.css")
);
const ui_1 = require("@/shared/ui");
const link_1 = __importDefault(require("next/link"));
const RegisterPage = () => {
  return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, {
    children: [
      (0, jsx_runtime_1.jsx)("h1", {
        className: RegisterPage_module_css_1.default.registerTitle,
        children: "Sign Up",
      }),
      (0, jsx_runtime_1.jsxs)("form", {
        className: RegisterPage_module_css_1.default.registerForm,
        action: "",
        children: [
          (0, jsx_runtime_1.jsxs)("div", {
            className: RegisterPage_module_css_1.default.registerFormItem,
            children: [
              (0, jsx_runtime_1.jsx)("label", {
                className: RegisterPage_module_css_1.default.registerLabel,
                htmlFor: "name",
                children: "Full name",
              }),
              (0, jsx_runtime_1.jsx)("input", {
                placeholder: "Enter Your Name",
                className: RegisterPage_module_css_1.default.registerInput,
                type: "text",
                id: "name",
              }),
            ],
          }),
          (0, jsx_runtime_1.jsxs)("div", {
            className: RegisterPage_module_css_1.default.registerFormItem,
            children: [
              (0, jsx_runtime_1.jsx)("label", {
                className: RegisterPage_module_css_1.default.registerLabel,
                htmlFor: "mail",
                children: "E-Mail",
              }),
              (0, jsx_runtime_1.jsx)("input", {
                placeholder: "Enter Your E-Mail",
                className: RegisterPage_module_css_1.default.registerInput,
                type: "text",
                id: "mail",
              }),
            ],
          }),
          (0, jsx_runtime_1.jsxs)("div", {
            className: RegisterPage_module_css_1.default.registerFormItem,
            children: [
              (0, jsx_runtime_1.jsx)("label", {
                className: RegisterPage_module_css_1.default.registerLabel,
                htmlFor: "name",
                children: "Password",
              }),
              (0, jsx_runtime_1.jsx)("input", {
                className: RegisterPage_module_css_1.default.registerInput,
                type: "text",
              }),
            ],
          }),
          (0, jsx_runtime_1.jsxs)("div", {
            className: RegisterPage_module_css_1.default.registerFormItem,
            children: [
              (0, jsx_runtime_1.jsx)("label", {
                className: RegisterPage_module_css_1.default.registerLabel,
                htmlFor: "name",
                children: "Role",
              }),
              (0, jsx_runtime_1.jsx)("input", {
                className: RegisterPage_module_css_1.default.registerInput,
                type: "text",
              }),
            ],
          }),
          (0, jsx_runtime_1.jsx)(ui_1.PinkButton, {
            className: RegisterPage_module_css_1.default.registerBtn,
            children: "Register",
          }),
          (0, jsx_runtime_1.jsxs)("span", {
            className: RegisterPage_module_css_1.default.registerText,
            children: [
              "Already have an account?",
              " ",
              (0, jsx_runtime_1.jsx)(link_1.default, {
                className: RegisterPage_module_css_1.default.registerLink,
                href: "/public",
                children: "Log in",
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
exports.RegisterPage = RegisterPage;
