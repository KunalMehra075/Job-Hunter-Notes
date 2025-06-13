import { Provider } from "react-redux";
import { store } from "./store/store";
import InputBox from "./components/InputBox";
import NotesContainer from "./components/NotesContainer";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-900">
        <header className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-center text-white">
            Job Hunt Helper
          </h1>
        </header>
        <main className="container mx-auto py-8">
          <InputBox />
          <NotesContainer />
        </main>
      </div>
    </Provider>
  );
}

export default App;
