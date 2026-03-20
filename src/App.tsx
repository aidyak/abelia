import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { TextField, Button, defaultTheme, Provider, ButtonGroup, Form, TextArea, ProgressBar } from "@adobe/react-spectrum";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [talkMsg, setTalkMsg] = useState("");
  const [talkInput, setTalkInput] = useState("");

  const [matches, setMatches] = useState<string[]>([]);
  const [pattern, setPattern] = useState("(?i)abelia");
  const [text, setText] = useState("");
  const [isMatching, setIsMatching] = useState(false);


  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  async function talk() {
    setTalkMsg(await invoke("talk", { message: talkInput }));
  }

  async function regexMatch() {
    setIsMatching(true);
    try {
      const results = await invoke<string[]>("regex_match", { pattern, text });
      setMatches(results);
    } catch (e) {
      console.error("regex_match error:", e);
      setMatches([`Error: ${e}`]);
    } finally {
      setIsMatching(false);
    }
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

      <div className="container">
        <h2>Abelia Regex matching</h2>
        <TextField
          label="Regex pattern:"
          value={pattern}
          onChange={setPattern}
        />
        <TextArea label="Input text" value={text} onChange={setText} />
        <Button variant="cta" onPress={regexMatch} type="button" isPending={isMatching}>
          Test Regex
        </Button>
        {isMatching && (
          <ProgressBar label="Matching..." isIndeterminate />
        )}
        <ul>
          {matches.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </Provider>
  );
}

export default App;
