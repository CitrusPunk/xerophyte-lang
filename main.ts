import Parser from "./frontend/parser.ts";
import Environment, { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

// repl();
run("./test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);
  const result = evaluate(program, env);
  console.log(result);
}

function repl() {
  const parser = new Parser();
  const env = createGlobalEnv();

  // Init REPL
  console.log("\nRepl v.01");
  // continue until user stops or exits
  while (true) {
    const input = prompt("> ");

    // Check for no user input or exit keyword
    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }

    // produce AST from source-code
    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);
  }
}
