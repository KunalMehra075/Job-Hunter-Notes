import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import InputBox from "./InputBox";
import NotesContainer from "./NotesContainer";

const Dashboard = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-900">
        <main className="container mx-auto py-8">
          <InputBox />
          <NotesContainer />
        </main>
      </div>
    </Provider>
  );
};

export default Dashboard;
