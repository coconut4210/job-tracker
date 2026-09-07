import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./page";

async function renderPage() {
  await act(async () => { render(<HomePage />); });
}

test("renders the job search heading", async () => {
  await renderPage();
  expect(screen.getByRole("heading", { name: "求职进度" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /登录/ })).not.toBeInTheDocument();
});

  test("shows the three summary labels and compact table columns without login", async () => {
  await renderPage();
  expect(screen.getByText("已投递岗位数")).toBeInTheDocument();
  expect(screen.getByText("已投递公司数")).toBeInTheDocument();
  expect(screen.getByText("已开始求职天数")).toBeInTheDocument();
  for (const column of ["公司名称", "所在城市", "岗位名称", "当前状态", "更多"]) {
    expect(screen.getByRole("columnheader", { name: column })).toBeInTheDocument();
  }
  await userEvent.click(screen.getByRole("button", { name: "看板视图" }));
  expect(screen.getByRole("heading", { name: "待投递" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Offer" })).toBeInTheDocument();
});

test("opens the add position panel", async () => {
  await renderPage();
  await userEvent.click(screen.getByRole("button", { name: "新增岗位" }));
  expect(screen.getByRole("dialog", { name: "新增岗位" })).toBeInTheDocument();
  expect(screen.getByLabelText("公司名称")).toBeInTheDocument();
  expect(screen.getByLabelText("岗位名称")).toBeInTheDocument();
});
