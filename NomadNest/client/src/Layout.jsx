import Header from "./Header";
import {Outlet} from "react-router-dom";
import Chatbot from "./Chatbot";

export default function Layout() {
  return (
    <div className="">
      <Header />
      <Outlet />
      <Chatbot />
    </div>
  );
}
