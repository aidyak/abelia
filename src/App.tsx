import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { TextField, Button, defaultTheme, Provider, ButtonGroup, Form } from "@adobe/react-spectrum";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [talkMsg, setTalkMsg] = useState("");
  const [talkInput, setTalkInput] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  async function talk() {
    setTalkMsg(await invoke("talk", { message: talkInput }));
  }

  return (
    <Provider theme={defaultTheme}>
      <main className="container">
        <h1>Abelia</h1>
        <Form validationBehavior="native" maxWidth="size-3000">
          <TextField
            label="Enter your name:"
            value={name}
            onChange={setName}
          />
          <ButtonGroup>
            <Button variant="cta" onPress={greet} type="button">
              Greet
            </Button>
            <Button variant="secondary" onPress={() => setName("")} type="button">
              Clear
            </Button>
          </ButtonGroup>
        </Form>
        <p>{greetMsg}</p>
      </main>

      <div className="container">
        <Form validationBehavior="native" maxWidth="size-3000">
          <TextField
            label="Talk to Abelia:"
            value={talkInput}
            onChange={setTalkInput}
          />
          <ButtonGroup>
            <Button variant="cta" onPress={talk} type="button">
              Talk
            </Button>
            <Button variant="secondary" onPress={() => setTalkInput("")} type="button">
              Clear
            </Button>
          </ButtonGroup>
        </Form>
        <p>{talkMsg}</p>
      </div>
    </Provider>
  );
}

export default App;
